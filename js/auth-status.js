// js/auth-status.js
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
  const el = document.getElementById("userGreeting");
  if (!el) return;

  if (user) {
    const email = user.email;
    try {
      const doc = await db.collection("users").doc(email).get();
      const namaLengkap = doc.exists ? doc.data().nama : email;
      const namaDepan = namaLengkap.split(" ")[0];

      el.textContent = namaDepan;
      el.classList.remove("underline");
      el.classList.add("font-semibold", "hover:opacity-90", "cursor-pointer");
      el.onclick = () => window.location.href = "akun.html";
    } catch (err) {
      console.error("Gagal mengambil nama:", err);
      el.textContent = "Pengguna";
      el.onclick = () => window.location.href = "akun.html";
    }
  } else {
    el.textContent = "Masuk";
    el.classList.remove("underline");
    el.classList.add(
      "bg-white", "text-[#4B6CC1]", "px-4", "py-2",
      "rounded-full", "text-sm", "font-semibold",
      "hover:bg-gray-100", "transition"
    );
    el.onclick = () => window.location.href = "login.html";
  }
});
