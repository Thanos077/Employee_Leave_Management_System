// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword
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

// Get form
const signupForm = document.getElementById("signupForm");

// Form submit event
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = Number( document.getElementById("age").value.trim());
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const token = await userCredential.user.getIdToken();
        // Save user in FastAPI
        const response = await fetch("https://employee-leave-management-system-2fr0.onrender.com/employee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                age:age,
                email: email,
                password: password,
                role: "Employee"
            })
        });

        const data = await response.json();
        console.log(data);

        showToast("Account created successfully!");
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

       