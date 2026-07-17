document.addEventListener("DOMContentLoaded", () => {
  const searchForms = document.querySelectorAll("form.search");
  const isProductList = Boolean(document.querySelector("#product-grid"));

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

  searchForms.forEach((form) => {
    const input = form.querySelector('input[type="search"]');
    if (!input) return;

    form.addEventListener("submit", (event) => {
      const keyword = input.value.trim();

      if (!keyword) {
        event.preventDefault();
        input.setCustomValidity("Vui lòng nhập từ khóa cần tìm.");
        input.reportValidity();
        input.focus();
        return;
      }

      input.setCustomValidity("");

      const brand = getBrandFromKeyword(keyword);

      if (isProductList) {
        event.preventDefault();
        const url = new URL(window.location.href);

        if (brand) {
          url.searchParams.set("brand", brand);
          url.searchParams.delete("q");
        } else {
          url.searchParams.set("q", keyword);
          url.searchParams.delete("brand");
        }

        window.history.replaceState(null, "", url);
        window.dispatchEvent(new CustomEvent("catalog:search", {
          detail: {
            keyword: brand ? "" : keyword,
            brand,
            displayValue: keyword
          }
        }));
        return;
      }

      // Ở Home: tìm đúng tên hãng sẽ chuyển sang ProductList và bật bộ lọc hãng.
      if (brand) {
        event.preventDefault();
        const targetUrl = new URL(form.action, window.location.href);
        targetUrl.searchParams.set("brand", brand);
        window.location.href = targetUrl.href;
      }
    });

    input.addEventListener("input", () => input.setCustomValidity(""));
  });
});
