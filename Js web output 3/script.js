const API_URL = "https://jsonplaceholder.typicode.com/todos/";

const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const todosTable = document.getElementById("todosTable");
const todosBody = document.getElementById("todosBody");

let dataLoaded = false;

function renderTodos(todos) {
  todosBody.innerHTML = "";

  todos.forEach((todo) => {
    const row = document.createElement("tr");

    const statusClass = todo.completed ? "status-completed" : "status-pending";
    const statusText = todo.completed ? "Completed" : "Not yet Completed";

    row.innerHTML = `
      <td>${todo.userId}</td>
      <td>${todo.id}</td>
      <td>${todo.title}</td>
      <td class="${statusClass}">${statusText}</td>
    `;

    todosBody.appendChild(row);
  });

  todosTable.classList.add("has-rows");
}

async function loadData() {
  // Once loaded, clicking again does nothing until the table is cleared
  if (dataLoaded) {
    return;
  }

  try {
    const response = await fetch(API_URL);
    const todos = await response.json();

    renderTodos(todos);
    dataLoaded = true;
  } catch (error) {
    alert("Something went wrong while loading data from the API.");
    console.error(error);
  }
}

function clearTable() {
  todosBody.innerHTML = "";
  todosTable.classList.remove("has-rows");
  dataLoaded = false;
}

loadBtn.addEventListener("click", loadData);
clearBtn.addEventListener("click", clearTable);