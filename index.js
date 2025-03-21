const todoInput = document.querySelector(".todo-input input");
const todosConteiner = document.querySelector(".todos");

// btns
const sortBtn = document.querySelector(".todo-sort");
const todoDoneBtn = document.querySelector(".todo-done");
const todoClearBtn = document.querySelector(".todo-clear");

const paginationNextBtn = document.querySelector(".pagination-nextbtn");
const paginationPrevBtn = document.querySelector(".pagination-prevbtn");

// elemenets

const paginationEl = document.querySelector(".pagination");

// icons
const sunIconEl = document.getElementById("sun-icon");
const moonIconEl = document.getElementById("moon-icon");

let todos = [];

// pagination

let currentPage = 0;
const itemsPerPage = 5;

// adding todos
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (e.target.value === "") {
      alert("Cannot add empty todo!");
      return;
    }
    let newTodo = {
      id: crypto.randomUUID(),
      title: e.target.value,
      done: false,
    };
    todos.push(newTodo);
    todoInput.value = "";

    showTodos();
  }
});

// handle todo click

function handleTodoClick(e) {
  const todoDiv = e.target.closest(".todo");
  if (!todoDiv) return;

  const todoId = todoDiv.dataset.id;
  const todo = todos.find((t) => t.id === todoId);

  if (e.target.classList.contains("edit-btn")) {
    const pElement = todoDiv.querySelector("p");

    if (pElement) {
      const currentText = pElement.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "edit-input";
      input.value = currentText;
      pElement.replaceWith(input);
      input.focus();
      input.select();

      input.addEventListener("keydown", function handler(e) {
        if (e.key === "Enter") {
          todo.title = input.value;
          showTodos();
          input.removeEventListener("keydown", handler);
        }
      });

      input.addEventListener("blur", function handler() {
        todo.title = input.value;
        showTodos();
        input.removeEventListener("blur", handler);
      });
    }
  } // remove todos
  else if (e.target.classList.contains("remove-btn")) {
    removeTodo(todo.id);
  } // done todos
  else if (e.target.classList.contains("done-btn")) {
    todoDone(todo.id);
  }
}

todosConteiner.addEventListener("click", handleTodoClick);

// rendering todos
function showTodos() {
  calcAmountOfDoneTodos();
  showPagination();

  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedTodos = todos.slice(start, end);

  todosConteiner.innerHTML = "";
  todoDoneBtn.textContent =
    todoDoneAmount > 0 ? `Done ${todoDoneAmount} / ${todos.length}` : "Done";

  if (!todos.length) {
    return;
  }

  paginatedTodos.forEach((todo) => {
    todosConteiner.insertAdjacentHTML(
      "afterbegin",
      `<div class="todo" data-id="${todo.id}">
            <p class="${todo.done ? "task-done" : ""}">${todo.title}</p>
            <div class="todo-btns">
              <span class="done-btn">✅</span>
              <span class="edit-btn">✏️</span>
              <span class="remove-btn">🗑️</span>
            </div>
          </div>`
    );
    // const removeBtn = document.querySelector(".remove-btn");
    // console.log(removeBtn);
    // removeBtn.addEventListener("click", () => removeTodo(todo.id));

    // const doneBtn = document.querySelector(".done-btn");
    // doneBtn.addEventListener("click", () => todoDone(todo.id));

    // // edit todos
    // const editBtn = document.querySelector(".edit-btn");
    // editBtn.addEventListener("click", () => console.log("editing"));
  });
}

// remove todo
function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  showTodos();
}

// sort todos

let todoWay = false;

sortBtn.addEventListener("click", sortTodo);

function sortTodo() {
  if (!todos.length) {
    alert("list is empty!");
    return;
  }

  todos = todos.sort((a, b) =>
    todoWay ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );

  sortBtn.textContent = todoWay ? "sort: (Z-A)" : "sort: (A-Z)";
  console.log(todos, "sorted");

  todoWay = !todoWay;
  showTodos();
}

// show pagination

function showPagination() {
  paginationEl.style.display = todos.length > 5 ? "flex" : "none";
}

// todo done

function todoDone(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );

  showTodos();
}

// calcAmountOfDone
let todoDoneAmount = 0;

function calcAmountOfDoneTodos() {
  if (!todos.length) return;

  todoDoneAmount = todos.reduce(
    (count, todo) => count + (todo.done ? 1 : 0),
    0
  );
}

// clear todos

todoClearBtn.addEventListener("click", clearTodos);

function clearTodos() {
  if (!todos.length) {
    alert("List is empty! nothing to clear.");
    return;
  }

  let sureClear = window.confirm("Are u sure that u want to clear the list?");

  if (sureClear) {
    todos = [];
    currentPage = 0;

    showTodos();
  }
}

// PAGINATION BTNS
paginationPrevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    showTodos();
  }
});

paginationNextBtn.addEventListener("click", () => {
  if ((currentPage + 1) * itemsPerPage < todos.length) {
    currentPage++;
    showTodos();
  }
});

// implementing drag and drop

todosConteiner.addEventListener("dragstart", (e) => {
  const todoDiv = e.target.closest(".todo");
  console.log("dragstart");
  if (!todoDiv) return;
  e.dataTransfer.setData("text/plain", todoDiv.dataset.id);
  todoDiv.classList.add("dragging");

  const dragImage = todoDiv.cloneNode(true);
  dragImage.style.opacity = "0.8";
  dragImage.style.backgroundColor = "#e0f7fa";
  dragImage.style.border = "2px dashed #0288d1";
  document.body.appendChild(dragImage);
  e.dataTransfer.setDragImage(dragImage, 0, 0);
  setTimeout(() => document.body.removeChild(dragImage), 0);
});

todosConteiner.addEventListener("dragend", (e) => {
  const todoDiv = e.target.closest(".todo");
  if (todoDiv) todoDiv.classList.remove("dragging");
});

todosConteiner.addEventListener("dragover", (e) => {
  e.preventDefault();
  const targetDiv = e.target.closest(".todo");
  if (targetDiv) targetDiv.classList.add("drag-over");
});

todosConteiner.addEventListener("dragleave", (e) => {
  const targetDiv = e.target.closest(".todo");
  if (targetDiv) targetDiv.classList.remove("drag-over"); // Remove highlight
});

todosConteiner.addEventListener("drop", (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  const draggetTodo = todos.find((t) => t.id === draggedId);
  const targetDiv = e.target.closest(".todo");

  if (!targetDiv || !draggetTodo) return;

  targetDiv.classList.remove("drag-over");

  const targetId = targetDiv.dataset.id;
  const targetTodo = todos.find((t) => t.id === targetId);

  // reorder todos

  const draggedIndex = todos.indexOf(draggetTodo);
  const targetIndex = todos.indexOf(targetTodo);
  todos.splice(draggedIndex, 1);
  todos.splice(targetIndex, 0, draggetTodo);

  showTodos();
});

// function handle color mode for application

let colorMode = "light"; // Initial mode

const bodyEl = document.querySelector("body");

function toggleMode() {
  colorMode = colorMode === "light" ? "dark" : "light"; // Toggle mode
  console.log(colorMode);
  sunIconEl.classList.toggle("icon-hidden");
  moonIconEl.classList.toggle("icon-hidden");

  bodyEl.classList.replace(
    colorMode === "light" ? "dark-mode" : "light-mode",
    `${colorMode}-mode`
  );
}

// Single event listener on both icons
[sunIconEl, moonIconEl].forEach((icon) =>
  icon.addEventListener("click", toggleMode)
);

showTodos();

// to store todos
