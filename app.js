// Theme toggle with localStorage persistence
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.classList.add(savedTheme);
  updateThemeIcon();
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : '');
  updateThemeIcon();
});

function updateThemeIcon() {
  const isDark = body.classList.contains('dark');
  themeToggle.innerHTML = isDark 
    ? '<img src="images/icon-sun.svg" alt="Light mode">' 
    : '<img src="images/icon-moon.svg" alt="Dark mode">';
}

// Todo functionality
const itemsLeft = document.getElementById("items-left");
const todoInput = document.querySelector('.todo-input');
const todoItems = document.getElementById('todo-items');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = 'all';

// Load todos from localStorage
document.addEventListener('DOMContentLoaded', () => {
  loadTodos();
  updateItemsCount();
  applyFilter(currentFilter);
});

todoInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && todoInput.value.trim() !== "") {
    addTodoItem(todoInput.value.trim());
    todoInput.value = "";
    saveTodos();
    updateItemsCount();
  }
});

clearCompletedBtn.addEventListener('click', () => {
  const completedItems = document.querySelectorAll('.todo-item .checked');
  completedItems.forEach(item => {
    item.closest('.todo-item').remove();
  });
  saveTodos();
  updateItemsCount();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    filterButtons.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.id;
    applyFilter(currentFilter);
  });
});

function addTodoItem(text) {
  const newli = document.createElement("li");
  newli.classList.add("todo-item");
  newli.dataset.completed = "false";

  const todoClick = document.createElement("div");
  todoClick.classList.add("todo-check");

  const todoText = document.createElement("span");
  todoText.classList.add("todo-text");
  todoText.textContent = text;

  const delBtn = document.createElement("img");
  delBtn.src = "./images/icon-cross.svg";
  delBtn.alt = "Delete todo";
  delBtn.classList.add("delete-btn");

  newli.appendChild(todoClick);
  newli.appendChild(todoText);
  newli.appendChild(delBtn);
  todoItems.appendChild(newli);

  // Event listeners
  delBtn.addEventListener("click", () => {
    newli.remove();
    saveTodos();
    updateItemsCount();
  });

  todoClick.addEventListener("click", () => {
    todoClick.classList.toggle("checked");
    todoText.classList.toggle("line-through");
    newli.dataset.completed = todoClick.classList.contains("checked").toString();
    saveTodos();
    updateItemsCount();
  });
}

function updateItemsCount() {
  const allTodoItems = document.querySelectorAll('.todo-item');
  const activeItems = document.querySelectorAll('.todo-item:not([data-completed="true"])');
  
  const count = activeItems.length;
  itemsLeft.textContent = `${count} ${count === 1 ? 'item' : 'items'} left`;
  
  if (allTodoItems.length === 0) {
    itemsLeft.style.display = "none";
  } else {
    itemsLeft.style.display = "inline-block";
  }
}

function applyFilter(filter) {
  const allItems = document.querySelectorAll('.todo-item');
  
  allItems.forEach(item => {
    const isCompleted = item.dataset.completed === "true";
    
    switch(filter) {
      case 'all':
        item.style.display = 'flex';
        break;
      case 'active':
        item.style.display = isCompleted ? 'none' : 'flex';
        break;
      case 'completed':
        item.style.display = isCompleted ? 'flex' : 'none';
        break;
    }
  });
}

// LocalStorage functions
function saveTodos() {
  const todos = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    todos.push({
      text: item.querySelector('.todo-text').textContent,
      completed: item.dataset.completed === "true"
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem('todos');
  if (savedTodos) {
    JSON.parse(savedTodos).forEach(todo => {
      addTodoItem(todo.text);
      const items = document.querySelectorAll('.todo-item');
      const lastItem = items[items.length - 1];
      
      if (todo.completed) {
        lastItem.querySelector('.todo-check').classList.add('checked');
        lastItem.querySelector('.todo-text').classList.add('line-through');
        lastItem.dataset.completed = "true";
      }
    });
  }
}