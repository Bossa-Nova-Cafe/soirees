/* Bossa Nova Café · Catalogue de la Festa
   Plats, vins, prix et réglages partagés entre le calculateur (index.html)
   et le panneau d'administration (admin.html).

   Deux modes :
   - local : sans Firebase, le catalogue est gardé dans ce navigateur (pour tester) ;
   - en ligne : avec firebase-config.js rempli, le catalogue est dans Firestore,
     document parametres/confra-catalogue, lisible par tous et modifiable par l'admin. */
(function () {
  "use strict";

  const CLE_LOCALE = "bossanova-confra-catalogue";
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";

  const DEFAUT = {
    version: 41,
    contacts: { whatsapp: "41766390495", email: "vevey@bossanova-cafe.ch" },
    saison: { debut: "2026-11-16", fin: "2027-02-28" },
    moments: { soir: true, midi: false, afterwork: false },
    regles: {
      minimumPrivatisation: 700,
      maxPersonnes: 26,
      platsMin: 4,
      platsMax: 3,
      acomptePourcent: 30,
      prolongationParHeure: 200,
      afterworkPrix: 42,
      productionDelaiJours: 15,
      earlyBirdJours: 30,
      earlyBirdRemise: 5,
      droitBouchon: 10,
      enfantsAge: 12,
      enfantsRemise: 50
    },
    menu: {
      bienvenue: [
        { id: "caipi", nom: "Caipirinha", ds: "Le cocktail national du Brésil : citron vert, sucre et cachaça, sur glace pilée", prix: 8, inclus: true, photo: "photos/caipirinha-2.jpg", actif: true },
        { id: "quentao", nom: "Quentão", ds: "La boisson chaude des fêtes brésiliennes : cachaça, gingembre, cannelle et orange", prix: 8, inclus: true, actif: false },
        { id: "vinho-quente", nom: "Vin chaud au Gamay vaudois (vinho quente)", ds: "Le vin chaud des fêtes brésiliennes, épicé et fruité, préparé avec un Gamay vaudois", prix: 8, inclus: true, photo: "photos/vin-chaud.jpg", actif: true },
        { id: "chasselas", nom: "Verre de Chasselas vaudois", ds: "L'apéritif de chez nous, servi frais", prix: 8, inclus: true, photo: "photos/chasselas.jpg", actif: true },
        { id: "quentao-sa", nom: "Jus de pomme chaud aux épices (quentão sans alcool)", ds: "Jus de pomme chaud au gingembre, à la cannelle et à l'orange", prix: 6, inclus: true, actif: true },
        { id: "eaux", nom: "Eaux minérales", ds: "Plate ou gazeuse, bien fraîche, pour ceux qui préfèrent sans alcool", prix: 3, inclus: true, actif: false },
        { id: "batida", nom: "Batida de coco et chips de manioc", ds: "Cocktail onctueux au lait de coco", prix: 8, inclus: true, actif: false },
        { id: "virgem", nom: "Cocktail sans alcool et cacahuètes grillées", ds: "Fruit de la passion, citron vert et menthe", prix: 6, inclus: true, actif: false }
      ],
      entree: [
        { id: "petiscos", nom: "Bouchées brésiliennes à partager (petiscos)", ds: "Pão de queijo, coxinhas et empadas tout chauds, sur planches à partager", prix: 10, photo: "photos/petiscos.jpg", actif: true },
        { id: "caldinho", nom: "Soupe de haricots à œil noir (caldinho)", ds: "Petite soupe de feijão de corda (haricots à œil noir) en tasse, lardons et coriandre", prix: 7, photo: "photos/caldinho-corda.jpg", porc: true, actif: true },
        { id: "salpicao", nom: "Salade de Noël au poulet (salpicão)", ds: "La salade de Noël brésilienne : poulet effiloché, carottes, pomme, raisins secs et batata palha", prix: 10, photo: "photos/salpicao.jpg", actif: true },
        { id: "massas", nom: "Gratin de pâtes de São Paulo (massas)", ds: "Lasagnes à la bolognaise et gnocchi tomate-mozzarella gratinés, à partager — l’héritage italien de São Paulo", prix: 10, porc: true, actif: true },
        { id: "pinsas", nom: "Pinsas romaines en carrés apéro (Cantina São Paulo)", ds: "Assortiment de pinsas romanas coupées en carrés apéro, à partager : margherita, jambon et salami piquant", prix: 8, porc: true, photo: "photos/pinsas.jpg", actif: true },
        { id: "veloute", nom: "Velouté de courge au lait de coco (creme de abóbora)", ds: "Velouté de courge au lait de coco, gingembre et graines torréfiées", prix: 8, photo: "photos/veloute.jpg", vg: true, actif: true },
        { id: "salade-melee", nom: "Salade mêlée", ds: "Salades de saison, carottes, tomates et concombre, vinaigrette maison", prix: 7, vg: true, photo: "photos/salade-melee.jpg", actif: true },
        { id: "caprese", nom: "Salade tomates mozzarella", ds: "Tomates, mozzarella, basilic frais, huile d’olive et balsamique", prix: 8, vg: true, photo: "photos/caprese.jpg", actif: true },
        { id: "bouchees", nom: "Assortiment de bouchées bahianaises", ds: "Coxinhas, pastéis et acarajé à partager", prix: 12, actif: false },
        { id: "palmito", nom: "Salade de cœurs de palmier, mangue et crevettes", ds: "Vinaigrette au citron vert et coriandre", prix: 13, actif: false }
      ],
      plat: [
        { id: "feijoada", nom: "Ragoût de haricots noirs aux viandes (feijoada complète)", ds: "Haricots noirs mijotés aux viandes, chou vert et orange", prix: 19, photo: "photos/feijoada.jpg", porc: true, actif: true },
        { id: "escondidinho", nom: "Escondidinho de carne", ds: "Bœuf effiloché sous une purée de manioc, gratiné au four", prix: 22, photo: "photos/escondidinho.jpg", actif: false },
        { id: "boeuf", nom: "Rumsteck rôti à la brésilienne", ds: "Rôti au four au gros sel, comme au Brésil, et tranché à table", prix: 24, photo: "photos/rumsteck.jpg", actif: false },
        { id: "bananier", nom: "Poisson en feuille de bananier", ds: "Filet de poisson cuit à l'étouffée, lait de coco et herbes fraîches", prix: 25, photo: "photos/bananier.jpg", actif: false },
        { id: "arroz-mar", nom: "Arroz de forno com frutos do mar", ds: "Riz au four aux crevettes, calamars et moules, gratiné", prix: 24, photo: "photos/arroz-mar.jpg", actif: false },
        { id: "costela", nom: "Côtes de bœuf à la brésilienne", ds: "Costela au four, à la brésilienne, cuite lentement jusqu'à être fondante", prix: 29, photo: "photos/cotes-de-boeuf.jpg", actif: false },
        { id: "frango", nom: "Poulet rôti au citron vert (frango assado)", ds: "Poulet suisse mariné à l'ail, au citron vert et aux herbes, rôti au four", prix: 18, photo: "photos/frango.jpg", actif: true },
        { id: "maluca", nom: "Bœuf effiloché aux poivrons (carne maluca)", ds: "Effiloché de bœuf mijoté aux poivrons, oignons et tomates", prix: 22, photo: "photos/carne-maluca.jpg", actif: true },
        { id: "peixe", nom: "Poisson au four au lait de coco (peixe ao forno)", ds: "Filet de colin cuit au four sur poivrons, oignons et tomates, sauce au lait de coco et citron vert", prix: 22, photo: "photos/peixe.jpg", actif: true },
        { id: "escondidinho-vg", nom: "Gratin de lentilles et légumes sous purée de patate douce (empadão)", ds: "Lentilles mijotées aux champignons, carottes et tomates, sous une purée de patate douce gratinée au fromage", prix: 20, vg: true, actif: true }
      ],
      dessert: [
        { id: "tiramisu-classico", nom: "Tiramisù classico", ds: "Le classique incontournable, l’héritage italien de São Paulo", prix: 5.5, actif: true },
        { id: "tiramisu-mango", nom: "Tiramisù mango", ds: "Le mascarpone italien et la fraîcheur de la mangue", prix: 5.5, actif: true },
        { id: "tartufo-pistache", nom: "Tartufo pistache", ds: "Glace pistache, cœur fondant pistache et chocolat blanc", prix: 5.5, actif: true },
        { id: "tartufo-nocciola", nom: "Tartufo nocciola & cioccolato", ds: "Noisette et chocolat, cœur fondant, finition cacao", prix: 5.5, actif: true },
        { id: "pudim", nom: "Flan brésilien au caramel (pudim de leite)", ds: "Le flan brésilien au caramel", prix: 5.5, actif: true },
        { id: "brigadeiros", nom: "Brigadeiros maison", ds: "Les truffes brésiliennes au chocolat, assortiment", prix: 7, actif: false },
        { id: "gourmand", nom: "Assiette gourmande", ds: "Brigadeiros, tiramisù mango et pudim de leite", prix: 11, actif: false },
        { id: "maracuja", nom: "Mousse de fruit de la passion", ds: "Légère et acidulée", prix: 8, actif: false },
        { id: "tiramisu", nom: "Duo de tiramisùs", ds: "Classico et mango, l’héritage italien de São Paulo", prix: 9, actif: false },
        { id: "tartufi", nom: "Tartufi glacés", ds: "Pistache, et noisette-chocolat au cœur fondant", prix: 9, actif: false }
      ]
    },
    cafe: { nom: "Café, espresso ou thé", inclus: true, prix: 4.5 },
    bols: ["Riz blanc", "Feijão (haricots noirs mijotés)", "Farofa", "Couve à l’ail (chou vert sauté)", "Vinagrete (tomates, oignons et poivrons)", "Patates douces rôties", "Molho de pimenta (piment doux)"],
    forfaits: { soft: 12, vin: 4, complet: 14, enfant: 8 },
    vins: [
      { id: "blanc", nom: "Saint-Saphorin", ds: "Blanc · Lavaux AOC, chasselas", prix: 44, part: 40, actif: true },
      { id: "rouge", nom: "Gamay La Côte", ds: "Rouge · La Côte AOC", prix: 39, part: 40, actif: true },
      { id: "rose", nom: "Rosé de Gamay La Côte", ds: "Rosé · La Côte AOC", prix: 39, part: 20, actif: true }
    ],
    digestifs: [
      { id: "cachaca", nom: "Cachaça artisanale", ds: "Minas Gerais, 70 cl · environ 17 verres", prix: 65, actif: true },
      { id: "cachaca-vieille", nom: "Cachaça vieillie en fût", ds: "Bois d'umburana, 70 cl · environ 17 verres", prix: 85, actif: true },
      { id: "williamine", nom: "Williamine du Valais", ds: "Eau-de-vie de poire, 70 cl · environ 17 verres", prix: 79, actif: true },
      { id: "maracuja-liqueur", nom: "Liqueur de fruit de la passion", ds: "50 cl · environ 12 verres", prix: 49, actif: true }
    ],
    bulles: [
      { id: "leonie", nom: "Champagne Canard-Duchêne Brut Léonie", ds: "75 cl · environ 6 coupes", prix: 69, actif: true }
    ],
    honneurs: { trofeu: 35, revelacao: 35, anos: 30, boaviagem: 50 }
  };

  const copie = o => JSON.parse(JSON.stringify(o));

  // Complète un catalogue enregistré avec les champs du catalogue par défaut qui manqueraient
  function completer(cat) {
    const c = copie(DEFAUT);
    if (!cat || typeof cat !== "object") return c;
    // Ancienne version : prix du moment + supplément trophée séparés -> un seul prix tout compris
    if (cat.regles && cat.regles.productionSupplement != null && cat.honneurs) {
      const sup = Number(cat.regles.productionSupplement) || 0;
      cat.honneurs = Object.fromEntries(Object.entries(cat.honneurs).map(([k, v]) => [k, (Number(v) || 0) + sup]));
      delete cat.regles.productionSupplement;
    }
    ["contacts", "saison", "moments", "regles", "forfaits", "honneurs", "cafe"].forEach(k => { if (cat[k]) Object.assign(c[k], cat[k]); });
    // Version 3 : nouveau plat « Côtes de bœuf à la brésilienne », ajouté aux catalogues déjà enregistrés
    const vAvant = Number(cat.version) || 1;
    c.version = DEFAUT.version;
    if (cat.menu) ["bienvenue", "entree", "plat", "dessert"].forEach(k => {
      if (!Array.isArray(cat.menu[k])) return;
      // Les photos ajoutées après un premier enregistrement viennent des valeurs d'origine
      c.menu[k] = cat.menu[k].map(x => {
        const d = DEFAUT.menu[k].find(y => y.id === x.id);
        return x.photo === undefined && d && d.photo ? Object.assign({}, x, { photo: d.photo }) : x;
      });
    });
    if (vAvant < 3 && !c.menu.plat.some(x => x.id === "costela")) {
      const nv = DEFAUT.menu.plat.find(x => x.id === "costela");
      const i = c.menu.plat.findIndex(x => x.id === "maluca");
      c.menu.plat.splice(i >= 0 ? i : c.menu.plat.length, 0, copie(nv));
    }
    // Version 4 : l'accueil se sert avec des cacahuètes grillées, plus avec du pão de queijo
    if (vAvant < 4) c.menu.bienvenue = c.menu.bienvenue.map(x => {
      const d = DEFAUT.menu.bienvenue.find(y => y.id === x.id);
      if (!d) return x;
      if (x.id === "caipi" && x.nom === "Caipirinha et pão de queijo") return Object.assign({}, x, { nom: d.nom, ds: d.ds });
      if (x.id === "virgem" && x.nom === "Cocktail sans alcool et pão de queijo") return Object.assign({}, x, { nom: d.nom });
      return x;
    });
    // Version 5 : le bœuf rôti remplace le filet de bœuf grillé ; nouveau plat « Frango assado »
    // Version 6 : le plat de bœuf rôti s'annonce sous son vrai nom, rumsteck
    if (vAvant < 6) {
      const pic = DEFAUT.menu.plat.find(x => x.id === "boeuf");
      c.menu.plat = c.menu.plat.map(x => x.id === "boeuf" && (x.nom === "Filet de bœuf grillé" || x.nom === "Picanha rôtie au four") ? Object.assign({}, x, { nom: pic.nom, ds: pic.ds }) : x);
      if (vAvant < 5 && !c.menu.plat.some(x => x.id === "frango")) {
        const nv = DEFAUT.menu.plat.find(x => x.id === "frango");
        const i = c.menu.plat.findIndex(x => x.id === "maluca");
        c.menu.plat.splice(i >= 0 ? i : c.menu.plat.length, 0, copie(nv));
      }
    }
    // Version 7 : les deux moquecas sont retirées, remplacées par l'escondidinho de carne et l'escondidinho de legumes
    if (vAvant < 7) {
      const ids = { "moqueca": "escondidinho", "moqueca-vg": "escondidinho-vg" };
      Object.keys(ids).forEach(ancien => {
        const nv = DEFAUT.menu.plat.find(x => x.id === ids[ancien]);
        const i = c.menu.plat.findIndex(x => x.id === ancien);
        if (c.menu.plat.some(x => x.id === nv.id)) { if (i >= 0) c.menu.plat.splice(i, 1); return; }
        if (i >= 0) c.menu.plat.splice(i, 1, copie(nv)); else c.menu.plat.push(copie(nv));
      });
    }
    // Version 8 : les côtes de bœuf (cuisson trop longue) sont désactivées, réactivables dans l'admin
    if (vAvant < 8) c.menu.plat = c.menu.plat.map(x => x.id === "costela" ? Object.assign({}, x, { actif: false }) : x);
    // Version 9 : nouveau plat « Arroz de forno com frutos do mar », après le poisson en feuille de bananier
    if (vAvant < 9 && !c.menu.plat.some(x => x.id === "arroz-mar")) {
      const nv = DEFAUT.menu.plat.find(x => x.id === "arroz-mar");
      const i = c.menu.plat.findIndex(x => x.id === "bananier");
      c.menu.plat.splice(i >= 0 ? i + 1 : c.menu.plat.length, 0, copie(nv));
    }
    // Version 10 : boissons d'accueil d'hiver (quentão, vinho quente, chasselas, quentão sans alcool) ;
    // la batida et le cocktail passion sont désactivés, réactivables dans l'admin
    if (vAvant < 10) {
      c.menu.bienvenue = c.menu.bienvenue.map(x => x.id === "batida" || x.id === "virgem" ? Object.assign({}, x, { actif: false }) : x);
      ["quentao", "vinho-quente", "chasselas", "quentao-sa"].forEach(id => {
        if (c.menu.bienvenue.some(x => x.id === id)) return;
        const nv = DEFAUT.menu.bienvenue.find(x => x.id === id);
        const i = c.menu.bienvenue.findIndex(x => x.id === "batida");
        c.menu.bienvenue.splice(i >= 0 ? i : c.menu.bienvenue.length, 0, copie(nv));
      });
    }
    // Version 11 : nouvelles entrées (petiscos, caldinho, salpicão) ; le velouté prend son nom brésilien ;
    // les bouchées bahianaises et la salade de palmier sont désactivées, réactivables dans l'admin
    if (vAvant < 11) {
      const vel = DEFAUT.menu.entree.find(x => x.id === "veloute");
      c.menu.entree = c.menu.entree.map(x => {
        if (x.id === "bouchees" || x.id === "palmito") return Object.assign({}, x, { actif: false });
        if (x.id === "veloute" && x.nom === "Velouté de potiron au lait de coco") return Object.assign({}, x, { nom: vel.nom, ds: vel.ds, prix: Number(x.prix) === 10 ? vel.prix : x.prix });
        return x;
      });
      ["petiscos", "caldinho", "salpicao"].reverse().forEach(id => {
        if (!c.menu.entree.some(x => x.id === id)) c.menu.entree.unshift(copie(DEFAUT.menu.entree.find(x => x.id === id)));
      });
    }
    // Version 12 : desserts de la carte du café (tiramisùs, tartufi) ; la mousse passion est désactivée
    if (vAvant < 12) {
      c.menu.dessert = c.menu.dessert.map(x => {
        if (x.id === "maracuja") return Object.assign({}, x, { actif: false });
        if (x.id === "gourmand" && x.ds === "Brigadeiros, pudim et mousse de fruit de la passion") return Object.assign({}, x, { ds: "Brigadeiros, tiramisù mango et pudim de leite" });
        return x;
      });
      ["tiramisu", "tartufi"].forEach(id => {
        if (c.menu.dessert.some(x => x.id === id)) return;
        const i = c.menu.dessert.findIndex(x => x.id === "gourmand");
        c.menu.dessert.splice(i >= 0 ? i : c.menu.dessert.length, 0, copie(DEFAUT.menu.dessert.find(x => x.id === id)));
      });
    }
    // Version 13 : brigadeiros et assiette gourmande désactivés (réactivables dans l'admin) ; le tiramisù passe en tête
    if (vAvant < 13) {
      c.menu.dessert = c.menu.dessert.map(x => x.id === "brigadeiros" || x.id === "gourmand" ? Object.assign({}, x, { actif: false }) : x);
      ["tartufi", "tiramisu"].forEach(id => {
        const i = c.menu.dessert.findIndex(x => x.id === id);
        if (i > 0) c.menu.dessert.unshift(c.menu.dessert.splice(i, 1)[0]);
      });
    }
    // Version 15 : prix de la première saison, plus serrés — un prix changé dans l'admin n'est pas touché
    if (vAvant < 15) {
      const NOUVEAUX = { "plat.bananier": [29, 25], "plat.arroz-mar": [27, 24], "plat.boeuf": [28, 26], "plat.feijoada": [25.5, 24], "plat.escondidinho": [23, 22], "plat.escondidinho-vg": [22, 20], "entree.petiscos": [11, 10], "entree.salpicao": [11, 10], "entree.caldinho": [8, 7], "entree.veloute": [9, 8], "dessert.pudim": [8, 7] };
      Object.entries(NOUVEAUX).forEach(([cle, [avant, apres]]) => {
        const [k, id] = cle.split(".");
        c.menu[k] = c.menu[k].map(x => x.id === id && Number(x.prix) === avant ? Object.assign({}, x, { prix: apres }) : x);
      });
      if (Number(c.regles.minimumPrivatisation) === 1200) c.regles.minimumPrivatisation = 700;
    }
    // Version 16 : le frango assado devient le prix d'appel (22 -> 18), sauf prix changé dans l'admin
    if (vAvant < 16) c.menu.plat = c.menu.plat.map(x => x.id === "frango" && Number(x.prix) === 22 ? Object.assign({}, x, { prix: 18 }) : x);
    // Version 17 : desserts choisis par personne ; tiramisùs et tartufi séparés par parfum (même prix que l'ancien duo)
    if (vAvant < 17) {
      const ancien = id => c.menu.dessert.find(x => x.id === id);
      const nv = [["tiramisu-classico", "tiramisu"], ["tiramisu-mango", "tiramisu"], ["tartufo-pistache", "tartufi"], ["tartufo-nocciola", "tartufi"]]
        .filter(([id]) => !c.menu.dessert.some(x => x.id === id))
        .map(([id, a]) => { const d = copie(DEFAUT.menu.dessert.find(x => x.id === id)); const o = ancien(a); if (o && o.prix != null) d.prix = Number(o.prix); return d; });
      c.menu.dessert = nv.concat(c.menu.dessert.map(x => x.id === "tiramisu" || x.id === "tartufi" ? Object.assign({}, x, { actif: false }) : x));
    }
    // Version 18 : rumsteck rôti à 24 (26 avant), sauf prix changé dans l'admin
    if (vAvant < 18) c.menu.plat = c.menu.plat.map(x => x.id === "boeuf" && Number(x.prix) === 26 ? Object.assign({}, x, { prix: 24 }) : x);
    // Version 19 : nouvelle entrée « Massas da Cantina Bixiga », avant le velouté
    if (vAvant < 19 && !c.menu.entree.some(x => x.id === "massas")) {
      const i = c.menu.entree.findIndex(x => x.id === "veloute");
      c.menu.entree.splice(i >= 0 ? i : c.menu.entree.length, 0, copie(DEFAUT.menu.entree.find(x => x.id === "massas")));
    }
    // Version 20 : nouvelle entrée « Pinsas da Cantina São Paulo », après les massas
    if (vAvant < 20 && !c.menu.entree.some(x => x.id === "pinsas")) {
      const i = c.menu.entree.findIndex(x => x.id === "massas");
      c.menu.entree.splice(i >= 0 ? i + 1 : c.menu.entree.length, 0, copie(DEFAUT.menu.entree.find(x => x.id === "pinsas")));
    }
    // Version 21 : pinsas coupées en carrés apéro (description), sauf texte changé dans l'admin
    if (vAvant < 21) c.menu.entree = c.menu.entree.map(x => x.id === "pinsas" && x.ds === "Assortiment de pinsas romanas à partager : margherita, diavola, dolce crudo, jambon et salami. Une pinsa pour deux à trois personnes" ? Object.assign({}, x, { ds: DEFAUT.menu.entree.find(y => y.id === "pinsas").ds }) : x);
    // Version 22 : trois pinsas au lieu de cinq (margherita, jambon, salami), sauf texte changé dans l'admin
    if (vAvant < 22) c.menu.entree = c.menu.entree.map(x => x.id === "pinsas" && x.ds === "Assortiment de pinsas romanas coupées en carrés apéro, à partager : margherita, diavola, dolce crudo, jambon et salami" ? Object.assign({}, x, { ds: DEFAUT.menu.entree.find(y => y.id === "pinsas").ds }) : x);
    // Version 23 : salami piquant (diavola) au lieu du salami
    if (vAvant < 23) c.menu.entree = c.menu.entree.map(x => x.id === "pinsas" && x.ds === "Assortiment de pinsas romanas coupées en carrés apéro, à partager : margherita, jambon et salami" ? Object.assign({}, x, { ds: DEFAUT.menu.entree.find(y => y.id === "pinsas").ds }) : x);
    // Version 24 : mention « porc » sur les plats qui en contiennent (modifiable dans l'admin)
    if (vAvant < 24) [["entree", "caldinho"], ["entree", "massas"], ["entree", "pinsas"], ["plat", "feijoada"]].forEach(([k, id]) => {
      c.menu[k] = c.menu[k].map(x => x.id === id && x.porc === undefined ? Object.assign({}, x, { porc: true }) : x);
    });
    // Version 25 : tous les desserts à CHF 5.50 (sauf prix changé dans l'admin)
    if (vAvant < 25) { const ANCIENS = { "tiramisu-classico": 9, "tiramisu-mango": 9, "tartufo-pistache": 9, "tartufo-nocciola": 9, "pudim": 7 };
      c.menu.dessert = c.menu.dessert.map(x => ANCIENS[x.id] !== undefined && Number(x.prix) === ANCIENS[x.id] ? Object.assign({}, x, { prix: 5.5 }) : x); }
    // Version 26 : première saison, plats limités à feijoada, carne maluca et frango (réactivables dans l'admin)
    if (vAvant < 26) c.menu.plat = c.menu.plat.map(x => ["escondidinho", "boeuf", "bananier", "arroz-mar", "escondidinho-vg"].includes(x.id) ? Object.assign({}, x, { actif: false }) : x);
    // Version 27 : l'escondidinho de legumes reste proposé (plat végétarien)
    if (vAvant < 27) c.menu.plat = c.menu.plat.map(x => x.id === "escondidinho-vg" ? Object.assign({}, x, { actif: true }) : x);
    // Version 28 : nouveau plat « Peixe ao forno com molho de coco », après la carne maluca
    if (vAvant < 28 && !c.menu.plat.some(x => x.id === "peixe")) {
      const i = c.menu.plat.findIndex(x => x.id === "maluca");
      c.menu.plat.splice(i >= 0 ? i + 1 : c.menu.plat.length, 0, copie(DEFAUT.menu.plat.find(x => x.id === "peixe")));
    }
    // Version 29 : photo du poisson au four
    if (vAvant < 29) c.menu.plat = c.menu.plat.map(x => x.id === "peixe" && !x.photo ? Object.assign({}, x, { photo: "photos/peixe.jpg" }) : x);
    // Version 30 : feijoada à CHF 19 (sauf prix changé dans l'admin)
    if (vAvant < 30) c.menu.plat = c.menu.plat.map(x => x.id === "feijoada" && Number(x.prix) === 24 ? Object.assign({}, x, { prix: 19 }) : x);
    // Version 31 : deux salades en entrée, après le velouté
    if (vAvant < 31) ["salade-melee", "caprese"].forEach((id, n) => {
      if (c.menu.entree.some(x => x.id === id)) return;
      const i = c.menu.entree.findIndex(x => x.id === "veloute");
      c.menu.entree.splice(i >= 0 ? i + 1 + n : c.menu.entree.length, 0, copie(DEFAUT.menu.entree.find(x => x.id === id)));
    });
    // Version 32 : caipirinha sans cacahuètes (sauf texte changé dans l'admin)
    if (vAvant < 32) c.menu.bienvenue = c.menu.bienvenue.map(x => x.id === "caipi" && x.nom === "Caipirinha et cacahuètes grillées" ? Object.assign({}, x, { nom: DEFAUT.menu.bienvenue.find(y => y.id === "caipi").nom, ds: DEFAUT.menu.bienvenue.find(y => y.id === "caipi").ds }) : x);
    // Version 33 : quentão retiré de l'accueil (réactivable dans l'admin)
    if (vAvant < 33) c.menu.bienvenue = c.menu.bienvenue.map(x => x.id === "quentao" ? Object.assign({}, x, { actif: false }) : x);
    // Version 34 : eaux minérales parmi les boissons d'accueil
    if (vAvant < 34 && !c.menu.bienvenue.some(x => x.id === "eaux")) c.menu.bienvenue.push(copie(DEFAUT.menu.bienvenue.find(x => x.id === "eaux")));
    // Version 35 : les eaux minérales ne sont plus un choix d'accueil, elles accompagnent toujours la boisson choisie
    if (vAvant < 35) c.menu.bienvenue = c.menu.bienvenue.map(x => x.id === "eaux" ? Object.assign({}, x, { actif: false }) : x);
    // Version 36 : photos des pinsas et des deux salades
    if (vAvant < 36) { const PH = { pinsas: "photos/pinsas.jpg", "salade-melee": "photos/salade-melee.jpg", caprese: "photos/caprese.jpg" };
      c.menu.entree = c.menu.entree.map(x => PH[x.id] && !x.photo ? Object.assign({}, x, { photo: PH[x.id] }) : x); }
    // Version 37 : photos du vin chaud et du chasselas, nouvelle photo de la caipirinha (sans cacahuètes)
    if (vAvant < 37) { const PH = { "vinho-quente": "photos/vin-chaud.jpg", chasselas: "photos/chasselas.jpg" };
      c.menu.bienvenue = c.menu.bienvenue.map(x => x.id === "caipi" && (!x.photo || x.photo === "photos/caipirinha.jpg") ? Object.assign({}, x, { photo: "photos/caipirinha-2.jpg" }) : PH[x.id] && !x.photo ? Object.assign({}, x, { photo: PH[x.id] }) : x); }
    // Version 38 : caldinho au feijão de corda au lieu des haricots noirs (sauf texte changé dans l'admin)
    if (vAvant < 38) c.menu.entree = c.menu.entree.map(x => x.id === "caldinho" && x.ds === "Petite soupe de haricots noirs en tasse, lardons et coriandre" ? Object.assign({}, x, { nom: x.nom === "Caldinho de feijão" ? "Caldinho de feijão de corda" : x.nom, ds: DEFAUT.menu.entree.find(y => y.id === "caldinho").ds }) : x);
    // Version 39 : photo du caldinho au feijão de corda
    if (vAvant < 39) c.menu.entree = c.menu.entree.map(x => x.id === "caldinho" && (!x.photo || x.photo === "photos/caldinho.jpg") ? Object.assign({}, x, { photo: "photos/caldinho-corda.jpg" }) : x);
    // Version 40 : nom français d'abord, nom brésilien entre parenthèses (sauf nom changé dans l'admin)
    if (vAvant < 40) { const NOMS = {"vinho-quente": ["Vinho quente au Gamay vaudois", "Vin chaud au Gamay vaudois (vinho quente)"], "quentao-sa": ["Quentão sans alcool", "Jus de pomme chaud aux épices (quentão sans alcool)"], "petiscos": ["Petiscos do Bossa", "Bouchées brésiliennes à partager (petiscos)"], "caldinho": ["Caldinho de feijão de corda", "Soupe de haricots à œil noir (caldinho)"], "salpicao": ["Salpicão de Natal", "Salade de Noël au poulet (salpicão)"], "massas": ["Massas da Cantina Bixiga", "Gratin de pâtes de São Paulo (massas)"], "pinsas": ["Pinsas da Cantina São Paulo", "Pinsas romaines en carrés apéro (Cantina São Paulo)"], "veloute": ["Creme de abóbora com coco", "Velouté de courge au lait de coco (creme de abóbora)"], "feijoada": ["Feijoada complète", "Ragoût de haricots noirs aux viandes (feijoada complète)"], "frango": ["Frango assado", "Poulet rôti au citron vert (frango assado)"], "maluca": ["Carne maluca", "Bœuf effiloché aux poivrons (carne maluca)"], "peixe": ["Peixe ao forno com molho de coco", "Poisson au four au lait de coco (peixe ao forno)"], "escondidinho-vg": ["Escondidinho de legumes", "Gratin de légumes sous purée de manioc (escondidinho)"], "pudim": ["Pudim de leite", "Flan brésilien au caramel (pudim de leite)"]};
      Object.keys(c.menu).forEach(k => { c.menu[k] = c.menu[k].map(x => NOMS[x.id] && x.nom === NOMS[x.id][0] ? Object.assign({}, x, { nom: NOMS[x.id][1] }) : x); }); }
    // Version 41 : plat végétarien remplacé par l'empadão de lentilles et légumes (prix et statut gardés)
    if (vAvant < 41) c.menu.plat = c.menu.plat.map(x => {
      if (x.id !== "escondidinho-vg") return x;
      const d = DEFAUT.menu.plat.find(y => y.id === "escondidinho-vg"), n = Object.assign({}, x, { nom: d.nom, ds: d.ds });
      if (n.photo === "photos/escondidinho-vg.jpg") delete n.photo;
      return n;
    });
    ["bols", "vins", "digestifs", "bulles"].forEach(k => { if (Array.isArray(cat[k])) c[k] = cat[k]; });
    // Version 14 : accompagnements revus (un seul bol au four) — seulement si la liste n'a pas été modifiée dans l'admin
    const BOLS_AVANT_14 = ["Riz blanc", "Farofa", "Haricots noirs", "Pommes de terre au four", "Patates douces rôties", "Courge, poivrons et oignons rouges rôtis au four", "Vinaigrette brésilienne", "Sauces pimentées douces"];
    if (vAvant < 14 && JSON.stringify(c.bols) === JSON.stringify(BOLS_AVANT_14)) c.bols = copie(DEFAUT.bols);
    c.majLe = cat.majLe || null;
    return c;
  }

  // ---------- Firebase (chargé seulement si firebase-config.js est rempli) ----------
  let fb = null;
  function chargerScript(src) {
    return new Promise((ok, ko) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => ko(new Error("Impossible de charger " + src));
      document.head.appendChild(s);
    });
  }
  async function firebase() {
    if (fb) return fb;
    const conf = window.FIREBASE_CONFIG;
    if (!conf || !conf.projectId) return null;
    await chargerScript(SDK + "firebase-app-compat.js");
    await Promise.all([chargerScript(SDK + "firebase-firestore-compat.js"), chargerScript(SDK + "firebase-auth-compat.js")]);
    const app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(conf);
    fb = { app, db: app.firestore(), auth: app.auth() };
    return fb;
  }
  const docRef = f => f.db.collection("parametres").doc("confra-catalogue");

  function lireLocal() {
    try { const t = localStorage.getItem(CLE_LOCALE); return t ? JSON.parse(t) : null; } catch (e) { return null; }
  }

  // ---------- Offres personnalisées ----------
  // Une offre voyage entière dans le lien envoyé au client (#offre=…) : elle fonctionne
  // sans serveur. La liste des offres créées est gardée pour l'administration.
  const CLE_OFFRES = "bossanova-confra-offres";
  const offresRef = f => f.db.collection("parametres").doc("confra-offres");
  function encoderOffre(o) {
    const octets = new TextEncoder().encode(JSON.stringify(o));
    let bin = "";
    octets.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decoderOffre(t) {
    const b64 = t.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
  }

  window.Catalogue = {
    DEFAUT: copie(DEFAUT),
    encoderOffre,
    decoderOffre,
    lireOffreDuLien() {
      const m = location.hash.match(/offre=([A-Za-z0-9_-]+)/);
      if (!m) return null;
      try { const o = decoderOffre(m[1]); return o && o.code ? o : null; } catch (e) { return null; }
    },
    async chargerOffres() {
      const f = await firebase();
      if (f) { const d = await offresRef(f).get(); return d.exists && Array.isArray(d.data().liste) ? d.data().liste : []; }
      try { return JSON.parse(localStorage.getItem(CLE_OFFRES)) || []; } catch (e) { return []; }
    },
    async enregistrerOffres(liste) {
      const f = await firebase();
      if (f) { await offresRef(f).set({ liste, majLe: new Date().toISOString() }); return; }
      localStorage.setItem(CLE_OFFRES, JSON.stringify(liste));
    },
    // Achats des soirées (achats.html) : soirées confirmées, recettes et prix d'achat, réservés à l'équipe
    async chargerAchats() {
      const f = await firebase();
      if (f) { const d = await f.db.collection("parametres").doc("confra-achats").get(); return d.exists ? d.data() : null; }
      try { return JSON.parse(localStorage.getItem("bossanova-confra-achats")); } catch (e) { return null; }
    },
    async enregistrerAchats(donnees) {
      const propre = Object.assign({}, donnees, { majLe: new Date().toISOString() });
      const f = await firebase();
      if (f) { await f.db.collection("parametres").doc("confra-achats").set(JSON.parse(JSON.stringify(propre))); return propre; }
      localStorage.setItem("bossanova-confra-achats", JSON.stringify(propre));
      return propre;
    },
    completer,
    mode() { return window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId ? "en ligne" : "local"; },

    async charger() {
      try {
        const f = await firebase();
        if (f) {
          const d = await docRef(f).get();
          return completer(d.exists ? d.data() : null);
        }
      } catch (e) {
        console.warn("Catalogue en ligne indisponible, valeurs par défaut utilisées.", e);
        return completer(null);
      }
      return completer(lireLocal());
    },

    async enregistrer(cat) {
      const propre = completer(cat);
      propre.majLe = new Date().toISOString();
      const f = await firebase();
      if (f) { await docRef(f).set(propre); return propre; }
      localStorage.setItem(CLE_LOCALE, JSON.stringify(propre));
      return propre;
    },

    // Connexion de l'administrateur (mode en ligne uniquement)
    async connexion(email, motDePasse) {
      let f;
      try { f = await firebase(); } catch (e) { const er = new Error("sdk"); er.code = "app/sdk"; throw er; }
      return f.auth.signInWithEmailAndPassword(email.trim().toLowerCase(), motDePasse);
    },
    // Message clair selon l'erreur de connexion (tablettes, réseau, navigateur intégré…)
    messageConnexion(e) {
      const c = (e && e.code) || "";
      const t = {
        "auth/invalid-credential": "E-mail ou mot de passe incorrect. Vérifie les majuscules du mot de passe (le clavier de la tablette en ajoute parfois une au début).",
        "auth/wrong-password": "Mot de passe incorrect. Vérifie les majuscules (le clavier de la tablette en ajoute parfois une au début).",
        "auth/invalid-login-credentials": "E-mail ou mot de passe incorrect. Vérifie les majuscules du mot de passe.",
        "auth/user-not-found": "Aucun compte avec cet e-mail.",
        "auth/invalid-email": "L’adresse e-mail n’est pas valide. Vérifie qu’il n’y a pas d’espace ou de faute.",
        "auth/missing-password": "Indique ton mot de passe.",
        "auth/too-many-requests": "Trop d’essais : la connexion est bloquée quelques minutes. Réessaie plus tard.",
        "auth/network-request-failed": "Pas de connexion internet, ou le réseau bloque Firebase. Vérifie le Wi-Fi et réessaie.",
        "auth/web-storage-unsupported": "Ce navigateur bloque l’enregistrement de la session (navigation privée ou navigateur intégré à une app). Ouvre la page dans Chrome, hors navigation privée.",
        "auth/operation-not-supported-in-this-environment": "Ce navigateur n’est pas pris en charge. Ouvre la page dans Chrome.",
        "app/sdk": "Impossible de charger le module de connexion. Vérifie internet, désactive un éventuel bloqueur de publicité, ou ouvre la page dans Chrome."
      }[c];
      return t || "Connexion impossible" + (c ? " (" + c + ")" : "") + ". Ouvre la page dans Chrome et réessaie.";
    },
    async deconnexion() { const f = await firebase(); if (f) await f.auth.signOut(); },
    async surConnexion(rappel) { const f = await firebase(); if (!f) { rappel({ local: true }); return; } f.auth.onAuthStateChanged(u => rappel(u)); }
  };
})();
