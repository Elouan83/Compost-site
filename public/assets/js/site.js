// SOLAÏ — comportements du site (site fictif : aucune commande ni donnée n'est transmise à un serveur).
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const euro = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
  const P = id => SOLAI.produits.find(p => p.id === id);
  const page = document.body.dataset.page || "";
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const offre = SOLAI.offre, debut = new Date(offre.debut), fin = new Date(offre.fin);
  const jour = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  /* ---------- En-tête, pied, panier, cookies ---------- */
  const liens = [["index.html", "Accueil", "accueil"], ["produits.html", "Nos boissons", "produits"], ["offre.html", "Offre de lancement", "offre"], ["histoire.html", "Notre histoire", "histoire"], ["salon.html", "Le salon", "salon"], ["contact.html", "Contact", "contact"]];
  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip" href="#contenu">Aller au contenu</a>
    <div class="bandeau">🌸 Offre de lancement Évasion Japon : <strong>${offre.libelle}</strong>, du ${jour(debut)} au ${jour(fin)}. <a href="offre.html">Découvrir</a></div>
    <header class="entete"><div class="wrap">
      <a class="marque" href="index.html" aria-label="SOLAÏ, accueil">SOLAÏ</a>
      <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
      <nav class="nav" aria-label="Navigation principale">
        ${liens.map(l => `<a href="${l[0]}"${l[2] === page ? ' aria-current="page"' : ""}>${l[1]}</a>`).join("")}
        <button class="panier-btn" aria-label="Ouvrir le panier">Panier <span class="nb" data-nb>0</span></button>
      </nav>
    </div></header>`);
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="pied"><div class="wrap">
      <div class="cols">
        <div><span class="marque">SOLAÏ</span><p>Du soleil à chaque gorgée.</p><p>Marque artisanale de boissons fruitées sans alcool. Format 33 cl.</p></div>
        <div><h3>Le site</h3><ul>${liens.map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join("")}</ul></div>
        <div><h3>Informations</h3><ul>
          <li><a href="mentions-legales.html">Mentions légales</a></li>
          <li><a href="cgv.html">Conditions générales de vente</a></li>
          <li><a href="confidentialite.html">Confidentialité et cookies</a></li>
          <li><a href="#" data-cookies>Gérer mes cookies</a></li></ul></div>
        <div><h3>La lettre SOLAÏ</h3><p>Recevez nos nouveautés et nos offres.</p>
          <form data-form="lettre" class="ligne"><label class="sr-only" for="nl">Adresse e-mail</label><input id="nl" type="email" name="email" required placeholder="vous@exemple.fr"><button class="btn petit">Je m’inscris</button></form>
          <p class="note" style="color:#cfe3d2;margin-top:.6em">Désinscription possible à tout moment. Voir la <a href="confidentialite.html">politique de confidentialité</a>.</p></div>
      </div>
      <div class="bas"><span>© 2026 SOLAÏ — ${SOLAI.fabricant.replace("SOLAÏ — ", "")}</span><span>Site fictif réalisé dans le cadre d’un projet étudiant (SAÉ Création d’entreprise). Aucune vente réelle.</span></div>
    </div></footer>
    <div class="voile"></div>
    <aside class="tiroir" aria-label="Panier" aria-hidden="true">
      <header><h2>Votre panier</h2><button class="fermer" aria-label="Fermer le panier">×</button></header>
      <div class="contenu" data-panier></div>
      <footer data-panier-pied></footer>
    </aside>
    <div class="toast" role="status" aria-live="polite"></div>`);

  const burger = $(".burger"), nav = $(".nav");
  burger.onclick = () => burger.setAttribute("aria-expanded", nav.classList.toggle("ouvert"));

  let tToast;
  function toast(msg) { const t = $(".toast"); t.textContent = msg; t.classList.add("vu"); clearTimeout(tToast); tToast = setTimeout(() => t.classList.remove("vu"), 2600); }

  /* ---------- Panier ---------- */
  let panier = store.get("solai-panier", {});
  const tiroir = $(".tiroir"), voile = $(".voile");
  function ouvrir(o) { tiroir.classList.toggle("ouvert", o); voile.classList.toggle("ouvert", o); tiroir.setAttribute("aria-hidden", !o); if (o) $(".fermer").focus(); }
  $(".panier-btn").onclick = () => ouvrir(true);
  $(".fermer").onclick = voile.onclick = () => ouvrir(false);
  document.addEventListener("keydown", e => e.key === "Escape" && ouvrir(false));

  function calcul() {
    let sous = 0, nb = 0;
    for (const [id, q] of Object.entries(panier)) { sous += P(id).prix * q; nb += q; }
    // Offre de lancement : pour 3 Évasion Japon dans le panier, la 3e est offerte (2 achetées = 1 offerte).
    const active = new Date() <= fin;
    const offertes = active ? Math.floor((panier[offre.produit] || 0) / 3) : 0;
    const remise = offertes * P(offre.produit).prix;
    return { sous, nb, offertes, remise, total: sous - remise };
  }
  function rendre() {
    store.set("solai-panier", panier);
    const c = calcul();
    $$("[data-nb]").forEach(e => e.textContent = c.nb);
    const ids = Object.keys(panier);
    $("[data-panier]").innerHTML = ids.length ? ids.map(id => { const p = P(id); return `
      <div class="ligne-panier">
        <div class="pastille"><img src="assets/img/${id}-face.jpg" alt=""></div>
        <div><b>${p.gamme} ${p.nom}</b><span class="note">${euro(p.prix)} · 33 cl</span>
          <div class="qte" style="margin-top:6px"><button data-moins="${id}" aria-label="Retirer une ${p.nom}">−</button><output>${panier[id]}</output><button data-plus="${id}" aria-label="Ajouter une ${p.nom}">+</button></div></div>
        <div><b>${euro(p.prix * panier[id])}</b><button data-suppr="${id}" class="note" style="border:0;background:none;cursor:pointer;text-decoration:underline">Retirer</button></div>
      </div>`; }).join("") : `<p class="centre" style="margin-top:3em">Votre panier est vide.<br><a href="produits.html">Découvrir nos boissons</a></p>`;
    const j = panier[offre.produit] || 0;
    const astuce = ["Offre appliquée sur vos Évasion Japon.", "Ajoutez 2 Évasion Japon de plus : la 3ᵉ est offerte.", "Ajoutez encore 1 Évasion Japon : elle est offerte."][j % 3];
    $("[data-panier-pied]").innerHTML = ids.length ? `
      ${j && new Date() <= fin ? `<p class="note">🌸 ${astuce}</p>` : ""}
      <div class="total"><span>Sous-total TTC</span><span>${euro(c.sous)}</span></div>
      ${c.remise ? `<div class="total remise"><span>Offre « ${offre.libelle} » (${c.offertes} offerte${c.offertes > 1 ? "s" : ""})</span><span>−${euro(c.remise)}</span></div>` : ""}
      <div class="total gros"><span>Total TTC</span><span>${euro(c.total)}</span></div>
      <p class="note">Hors frais de livraison. ${new Date() < debut ? `Aperçu de l’offre, valable du ${jour(debut)} au ${jour(fin)}.` : ""}</p>
      <button class="btn vert" style="width:100%" data-commander>Valider la commande</button>` : "";
  }
  function ajouter(id, q = 1) { panier[id] = (panier[id] || 0) + q; rendre(); toast(`${P(id).gamme} ${P(id).nom} ajoutée au panier`); }
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-ajout],[data-plus],[data-moins],[data-suppr],[data-commander],[data-cookies]");
    if (!t) return;
    if (t.dataset.ajout) { e.preventDefault(); ajouter(t.dataset.ajout, +(t.dataset.qte || 1)); }
    else if (t.dataset.plus) { panier[t.dataset.plus]++; rendre(); }
    else if (t.dataset.moins) { if (--panier[t.dataset.moins] <= 0) delete panier[t.dataset.moins]; rendre(); }
    else if (t.dataset.suppr) { delete panier[t.dataset.suppr]; rendre(); }
    else if ("commander" in t.dataset) {
      panier = {}; rendre();
      $("[data-panier]").innerHTML = `<div class="ok" style="margin-top:2em"><strong>Merci !</strong> Ceci est une simulation : SOLAÏ est un site fictif réalisé dans le cadre d’un projet étudiant. Aucune commande n’a été enregistrée et aucun paiement n’a été effectué.</div>`;
    } else if ("cookies" in t.dataset) { e.preventDefault(); bandeauCookies(); }
  });

  /* ---------- Cookies (consentement) ---------- */
  function bandeauCookies() {
    $(".cookies")?.remove();
    document.body.insertAdjacentHTML("beforeend", `<div class="cookies" role="dialog" aria-label="Cookies">
      <strong>🍪 Cookies et stockage local</strong>
      <p style="margin:.4em 0 0">Ce site utilise uniquement un stockage strictement nécessaire (panier, choix cookies). Aucun traceur publicitaire. La mesure d’audience n’est activée qu’avec votre accord. <a href="confidentialite.html">En savoir plus</a></p>
      <div class="ligne"><button class="btn petit" data-c="oui">Tout accepter</button><button class="btn petit clair" data-c="non">Tout refuser</button></div></div>`);
    $$(".cookies [data-c]").forEach(b => b.onclick = () => { store.set("solai-cookies", { choix: b.dataset.c, date: new Date().toISOString() }); $(".cookies").remove(); toast(b.dataset.c === "oui" ? "Cookies acceptés" : "Cookies refusés"); });
  }
  if (!store.get("solai-cookies")) bandeauCookies();

  /* ---------- Formulaires (simulation locale) ---------- */
  document.addEventListener("submit", e => {
    const f = e.target.closest("[data-form]"); if (!f) return;
    e.preventDefault();
    const msg = { lettre: "Merci ! Votre inscription à la lettre SOLAÏ est prise en compte.", contact: "Merci pour votre message ! Nous vous répondrons dans les meilleurs délais.", salon: "C’est noté ! Nous vous préviendrons avant l’ouverture du salon." }[f.dataset.form];
    f.outerHTML = `<div class="ok" role="status">${msg}<br><span class="note">Site fictif : aucune donnée n’a été envoyée.</span></div>`;
  });

  /* ---------- Cartes produit ---------- */
  function carte(p) {
    return `<article class="carte reveler" style="--c:${p.couleur}" data-gamme="${p.gamme}">
      ${p.id === offre.produit ? `<span class="badge">${offre.libelle}</span>` : ""}
      <div class="pastille" style="background:${p.teinte}"><img src="assets/img/${p.id}-face.jpg" alt="SOLAÏ ${p.gamme} ${p.nom}, contenant rond de 33 cl" loading="lazy" width="564" height="563"></div>
      <span class="gamme">${p.gamme}</span>
      <h3><a href="produit.html?id=${p.id}">${p.nom}</a></h3>
      <p class="saveurs">${p.saveurs.join(" · ")}</p>
      <div class="bas"><span class="prix">${euro(p.prix)}<small>TTC · 33 cl</small></span><button class="btn petit" data-ajout="${p.id}" aria-label="Ajouter ${p.gamme} ${p.nom} au panier">Ajouter</button></div>
    </article>`;
  }
  $$("[data-grille]").forEach(g => {
    const f = g.dataset.grille;
    g.innerHTML = SOLAI.produits.filter(p => !f || f === "tous" || p.gamme === f).map(carte).join("");
  });
  $$(".filtres button").forEach(b => b.onclick = () => {
    $$(".filtres button").forEach(x => x.setAttribute("aria-pressed", x === b));
    $$("[data-grille] .carte").forEach(c => c.hidden = b.dataset.f !== "tous" && c.dataset.gamme !== b.dataset.f);
  });

  /* ---------- Fiche produit ---------- */
  const fiche = $("[data-fiche]");
  if (fiche) {
    const p = P(new URLSearchParams(location.search).get("id")) || SOLAI.produits[0];
    document.title = `${p.gamme} ${p.nom} — ${p.denomination} 33 cl | SOLAÏ`;
    $('meta[name="description"]')?.setAttribute("content", `${p.gamme} ${p.nom} : ${p.court} ${euro(p.prix)} TTC les 33 cl.`);
    const estOffre = p.id === offre.produit;
    fiche.style.setProperty("--c", p.couleur); fiche.style.setProperty("--teinte-produit", p.teinte);
    fiche.innerHTML = `
      <div class="fiche-visuel">
        <div class="pastille"><img data-vue src="assets/img/${p.id}-face.jpg" alt="SOLAÏ ${p.gamme} ${p.nom}, face avant" width="564" height="563"></div>
        <div class="vues"><button aria-pressed="true" data-v="face">Face avant</button><button aria-pressed="false" data-v="dos">Face arrière</button></div>
        <p class="note centre" style="margin-top:10px">Visuels de maquette, non contractuels.</p>
      </div>
      <div>
        <span class="gamme">Gamme ${p.gamme}</span>
        <h1>${p.nom}</h1>
        <p><strong>${p.denomination}</strong> · 33 cl</p>
        <div class="puces">${p.saveurs.map(s => `<span>${s}</span>`).join("")}</div>
        <p class="chapo">${p.texte}</p>
        ${estOffre ? `<div class="encart" style="border-left-color:var(--rouge)"><strong>🌸 Offre de lancement : ${offre.libelle}</strong><br>Du ${jour(debut)} au ${jour(fin)}. Ajoutez 3 Évasion Japon au panier, la troisième est offerte. <a href="offre.html">Voir l’offre</a></div>` : ""}
        <div class="achat">
          <span class="prix">${euro(p.prix)}<small>TTC · l’unité de 33 cl</small></span>
          <div class="qte"><button data-q="-1" aria-label="Diminuer la quantité">−</button><output data-qte>1</output><button data-q="1" aria-label="Augmenter la quantité">+</button></div>
          <button class="btn" style="--accent:${p.couleur};--accent-fonce:#0003" data-ajout="${p.id}" data-qte="1">Ajouter au panier</button>
        </div>
        <p class="note">Prix au litre : ${euro(p.prix / 0.33)}. Prix TTC, hors frais de livraison.</p>
        <details open><summary>Ingrédients</summary><p>${p.ingredients}</p></details>
        <details><summary>Valeurs nutritionnelles moyennes pour 100 ml</summary>
          <table class="nutri"><thead><tr><th>Pour 100 ml</th><th></th></tr></thead><tbody>${SOLAI.nutrition.map(n => `<tr${n[2] ? ' class="sous"' : ""}><th scope="row">${n[0]}</th><td>${n[1]}</td></tr>`).join("")}</tbody></table></details>
        <details><summary>Conservation</summary><p>${SOLAI.conservation}</p></details>
        <details><summary>Emballage</summary><p>Contenant rond de 33 cl, à base aplatie : corps en PET transparent et couvercle en aluminium avec languette (ouverture sans outil, type canette). Le contenant n’est pas refermable : il est pensé pour une consommation en une seule occasion.</p></details>
        <details><summary>Fabricant</summary><p>${SOLAI.fabricant}</p></details>
      </div>`;
    let q = 1;
    $$("[data-q]", fiche).forEach(b => b.onclick = () => { q = Math.max(1, Math.min(24, q + +b.dataset.q)); $("[data-qte]", fiche).textContent = q; $(".achat [data-ajout]", fiche).dataset.qte = q; });
    $$("[data-v]", fiche).forEach(b => b.onclick = () => { $$("[data-v]", fiche).forEach(x => x.setAttribute("aria-pressed", x === b)); const i = $("[data-vue]", fiche); i.src = `assets/img/${p.id}-${b.dataset.v}.jpg`; i.alt = `SOLAÏ ${p.gamme} ${p.nom}, face ${b.dataset.v === "dos" ? "arrière avec mentions" : "avant"}`; });
    const fil = $("[data-fil]"); if (fil) fil.textContent = `${p.gamme} ${p.nom}`;
    const autres = $("[data-autres]"); if (autres) autres.innerHTML = SOLAI.produits.filter(x => x.id !== p.id).slice(0, 4).map(carte).join("");
  }

  /* ---------- Compte à rebours de l'offre ---------- */
  $$("[data-compte]").forEach(el => {
    const titre = $("[data-compte-titre]");
    (function maj() {
      const now = new Date(), cible = now < debut ? debut : fin;
      if (titre) titre.textContent = now < debut ? "L’offre démarre dans" : now <= fin ? "L’offre se termine dans" : "L’offre est terminée";
      let s = Math.max(0, Math.floor((cible - now) / 1000));
      const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
      el.innerHTML = ["jours", "heures", "min", "sec"].map((l, i) => `<div><b>${String(v[i]).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
      setTimeout(maj, 1000);
    })();
  });
  $$("[data-petales]").forEach(z => { if (matchMedia("(prefers-reduced-motion:reduce)").matches) return; for (let i = 0; i < 14; i++) { const s = document.createElement("i"); s.className = "petale"; s.style.left = Math.random() * 110 + "%"; s.style.animationDuration = 6 + Math.random() * 8 + "s"; s.style.animationDelay = -Math.random() * 10 + "s"; z.append(s); } });

  /* ---------- Quiz « Quelle SOLAÏ est faite pour vous ? » ---------- */
  const quiz = $("[data-quiz]");
  if (quiz) {
    const Q = [
      ["Votre pause idéale, c’est…", [["Un classique qui ne déçoit jamais", { orange: 2, pomme: 2 }], ["Une saveur que je ne connais pas encore", { japon: 2, bresil: 2, madagascar: 1 }], ["Quelque chose de gourmand", { madagascar: 2, japon: 1 }]]],
      ["Côté fruits, vous êtes plutôt…", [["Agrumes", { orange: 3 }], ["Fruits du verger", { pomme: 3 }], ["Fruits rouges et fleurs", { japon: 3 }], ["Fruits exotiques", { bresil: 2, madagascar: 2 }]]],
      ["Si vous partiez demain ?", [["Sous les cerisiers en fleurs", { japon: 3 }], ["Sur une plage, palmiers en vue", { bresil: 3 }], ["Au pied des baobabs", { madagascar: 3 }], ["Je reste ici, au soleil", { orange: 2, pomme: 2 }]]]
    ];
    let i = 0, score = {};
    (function etape() {
      if (i >= Q.length) {
        const id = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0], p = P(id);
        quiz.innerHTML = `<div class="resultat"><div class="pastille" style="background:${p.teinte}"><img src="assets/img/${id}-face.jpg" alt="SOLAÏ ${p.gamme} ${p.nom}"></div>
          <div><span class="surtitre" style="color:var(--soleil)">Votre SOLAÏ</span><h3 style="font-size:2.2rem">${p.gamme} ${p.nom}</h3><p>${p.court}</p>
          <div class="ligne"><a class="btn" href="produit.html?id=${id}">Voir la fiche</a><button class="btn clair" data-ajout="${id}">Ajouter au panier · ${euro(p.prix)}</button><button class="btn clair" data-rejouer>Rejouer</button></div></div></div>`;
        $("[data-rejouer]", quiz).onclick = () => { i = 0; score = {}; etape(); };
        return;
      }
      quiz.innerHTML = `<div class="progres"><i style="width:${i / Q.length * 100}%"></i></div><h3>${i + 1}/${Q.length} — ${Q[i][0]}</h3><div class="reponses">${Q[i][1].map((r, k) => `<button data-r="${k}">${r[0]}</button>`).join("")}</div>`;
      $$("[data-r]", quiz).forEach(b => b.onclick = () => { for (const [k, v] of Object.entries(Q[i][1][b.dataset.r][1])) score[k] = (score[k] || 0) + v; i++; etape(); });
    })();
  }

  /* ---------- Apparition au défilement ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveler").forEach(e => io.observe(e));

  rendre();
})();
