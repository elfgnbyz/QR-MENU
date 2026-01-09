// SAYFA YÖNLENDİRME
// =====================
function goCategory(category) {
    window.location.href = `category.html?cat=${category}`;
}

function goHome() {
    window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", () => {



    function createSearchItem(item, cat, categoryTitle) {
    return `
        <div class="search-item" onclick="goCategory('${cat}')">
            <span class="item-name">${item.name}</span>
            <small class="item-cat">${categoryTitle}</small>
        </div>
    `;
}
   // ARAMA (INDEX + CATEGORY)
    // =====================
    const searchBtn = document.querySelector(".search-btn");
    const searchOverlay = document.getElementById("searchOverlay");
    const searchInput = document.getElementById("searchInput");
    const closeBtn = document.querySelector(".close-search");
    const searchResults = document.getElementById("searchResults");

    if (searchBtn && searchOverlay && searchInput && closeBtn) {

        searchBtn.addEventListener("click", () => {
            searchOverlay.style.display = "block";
            searchInput.focus();
        });

        closeBtn.addEventListener("click", () => {
            searchOverlay.style.display = "none";
            searchInput.value = "";
            searchResults.innerHTML = "";
        });

        searchInput.addEventListener("input", e => {
            const text = e.target.value.toLowerCase();
            if (!text) {
                searchResults.innerHTML = "";
                return;
            }
            searchAllProducts(text);
        });
    }

    function searchAllProducts(keyword) {
    if (!searchResults || typeof menuData === "undefined") return;

    searchResults.innerHTML = "";
    let found = false;

    Object.keys(menuData).forEach(cat => {
        const category = menuData[cat];

        // 🔹 NORMAL ITEMS
        if (category.items) {
            category.items.forEach(item => {
                if (item.name.toLowerCase().includes(keyword)) {
                    found = true;
                    searchResults.innerHTML += createSearchItem(item, cat, category.title);
                }
            });
        }

        // 🔹 GROUPS İÇİN
        if (category.groups) {
            category.groups.forEach(group => {
                group.items.forEach(item => {
                    if (item.name.toLowerCase().includes(keyword)) {
                        found = true;
                        searchResults.innerHTML += createSearchItem(item, cat, category.title);
                    }
                });
            });
        }
    });

    if (!found) {
        searchResults.innerHTML = `
            <p class="no-result">Ürün bulunamadı</p>
        `;
    }
}

    // =====================
    // CATEGORY SAYFASI
    // =====================
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");

    const titleEl = document.getElementById("categoryTitle");
    const imageEl = document.getElementById("categoryImage");
    const listEl  = document.getElementById("productList");

    if (!cat || !menuData[cat]) return;

    const category = menuData[cat];

    // 🔹 Başlık
    titleEl.innerText = category.title;

    // 🔹 Header Görseli
    if (imageEl && category.image) {
        imageEl.src = category.image;
    }

    // =====================
    // 🔥 GRUPLU KATEGORİ (FROZEN vb.)
    // =====================
    if (category.groups) {

        category.groups.forEach(group => {

            // Grup Başlığı
            listEl.innerHTML += `
                <h3 class="group-title">${group.title}</h3>
            `;

            group.items.forEach(item => {
                listEl.innerHTML += `
                    <div class="product line">
                        <span class="product-name">${item.name}</span>
                        <span class="dots"></span>
                        <span class="product-price">${item.price}₺</span>
                    </div>
                `;
            });
        });

    }

    // =====================
    // 🔹 NORMAL KATEGORİLER
    // =====================
    else if (category.items) {

        category.items.forEach(item => {

            // RESİMLİ ÜRÜN
            if (item.image) {
                listEl.innerHTML += `
                    <div class="product card">
                        <img src="${item.image}">
                        <div class="product-info">
                            <h4>${item.name}</h4>
                        </div>
                        <div class="product-price">${item.price}₺</div>
                    </div>
                `;
            }

            // RESİMSİZ ÜRÜN
            else {
                listEl.innerHTML += `
                    <div class="product line">
                        <span class="product-name">${item.name}</span>
                        <span class="dots"></span>
                        <span class="product-price">${item.price}₺</span>
                    </div>
                `;
            }
        });
    }

});