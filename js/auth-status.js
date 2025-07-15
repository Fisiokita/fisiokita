auth.onAuthStateChanged(async (user) => {
  const el = document.getElementById("userGreeting");
  if (!el) return;

  // Reset class terlebih dahulu
  el.className = "cursor-pointer bg-white text-[#4B6CC1] px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition";

  if (user) {
    try {
      const snap = await db.collection("users").doc(user.email).get();
      const nama = snap.exists ? snap.data().nama : user.email;
      const namaDepan = nama.split(" ")[0];

      el.textContent = namaDepan;
      el.onclick = () => window.location.href = "akun.html";
    } catch (err) {
      console.error("Gagal ambil nama:", err);
      el.textContent = "Pengguna";
      el.onclick = () => window.location.href = "akun.html";
    }
  } else {
    el.textContent = "Masuk";
    el.onclick = () => window.location.href = "login.html";
  }
});
