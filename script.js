let allData = [];
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkHlEyRjTo1uBBc_vu_26CO7RDkSn_cZU0WOMC2Q4zuf9asasT77YXrrzFeAwSuV7lCyvl6bpiEJDz/pub?output=csv";

// Fetch product details from Google Sheet CSV
Papa.parse(csvUrl, {
  download: true,
  header: true,
  complete: results => {
    allData = results.data.map(row => {
      const cleaned = {};
      for (let key in row) cleaned[key.trim()] = row[key];
      return cleaned;
    });
    renderCategories();
  }
});

function renderCategories() {
  const catDiv = document.getElementById("category-buttons");
  const categories = [...new Set(allData.map(p => p.Category))];
  catDiv.innerHTML = "";

  // Icons for categories
  const icons = {
    "hydraulic parts supply": "fa-solid fa-droplet",
    "electrical and automation parts supply": "fa-solid fa-bolt",
    "industrial parts supply": "fa-solid fa-industry",
    "marine and oil&gas supply": "fa-solid fa-ship"
  };

  categories.forEach(cat => {
    const key = cat?.toLowerCase().trim();
    const wrapper = document.createElement("div");
    wrapper.className = "cat-wrapper";

    // Category card
    const card = document.createElement("div");
    card.className = "cat-card";
    card.innerHTML = `
      <i class="${icons[key] || 'fa-solid fa-box'}"></i>
      <h3>${cat}</h3>
      <span>Click to view products</span>
    `;

    // Products container (hidden by default)
    const subContainer = document.createElement("div");
    subContainer.className = "subcategory-container";
    subContainer.style.display = "none";

    // On click → toggle product list
    card.onclick = () => {
      const isOpen = subContainer.style.display === "block";
      document.querySelectorAll(".subcategory-container").forEach(sc => sc.style.display = "none");
      if (!isOpen) {
        renderProducts(cat, subContainer);
        subContainer.style.display = "block";
      }
    };

    wrapper.appendChild(card);
    wrapper.appendChild(subContainer);
    catDiv.appendChild(wrapper);
  });
}

function renderProducts(selectedCategory, container) {
  container.innerHTML = "";

  let filtered = allData.filter(p => p.Category === selectedCategory);

  if (filtered.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>${p.Name || ""}</h4>
      <p>${p.Description || ""}</p>
      ${p.Spec ? `<p><strong>${p.Spec}</strong></p>` : ""}
    `;
    container.appendChild(card);
  });
}

// Search bar → filter products
document.getElementById("search-bar").addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const catDiv = document.getElementById("category-buttons");
  catDiv.querySelectorAll(".cat-wrapper").forEach(wrapper => {
    const title = wrapper.querySelector("h3").textContent.toLowerCase();
    wrapper.style.display = title.includes(query) ? "block" : "none";
  });
});
