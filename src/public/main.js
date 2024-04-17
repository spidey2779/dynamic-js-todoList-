const myinput = document.getElementById("myinput");
const todoBtn = document.getElementById("todoBtn");
const todosContainer = document.getElementById("todosContainer");
//route securing
if(!document.cookie){
  window.location.href='/login.html'
}
//loader
const showLoader = () => {
  document.querySelector(".loader").style.display = "grid";
};
const removeLoader = () => {
  document.querySelector(".loader").style.display = "none";
};
//Actual code
let todos = await fetchData();

todoBtn.addEventListener("click", async () => {
  if (myinput.value.trim().length === 0) {
    alert("Please enter something");
    return;
  }
  console.log(myinput.value.length);
  if (myinput.value.length > 30) {
    alert("Please enter below 30 characters");
    return;
  }
  //adding new todos
  const _id = await fetchData("/api/user/addTask", "POST", {
    isCompleted: "false",
    task: myinput.value,
  });
  //this is for static todo
  // const mytodo = {
  //   _id,
  //   text: myinput.value,
  //   isCompleted: false,
  // };
  todos = await fetchData();
  //this is static todolist
  // todos.push(mytodo);
  myinput.value = "";
  renderTodos(todos);
});
//generating todos
const generateTodo = (todo) => {
  // console.log(todo);
  let todoDiv = document.createElement("div");
  let todoText = document.createElement("span");
  let controlsDiv = document.createElement("div");
  let controlsCheckbox = document.createElement("input");
  let controlsButton = document.createElement("button");
  // creating todo and adding in todo container
  todoDiv.classList.add("todo");
  todosContainer.appendChild(todoDiv);
  //inside todo add span and controls and before adding include the text and add the classes also
  todoText.innerText = todo?.task;
  todoText.classList.add("todoText");
  todoDiv.appendChild(todoText);
  controlsDiv.classList.add("controls");
  todoDiv.appendChild(controlsDiv);
  //inside controls add input and button and before adding make the input type checkbox and add symbol to button
  controlsCheckbox.type = "checkbox";
  controlsCheckbox.checked = todo?.isCompleted;
  controlsDiv.appendChild(controlsCheckbox);
  controlsButton.innerHTML = "&times;";
  controlsDiv.appendChild(controlsButton);
  //adding event listeners
  controlsCheckbox.addEventListener("change", async () => {
    todos = await fetchData("/api/user/updateTask", "PUT", {
      taskID: todo._id,
    });
    renderTodos(todos);
  });
  controlsButton.addEventListener("click", async () => {
    todos = await fetchData("/api/user/deleteTask", "DELETE", {
      taskID: todo._id,
    });
    renderTodos(todos);
    //this is for static todolist
    // deleteTodo(todo);
  });
};
//rendering todos
const renderTodos = (todos) => {
  // console.log(todos)

  todosContainer.innerHTML = "";
  if (todos?.length === 0) {
    todosContainer.innerHTML = "No Todos yet...😇";
  } else {
    todos?.forEach((todo) => {
      generateTodo(todo);
    });
  }
};
renderTodos(todos);
//deleting todos
const deleteTodo = (todo) => {
  todos = todos?.filter((item) => item._id !== todo._id);
  renderTodos(todos);
};

// fetching function
async function fetchData(
  url = "/api/user/getData",
  method = "GET",
  data = null
) {
  showLoader();
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
      credentials: "include",
    });

    const responseData = await response.json();
    // console.log(responseData);
    if (url === "/api/user/getData") {
      return [...responseData.data];
    } else return responseData;
  } catch (error) {
    // Handle fetch errors
    console.error("Error fetching data:", error | null);
    throw new Error("Fetch error: " + error?.message);
  } finally {
    removeLoader();
  }
}

//logging out
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", async () => {
  const response = await fetchData("/api/user/logOutUser");
  
 
  alert(response.message)
  window.location.reload();
});
