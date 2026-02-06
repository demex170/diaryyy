// ========================
// 🔥 Firebase config
// ========================
const firebaseConfig = {
  apiKey: "AIzaSyDsc0xVKoxXwbPA32imS_NSL5I7Bxf1ZSI",
  authDomain: "demetre-nini-diary.firebaseapp.com",
  projectId: "demetre-nini-diary",
  storageBucket: "demetre-nini-diary.appspot.com",
  messagingSenderId: "1079599079461",
  appId: "1:1079599079461:web:9abeb73b8e70431aa25fcc",
  measurementId: "G-PN7Q9DV19R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ========================
// 📝 Elements
// ========================
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const entriesDiv = document.getElementById("entries");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const textArea = document.getElementById("text");

// ========================
// 🔐 Auth state
// ========================
auth.onAuthStateChanged(user => {
  if (user) {
    loginDiv.classList.add("hidden");
    appDiv.classList.remove("hidden");
    loadEntries();
  } else {
    loginDiv.classList.remove("hidden");
    appDiv.classList.add("hidden");
    entriesDiv.innerHTML = "";
    textArea.value = "";
  }
});

// ========================
// 🔐 Login
// ========================
function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("გთხოვთ შეიყვანოთ Email და პაროლი");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert("Login error: " + err.message));
}

// ========================
// 🚪 Logout
// ========================
function logout() {
  auth.signOut();
}

// ========================
// 💾 Save entry
// ========================
function saveEntry() {
  const text = textArea.value.trim();

  if (!text) {
    alert("ტექსტი ცარიელია ✍️");
    return;
  }

  if (!auth.currentUser) {
    alert("გთხოვთ შეხვიდეთ საიტზე 🔐");
    return;
  }

  db.collection("entries").add({
    text: text,
    user: auth.currentUser.email,
    created: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    textArea.value = "";
  })
  .catch(err => {
    alert("შენახვის შეცდომა: " + err.message);
  });
}

// ========================
// 📜 Load entries
// ========================
function loadEntries() {
  db.collection("entries")
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {
      entriesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const d = doc.data();
        const div = document.createElement("div");
        div.className = "saved-entry";
        div.innerHTML = `
          <b>${d.user}</b>
          <span>${d.created ? d.created.toDate().toLocaleString("ka-GE") : ""}</span>
          <p>${d.text}</p>
          <button class="delete" onclick="deleteEntry('${doc.id}')">წაშლა</button>
        `;
        entriesDiv.appendChild(div);
      });
    });
}

// ========================
// 🗑️ Delete entry
// ========================
function deleteEntry(id) {
  if (!confirm("ნამდვილად გსურთ წაშლა?")) return;

  db.collection("entries").doc(id).delete()
    .catch(err => alert("შეცდომა წაშლისას: " + err.message));
}
