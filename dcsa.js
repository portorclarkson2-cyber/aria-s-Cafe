document.addEventListener("DOMContentLoaded", () => {

  initProfileMenu();
  initReservationForm();
  loadMenuFromAdmin();
  renderCart();

});



function toggleGCash(){



  const payment =

  document.getElementById("cPayment").value;



  const gcashField =

  document.getElementById("gcashField");



  if(

    payment === "GCash" ||

    payment === "Maya"

  ){

    gcashField.style.display = "block";

  }

  else{

    gcashField.style.display = "none";

  }



}



const profileBtn = document.getElementById("profileBtn");

const profileMenu = document.getElementById("profileMenu");



profileBtn.addEventListener("click", () => {

  profileMenu.classList.toggle("show");

});



window.addEventListener("click", (e) => {

  if (!document.getElementById("profileWrapper").contains(e.target)) {

    profileMenu.classList.remove("show");

  }

});





/* ================================

PROFILE

================================ */

function initProfileMenu() {

  const wrapper = document.getElementById("profileWrapper");

  const btn = document.getElementById("profileBtn");



  if (!wrapper || !btn) return;



  btn.onclick = (e) => {

    e.stopPropagation();

    wrapper.classList.toggle("open");

  };



  document.onclick = (e) => {

    if (!wrapper.contains(e.target)) {

      wrapper.classList.remove("open");

    }

  };

}

/* ================================

   MENU TAB

================================ */

function openMenu(menuId, el) {

  document.querySelectorAll(".menu").forEach(m => m.style.display = "none");

  document.getElementById(menuId).style.display = "block";



  document.querySelectorAll(".tablink").forEach(t => t.classList.remove("active"));

  el.classList.add("active");

}



/* ================================

   MENU FROM ADMIN

================================ */

function loadMenuFromAdmin() {

  let menu = JSON.parse(localStorage.getItem("menu")) || [];



  // default items (first load only)

  if (menu.length === 0) {

    
menu = [
  {
    name: "Brown Sugar Milk Tea",
    description: "Rich and creamy milk tea with a sweet brown sugar flavor.",
    price: 129,
    img: "./b.1.jpg",
    category: "Milk Tea"
  },
  {
    name: "Classic Pearl Milk Tea",
    description: "Smooth milk tea served with chewy tapioca pearls.",
    price: 119,
    img: "./b.2.jpg",
    category: "Milk Tea"
  },
  {
    name: "Wintermelon Milk Tea",
    description: "A refreshing milk tea with a mellow wintermelon flavor.",
    price: 125,
    img: "./b.3.jpg",
    category: "Milk Tea"
  },
  {
    name: "Matcha Milk Tea",
    description: "Rich and creamy matcha milk tea.",
    price: 139,
    img: "./b.4.jpg",
    category: "Milk Tea"
  },
  {
    name: "Strawberry Refresher",
    description: "A fruity and refreshing strawberry drink.",
    price: 129,
    img: "./k1.jpg",
    category: "Refreshers"
  },
  {
    name: "Mango Refresher",
    description: "A sweet tropical mango drink.",
    price: 129,
    img: "./i.2.jpg",
    category: "Refreshers"
  },
  {
    name: "Blueberry Refresher",
    description: "A cool and fruity blueberry drink.",
    price: 129,
    img: "./i.5.jpg",
    category: "Refreshers"
  }
];

    localStorage.setItem("menu", JSON.stringify(menu));

  }



  const hot = document.getElementById("hotList");

  const iced = document.getElementById("icedList");



  hot.innerHTML = "";

  iced.innerHTML = "";



  menu.forEach(item => {

    const card = `

  <div class="menu-item">

    <img
      src="${item.img}"
      alt="${item.name}"
    >

    <h5>${item.name}</h5>

    <p class="menu-description">
      ${item.description || "A delicious choice from Aria's Cafe."}
    </p>

    <p class="menu-price">
      ₱${item.price}
    </p>

    <button
      class="order-btn"
      onclick="addToCart(
        '${item.name.replace(/'/g, "\\'")}',
        ${item.price},
        '${item.img}'
      )"
    >
      Order
    </button>

  </div>

`;



    if (item.category === "Milk Tea") hot.innerHTML += card;

    else iced.innerHTML += card;

  });

}



/* ================================

   CART

================================ */

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getUserKey(prefix) {
  const user = getCurrentUser();

  if (!user || !user.email) {
    return null;
  }

  return prefix + "_" + user.email;
}

function getUserCart() {
  const key = getUserKey("cartItems");

  if (!key) {
    return {};
  }

  return JSON.parse(localStorage.getItem(key)) || {};
}

let cartItems = getUserCart();

function saveCart() {
  const key = getUserKey("cartItems");

  if (!key) {
    alert("Please login first!");
    return;
  }

  localStorage.setItem(key, JSON.stringify(cartItems));
}



function addToCart(name, price, image) {

  if (cartItems[name]) {

    cartItems[name].quantity++;

  } else {

    cartItems[name] = { price, image, quantity: 1 };

  }



  saveCart();

  renderCart();

  showPopup(name, price);

}



function removeItem(name) {

  delete cartItems[name];

  saveCart();

  renderCart();

}



function renderCart() {

  const list = document.getElementById("cart-list");

  const totalEl = document.getElementById("cart-total");



  if (!list) return;



  list.innerHTML = "";

  let total = 0;



  for (let name in cartItems) {

    let item = cartItems[name];

    let sum = item.price * item.quantity;

    total += sum;



    list.innerHTML += `

      <li>

        <img src="${item.image}" class="cart-img">

        <div>${name} x${item.quantity} - ₱${sum}</div>

        <button onclick="removeItem('${name}')">✖</button>

      </li>

    `;

  }



  totalEl.innerText = total;

}



