const STORAGE_KEY = "today-todo-list";

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const today = document.querySelector("#today");

let todos = loadTodos();

today.textContent = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "long",
}).format(new Date());

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  list.replaceChildren();

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;
    item.dataset.id = todo.id;

    const checkButton = document.createElement("button");
    checkButton.type = "button";
    checkButton.className = "check-button";
    checkButton.textContent = "✓";
    checkButton.setAttribute("aria-label", todo.completed ? "标记为未完成" : "标记为已完成");
    checkButton.setAttribute("aria-pressed", String(todo.completed));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `删除“${todo.text}”`);

    item.append(checkButton, text, deleteButton);
    list.append(item);
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  remainingCount.textContent = todos.length - completedCount;
  emptyState.hidden = todos.length > 0;
  clearCompletedButton.hidden = completedCount === 0;
}

function updateTodos() {
  saveTodos();
  renderTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({ id: crypto.randomUUID(), text, completed: false });
  input.value = "";
  updateTodos();
  input.focus();
});

list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  if (event.target.closest(".check-button")) {
    todos = todos.map((todo) =>
      todo.id === item.dataset.id ? { ...todo, completed: !todo.completed } : todo,
    );
    updateTodos();
  }

  if (event.target.closest(".delete-button")) {
    todos = todos.filter((todo) => todo.id !== item.dataset.id);
    updateTodos();
  }
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  updateTodos();
});

renderTodos();
