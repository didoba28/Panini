// ─── TYPES ────────────────────────────────────────────────────────────────────
export type Sticker = {
  id: number;
  code: string;
  teamCode: string;
  num: number;
  name: string;
  teamId: string;
  teamName: string;
  teamEmoji: string;
  conf: string;
  flagKey: string | null;
};

export type Team = {
  id: string;
  code: string;
  name: string;
  emoji: string;
  conf: string;
  flagKey: string | null;
  players: string[];
};

// ─── FLAG CDN ─────────────────────────────────────────────────────────────────
const FLAG = (c: string) => `https://flagcdn.com/h40/${c}.png`;

export const TEAM_FLAGS: Record<string, string> = {
  mex: FLAG("mx"), can: FLAG("ca"), usa: FLAG("us"), hai: FLAG("ht"), pan: FLAG("pa"), cuw: FLAG("cw"),
  bra: FLAG("br"), arg: FLAG("ar"), col: FLAG("co"), uru: FLAG("uy"), ecu: FLAG("ec"), par: FLAG("py"),
  ger: FLAG("de"), fra: FLAG("fr"), esp: FLAG("es"), eng: FLAG("gb-eng"), por: FLAG("pt"), ned: FLAG("nl"),
  bel: FLAG("be"), cro: FLAG("hr"), sui: FLAG("ch"), sco: FLAG("gb-sct"), tur: FLAG("tr"), swe: FLAG("se"),
  nor: FLAG("no"), aut: FLAG("at"), cze: FLAG("cz"), bih: FLAG("ba"),
  rsa: FLAG("za"), mar: FLAG("ma"), sen: FLAG("sn"), egy: FLAG("eg"), alg: FLAG("dz"), civ: FLAG("ci"),
  gha: FLAG("gh"), tun: FLAG("tn"), cpv: FLAG("cv"), cod: FLAG("cd"),
  kor: FLAG("kr"), qat: FLAG("qa"), aus: FLAG("au"), jpn: FLAG("jp"), ksa: FLAG("sa"), irn: FLAG("ir"),
  irq: FLAG("iq"), uzb: FLAG("uz"), jor: FLAG("jo"), nzl: FLAG("nz"),
};

