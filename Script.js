// Importing necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyAoA6XX1Mrxg9RPvF1Fl9QQyYgyZo_Kzg4",
    authDomain: "fir-seminar-f2b68.firebaseapp.com",
    databaseURL: "https://fir-seminar-f2b68-default-rtdb.firebaseio.com",
    projectId: "fir-seminar-f2b68",
    storageBucket: "fir-seminar-f2b68.firebasestorage.app",
    messagingSenderId: "506611064392",
    appId: "1:506611064392:web:0721db79fb6ab12813427d"
};

// Initialize Firebase app and database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Event listeners for toggling sections
document.getElementById("btnCreate").addEventListener("click", () => toggleSection("create"));
document.getElementById("btnRead").addEventListener("click", () => toggleSection("read"));
document.getElementById("btnUpdate").addEventListener("click", () => toggleSection("update"));
document.getElementById("btnDelete").addEventListener("click", () => toggleSection("delete"));

// Event listeners for CRUD operations
document.getElementById("createDataBtn").addEventListener("click", createData);
document.getElementById("readDataBtn").addEventListener("click", readData);
document.getElementById("updateDataBtn").addEventListener("click", updateData);
document.getElementById("deleteDataBtn").addEventListener("click", deleteData);

// Function to toggle visibility of sections based on selected action
function toggleSection(sectionId) {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.style.display = section.id === sectionId ? "flex" : "none";
    });
}

// Function to create new data in the database
function createData() {
    const productId = document.getElementById("createId").value.trim(); // Get product ID from input
    const brand = document.getElementById("createBrand").value.trim();
    const category = document.getElementById("createCategory").value.trim();
    const name = document.getElementById("createName").value.trim();
    const price = document.getElementById("createPrice").value.trim();
    const rating = document.getElementById("createRating").value.trim();
    const reviews = document.getElementById("createReviews").value.trim();
    const stock = document.getElementById("createStock").value.trim();

    // Validate that no field is empty
    if (!productId || !brand || !category || !name || !price || !rating || !reviews || !stock) {
        showAlert("All fields are required!", "error");
        return;
    }

    // Parse numeric values
    const parsedPrice = parseFloat(price);
    const parsedRating = parseFloat(rating);
    const parsedReviews = parseInt(reviews, 10);
    const parsedStock = parseInt(stock, 10);

    // Validate numeric fields
    if (isNaN(parsedPrice) || isNaN(parsedRating) || isNaN(parsedReviews) || isNaN(parsedStock)) {
        showAlert("Price, rating, reviews, and stock must be valid numbers!", "error");
        return;
    }

    // Create data object
    const data = {
        brand: brand,
        category: category,
        name: name,
        price: parsedPrice,
        rating: parsedRating,
        reviews: parsedReviews,
        stock: parsedStock
    };

    // Set data in the database
    set(ref(database, `products/${productId}`), data)
        .then(() => showAlert("Data created successfully!", "success"))
        .catch((error) => showAlert("Error creating data: " + error, "error"));
}

// Function to read data from the database
function readData() {
    const productId = document.getElementById("readId").value; // Get product ID from input
    get(child(ref(database), `products/${productId}`)) // Fetch data for the given product ID
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const resultDiv = document.getElementById("readResult");
                // Display fetched data in a readable format
                resultDiv.innerHTML = `
                    <h3>Product ID: ${productId}</h3>
                    <p><strong>Brand:</strong> ${data.brand}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Price:</strong> $${data.price}</p>
                    <p><strong>Rating:</strong> ${data.rating} ★</p>
                    <p><strong>Reviews:</strong> ${data.reviews}</p>
                    <p><strong>Stock:</strong> ${data.stock}</p>
                `;
            } else {
                showAlert("No data found!"); // Show alert if no data exists
            }
        })
        .catch((error) => showAlert("Error: " + error));
}

// Function to update data in the database
function updateData() {
    const productId = document.getElementById("updateId").value.trim(); // Get product ID
    const field = document.getElementById("updateField").value.trim(); // Field to update
    const value = document.getElementById("updateValue").value.trim(); // New value

    if (!productId || !field || !value) {
        showAlert("All fields are required for updating data!"); // Validation for empty fields
        return;
    }

    // Check if the product exists before updating
    get(child(ref(database), `products/${productId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const updates = { [field]: isNaN(value) ? value : parseFloat(value) }; // Update field
                update(ref(database, `products/${productId}`), updates)
                    .then(() => showAlert("Data updated successfully!"))
                    .catch((error) => showAlert("Error: " + error));
            } else {
                showAlert(`No product found with ID "${productId}" to update.`, "error");
            }
        })
        .catch((error) => showAlert("Error: " + error));
}

// Function to delete data from the database
function deleteData() {
    const productId = document.getElementById("deleteId").value.trim(); // Get product ID

    if (!productId) {
        showAlert("Product ID is required to delete data!"); // Validation for empty ID
        return;
    }

    // Check if the product exists before deleting
    get(child(ref(database), `products/${productId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                remove(ref(database, `products/${productId}`)) // Delete data
                    .then(() => showAlert("Data deleted successfully!"))
                    .catch((error) => showAlert("Error: " + error));
            } else {
                showAlert(`No product found with ID "${productId}" to delete.`);
            }
        })
        .catch((error) => showAlert("Error: " + error));
}

// Function to show custom alerts
function showAlert(message, type = "error") {
    const alertBox = document.getElementById("alert-box");
    const alertMessage = document.getElementById("alert-message");

    // Set the message and style based on the type
    alertMessage.textContent = message;
    alertBox.style.backgroundColor = type === "success" ? "#28a745" : "#ff4444";

    // Show the alert box
    alertBox.classList.remove("hidden");

    // Auto-hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.add("hidden");
    }, 3000);
}

document.getElementById("read").addEventListener("mouseleave", function() {
    document.getElementById("readResult").innerHTML ="" // Clear card data when moving out of the 'read' section
});
