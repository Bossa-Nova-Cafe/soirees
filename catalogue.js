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
    version: 2,
    contacts: { whatsapp: "41766390495", email: "vevey@bossanova-cafe.ch" },
    saison: { debut: "2026-11-16", fin: "2027-02-28" },
    moments: { soir: true, midi: false, afterwork: false },
    regles: {
      minimumPrivatisation: 1200,
      acomptePourcent: 30,
      prolongationParHeure: 200,
      gateauParPersonne: 6,
      afterworkPrix: 42,
      productionDelaiJours: 15,
      earlyBirdJours: 30,
      droitBouchon: 10
    },
    menu: {
      bienvenue: [
        { id: "caipi", nom: "Caipirinha et pão de queijo", ds: "Le cocktail national, citron vert et cachaça, avec les petits pains au fromage", prix: 8, inclus: true, actif: true },
        { id: "batida", nom: "Batida de coco et chips de manioc", ds: "Cocktail onctueux au lait de coco", prix: 8, inclus: true, actif: true },
        { id: "virgem", nom: "Cocktail sans alcool et pão de queijo", ds: "Fruit de la passion, citron vert et menthe", prix: 6, inclus: true, actif: true }
      ],
      entree: [
        { id: "bouchees", nom: "Assortiment de bouchées bahianaises", ds: "Coxinhas, pastéis et acarajé à partager", prix: 12, actif: true },
        { id: "palmito", nom: "Salade de cœurs de palmier, mangue et crevettes", ds: "Vinaigrette au citron vert et coriandre", prix: 13, actif: true },
        { id: "veloute", nom: "Velouté de potiron au lait de coco", ds: "Gingembre et graines torréfiées", prix: 10, vg: true, actif: true }
      ],
      plat: [
        { id: "feijoada", nom: "Feijoada complète", ds: "Haricots noirs mijotés aux viandes, chou vert et orange", prix: 25.5, actif: true },
        { id: "moqueca", nom: "Moqueca de poisson de Bahia", ds: "Poisson au lait de coco et huile de dendê, pirão", prix: 26, actif: true },
        { id: "boeuf", nom: "Filet de bœuf grillé", ds: "Grillé et tranché, à la brésilienne", prix: 28, actif: true },
        { id: "bananier", nom: "Poisson en feuille de bananier", ds: "Filet de poisson cuit à l'étouffée, lait de coco et herbes fraîches", prix: 29, actif: true },
        { id: "maluca", nom: "Carne maluca", ds: "Effiloché de bœuf mijoté aux poivrons, oignons et tomates", prix: 22, actif: true },
        { id: "moqueca-vg", nom: "Moqueca de cœurs de palmier et plantain", ds: "Lait de coco et poivrons", prix: 25, vg: true, actif: true }
      ],
      dessert: [
        { id: "brigadeiros", nom: "Brigadeiros maison", ds: "Les truffes brésiliennes au chocolat, assortiment", prix: 7, actif: true },
        { id: "pudim", nom: "Pudim de leite", ds: "Le flan brésilien au caramel", prix: 8, actif: true },
        { id: "maracuja", nom: "Mousse de fruit de la passion", ds: "Légère et acidulée", prix: 8, actif: true },
        { id: "gourmand", nom: "Assiette gourmande", ds: "Brigadeiros, pudim et mousse de fruit de la passion", prix: 11, actif: true }
      ]
    },
    cafe: { nom: "Café, espresso ou thé", inclus: true, prix: 4.5 },
    bols: ["Riz blanc", "Farofa", "Haricots noirs", "Pommes de terre au four", "Patates douces rôties", "Courge, poivrons et oignons rouges rôtis au four", "Vinaigrette brésilienne", "Sauces pimentées douces"],
    forfaits: { soft: 12, vin: 4, complet: 14 },
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
    c.version = DEFAUT.version;
    if (cat.menu) ["bienvenue", "entree", "plat", "dessert"].forEach(k => { if (Array.isArray(cat.menu[k])) c.menu[k] = cat.menu[k]; });
    ["bols", "vins", "digestifs"].forEach(k => { if (Array.isArray(cat[k])) c[k] = cat[k]; });
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
    async connexion(email, motDePasse) { const f = await firebase(); return f.auth.signInWithEmailAndPassword(email, motDePasse); },
    async deconnexion() { const f = await firebase(); if (f) await f.auth.signOut(); },
    async surConnexion(rappel) { const f = await firebase(); if (!f) { rappel({ local: true }); return; } f.auth.onAuthStateChanged(u => rappel(u)); }
  };
})();