export const CONF_COL: Record<string, string> = {
  CONCACAF: "#0d6efd",
  CONMEBOL: "#198754",
  UEFA: "#0a3d8f",
  CAF: "#dc3545",
  AFC: "#fd7e14",
  OFC: "#6f42c1",
  "Spécial": "#ffc107",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const p20 = (o: Record<number, string> = {}): string[] =>
  Array.from({ length: 20 }, (_, i) => o[i + 1] || (i === 0 ? "Écusson" : i === 1 ? "Photo équipe" : `Joueur ${i - 1}`));

// ─── TEAMS DATA ───────────────────────────────────────────────────────────────
export const TEAMS: Team[] = [
  { id: "b0", code: "B0", name: "Intro Album", emoji: "📖", conf: "Spécial", flagKey: null, players: ["B0 — Sticker intro"] },
  { id: "fwc", code: "FWC", name: "FIFA World Cup", emoji: "🏆", conf: "Spécial", flagKey: "wc", players: Array.from({ length: 19 }, (_, i) => `FWC ${i + 1}`) },
  { id: "cc", code: "CC", name: "Coca-Cola Series", emoji: "🥤", conf: "Spécial", flagKey: null, players: Array.from({ length: 14 }, (_, i) => `CC ${i + 1}`) },
  { id: "mex", code: "MEX", name: "Mexique", emoji: "🇲🇽", conf: "CONCACAF", flagKey: "mex", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "G. Ochoa", 4: "E. Álvarez", 5: "C. Salcedo", 6: "J. Vásquez", 7: "H. Moreno", 8: "G. Arteaga", 9: "E. Gutiérrez", 10: "H. Lozano", 11: "A. Vega", 12: "C. Antuna", 13: "R. Jiménez", 14: "S. Giménez", 15: "C. Rodríguez", 16: "R. Alvarado", 17: "J. Gallardo", 18: "O. Romo", 19: "J.J. Macías", 20: "J. Sánchez" }) },
  { id: "can", code: "CAN", name: "Canada", emoji: "🇨🇦", conf: "CONCACAF", flagKey: "can", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Crepeau", 4: "A. Johnston", 5: "K. Miller", 6: "D. Zoletic", 7: "E. Eustáquio", 8: "I. Koné", 9: "A. Davies", 10: "J. Laryea", 11: "T. Buchanan", 12: "J. David", 13: "C. Larin", 14: "C. Borjan", 15: "R. Adekugbe", 16: "J. Osorio", 17: "J. Nelson", 18: "A. Ahmed", 19: "S. Cornelius", 20: "B. Table" }) },
  { id: "usa", code: "USA", name: "États-Unis", emoji: "🇺🇸", conf: "CONCACAF", flagKey: "usa", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "T. Turner", 4: "S. Dest", 5: "M. Ream", 6: "W. McKennie", 7: "T. Adams", 8: "Y. Musah", 9: "G. Reyna", 10: "C. Pulisic", 11: "T. Weah", 12: "R. Pepi", 13: "F. Balogun", 14: "J. Ferreira", 15: "B. Aaronson", 16: "L. Acosta", 17: "M. Tillman", 18: "E. Sargent", 19: "D. Moore", 20: "C. McWilliams" }) },
  { id: "hai", code: "HAI", name: "Haïti", emoji: "🇭🇹", conf: "CONCACAF", flagKey: "hai", players: p20() },
  { id: "pan", code: "PAN", name: "Panama", emoji: "🇵🇦", conf: "CONCACAF", flagKey: "pan", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "L. Mejía", 4: "E. Murillo", 5: "A. Murillo", 6: "M. Córdoba", 7: "A. Godoy", 8: "J. Rodríguez", 9: "A. Pinto", 10: "É. Bárcenas", 11: "R. Blackburn", 12: "A. Fajardo", 13: "C. Waterman", 14: "J. Murillo", 15: "V. Ávila", 16: "G. Torres", 17: "C. Céspedes", 18: "J. Davis", 19: "A. Sánchez", 20: "K. Anderson" }) },
  { id: "cuw", code: "CUW", name: "Curaçao", emoji: "🇨🇼", conf: "CONCACAF", flagKey: "cuw", players: p20() },
  { id: "bra", code: "BRA", name: "Brésil", emoji: "🇧🇷", conf: "CONMEBOL", flagKey: "bra", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "Alisson", 4: "Danilo", 5: "Marquinhos", 6: "G. Magalhães", 7: "A. Telles", 8: "Casemiro", 9: "B. Guimarães", 10: "Paquetá", 11: "Rodrygo", 12: "Vinicius Jr", 13: "Raphinha", 14: "Richarlison", 15: "Endrick", 16: "G. Martinelli", 17: "Militão", 18: "Bremer", 19: "Gerson", 20: "Douglas Luiz" }) },
  { id: "arg", code: "ARG", name: "Argentine", emoji: "🇦🇷", conf: "CONMEBOL", flagKey: "arg", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "E. Martínez", 4: "N. Molina", 5: "C. Romero", 6: "L. Martínez", 7: "M. Acuña", 8: "R. De Paul", 9: "E. Fernández", 10: "A. Mac Allister", 11: "Á. Di María", 12: "L. Messi", 13: "J. Álvarez", 14: "L. Ocampos", 15: "G. Lo Celso", 16: "P. Dybala", 17: "N. González", 18: "L. Paredes", 19: "L. Balerdi", 20: "T. Almada" }) },
  { id: "col", code: "COL", name: "Colombie", emoji: "🇨🇴", conf: "CONMEBOL", flagKey: "col", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "D. Ospina", 4: "D. Sánchez", 5: "Y. Mina", 6: "C. Cuesta", 7: "J. Mojica", 8: "J. Lerma", 9: "M. Uribe", 10: "J. Rodríguez", 11: "L. Díaz", 12: "R. Ríos", 13: "L. Sinisterra", 14: "J. Durán", 15: "B. Cuadrado", 16: "R. Arango", 17: "J. Castaño", 18: "S. Castillo", 19: "M. Borja", 20: "E. Cossio" }) },
  { id: "uru", code: "URU", name: "Uruguay", emoji: "🇺🇾", conf: "CONMEBOL", flagKey: "uru", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "S. Rochet", 4: "N. Nández", 5: "J.M. Giménez", 6: "R. Araújo", 7: "M. Viña", 8: "R. Bentancur", 9: "M. Vecino", 10: "F. Valverde", 11: "F. Torres", 12: "D. Núñez", 13: "L. Suárez", 14: "C. De La Cruz", 15: "G. De Arrascaeta", 16: "M. Ugarte", 17: "G. Bueno", 18: "J. Piquerez", 19: "B. Pellistri", 20: "E. Cavani" }) },
  { id: "ecu", code: "ECU", name: "Équateur", emoji: "🇪🇨", conf: "CONMEBOL", flagKey: "ecu", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "H. Galíndez", 4: "Á. Preciado", 5: "P. Hincapié", 6: "R. Arboleda", 7: "J. Angulo", 8: "C. Gruezo", 9: "M. Caicedo", 10: "J. Sarmiento", 11: "G. Plata", 12: "E. Valencia", 13: "M. Cifuentes", 14: "K. Rodríguez", 15: "D. Chalá", 16: "J. Cifuentes", 17: "I. Ibarra", 18: "Á. Torres", 19: "P. Ibáñez", 20: "J. Ángulo" }) },
  { id: "par", code: "PAR", name: "Paraguay", emoji: "🇵🇾", conf: "CONMEBOL", flagKey: "par", players: p20() },
  { id: "ger", code: "GER", name: "Allemagne", emoji: "🇩🇪", conf: "UEFA", flagKey: "ger", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Neuer", 4: "J. Kimmich", 5: "A. Rüdiger", 6: "T. Süle", 7: "D. Raum", 8: "İ. Gündoğan", 9: "T. Müller", 10: "K. Havertz", 11: "L. Sané", 12: "J. Musiala", 13: "F. Wirtz", 14: "L. Goretzka", 15: "T. Werner", 16: "S. Gnabry", 17: "B. Pavard", 18: "R. Hofmann", 19: "M. Reus", 20: "N. Schlotterbeck" }) },
  { id: "fra", code: "FRA", name: "France", emoji: "🇫🇷", conf: "UEFA", flagKey: "fra", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Maignan", 4: "J. Konaté", 5: "R. Upamecano", 6: "W. Saliba", 7: "T. Hernandez", 8: "A. Tchouaméni", 9: "A. Camavinga", 10: "A. Griezmann", 11: "O. Dembélé", 12: "K. Mbappé", 13: "O. Giroud", 14: "M. Guendouzi", 15: "K. Thuram", 16: "Y. Fofana", 17: "J. Koundé", 18: "C. Tolisso", 19: "B. Pavard", 20: "E. Diaby" }) },
  { id: "esp", code: "ESP", name: "Espagne", emoji: "🇪🇸", conf: "UEFA", flagKey: "esp", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "U. Simón", 4: "D. Carvajal", 5: "A. Laporte", 6: "P. Torres", 7: "J. Gayà", 8: "Rodri", 9: "Pedri", 10: "G. Ramos", 11: "N. Williams", 12: "L. Yamal", 13: "A. Morata", 14: "M. Alonso", 15: "A. Grimaldo", 16: "Gavi", 17: "Ferran Torres", 18: "M. Oyarzabal", 19: "D. Olmo", 20: "Ansu Fati" }) },
  { id: "eng", code: "ENG", name: "Angleterre", emoji: "🏴", conf: "UEFA", flagKey: "eng", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "J. Pickford", 4: "K. Walker", 5: "H. Maguire", 6: "J. Stones", 7: "L. Shaw", 8: "D. Rice", 9: "K. Phillips", 10: "J. Bellingham", 11: "B. Saka", 12: "H. Kane", 13: "M. Rashford", 14: "P. Foden", 15: "J. Grealish", 16: "R. Sterling", 17: "T. Alexander-Arnold", 18: "R. James", 19: "C. Gallagher", 20: "E. Dier" }) },
  { id: "por", code: "POR", name: "Portugal", emoji: "🇵🇹", conf: "UEFA", flagKey: "por", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "D. Costa", 4: "J. Cancelo", 5: "R. Dias", 6: "P. Pepe", 7: "N. Mendes", 8: "J. Palhinha", 9: "B. Fernandes", 10: "R. Neves", 11: "D. Jota", 12: "C. Ronaldo", 13: "R. Leão", 14: "B. Silva", 15: "Vitinha", 16: "F. Conceição", 17: "M. Nunes", 18: "G. Ramos", 19: "J. Moutinho", 20: "A. Silva" }) },
  { id: "ned", code: "NED", name: "Pays-Bas", emoji: "🇳🇱", conf: "UEFA", flagKey: "ned", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "A. Flekken", 4: "D. Dumfries", 5: "V. van Dijk", 6: "S. de Vrij", 7: "N. Ake", 8: "F. de Jong", 9: "T. Koopmeiners", 10: "G. Wijnaldum", 11: "S. Bergwijn", 12: "M. Depay", 13: "C. Gakpo", 14: "X. Simons", 15: "W. Zirkzee", 16: "L. de Jong", 17: "M. Timber", 18: "J. Veerman", 19: "J. Gravenberch", 20: "D. Frimpong" }) },
  { id: "bel", code: "BEL", name: "Belgique", emoji: "🇧🇪", conf: "UEFA", flagKey: "bel", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "T. Courtois", 4: "T. Castagne", 5: "T. Alderweireld", 6: "J. Vertonghen", 7: "T. Tielemans", 8: "K. De Bruyne", 9: "A. Witsel", 10: "D. Mertens", 11: "E. Hazard", 12: "R. Lukaku", 13: "L. Trossard", 14: "J. Doku", 15: "A. Onana", 16: "C. De Ketelaere", 17: "O. Mangala", 18: "A. Theate", 19: "M. Faes", 20: "L. Dendoncker" }) },
  { id: "cro", code: "CRO", name: "Croatie", emoji: "🇭🇷", conf: "UEFA", flagKey: "cro", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "D. Livaković", 4: "S. Ćaleta-Car", 5: "J. Gvardiol", 6: "J. Šutalo", 7: "B. Sosa", 8: "L. Modrić", 9: "M. Brozović", 10: "M. Kovačić", 11: "I. Perišić", 12: "A. Kramarić", 13: "B. Petković", 14: "N. Vlašić", 15: "L. Ivanušec", 16: "J. Stanišić", 17: "B. Šutalo", 18: "M. Baturina", 19: "M. Pjaca", 20: "D. Stefulj" }) },
  { id: "sui", code: "SUI", name: "Suisse", emoji: "🇨🇭", conf: "UEFA", flagKey: "sui", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "Y. Sommer", 4: "S. Widmer", 5: "M. Akanji", 6: "F. Schär", 7: "R. Rodríguez", 8: "G. Xhaka", 9: "R. Freuler", 10: "D. Zakaria", 11: "X. Shaqiri", 12: "H. Seferović", 13: "B. Embolo", 14: "N. Elvedi", 15: "S. Zuber", 16: "A. Vargas", 17: "Y. Stergiou", 18: "L. Rieder", 19: "M. Ndoye", 20: "K. Zesiger" }) },
  { id: "sco", code: "SCO", name: "Écosse", emoji: "🏴", conf: "UEFA", flagKey: "sco", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "A. Gunn", 4: "A. Robertson", 5: "G. Hanley", 6: "J. Souttar", 7: "K. Tierney", 8: "S. McTominay", 9: "C. McGregor", 10: "J. McGinn", 11: "R. Christie", 12: "L. Ferguson", 13: "C. Adams", 14: "J. Porteous", 15: "B. McKenna", 16: "N. Patterson", 17: "S. Armstrong", 18: "T. Lawrence", 19: "D. Patterson", 20: "R. Jack" }) },
  { id: "tur", code: "TUR", name: "Turquie", emoji: "🇹🇷", conf: "UEFA", flagKey: "tur", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "A. Bayındır", 4: "Z. Çelik", 5: "M. Demiral", 6: "Ç. Söyüncü", 7: "F. Kadioglu", 8: "H. Çalhanoğlu", 9: "S. Özcan", 10: "O. Tufan", 11: "K. Yıldız", 12: "B. Yılmaz", 13: "Y. Yazıcı", 14: "A. Güler", 15: "M. Kabak", 16: "O. Koybasi", 17: "I. Yüksek", 18: "E. Akturkoglu", 19: "C. Tosun", 20: "B. Yildirim" }) },
  { id: "swe", code: "SWE", name: "Suède", emoji: "🇸🇪", conf: "UEFA", flagKey: "swe", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "R. Olsen", 4: "M. Lustig", 5: "V. Lindelöf", 6: "L. Augustinsson", 7: "E. Krafth", 8: "M. Svanberg", 9: "A. Ekdal", 10: "E. Forsberg", 11: "D. Kulusevski", 12: "V. Gyökeres", 13: "A. Isak", 14: "J. Elanga", 15: "K. Olsson", 16: "I. Thelin", 17: "E. Karlsson", 18: "S. Larsson", 19: "O. Runesson", 20: "J. Almqvist" }) },
  { id: "nor", code: "NOR", name: "Norvège", emoji: "🇳🇴", conf: "UEFA", flagKey: "nor", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "Ø. Nyland", 4: "K. Ajer", 5: "L. Østigård", 6: "J. Strandberg", 7: "B. Pedersen", 8: "M. Ødegaard", 9: "P. Berg", 10: "S. Berge", 11: "M. Elyounoussi", 12: "E. Haaland", 13: "A. Sørloth", 14: "V. Henriksen", 15: "T. Thorstvedt", 16: "H. Normann", 17: "O. Solbakken", 18: "A. Strand Larsen", 19: "C. Tronstad", 20: "A. Ryerson" }) },
  { id: "aut", code: "AUT", name: "Autriche", emoji: "🇦🇹", conf: "UEFA", flagKey: "aut", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "P. Pentz", 4: "S. Posch", 5: "D. Alaba", 6: "M. Wöber", 7: "P. Ulmer", 8: "K. Laimer", 9: "F. Grillitsch", 10: "M. Sabitzer", 11: "N. Seiwald", 12: "M. Gregoritsch", 13: "C. Baumgartner", 14: "K. Arnautović", 15: "P. Wimmer", 16: "G. Querfeld", 17: "C. Lienhart", 18: "T. Daniliuc", 19: "P. Mwene", 20: "M. Wiesinger" }) },
  { id: "cze", code: "CZE", name: "Tchéquie", emoji: "🇨🇿", conf: "UEFA", flagKey: "cze", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "J. Staněk", 4: "V. Coufal", 5: "T. Souček", 6: "J. Kuchta", 7: "A. Barák", 8: "P. Schick", 9: "M. Havel", 10: "L. Sadílek", 11: "J. Lingr", 12: "D. Jurásek", 13: "O. Duda", 14: "D. Hlozek", 15: "T. Holes", 16: "L. Provod", 17: "M. Matouš", 18: "F. Vlcek", 19: "J. Cerny", 20: "A. Vlkanova" }) },
  { id: "bih", code: "BIH", name: "Bosnie-Herz.", emoji: "🇧🇦", conf: "UEFA", flagKey: "bih", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "I. Pirić", 4: "S. Kolasinac", 5: "G. Savanovic", 6: "E. Bicakcic", 7: "H. Tatar", 8: "M. Pjanić", 9: "A. Hadžić", 10: "P. Bilbija", 11: "E. Džeko", 12: "S. Rahmanović", 13: "V. Kovačević", 14: "A. Šehić", 15: "N. Loncar", 16: "D. Memić", 17: "A. Husic", 18: "B. Kristic", 19: "H. Mujakic", 20: "D. Šahinović" }) },
  { id: "rsa", code: "RSA", name: "Afrique du Sud", emoji: "🇿🇦", conf: "CAF", flagKey: "rsa", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "R. Williams", 4: "L. Petersen", 5: "N. Mobbie", 6: "M. Mokoena", 7: "T. Zwane", 8: "P. Tau", 9: "B. Zungu", 10: "T. Mokoena", 11: "L. Foster", 12: "B. Grobler", 13: "K. Dolly", 14: "P. Majoro", 15: "S. Mabiliso", 16: "E. Mothwa", 17: "H. Tshivhangho", 18: "K. Petersen", 19: "G. Mashigo", 20: "S. Dlamini" }) },
  { id: "mar", code: "MAR", name: "Maroc", emoji: "🇲🇦", conf: "CAF", flagKey: "mar", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "Y. Bounou", 4: "N. Mazraoui", 5: "R. Saïss", 6: "A. Aguerd", 7: "N. Masina", 8: "S. Amrabat", 9: "S. Ounahi", 10: "A. Hakimi", 11: "H. Ziyech", 12: "Y. En-Nesyri", 13: "S. Boufal", 14: "A. Sabiri", 15: "S. Benoun", 16: "I. Almellah", 17: "B. El Kaabi", 18: "Z. Aboukhlal", 19: "I. Benrhima", 20: "A. Tagnaouti" }) },
  { id: "sen", code: "SEN", name: "Sénégal", emoji: "🇸🇳", conf: "CAF", flagKey: "sen", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "É. Mendy", 4: "I. Sarr", 5: "K. Koulibaly", 6: "A. Diallo", 7: "F. Ciss", 8: "P. Gueye", 9: "N. Mendy", 10: "I. Gueye", 11: "B. Diatta", 12: "S. Mané", 13: "K. Kouyaté", 14: "I. Ndiaye", 15: "B. Diallo", 16: "M. Diedhiou", 17: "N. Jackson", 18: "A. Bamba", 19: "L. Doucouré", 20: "A. Sabaly" }) },
  { id: "egy", code: "EGY", name: "Égypte", emoji: "🇪🇬", conf: "CAF", flagKey: "egy", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. El-Shenawy", 4: "A. Hegazi", 5: "O. Kamal", 6: "M. Abdelmonem", 7: "O. Gaber", 8: "H. El-Neny", 9: "T. El-Said", 10: "T. Mohamed", 11: "M. Salah", 12: "O. Marmoush", 13: "A. Warda", 14: "A. Ashraf", 15: "M. Elneny", 16: "Z. El-Gamal", 17: "M. Lasheen", 18: "M. Hamdi", 19: "K. Hamdi", 20: "A. Moamen" }) },
  { id: "alg", code: "ALG", name: "Algérie", emoji: "🇩🇿", conf: "CAF", flagKey: "alg", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "R. Mandrea", 4: "R. Ait-Nouri", 5: "D. Benlamri", 6: "A. Mandi", 7: "F. Ghoulam", 8: "I. Bennacer", 9: "H. Aouar", 10: "R. Mahrez", 11: "Y. Brahimi", 12: "I. Slimani", 13: "Y. Atal", 14: "B. Bounedjah", 15: "A. Sayoud", 16: "S. Feghouli", 17: "A. Zerrouki", 18: "I. Doukha", 19: "Z. Eddine", 20: "T. Benrahma" }) },
  { id: "civ", code: "CIV", name: "Côte d'Ivoire", emoji: "🇨🇮", conf: "CAF", flagKey: "civ", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "O. Diaw", 4: "S. Aurier", 5: "S. Badé", 6: "W. Zaha", 7: "F. Kessié", 8: "I. Sangaré", 9: "S. Fofana", 10: "N. Pépé", 11: "S. Haller", 12: "J. Konaté", 13: "I. Koné", 14: "E. Dié", 15: "S. Touré", 16: "M. Boli", 17: "A. Dao", 18: "M. Koffi", 19: "Y. Fofana", 20: "W. Sissoko" }) },
  { id: "gha", code: "GHA", name: "Ghana", emoji: "🇬🇭", conf: "CAF", flagKey: "gha", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "L. Ati-Zigi", 4: "A. Ayew", 5: "A. Djiku", 6: "A. Amartey", 7: "T. Partey", 8: "M. Kudus", 9: "K. Kyereh", 10: "J. Ayew", 11: "I. Sulemana", 12: "O. Paintsil", 13: "A. Sulemana", 14: "B. Asante", 15: "P. Gyimah", 16: "K. Mensah", 17: "K. Opoku", 18: "E. Antwi", 19: "D. Bampoe", 20: "R. Amofa" }) },
  { id: "tun", code: "TUN", name: "Tunisie", emoji: "🇹🇳", conf: "CAF", flagKey: "tun", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "A. Dahmen", 4: "A. Talbi", 5: "Y. Msakni", 6: "W. Ifa", 7: "A. Laidouni", 8: "M. Ben Romdhane", 9: "A. Maaloul", 10: "N. Sliti", 11: "S. Jaziri", 12: "I. Jebali", 13: "O. Khazri", 14: "M. Ben Brahem", 15: "B. Saîd", 16: "F. Chaalali", 17: "K. Laïdouni", 18: "H. Kadri", 19: "A. Mathlouthi", 20: "A. Bguir" }) },
  { id: "cpv", code: "CPV", name: "Cap-Vert", emoji: "🇨🇻", conf: "CAF", flagKey: "cpv", players: p20() },
  { id: "cod", code: "COD", name: "RD Congo", emoji: "🇨🇩", conf: "CAF", flagKey: "cod", players: p20() },
  { id: "kor", code: "KOR", name: "Corée du Sud", emoji: "🇰🇷", conf: "AFC", flagKey: "kor", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "K. Seung-Gyu", 4: "K. Moon-Hwan", 5: "K. Min-Jae", 6: "K. Young-Gwon", 7: "H. In-Beom", 8: "H. Heechan", 9: "L. Jae-Sung", 10: "K. Doo-Hyun", 11: "H. Son", 12: "C. Gue-Sung", 13: "H. Seung-Woo", 14: "O. Hyeon-Gyu", 15: "L. Kang-In", 16: "B. Jun-Ho", 17: "K. Junho", 18: "L. Chang-Geun", 19: "K. In-Sung", 20: "J. Seung-Hyun" }) },
  { id: "qat", code: "QAT", name: "Qatar", emoji: "🇶🇦", conf: "AFC", flagKey: "qat", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Barsham", 4: "P. Correia", 5: "B. Khoukhi", 6: "R. Salman", 7: "H. Hatem", 8: "K. Boudiaf", 9: "M. Asad", 10: "H. Al-Haydos", 11: "A. Afif", 12: "A. Almoez", 13: "A. Hatem", 14: "S. Al-Muraikhi", 15: "B. Alrawi", 16: "A. Abdulsalam", 17: "K. Alhassan", 18: "J. Obbadi", 19: "A. Ghanim", 20: "J. Hassan" }) },
  { id: "aus", code: "AUS", name: "Australie", emoji: "🇦🇺", conf: "AFC", flagKey: "aus", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Ryan", 4: "N. Atkinson", 5: "H. Souttar", 6: "K. Rowles", 7: "A. Mooy", 8: "C. Ikonomidis", 9: "R. McGree", 10: "M. Leckie", 11: "M. Duke", 12: "M. Boyle", 13: "J. Irvine", 14: "K. Deng", 15: "J. Nisbet", 16: "J. Fluke", 17: "C. Goodwin", 18: "T. Devlin", 19: "B. Tilio", 20: "E. Dezotti" }) },
  { id: "jpn", code: "JPN", name: "Japon", emoji: "🇯🇵", conf: "AFC", flagKey: "jpn", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "S. Gonda", 4: "H. Sakai", 5: "M. Yoshida", 6: "K. Itakura", 7: "Y. Nagatomo", 8: "W. Endo", 9: "T. Morita", 10: "J. Soma", 11: "T. Minamino", 12: "D. Kamada", 13: "R. Doan", 14: "T. Tomiyasu", 15: "K. Mitoma", 16: "H. Tanaka", 17: "R. Machino", 18: "N. Nakayama", 19: "S. Kubo", 20: "A. Ito" }) },
  { id: "ksa", code: "KSA", name: "Arabie Saoudite", emoji: "🇸🇦", conf: "AFC", flagKey: "ksa", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Al-Owais", 4: "A. Al-Buraikan", 5: "A. Al-Bulaihi", 6: "A. Tambakti", 7: "S. Al-Ghannam", 8: "M. Al-Najei", 9: "A. Al-Hassan", 10: "H. Al-Shehri", 11: "S. Al-Dawsari", 12: "F. Al-Buraikan", 13: "A. Al-Hamdán", 14: "Y. Al-Shahrani", 15: "A. Al-Khaibari", 16: "M. Al-Fatil", 17: "H. Bahebri", 18: "S. Al-Otaibi", 19: "T. Al-Nuem", 20: "O. Al-Ghamdi" }) },
  { id: "irn", code: "IRN", name: "Iran", emoji: "🇮🇷", conf: "AFC", flagKey: "irn", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "A. Beiranvand", 4: "R. Rezaeian", 5: "M. Hosseini", 6: "S. Mohammadi", 7: "M. Taremi", 8: "S. Azmoun", 9: "A. Jahanbakhsh", 10: "A. Ansarifard", 11: "V. Amiri", 12: "K. Karimi", 13: "M. Torabi", 14: "S. Ghoddos", 15: "A. Hajsafi", 16: "H. Kanaanizadegan", 17: "A. Gholizadeh", 18: "M. Karimi", 19: "B. Alizadeh", 20: "A. Noorollahi" }) },
  { id: "irq", code: "IRQ", name: "Irak", emoji: "🇮🇶", conf: "AFC", flagKey: "irq", players: p20() },
  { id: "uzb", code: "UZB", name: "Ouzbékistan", emoji: "🇺🇿", conf: "AFC", flagKey: "uzb", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "I. Nesterov", 4: "S. Jaloliddinov", 5: "A. Ismoilov", 6: "E. Shomurodov", 7: "J. Masharipov", 8: "A. Fayzullaev", 9: "O. Alijonov", 10: "D. Khamdamov", 11: "S. Tursunov", 12: "U. Rashidov", 13: "J. Yakhshiboev", 14: "J. Khoshimov", 15: "O. Shodiev", 16: "D. Turgunboev", 17: "I. Komilov", 18: "S. Nazarov", 19: "E. Qodirov", 20: "J. Abdurakhimov" }) },
  { id: "jor", code: "JOR", name: "Jordanie", emoji: "🇯🇴", conf: "AFC", flagKey: "jor", players: p20() },
  { id: "nzl", code: "NZL", name: "Nouvelle-Zélande", emoji: "🇳🇿", conf: "OFC", flagKey: "nzl", players: p20({ 1: "Écusson", 2: "Photo équipe", 3: "M. Ryan", 4: "T. Payne", 5: "N. Elcock", 6: "M. Ingham", 7: "T. Anselmi", 8: "L. Cacace", 9: "C. Wood", 10: "M. Garbett", 11: "J. Waine", 12: "B. Suter", 13: "T. Robic", 14: "B. Old", 15: "O. Sail", 16: "A. Hefer", 17: "K. Washington", 18: "A. Galloway", 19: "S. Chrisfield", 20: "T. Devlin" }) },
];