/* ================================

   ✅ FIXED ORDER (NO SERVER)

================================ */

function confirmOrder() {

  if (Object.keys(cartItems).length === 0) {

    alert("Cart is empty!");

    return;

  }



  let user = JSON.parse(localStorage.getItem("loggedInUser")) || {name:"Guest"};



  let order = {

    name: user.name,

    items: Object.keys(cartItems),

    total: Object.values(cartItems)

      .reduce((sum, i) => sum + i.price * i.quantity, 0),

    status: "Pending"

  };



  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push(order);



  localStorage.setItem("orders", JSON.stringify(orders));



  cartItems = {};

  saveCart();

  renderCart();



  alert("✅ Order Confirmed!");

}



/* ================================

   POPUP

================================ */

function showPopup(name, price) {

  const popup = document.getElementById("popup");

  const msg = document.getElementById("popup-message");



  if (!popup) return;



  msg.innerText = `${name} (₱${price}) added!`;

  popup.style.display = "flex";



  setTimeout(() => popup.style.display = "none", 800);

}



function initReservationForm() {



  const form = document.getElementById("reservationForm");



  if (!form) return;



  form.addEventListener("submit", (e) => {



    e.preventDefault();



    const currentUser =

    JSON.parse(localStorage.getItem("currentUser"));



    const reservation = {



      name: document.getElementById("name").value,

      phone: document.getElementById("phone").value,

      date: document.getElementById("date").value,

      time: document.getElementById("time").value,

      guests: document.getElementById("guests").value,



      userEmail: currentUser.email,

      status: "Pending"



    };



    let reservations =

    JSON.parse(localStorage.getItem("reservations")) || [];



    reservations.push(reservation);



    localStorage.setItem(

      "reservations",

      JSON.stringify(reservations)

    );



    alert("✅ Reservation saved!");



    form.reset();



  });



}





function openCheckout() {



  if (Object.keys(cartItems).length === 0) {

    alert("Cart is empty!");

    return;

  }



  const currentUser = JSON.parse(localStorage.getItem("currentUser"));



  if (currentUser) {

    document.getElementById("cName").value = currentUser.name || "";

  }



  let subtotal = 0;

  let checkoutItemsHTML = "";



  for (let itemName in cartItems) {

    let item = cartItems[itemName];



    subtotal += item.price * item.quantity;



    checkoutItemsHTML += `

      <p style="display:flex;justify-content:space-between;margin:8px 0;">

        <span>${itemName} x${item.quantity}</span>

        <strong>₱${item.price * item.quantity}</strong>

      </p>

    `;

  }



  document.getElementById("checkoutItems").innerHTML = checkoutItemsHTML;

  document.getElementById("checkoutSubtotal").innerText = subtotal;



  updateTotal();

  document.getElementById("checkoutModal").style.display = "flex";

}



function updateTotal() {

  let subtotal = 0;

  for (let itemName in cartItems) {
    let item = cartItems[itemName];
    subtotal += item.price * item.quantity;
  }

  const paymentMethod =
    document.getElementById("cPayment").value;

  // ₱30 delivery fee ONLY for GCash
  const deliveryFee =
    paymentMethod === "GCash" ? 30 : 0;

  const grandTotal =
    subtotal + deliveryFee;

  // Display subtotal
  document.getElementById("checkoutSubtotal").innerText =
    subtotal;

  // Display delivery fee
  document.getElementById("checkoutDeliveryFee").innerText =
    deliveryFee;

  // Display grand total
  document.getElementById("checkoutTotal").innerText =
    grandTotal;
}






function closeCheckout() {

  document.getElementById("checkoutModal").style.display = "none";

}



function placeOrder() {



  const currentUser = JSON.parse(localStorage.getItem("currentUser"));



  if (!currentUser) {

    alert("Please login first!");

    return;

  }



  const address = document.getElementById("cAddress").value;

  const phone = document.getElementById("cPhone").value;

  const payment = document.getElementById("cPayment").value;



  const referenceNumber =

    document.getElementById("referenceNumber")?.value || "";



  const proof = document.getElementById("paymentProof");



  if (!address.trim()) {

    alert("Please enter your address");

    return;

  }



  if (!phone.trim()) {

    alert("Please enter your phone number");

    return;

  }



  // SAFE CHECK (IMPORTANT FIX)

  if (payment === "GCash" || payment === "Maya") {



    if (!referenceNumber.trim()) {

      alert("Please enter reference number");

      return;

    }



  }



  let total = Object.values(cartItems).reduce(

    (sum, item) => sum + item.price * item.quantity,

    0

  );



  let orders = JSON.parse(localStorage.getItem("orders")) || [];



  for (let itemName in cartItems) {



    let item = cartItems[itemName];



    orders.push({
      userName: currentUser.name,
      userEmail: currentUser.email,
    
      itemName: itemName,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    
      phone,
      address,
      payment,
      referenceNumber,
    
      total,
    
      status: "Pending"
    });

  }



  localStorage.setItem("orders", JSON.stringify(orders));



  cartItems = {};

  saveCart();

  renderCart();

  closeCheckout();



  alert(
    payment === "COD"
      ? "✅ Order Placed!"
      : "✅ GCash Order Placed!"
  );
}

