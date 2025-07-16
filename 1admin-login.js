import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Simpan UID dan redirect
    localStorage.setItem("adminUID", user.uid);
    window.location.href = "admin/dashboard.html";
  } catch (error) {
    errorMessage.textContent = "Login gagal. Periksa email dan password.";
    errorMessage.classList.remove("hidden");
  }
});
