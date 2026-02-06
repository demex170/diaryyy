// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDsc0xVKoxXwbPA32imS_NSL5I7Bxf1ZSI",
  authDomain: "demetre-nini-diary.firebaseapp.com",
  projectId: "demetre-nini-diary",
  storageBucket: "demetre-nini-diary.firebasestorage.app",
  messagingSenderId: "1079599079461",
  appId: "1:1079599079461:web:9abeb73b8e70431aa25fcc",
  measurementId: "G-PN7Q9DV19R"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const entriesDiv = document.getElementById("entries");

// 🔐 auth state
auth.onAuthStateChanged(user => {
  if (user) {
    loginDiv.classList.add("hidden");
    appDiv.classList.remove("hidden");
    loadEntries();
  } else {
    loginDiv.classList.remove("hidden");
    appDiv.classList.add("hidden");
  }
});

// 🔐 login
function login() {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  ).catch(err => alert(err.message));
}

// 🚪 logout
function logout() {
  auth.signOut();
}

// 💾 save entry
function saveEntry() {
  const text = document.getElementById("text").value.trim();
  if (!text) return;

  db.collection("entries").add({
    text: text,
    user: auth.currentUser.email,
    created: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("text").value = "";
}

// 📜 load entries
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

// 🗑️ delete
function deleteEntry(id) {
  db.collection("entries").doc(id).delete();
}
