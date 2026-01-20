const CART_KEY = "amazon_cart";

function loadCartCheckout() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartCheckout(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCountCheckout(cart) {
  const count = cart.length; // Number of different/unique items
  const el = document.getElementById("cartCount");
  if (el) el.textContent = String(count);
}

function formatCurrency(value) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function calculateTotals(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 0),
    0
  );
  const selectedDelivery = document.querySelector(
    'input[name="delivery"]:checked'
  );
  const shippingFee = selectedDelivery
    ? Number(selectedDelivery.getAttribute("data-fee")) || 0
    : 0;
  const tax = subtotal * 0.1; // simple 10% estimate
  const total = subtotal + shippingFee + tax;
  return { subtotal, shippingFee, tax, total };
}

function renderTotals(cart) {
  const { subtotal, shippingFee, tax, total } = calculateTotals(cart);
  const itemsSubtotal = document.getElementById("itemsSubtotal");
  const shippingFeeEl = document.getElementById("shippingFee");
  const taxAmount = document.getElementById("taxAmount");
  const orderTotal = document.getElementById("orderTotal");

  if (itemsSubtotal) itemsSubtotal.textContent = formatCurrency(subtotal);
  if (shippingFeeEl) shippingFeeEl.textContent = formatCurrency(shippingFee);
  if (taxAmount) taxAmount.textContent = formatCurrency(tax);
  if (orderTotal) orderTotal.textContent = formatCurrency(total);
}

function renderCartItems() {
  const container = document.getElementById("cartItemsContainer");
  if (!container) return;

  const cart = loadCartCheckout();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-container">
        <p class="empty-cart-message">Your cart is empty.</p>
        <a href="index.html" class="shop-now-button">Shop Now</a>
      </div>
    `;
    updateCartCountCheckout(cart);
    renderTotals(cart);
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.dataset.productId = item.id;
    const safeName = item.name.replace(/"/g, '&quot;');
    row.innerHTML = `
      <div class="cart-item-image-wrapper">
        <img src="${item.image}" alt="${safeName}" class="cart-item-image" 
             onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext fill=\\'%23999\\' font-family=\\'Arial\\' font-size=\\'14\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E${encodeURIComponent(safeName)}%3C/text%3E%3C/svg%3E';" />
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)} x ${
      item.quantity
    }</div>
        <div class="cart-item-controls">
          <label>
            Qty:
            <input type="number" min="1" value="${
              item.quantity
            }" class="cart-item-quantity-input" />
          </label>
          <button class="link-button delete-item-button">Delete</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  updateCartCountCheckout(cart);
  renderTotals(cart);
}

document.addEventListener("DOMContentLoaded", () => {
  let cart = loadCartCheckout();
  updateCartCountCheckout(cart);
  renderCartItems();

  const container = document.getElementById("cartItemsContainer");
  if (container) {
    container.addEventListener("click", (event) => {
      const target = event.target;
      const row = target.closest(".cart-item");
      if (!row) return;
      const productId = row.dataset.productId;
      if (target.classList.contains("delete-item-button")) {
        cart = cart.filter((item) => item.id !== productId);
        saveCartCheckout(cart);
        renderCartItems();
      }
    });

    container.addEventListener("change", (event) => {
      const target = event.target;
      if (!target.classList.contains("cart-item-quantity-input")) return;
      const row = target.closest(".cart-item");
      if (!row) return;
      const productId = row.dataset.productId;
      const newQty = Math.max(1, Number(target.value) || 1);
      target.value = String(newQty);

      const item = cart.find((x) => x.id === productId);
      if (item) {
        item.quantity = newQty;
        saveCartCheckout(cart);
        renderCartItems();
      }
    });
  }

  document
    .querySelectorAll('input[name="delivery"]')
    .forEach((radio) =>
      radio.addEventListener("change", () => {
        cart = loadCartCheckout();
        renderTotals(cart);
      })
    );

  const placeOrderButton = document.getElementById("placeOrderButton");
  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", () => {
      cart = loadCartCheckout();
      if (!cart.length) {
        alert("Your cart is empty.");
        return;
      }
      const { total } = calculateTotals(cart);
      alert(
        `Order placed successfully!\n\nTotal amount: ${formatCurrency(
          total
        )}`
      );
    });
  }
});

