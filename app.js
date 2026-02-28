// ===============================
// API CONSUMPTION
// ===============================
// API consumption
// Asynchronous request handling
// External data source
// ===============================

const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=c";

// ===============================
// APPLICATION STATE (Source of Truth)
// ===============================
// State management
// Runtime state
// Source of truth
// ===============================



// Runtime cart state (in-memory)
let cart = [];

// Runtime meal data (enriched API data)
let mealsData = [];

document.addEventListener("DOMContentLoaded", () => {

  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  fetchMeals();
  updateCartDisplay();
});

async function fetchMeals() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

  // ===============================
  // DATA TRANSFORMATION
  // Enriching external data
  // Creating internal application model
  // ===============================

    mealsData = data.meals.map(meal => {
  return {
    ...meal,
    price: (Math.random() * 20 + 5).toFixed(2)
  };
});

displayMeals(mealsData);
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
}

function displayMeals(meals) {
  const container = document.getElementById("meals-container");
  container.innerHTML = "";

  meals.forEach(meal => {

    const mealCard = `
      <div class="bg-white rounded shadow-md overflow-hidden">
        <img src="${meal.strMealThumb}" 
             alt="${meal.strMeal}" 
             class="w-full h-48 object-cover">

        <div class="p-4">
          <h3 class="text-xl font-semibold mb-2">
            ${meal.strMeal}
          </h3>

          <p class="text-gray-600 mb-1">
            Category: ${meal.strCategory}
          </p>

          <p class="font-bold text-lg mb-3">
            $${meal.price}
          </p>

          <button 
            onclick="addToCart('${meal.idMeal}')"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    container.innerHTML += mealCard;
  });
}

function addToCart(mealId) {

  const selectedMeal = mealsData.find(meal => meal.idMeal === mealId);

  const existingItem = cart.find(item => item.id === mealId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: mealId,
      name: selectedMeal.strMeal,
      price: parseFloat(selectedMeal.price),
      quantity: 1
    });
  }

  updateCartDisplay();
}

function updateCartDisplay() {

  const cartCount = document.getElementById("cart-count");
  const cartSection = document.getElementById("cart-section");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ).toFixed(2);

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalCost;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartSection.classList.add("hidden");
    return;
  }

  cartSection.classList.remove("hidden");

  cart.forEach(item => {

    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";

    div.innerHTML = `
      <span>
        ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
      </span>
      <button onclick="removeFromCart('${item.id}')"
              class="text-red-500 hover:underline">
        Remove
      </button>
    `;

    cartItemsContainer.appendChild(div);
  });

  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(mealId) {
  cart = cart.filter(item => item.id !== mealId);
  updateCartDisplay();
}

function checkout() {
  alert("Order placed successfully!");
  cart = [];
  updateCartDisplay();
}