// ─── STICKER INDEX ────────────────────────────────────────────────────────────
let _sid = 1;
export const STICKERS: Sticker[] = [];
export const CODE_MAP: Record<string, Sticker> = {};

TEAMS.forEach(t =>
  t.players.forEach((name, i) => {
    const s: Sticker = {
      id: _sid++,
      code: `${t.code}-${i + 1}`,
      teamCode: t.code,
      num: i + 1,
      name,
      teamId: t.id,
      teamName: t.name,
      teamEmoji: t.emoji,
      conf: t.conf,
      flagKey: t.flagKey,
    };
    STICKERS.push(s);
    CODE_MAP[`${t.code}-${i + 1}`] = s;
    CODE_MAP[`${t.code}${i + 1}`] = s;
  })
);

export const SMAP: Record<number, Sticker> = Object.fromEntries(STICKERS.map(s => [s.id, s]));
export const TOTAL = STICKERS.length;
export const CONFS = ["Tous", "Spécial", "CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"];

export function lookupSticker(code: string, num: string | number): Sticker | null {
  if (!code || num == null) return null;
  const c = String(code).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const n = parseInt(String(num));
  if (!c || isNaN(n)) return null;
  return CODE_MAP[`${c}-${n}`] || CODE_MAP[`${c}${n}`] || STICKERS.find(s => s.teamCode === c && s.num === n) || null;
}
