/*
  BTI — Between The Irons
  Vanilla JS, no dependencies. Three small features:
    1. Mobile menu toggle   (fixes: nav had no way to open on phones below 950px)
    2. Scroll-reveal fade-ins (sections/cards fade + slide up as you scroll to them)
    3. Active nav-link highlighting (highlights "Services" etc. as you scroll past that section)
*/

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initScrollReveal();
  initActiveNavLinks();
});

/* ------------------------------------------------------------------ */
/* 1. Mobile menu toggle                                               */
/* ------------------------------------------------------------------ */
function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu whenever a nav link is clicked (so it doesn't stay open
  // after jumping to a section).
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on escape key, for keyboard users.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // If the window is resized back to desktop width while the menu is open,
  // reset it so it doesn't get stuck open when they shrink it again later.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 950) closeMenu();
  });
}

/* ------------------------------------------------------------------ */
/* 2. Scroll-reveal fade-ins                                           */
/* ------------------------------------------------------------------ */
function initScrollReveal() {
  // Elements we want to fade/slide in as the user scrolls to them.
  // Add or remove selectors here to control what animates.
  var targets = document.querySelectorAll(
    ".section-title, .card, .tile, .service-item, .step, .price-card, .visual-main, .visual-side"
  );

  if (!targets.length) return;

  // If the browser doesn't support IntersectionObserver, just show
  // everything immediately instead of leaving it invisible.
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  targets.forEach(function (el) {
    el.classList.add("reveal");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* ------------------------------------------------------------------ */
/* 3. Active nav-link highlighting                                     */
/* ------------------------------------------------------------------ */
function initActiveNavLinks() {
  var navLinks = document.querySelectorAll('#primary-nav a[href^="#"]');
  if (!navLinks.length) return;

  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ link: link, section: section });
  });

  if (!sections.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) {
          return s.section === entry.target;
        });
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) {
            l.classList.remove("active");
          });
          match.link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(function (s) {
    observer.observe(s.section);
  });
}
const urlParams = new URLSearchParams(window.location.search);
const rawData = urlParams.get('data');
const cartSummary = document.getElementById('cart-summary');
const errorBox = document.getElementById('error-box');

if (!rawData) {
  errorBox.innerText = "Your cart is empty. Please return to the store and add items.";
  errorBox.style.display = "block";
} else {
  try {
    // 2. Unpack the encoded string back into a functional list arrays
    const cart = JSON.parse(decodeURIComponent(rawData));
    let totalPrice = 0;

    // 3. Loop through your list and render each distinct item
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      totalPrice += itemTotal;

      cartSummary.innerHTML += `
                    <div class="cart-item">
                        <div>
                            <span class="item-name">${item.name}</span>
                            <span class="item-qty">x${item.qty}</span>
                        </div>
                        <span class="item-price">$${itemTotal.toFixed(2)}</span>
                    </div>
                `;
    });

    // Display overall total sum
    document.getElementById('cart-total').innerText = `$${totalPrice.toFixed(2)}`;

    // 4. Fire up the itemized PayPal layout buttons
    initPayPalButton(cart, totalPrice);

  } catch (e) {
    errorBox.innerText = "Error loading cart checkout data.";
    errorBox.style.display = "block";
  }
}

// 5. Initialize PayPal Checkout Engine
function initPayPalButton(cart, totalPrice) {
  paypal.Buttons({
    createOrder: function (data, actions) {
      // Dynamically map list items to PayPal's strict structural layout requirement
      const paypalItems = cart.map(item => ({
        name: item.name,
        unit_amount: { currency_code: "USD", value: item.price.toFixed(2) },
        quantity: item.qty.toString()
      }));

      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: totalPrice.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: totalPrice.toFixed(2) }
            }
          },
          items: paypalItems // Passes structural layout receipt to customer invoice
        }]
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        // Extract customer validated payment credentials
        const buyerEmail = details.payer.email_address;
        const txId = details.id;

        // Instantly forward to static Cloudflare upload portal page with verification tokens
        window.location.href = `Checkout.html?data=${encodedCart}`;
      });
    },
    onError: function (err) {
      console.error(err);
      errorBox.innerText = "An error occurred with PayPal checkout. Please try again.";
      errorBox.style.display = "block";
    }
  }).render('#paypal-button-container');
}


// Listen for clicks anywhere on the page
document.addEventListener('click', function (event) {
  // Check if the clicked item is one of our buy buttons
  if (event.target.classList.contains('price-action')) {

    // 1. Pull the product information directly from the button attributes
    const productName = event.target.getAttribute('data-name');
    const productPrice = parseFloat(event.target.getAttribute('data-price'));

    // 2. Format the item into a structured cart array (single item for "Buy Now")
    const cart = [
      {
        name: productName,
        price: productPrice,
        qty: 1
      }
    ];

    // 3. Compress the cart data into a URL-friendly text string
    const encodedCart = encodeURIComponent(JSON.stringify(cart));

    // 4. Send the user straight to your new checkout page with their item
    window.location.href = `Checkout.html?data=${encodedCart}`;
  }
});

document.addEventListener('click', function (event) {
  // Debug 1: See what element was actually clicked
  console.log("You clicked on:", event.target);

  if (event.target.classList.contains('price-action')) {
    alert("Success! JavaScript detected a click on the .price-action button!");

    const productName = event.target.getAttribute('data-name');
    const productPrice = parseFloat(event.target.getAttribute('data-price'));

    alert("Found Product: " + productName + " costing $" + productPrice);

    const cart = [{ name: productName, price: productPrice, qty: 1 }];

    // Save it
    localStorage.setItem('pending_cart', JSON.stringify(cart));
    alert("Saved to memory! Attempting to redirect to Checkout.html now...");

    // Redirect
    window.location.href = 'Checkout.html';
  }
});

// Wait until the full HTML structure is loaded into the browser
document.addEventListener('DOMContentLoaded', function () {
    
    // Select all checkout buttons with the class 'price-action'
    const checkoutButtons = document.querySelectorAll('.price-action');

    // Loop through each button found and attach the click detector
    checkoutButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent any default link behavior if nested
            event.preventDefault();

            // 1. Read product variables from data attributes
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));

            // 2. Build our structured array cart
            const cart = [
                {
                    name: productName,
                    price: productPrice,
                    qty: 1
                }
            ];

            // 3. Save it to local browser memory
            localStorage.setItem('pending_cart', JSON.stringify(cart));

            // 4. Redirect cleanly to your checkout page
            // (Verify if your file is named Checkout.html or checkout.html)
            window.location.href = 'Checkout.html';
        });
    });

});
