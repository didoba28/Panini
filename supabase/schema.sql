-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ─── COLLECTIONS ─────────────────────────────────────────────────────────────
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_id integer NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, sticker_id)
);

CREATE INDEX idx_collections_user ON collections(user_id);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own collection"
  ON collections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users view any collection"
  ON collections FOR SELECT
  USING (true);


-- ─── MARKET LISTINGS ─────────────────────────────────────────────────────────
CREATE TABLE market_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_username text NOT NULL,
  card_id integer NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_listings_status ON market_listings(status);
CREATE INDEX idx_listings_seller ON market_listings(seller_id);

ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all see listings" ON market_listings FOR SELECT USING (true);
CREATE POLICY "auth create listing" ON market_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "seller update listing" ON market_listings FOR UPDATE
  USING (auth.uid() = seller_id);


-- ─── PROPOSALS ───────────────────────────────────────────────────────────────
CREATE TABLE proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES market_listings(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_username text NOT NULL,
  offered_card_id integer NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_proposals_listing ON proposals(listing_id);
CREATE INDEX idx_proposals_buyer ON proposals(buyer_id);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seller and buyer see proposals" ON proposals FOR SELECT
  USING (
    auth.uid() = buyer_id OR
    auth.uid() = (SELECT seller_id FROM market_listings WHERE id = listing_id)
  );
CREATE POLICY "buyer creates proposal" ON proposals FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "seller updates proposal status" ON proposals FOR UPDATE
  USING (auth.uid() = (SELECT seller_id FROM market_listings WHERE id = listing_id));


-- ─── CHAT MESSAGES ───────────────────────────────────────────────────────────
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id),
  sender_username text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_chat_proposal ON chat_messages(proposal_id);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proposal parties see chat" ON chat_messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    auth.uid() = (SELECT buyer_id FROM proposals WHERE id = proposal_id) OR
    auth.uid() = (SELECT m.seller_id FROM market_listings m JOIN proposals p ON p.listing_id = m.id WHERE p.id = proposal_id)
  );
CREATE POLICY "proposal parties send chat" ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);


-- ─── REALTIME ────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE market_listings;
