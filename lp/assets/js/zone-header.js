/**
 * Header dynamique par zone (arrondissement / quartier de Paris).
 *
 * Comment ça marche :
 * 1. Chaque groupe d'annonces Google Ads ajoute un "Suffixe d'URL finale"
 *    du type  zone=paris-11  ou  zone=marais
 * 2. Ce script lit ce paramètre dans l'URL de la page.
 * 3. Si la clé existe dans ZONES ci-dessous, il remplace le texte des
 *    éléments marqués data-zone-template="... {ZONE} ..." par le champ
 *    demandé (data-zone-field, "label" par défaut).
 * 4. Sinon (visite directe, SEO, lien partagé, zone inconnue), le texte
 *    par défaut déjà présent dans le HTML reste affiché tel quel.
 *
 * Pour ajouter une nouvelle zone, ajoute une ligne ci-dessous avec deux
 * versions du nom, car le français a besoin d'accorder la préposition :
 *   - label : le nom seul                 -> "Paris 11ᵉ", "le Marais"
 *   - intro : précédé de sa préposition   -> "à Paris 11ᵉ", "au Marais"
 * Le slug (à gauche, ex. "paris-11") ne doit contenir ni espace ni accent
 * : c'est lui qui sera utilisé tel quel dans l'URL Google Ads.
 */
window.SNAPDESK_ZONES = {
  "paris-11": { label: "Paris 11ᵉ", intro: "à Paris 11ᵉ" },
  "paris-2": { label: "Paris 2ᵉ", intro: "à Paris 2ᵉ" },
  "opera": { label: "Paris Opéra", intro: "à Paris Opéra" },
  "marais": { label: "le Marais", intro: "au Marais" },
  "bastille": { label: "Bastille", intro: "à Bastille" }
};

(function () {
  var zones = window.SNAPDESK_ZONES || {};
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("zone");
  var zone = slug && zones[slug];

  if (!zone) return;

  document.querySelectorAll("[data-zone-template]").forEach(function (el) {
    var field = el.getAttribute("data-zone-field") || "label";
    var value = zone[field];
    if (!value) return;
    var template = el.getAttribute("data-zone-template");
    el.textContent = template.replace("{ZONE}", value);
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "zone_detected",
    zoneSlug: slug,
    zoneLabel: zone.label
  });
})();
