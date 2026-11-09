/* Barre de navigation commune aux pages d'administration du Bossa Nova Café.
   Utilisation : <script src="nav-admin.js" data-page="stock"></script>, placé là où la barre doit apparaître
   (tout en haut du <body> d'une page d'administration). Dans le portail de réservations :
   <script src="../soirees/nav-admin.js" data-page="reservations"></script>.
   Pour ajouter une page à toutes les barres : l'ajouter dans PAGES ci-dessous, et dans admin.html. */
(function () {
  const script = document.currentScript;
  // Les visites de l'équipe ne sont pas comptées dans GoatCounter (tout le site bossa-nova-cafe.github.io)
  try { localStorage.setItem("skipgc", "t"); } catch (e) { /* navigation privée */ }
  if (!script) return;
  const ici = script.dataset.page || "";
  // Les deux sites sont voisins sur bossa-nova-cafe.github.io : /soirees/ et /bossa-nova-reservations/
  const depuisResa = /bossa-nova-reservations/.test(location.pathname);
  const S = depuisResa ? "../soirees/" : "";
  const R = depuisResa ? "" : "../bossa-nova-reservations/";

  const PAGES = [
    { id: "accueil", nom: "Accueil", href: S + "admin.html" },
    { id: "stock", nom: "Stock", href: S + "stock.html" },
    { id: "caisse", nom: "Caisse", href: S + "caisse.html" },
    { id: "reservations", nom: "Réservations", href: R + "index.html#gestion" },
    { id: "festa", nom: "Prix de la Festa", href: S + "festa-admin.html" },
    { id: "achats", nom: "Achats des soirées", href: S + "achats.html" }
  ];

  const css = `
  .nav-adm { background: #082a1f; color: #fbf6e9; font-family: "Poppins", system-ui, -apple-system, "Segoe UI", sans-serif; font-size: 13.5px; padding-top: env(safe-area-inset-top, 0px); position: relative; z-index: 30; }
  .nav-adm__in { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 6px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;
    padding: 7px max(12px, env(safe-area-inset-right, 0px)) 7px max(12px, env(safe-area-inset-left, 0px)); }
  .nav-adm__in::-webkit-scrollbar { display: none; }
  .nav-adm a { color: #d5e3da; text-decoration: none; white-space: nowrap; padding: 6px 12px; border-radius: 999px; font-weight: 500; line-height: 1.2; }
  .nav-adm a:hover { background: rgba(255,255,255,.08); color: #fff; }
  .nav-adm a:focus-visible { outline: 2px solid #f2c230; outline-offset: 1px; }
  .nav-adm a[aria-current="page"] { background: #f2c230; color: #0f3d2e; font-weight: 600; }
  .nav-adm__marque { font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; font-size: 11px; color: #f2c230; padding-right: 6px; white-space: nowrap; }
  .nav-adm__sep { width: 1px; align-self: stretch; background: rgba(255,255,255,.15); margin: 4px 2px; flex: none; }
  .nav-adm--encart { border-radius: 12px; margin: 0 0 14px; padding-top: 0; }
  .nav-adm--encart .nav-adm__in { padding-left: 10px; padding-right: 10px; }
  @media print { .nav-adm { display: none; } }`;
  if (!document.getElementById("nav-adm-style")) {
    const st = document.createElement("style"); st.id = "nav-adm-style"; st.textContent = css; document.head.appendChild(st);
  }

  const nav = document.createElement("nav");
  nav.className = "nav-adm";
  if (script.parentNode !== document.body) nav.classList.add("nav-adm--encart");
  nav.setAttribute("aria-label", "Pages d’administration");
  const ins = document.createElement("div");
  ins.className = "nav-adm__in";
  const marque = document.createElement("span");
  marque.className = "nav-adm__marque"; marque.textContent = "Bossa Nova · Admin";
  ins.appendChild(marque);
  PAGES.forEach((p, i) => {
    if (i === 1) { const s = document.createElement("span"); s.className = "nav-adm__sep"; ins.appendChild(s); }
    const a = document.createElement("a");
    a.href = p.href; a.textContent = p.nom;
    if (p.id === ici) a.setAttribute("aria-current", "page");
    ins.appendChild(a);
  });
  nav.appendChild(ins);
  script.parentNode.insertBefore(nav, script);
  const actif = ins.querySelector('[aria-current="page"]');
  if (actif && actif.scrollIntoView) setTimeout(() => { try { actif.scrollIntoView({ block: "nearest", inline: "center" }); } catch (e) { /* ancien navigateur */ } }, 0);
})();
