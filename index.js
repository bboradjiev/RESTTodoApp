// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// define variables and functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const displayTodoItemsCount = function () {
    let count = todos.length || 0;
    nodes.totalItemsCount.innerHTML = count;
  };
  const renderTodos = function (todos) {
    // clean current todos:
    nodes.todoListUL.innerHTML = "";
  
    // add todo item at the end
    todos.forEach((todo) => {
      const li = document.createElement('LI');
          li.dataset.id = todo.id;
          li.innerHTML = `
          <span class="todoID">${todo.id}.</span>
          <span class="${todo.completed?'completed':''}">${todo.title}</span>
          <div class="todo-remove-btn"><i class="far fa-trash-alt"></i></div>
      <div class="todo-check-btn"><i class="fas fa-check"></i></div>
      `;
  
          nodes.todoListUL.append(li);
      // attach click event on .todo-remove-btn ("optional chaining" operator is used to prevent errors on null)
      document
        .querySelector(".todo-remove-btn")
        ?.addEventListener("click", removeTodo);
  
        // li.addEventListener('click', completeTodo);
  
      // document
      //   .querySelector(".todo-check-btn")
      //   ?.addEventListener("click", completeTodo);
    });
  
    displayTodoItemsCount();
  };
  const addTodo = function () {
    // get the input text:
    const todoText = nodes.addTodoInput.value;
    // new todo data to be sent to the server:
    const newTodo = {
      title: todoText,
      completed: false,
    };
  
    // change server state:
    fetch(`${apiRoot}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((data) => {
        // change local state:
        todos = [...todos, data];
        // update the view (UI)
        renderTodos(todos);
      });
  
    // clear input text
    nodes.addTodoInput.value = "";
  
    // focus on input for new todo:
    nodes.addTodoInput.focus();
  };
  const removeTodo = function (e) {
    // get id of todo to be removed:
    const liNode = e.currentTarget.parentNode;
    const todoID = +liNode.dataset.id;
    // change server(db) state:
    fetch(`${apiRoot}/todos/${todoID}`, { method: "DELETE" })
      .then((response) => {
        if (response.status === 200) {
          // change local state:
          let idx = todos.findIndex((todo) => todo.id === todoID);
          idx >= 0 && todos.splice(idx, 1);
          // update the view (UI)
          renderTodos(todos);
        }
      })
      .catch((err) => console.error(err));
  };
  const fetchTodos = function (apiRoot) {
    fetch(`${apiRoot}/todos`)
      .then((response) => response.json())
      .then((data) => {
         todos = data;
        renderTodos(todos);
      })
      .catch((err) => console.error(err));
  };
  const completeTodo = function (e) {
    // get id of todo to be updated:
      const liNode = e.currentTarget;
      const todoID = +liNode.dataset.id;
  
      // get todo object to be updated and toggle its completed prop:
      // if we've used the PATCH method that would not be needed, as we can
      // only send the new completed prop and todo id
      let idx = todos.findIndex( todo => todo.id === todoID );
  
      // make copy of updated todo object, because we do not want to modify local state before successfully updating server state
      const todoToggled = {...todos[idx]};
      todoToggled.completed = !todoToggled.completed;
  
      // change server(db) state:
      fetch(`${apiRoot}/todos/${todoID}`, {
          method:"PUT",
          headers: {
              'Content-Type': 'application/json'
          },
          body:JSON.stringify(todoToggled)
          })
          .then( response=> {
              if(response.status === 200){
                  // change local state:
                  todos[idx] = todoToggled;
  
                  // update the view (UI)
                  renderTodos(todos);
              }
          })
          .catch( err => console.error(err) )
  };
  
  // "cache" the DOM elements used in script:
  const nodes = {
    todoListUL: document.querySelector("ul.todo-items"),
    addTodoInput: document.querySelector(".todo-add>input"),
    addTodoBtn: document.querySelector(".todo-add-btn"),
    totalItemsCount: document.querySelector(".todos-total>.output"),
  };
  
  let apiRoot = "http://localhost:3000";
  // create array of todo objects from string
  let todos = [];
  // console.log(todos);
  
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // attach events
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  window.addEventListener("DOMContentLoaded", function () {
    fetchTodos(apiRoot);
  });
  
  // add Todo Item (on button click):
  nodes.addTodoBtn.addEventListener("click", addTodo);
  