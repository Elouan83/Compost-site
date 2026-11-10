// Données SOLAÏ — reprises du dossier de la Mission 1 (gamme, recettes, prix cibles, mentions).
const SOLAI = {
  offre: {
    produit: "japon",
    debut: "2026-12-18T00:00:00",
    fin: "2027-03-27T23:59:59",
    libelle: "2 achetées = 1 offerte",
    accroche: "Profitez-en avant qu’il ne soit trop tard !"
  },
  // Valeurs nutritionnelles moyennes pour 100 ml (identiques pour les 5 références dans le dossier).
  nutrition: [
    ["Énergie", "179 kJ / 42 kcal"],
    ["Matières grasses", "0 g"],
    ["dont acides gras saturés", "0 g", true],
    ["Glucides", "8,8 g"],
    ["dont sucres", "8,8 g", true],
    ["Protéines", "0,7 g"],
    ["Sel", "0 g"]
  ],
  produits: [
    {
      id: "orange", banniere: "essentiel", gamme: "Essentiel", nom: "Orange", denomination: "Jus d’orange",
      saveurs: ["Orange", "Sans pulpe"], prix: 2.5, couleur: "#d9480f", teinte: "#ffe2b0",
      court: "Le goût familier de l’orange, sans pulpe, à la texture fluide.",
      texte: "Essentiel Orange, c’est la saveur que tout le monde connaît, dans notre contenant rond de 33 cl. Un jus sans pulpe, à la texture fluide, pensé pour une pause entre deux cours, un déjeuner ou un moment entre amis.",
      ingredients: "Jus de fruits partiellement à base de concentrés : orange (44 %) et eau."
    },
    {
      id: "pomme", banniere: "essentiel", gamme: "Essentiel", nom: "Pomme", denomination: "Jus de pomme",
      saveurs: ["Pomme", "Sans pulpe"], prix: 2.5, couleur: "#c62828", teinte: "#ffd9c9",
      court: "La pomme, simple et rassurante, pour tous les jours.",
      texte: "Essentiel Pomme mise sur un goût classique et facile à reconnaître. Un jus sans pulpe, au format individuel de 33 cl, pour retrouver une saveur familière à n’importe quel moment de la journée.",
      ingredients: "Jus de fruits partiellement à base de concentrés : pomme (31,7 %) et eau."
    },
    {
      id: "japon", banniere: "japon", gamme: "Évasion", nom: "Japon", denomination: "Boisson aux fruits et au sakura",
      saveurs: ["Fraise", "Litchi", "Sakura"], prix: 2.9, couleur: "#b3261e", teinte: "#ffd9e3", nouveau: true,
      court: "Fraise, litchi et fleur de cerisier : cap sur le Japon.",
      texte: "Évasion Japon associe la fraise, le litchi et le sakura (pétales de cerisier). Son décor rose et rouge reprend les cerisiers en fleurs et le mont Fuji. C’est la référence que nous lançons à l’occasion du salon.",
      ingredients: "Jus de fruits partiellement à base de concentrés : fraise (16,7 %), litchi (15 %), pétales de cerisier – sakura (4 %) et eau."
    },
    {
      id: "bresil", banniere: "bresil", gamme: "Évasion", nom: "Brésil", denomination: "Boisson aux fruits",
      saveurs: ["Açaï", "Passion"], prix: 2.9, couleur: "#5b1f6a", teinte: "#ead3ef",
      court: "Açaï et fruit de la passion, direction le Brésil.",
      texte: "Évasion Brésil réunit l’açaï et le fruit de la passion. Sa robe violette, ses palmiers et sa baie illustrée donnent le ton : une association de saveurs à découvrir, sans quitter sa pause.",
      ingredients: "Jus de fruits partiellement à base de concentrés : açaï (19,7 %), passion (17 %) et eau."
    },
    {
      id: "madagascar", banniere: "madagascar", gamme: "Évasion", nom: "Madagascar", denomination: "Boisson aux fruits et à la vanille",
      saveurs: ["Vanille", "Ananas", "Mangue"], prix: 2.9, couleur: "#a8431f", teinte: "#ffe6a8",
      court: "Ananas, mangue et vanille sous les baobabs.",
      texte: "Évasion Madagascar marie l’ananas, la mangue et la vanille. Les baobabs et la fleur de vanille de son étiquette prolongent le voyage jusque dans le visuel.",
      ingredients: "Jus de fruits partiellement à base de concentrés : ananas (17,8 %), mangue (15 %), vanille (5 %) et eau."
    }
  ],
  conservation: "À consommer de préférence avant fin : voir fond. Après ouverture, conserver au réfrigérateur et consommer rapidement.",
  fabricant: "SOLAÏ — 37-39 rue Boissière, 75116 Paris, France — 01 56 62 15 15"
};
