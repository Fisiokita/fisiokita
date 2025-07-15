const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async (user) => {
  const el = document.getElementById("userGreeting");
  if (!el) return;

  // Reset semua class setiap kali
  el.className = "cursor-pointer px-4 py-2 rounded-full text-sm font-semibold transition";

  if (user) {
    try {
      const snap = await db.collection("users").doc(user.email).get();
      const nama = snap.exists ? snap.data().nama : user.email;
      const namaDepan = nama.split(" ")[0];

      el.textContent = namaDepan;
      el.classList.add("text-white", "hover:opacity-90");
      el.onclick = () => window.location.href = "../akun.html";
    } catch (err) {
      console.error("Gagal ambil nama:", err);
      el.textContent = "Pengguna";
      el.classList.add("text-white", "hover:opacity-90");
      el.onclick = () => window.location.href = "../akun.html";
    }
  } else {
    el.textContent = "Masuk";
    el.classList.add("bg-white", "text-[#4B6CC1]", "hover:bg-gray-100", "shadow");
    el.onclick = () => window.location.href = "../login.html";
  }
});
