"use strict";

// Afficher automatiquement l'année actuelle.
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Menu de navigation pour les téléphones.
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Fermer le menu après avoir sélectionné une rubrique.
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      menuToggle.textContent = "☰";
    });
  });
}

// Recherche d'articles dans la liste des tarifs.
const priceSearch = document.getElementById("priceSearch");
const priceItems = Array.from(
  document.querySelectorAll(".price-item")
);
const priceCategories = Array.from(
  document.querySelectorAll(".price-category")
);
const emptyMessage = document.getElementById("emptyMessage");

// Retirer les accents pour faciliter la recherche.
// Exemple : "echarpe" peut trouver "écharpe".
function normalizeText(text) {
  return text
    .toLocaleLowerCase("fr-CH")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

if (priceSearch) {
  priceSearch.addEventListener("input", () => {
    const query = normalizeText(priceSearch.value.trim());
    let visibleCount = 0;

    priceItems.forEach((item) => {
      const searchableText = normalizeText(
        item.textContent + " " + (item.dataset.search || "")
      );

      const matches = searchableText.includes(query);

      item.hidden = !matches;

      if (matches) {
        visibleCount++;
      }
    });

    // Masquer les catégories qui ne contiennent aucun résultat.
    priceCategories.forEach((category) => {
      let next = category.nextElementSibling;
      let hasVisibleItem = false;

      while (next && !next.classList.contains("price-category")) {
        if (
          next.classList.contains("price-list") &&
          next.querySelector(".price-item:not([hidden])")
        ) {
          hasVisibleItem = true;
        }

        next = next.nextElementSibling;
      }

      category.hidden = query !== "" && !hasVisibleItem;
    });

    // Message si aucun article ne correspond.
    if (emptyMessage) {
      emptyMessage.hidden = visibleCount !== 0;
    }
  });
}