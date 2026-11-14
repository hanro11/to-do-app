// BEHAVIOR: JavaScript makes the page DO things.

// 1. STATE — the single source of truth: an array of task objects.
//    Loaded from localStorage so tasks survive a page refresh.
let todos = JSON.parse(localStorage.getItem("todos") || "[]");
let filter = "all";

// 2. Grab references to the HTML elements we need.
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("count");
const clearDone = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filters button");

// 3. SAVE — write state to the browser's storage.
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 4. RENDER — rebuild the list from state. Every change calls this.
function render() {
  list.innerHTML = "";

  const visible = todos.filter(t =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  for (const todo of visible) {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggle(todo.id));

    const text = document.createElement("span");
    text.textContent = todo.text; // textContent (not innerHTML) = safe from HTML injection

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "✕";
    del.title = "Delete";
    del.addEventListener("click", () => remove(todo.id));

    li.append(checkbox, text, del);
    list.append(li);
  }

  const left = todos.filter(t => !t.done).length;
  count.textContent = `${left} task${left === 1 ? "" : "s"} left`;
}

// 5. ACTIONS — each one changes state, saves, then re-renders.
function add(text) {
  todos.push({ id: Date.now(), text, done: false });
  save(); render();
}
function toggle(id) {
  const todo = todos.find(t => t.id === id);
  todo.done = !todo.done;
  save(); render();
}
function remove(id) {
  todos = todos.filter(t => t.id !== id);
  save(); render();
}

// 6. EVENTS — connect user actions to our functions.
form.addEventListener("submit", e => {
  e.preventDefault(); // stop the browser from reloading the page
  const text = input.value.trim();
  if (text) add(text);
  input.value = "";
});

clearDone.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  save(); render();
});

filterButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle("active", b === btn));
    render();
  })
);

// 7. Initial draw when the page loads.
render();
