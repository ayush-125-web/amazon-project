// Shared cart utilities using localStorage so both pages can access cart

const CART_STORAGE_KEY = "amazon_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const cart = loadCart();
  const count = cart.length; // Number of different/unique items
  const el = document.getElementById("cartCount");
  if (el) {
    el.textContent = String(count);
  }
}

function addToCart(productId, quantity) {
  const qty = Number(quantity) || 1;
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
  }
  saveCart(cart);
  updateCartCount();
}

// Render products on the home page
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  PRODUCTS.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image" 
             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'400\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'400\\' height=\\'400\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'Arial\\' font-size=\\'18\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E';" />
      </div>
      <div>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
        <p class="product-rating">${"★".repeat(
          Math.round(product.rating)
        )}<span style="color:#999;"> (${product.rating.toFixed(1)})</span></p>
        <div class="product-actions">
          <select class="quantity-select" data-product-id="${
            product.id
          }" aria-label="Quantity">
            ${Array.from({ length: 10 }, (_, i) => i + 1)
              .map((n) => `<option value="${n}">${n}</option>`)
              .join("")}
          </select>
          <button class="primary-button add-to-cart-button" data-product-id="${
            product.id
          }">
            Add to cart
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  grid.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("add-to-cart-button")) {
      const productId = target.getAttribute("data-product-id");
      const select = grid.querySelector(
        `.quantity-select[data-product-id="${productId}"]`
      );
      const qty = select ? select.value : 1;
      addToCart(productId, qty);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
});

