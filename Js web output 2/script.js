const STORAGE_KEY = "js2_records";

let records = [];
let editIndex = -1; // -1 means we are inserting a new record, otherwise editing this index

const form = document.getElementById("recordForm");
const firstNameInput = document.getElementById("firstName");
const middleNameInput = document.getElementById("middleName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");

const insertBtn = document.getElementById("insertBtn");
const clearBtn = document.getElementById("clearBtn");

const noRecordsMsg = document.getElementById("noRecords");
const recordsTable = document.getElementById("recordsTable");
const recordsBody = document.getElementById("recordsBody");

const clearRecordsBtn = document.getElementById("clearRecordsBtn");
const sortFieldSelect = document.getElementById("sortField");
const sortOrderSelect = document.getElementById("sortOrder");
const saveBtn = document.getElementById("saveBtn");

// ---------- Local Storage helpers ----------

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      records = JSON.parse(saved);
    } catch (e) {
      records = [];
    }
  } else {
    records = [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// ---------- Rendering ----------

function renderRecords() {
  recordsBody.innerHTML = "";

  if (records.length === 0) {
    noRecordsMsg.style.display = "block";
    recordsTable.classList.remove("has-rows");
    return;
  }

  noRecordsMsg.style.display = "none";
  recordsTable.classList.add("has-rows");

  records.forEach((record, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${record.firstName}</td>
      <td>${record.middleName}</td>
      <td>${record.lastName}</td>
      <td>${record.age}</td>
      <td>
        <button type="button" class="deleteBtn" data-index="${index}">Delete</button>
        <button type="button" class="editBtn" data-index="${index}">Edit</button>
      </td>
    `;

    recordsBody.appendChild(row);
  });

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });

  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", handleEdit);
  });
}

// ---------- Form helpers ----------

function clearForm() {
  firstNameInput.value = "";
  middleNameInput.value = "";
  lastNameInput.value = "";
  ageInput.value = "";
  editIndex = -1;
  insertBtn.textContent = "Insert";
}

function getFormValues() {
  return {
    firstName: firstNameInput.value.trim(),
    middleName: middleNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    age: ageInput.value.trim(),
  };
}

// ---------- Event Handlers ----------

function handleSubmit(e) {
  e.preventDefault();

  const values = getFormValues();

  if (!values.firstName || !values.lastName || !values.age) {
    alert("Please fill in at least First Name, Last Name, and Age.");
    return;
  }

  if (editIndex === -1) {
    // Insert new record
    records.push(values);
  } else {
    // Update existing record
    records[editIndex] = values;
  }

  renderRecords();
  clearForm();
}

function handleDelete(e) {
  const index = Number(e.target.getAttribute("data-index"));
  records.splice(index, 1);

  // If we happened to be editing the record being deleted, reset the form
  if (editIndex === index) {
    clearForm();
  }

  renderRecords();
}

function handleEdit(e) {
  const index = Number(e.target.getAttribute("data-index"));
  const record = records[index];

  firstNameInput.value = record.firstName;
  middleNameInput.value = record.middleName;
  lastNameInput.value = record.lastName;
  ageInput.value = record.age;

  editIndex = index;
  insertBtn.textContent = "Update";
}

function handleClearRecords() {
  records = [];
  localStorage.removeItem(STORAGE_KEY);
  clearForm();
  renderRecords();
}

function handleSave() {
  saveToStorage();
}

function handleSort() {
  const field = sortFieldSelect.value;
  const order = sortOrderSelect.value;

  if (!field || !order) {
    return;
  }

  records.sort((a, b) => {
    const valA = a[field].toLowerCase();
    const valB = b[field].toLowerCase();

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  renderRecords();
}

// ---------- Init ----------

form.addEventListener("submit", handleSubmit);
clearBtn.addEventListener("click", clearForm);
clearRecordsBtn.addEventListener("click", handleClearRecords);
saveBtn.addEventListener("click", handleSave);
sortFieldSelect.addEventListener("change", handleSort);
sortOrderSelect.addEventListener("change", handleSort);

loadFromStorage();
renderRecords();