document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector("#filter-overlay");
  const dialog = overlay?.querySelector(".filter-dialog");
  const grid = document.querySelector("#product-grid");
  const cards = Array.from(document.querySelectorAll(".catalog-card"));
  const filterInputs = Array.from(document.querySelectorAll("[data-filter], [data-price-min]"));
  const resultCount = document.querySelector("#result-count");
  const filterCount = document.querySelector("#filter-count");
  const activeFilters = document.querySelector("#active-filters");
  const activeFilterList = document.querySelector("#active-filter-list");
  const emptyProducts = document.querySelector("#empty-products");
  const sortProducts = document.querySelector("#sort-products");
  const catalogSearchInput = document.querySelector('form.search input[type="search"]');

  const normalizeText = (value) => value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const brandAliases = new Map([
    ["acer", "acer"],
    ["asus", "asus"],
    ["rog", "asus"],
    ["asus rog", "asus"],
    ["msi", "msi"],
    ["lenovo", "lenovo"],
    ["gigabyte", "gigabyte"],
    ["aorus", "gigabyte"],
    ["gigabyte aorus", "gigabyte"]
  ]);

  const getBrandFromKeyword = (keyword) => {
    const normalized = normalizeText(keyword);
    const simplified = normalized
      .replace(/^(laptop gaming|laptop|may tinh)\s+/, "")
      .replace(/^hang\s+/, "")
      .trim();

    return brandAliases.get(normalized) || brandAliases.get(simplified) || "";
  };

  const initialParams = new URLSearchParams(window.location.search);
  const initialQuery = (initialParams.get("q") || "").trim();
  const brandFromOldQuery = getBrandFromKeyword(initialQuery);
  let brandSearch = (initialParams.get("brand") || brandFromOldQuery).toLowerCase();
  let searchKeyword = brandSearch ? "" : initialQuery;

  if (!overlay || !dialog || !grid) return;

  const initialBrandInput = filterInputs.find((input) =>
    input.dataset.filter === "brand" && input.value === brandSearch
  );

  if (initialBrandInput) initialBrandInput.checked = true;
  else brandSearch = "";

  if (catalogSearchInput) catalogSearchInput.value = brandSearch || searchKeyword;

  const updateSearchUrl = () => {
    const url = new URL(window.location.href);
    if (searchKeyword) url.searchParams.set("q", searchKeyword);
    else url.searchParams.delete("q");
    if (brandSearch) url.searchParams.set("brand", brandSearch);
    else url.searchParams.delete("brand");
    window.history.replaceState(null, "", url);
  };

  cards.forEach((card, index) => {
    card.dataset.order = String(index);
  });

  const openFilter = (sectionName) => {
    overlay.hidden = false;
    overlay.classList.add("is-open");
    document.body.classList.add("filter-open");

    window.setTimeout(() => {
      if (sectionName) {
        const section = dialog.querySelector(`[data-filter-section="${sectionName}"]`);
        section?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      document.querySelector("#close-filter")?.focus();
    }, 50);
  };

  const closeFilter = () => {
    overlay.classList.remove("is-open");
    overlay.hidden = true;
    document.body.classList.remove("filter-open");
  };

  const selectedByGroup = () => {
    const groups = new Map();

    document.querySelectorAll("[data-filter]:checked").forEach((input) => {
      const group = input.dataset.filter;
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(input.value);
    });

    return groups;
  };

  const selectedPrice = () => document.querySelector("[data-price-min]:checked");

  const cardMatchesFilters = (card) => {
    const groups = selectedByGroup();
    const matchesGroups = Array.from(groups.entries()).every(([group, values]) =>
      values.includes(card.dataset[group])
    );

    const priceInput = selectedPrice();
    if (!priceInput) return matchesGroups;

    const price = Number(card.dataset.price);
    const min = Number(priceInput.dataset.priceMin);
    const max = Number(priceInput.dataset.priceMax);
    return matchesGroups && price >= min && price < max;
  };

  const getSelectedInputs = () => filterInputs.filter((input) => input.checked);

  const cardMatchesSearch = (card) => {
    const terms = normalizeText(searchKeyword).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return true;
    const content = normalizeText(`${card.dataset.name || ""} ${card.textContent}`);
    return terms.every((term) => content.includes(term));
  };

  const renderActiveFilters = () => {
    const selected = getSelectedInputs();
    activeFilterList.replaceChildren();

    selected.forEach((input) => {
      const label = input.closest("label")?.querySelector("span")?.textContent?.trim() || input.value;
      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = "active-filter-badge";
      badge.innerHTML = `${label} <i class="bi bi-x" aria-hidden="true"></i>`;
      badge.setAttribute("aria-label", `Bỏ lọc ${label}`);
      badge.addEventListener("click", () => {
        input.checked = false;
        if (input.dataset.filter === "brand" && input.value === brandSearch) {
          brandSearch = "";
          if (catalogSearchInput) catalogSearchInput.value = "";
          updateSearchUrl();
        }
        applyFilters();
      });
      activeFilterList.appendChild(badge);
    });

    if (searchKeyword) {
      const searchBadge = document.createElement("button");
      searchBadge.type = "button";
      searchBadge.className = "active-filter-badge";
      searchBadge.textContent = `Từ khóa: ${searchKeyword} `;
      const removeIcon = document.createElement("i");
      removeIcon.className = "bi bi-x";
      removeIcon.setAttribute("aria-hidden", "true");
      searchBadge.appendChild(removeIcon);
      searchBadge.setAttribute("aria-label", `Xóa từ khóa ${searchKeyword}`);
      searchBadge.addEventListener("click", () => {
        searchKeyword = "";
        if (catalogSearchInput) catalogSearchInput.value = "";
        updateSearchUrl();
        applyFilters();
      });
      activeFilterList.prepend(searchBadge);
    }

    const activeCount = selected.length + (searchKeyword ? 1 : 0);
    activeFilters.hidden = activeCount === 0;
    filterCount.hidden = activeCount === 0;
    filterCount.textContent = String(activeCount);
  };

  const sortCards = () => {
    const sortValue = sortProducts?.value || "featured";
    const sortedCards = [...cards].sort((a, b) => {
      if (sortValue === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sortValue === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sortValue === "name-asc") {
        return a.dataset.name.localeCompare(b.dataset.name, "vi", { sensitivity: "base" });
      }
      return Number(a.dataset.order) - Number(b.dataset.order);
    });

    sortedCards.forEach((card) => grid.appendChild(card));
  };

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const visible = cardMatchesFilters(card) && cardMatchesSearch(card);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    resultCount.textContent = String(visibleCount);
    emptyProducts.hidden = visibleCount !== 0;
    grid.hidden = visibleCount === 0;
    renderActiveFilters();
    sortCards();
  };

  const clearFilters = (includeSearch = false) => {
    filterInputs.forEach((input) => {
      input.checked = false;
    });

    brandSearch = "";

    if (includeSearch) {
      searchKeyword = "";
      if (catalogSearchInput) catalogSearchInput.value = "";
    }

    updateSearchUrl();
    applyFilters();
  };

  document.querySelectorAll("[data-open-filter]").forEach((button) => {
    button.addEventListener("click", () => openFilter(button.dataset.focusFilter));
  });

  document.querySelector("#close-filter")?.addEventListener("click", closeFilter);
  document.querySelector("#apply-filter")?.addEventListener("click", () => {
    applyFilters();
    closeFilter();
  });
  document.querySelector("#clear-filter")?.addEventListener("click", () => clearFilters(false));
  document.querySelector("#clear-active-filters")?.addEventListener("click", () => clearFilters(true));
  document.querySelector("#empty-clear-filter")?.addEventListener("click", () => clearFilters(true));
  sortProducts?.addEventListener("change", sortCards);

  window.addEventListener("catalog:search", (event) => {
    const requestedBrand = String(event.detail?.brand || "").toLowerCase();

    if (brandSearch) {
      const previousBrandInput = filterInputs.find((input) =>
        input.dataset.filter === "brand" && input.value === brandSearch
      );
      if (previousBrandInput) previousBrandInput.checked = false;
    }

    brandSearch = requestedBrand;
    searchKeyword = requestedBrand ? "" : String(event.detail?.keyword || "").trim();

    filterInputs
      .filter((input) => input.dataset.filter === "brand")
      .forEach((input) => {
        input.checked = Boolean(requestedBrand) && input.value === requestedBrand;
      });

    if (catalogSearchInput) {
      catalogSearchInput.value = String(event.detail?.displayValue || requestedBrand || searchKeyword);
    }

    updateSearchUrl();
    applyFilters();
    document.querySelector(".catalog-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeFilter();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closeFilter();
  });

  updateSearchUrl();
  applyFilters();
});
