// Chargement dynamique de la galerie depuis data/sculptures.json
(function () {
  const container = document.getElementById("narvilitus");
  if (!container) return; // pas sur la page galerie

  fetch("data/sculptures.json")
    .then((res) => res.json())
    .then((data) => {
      const list = data.sculptures || [];

      list.forEach((item) => {
        if (!item.titre || !item.image) return;

        const collectionId = (item.collection || "").trim().toLowerCase();
        const target = document.getElementById(collectionId);
        if (!target) return;

        const caption = `${item.titre}${item.description ? " : " + item.description : ""}${item.dimensions ? ". " + item.dimensions : ""}`;

        const figure = document.createElement("figure");
        figure.className = "figure";
        figure.innerHTML = `
          <div class="imgwrap">
            <button class="imgbtn" type="button" data-lightbox
              data-src="${item.image}"
              data-alt="${item.titre}"
              data-caption="${caption}">
              <img loading="lazy" src="${item.image}" alt="${item.titre}">
            </button>
          </div>
          <figcaption>${caption}</figcaption>
        `;
        target.appendChild(figure);
      });

      // Réactive le lightbox sur les images générées dynamiquement
      document.querySelectorAll("[data-lightbox]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const root = document.querySelector("[data-lightbox-root]");
          const img = root.querySelector("[data-lightbox-img]");
          const cap = root.querySelector("[data-lightbox-caption]");
          img.src = btn.getAttribute("data-src");
          img.alt = btn.getAttribute("data-alt") || "";
          cap.textContent = btn.getAttribute("data-caption") || "";
          root.classList.add("open");
          root.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        });
      });
    })
    .catch((err) => console.error("Erreur de chargement des sculptures :", err));
})();
