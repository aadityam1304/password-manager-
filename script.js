const API =
  "https://crudcrud.com/api/f645ccdbb61c46e697c69389e1054165/passwords";

const titleInput = document.getElementById("title");
const passwordInput = document.getElementById("password");
const saveBtn = document.getElementById("saveBtn");
const passwordList = document.getElementById("passwordList");

let editId = null;

// Event Listener
saveBtn.addEventListener("click", savePassword);

// CREATE + UPDATE
async function savePassword() {
  const title = titleInput.value.trim();
  const password = passwordInput.value.trim();

  if (title === "" || password === "") {
    alert("Input fields can't be blank!");
    return;
  }

  const passwordData = {
    title,
    password,
  };

  try {
    if (editId) {
      // UPDATE
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      editId = null;
      saveBtn.textContent = "Save Password";
    } else {
      // CREATE
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });
    }

    titleInput.value = "";
    passwordInput.value = "";

    await getPasswords();
  } catch (error) {
    console.log(error);
  }
}

// READ
async function getPasswords() {
  try {
    const response = await fetch(API);

    const data = await response.json();

    displayPasswords(data);
  } catch (error) {
    console.log(error);
  }
}

// DISPLAY PASSWORDS
function displayPasswords(passwords) {
  passwordList.innerHTML = "";

  passwords.forEach((item) => {
    passwordList.innerHTML += `
      <tr>
        <td>${item.title}</td>
        <td>${item.password}</td>

        <td>
          <button
            class="action-btn"
            onclick="editPassword('${item._id}')"
          >
            Edit
          </button>

          <button
            class="action-btn"
            onclick="deletePassword('${item._id}')"
          >
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// DELETE
async function deletePassword(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this password?",
  );

  if (!confirmDelete) return;

  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    await getPasswords();
  } catch (error) {
    console.log(error);
  }
}

// EDIT
async function editPassword(id) {
  try {
    const response = await fetch(API);

    const passwords = await response.json();

    const selectedPassword = passwords.find((item) => item._id === id);

    if (!selectedPassword) return;

    titleInput.value = selectedPassword.title;
    passwordInput.value = selectedPassword.password;

    editId = id;

    saveBtn.textContent = "Update Password";
  } catch (error) {
    console.log(error);
  }
}

// Load Data on Page Refresh
getPasswords();
