// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


function showToast(message) {
    const toastElement = document.getElementById("successToast");
    document.getElementById("toastMessage").textContent = message;

    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJrhLqtCl3q83FT247xmfqCyTCJIDfdbY",
    authDomain: "login-26c4b.firebaseapp.com",
    projectId: "login-26c4b",
    storageBucket: "login-26c4b.firebasestorage.app",
    messagingSenderId: "1091186312019",
    appId: "1:1091186312019:web:036356885beb74223e17a6",
    measurementId: "G-9X88RMT4VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Get Login Form
const loginForm = document.getElementById("loginForm");

// Login Event
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        // Login user with Firebase
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Get Firebase token
        const token = await userCredential.user.getIdToken();

        // Store token
        localStorage.setItem("token", token);


        const response = await fetch(
            "https://employee-leave-management-system-2fr0.onrender.com/employee/me",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );
        

if (!response.ok) {
    throw new Error("Unable to get user role.");
}

const result = await response.json();

console.log(result);

const role = result.details.role;

console.log("Role:", role);

// Show success message
showToast("Login successful!");

// Wait before redirecting
setTimeout(() => {

    if (role === "Employee") {
        window.location.href = "../Emp/emp.html";
    } else {
        window.location.href = "../Admin/admin.html";
    }

}, 1500);

    } catch (error) {
    console.error("Login Error:", error);

    showToast(error.message);
}
});
// Show / Hide Password
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const icon = togglePassword.querySelector("i");

togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.replace("bi-eye", "bi-eye-slash");
    } else {
        passwordInput.type = "password";
        icon.classList.replace("bi-eye-slash", "bi-eye");
    }
});


