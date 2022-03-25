let itemCount = 0;
let todos = [];

document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    if (todos.length === 0) {
      document.getElementById("filter-action-row").style.display = "flex"
    }
    todos.push({ valueBeforeEdit: todoVal, alteredValue: todoVal, done: false, editModeOn: false });
    const newElem = document.createElement("li");
    newElem.setAttribute("id", `item-${itemCount}`);
    newElem.setAttribute("status", `${todos[itemCount].done ? "Done" : "Not-done"}`);
    newElem.innerHTML = `
      <span>
        <i class="${todos[itemCount].done ? 'fa solid fa-circle-check' : 'fa-regular fa-circle'} clickable" title="Click to mark as ${todos[itemCount].done ? "'Not Done'" : "'Done'"}" onclick="toggleDone(this)"></i>
      </span>
      <span class="item-value">${todoVal}</span>
      <span class="action-icons set-1">
        <i class="fa-regular fa-pen-to-square clickable" title="Edit" onclick="editItem(this)"></i>
        <i class="fa-regular fa-trash-can clickable" title="Delete" onclick="deleteItem(this)"></i>
      </span>
      <span class="action-icons set-2">
        <i class="fa-regular fa-floppy-disk clickable" title="Save"></i>
        <i class="fa-solid fa-xmark clickable" title="Cancel"></i>
      </span>
    `;
    document.querySelector("ul.todo-items").appendChild(newElem);
    document.getElementById("todo").value = "";
    toggleAlert("Item Added");
    itemCount++;
    // console.log(todos);
  } else {
    alert("Empty inputs not allowed");
  }
});

// Activate edit mode and toggle action icons
const editItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  todos[itemPos].valueBeforeEdit = thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  toggleEditAndIcons(thisNode, itemPos);
  thisNode.parentElement.previousElementSibling.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit(thisNode, itemPos);
      toggleEditAndIcons(thisNode, itemPos);
    }
    if (e.key === "Escape") {
      cancelEdit(thisNode, itemPos);
      toggleEditAndIcons(thisNode, itemPos);
    }
  })

  thisNode.parentElement.nextElementSibling.querySelector("i:first-child").addEventListener("click", () => {
    saveEdit(thisNode, itemPos);
    toggleEditAndIcons(thisNode, itemPos);
  });

  thisNode.parentElement.nextElementSibling.querySelector("i:last-child").addEventListener("click", () => {
    cancelEdit(thisNode, itemPos);
    toggleEditAndIcons(thisNode, itemPos);
  });
}

// Delete items
const deleteItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  todos.splice(itemPos, 1);
  thisNode.parentElement.parentElement.remove();
  toggleAlert("Item Deleted");
}

// Save edited items
const saveEdit = (thisNode, itemPos) => {
  console.log("saveEdit() called");
  todos[itemPos].alteredValue = thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  todos[itemPos].alteredValue !== todos[itemPos].valueBeforeEdit && toggleAlert("Changes Saved")
}

// Cancel edit mode
const cancelEdit = (thisNode, itemPos) => {
  thisNode.parentElement.parentElement.querySelector(".item-value").innerText = todos[itemPos].valueBeforeEdit;
}

// Show/Hide alert from top on adding/editing/deleting of items
const toggleAlert = (label) => {
  document.querySelector(".alert").innerText = label;
  document.querySelector(".alert").style.top = "35px";
  document.querySelector(".backdrop").style.visibility = "visible";
  setTimeout(() => {
    document.querySelector(".alert").style.top = "-25%";
    document.querySelector(".backdrop").style.visibility = "hidden";
  }, 2000);
}

// Toggle between done/not-done todos of items and visual appearance
const toggleDone = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  if (todos[itemPos].done) {
    thisNode.setAttribute("class", "fa-regular fa-circle clickable");
    thisNode.setAttribute("title", "Click to mark as 'Done'");
    thisNode.parentElement.parentElement.setAttribute("status", `${todos[itemPos].done ? 'Not-done' : 'Done'}`);
    thisNode.parentElement.nextElementSibling.style.textDecoration = "none";
    thisNode.parentElement.nextElementSibling.style.color = "initial";
  } else {
    thisNode.setAttribute("class", "fa-solid fa-circle-check clickable");
    thisNode.setAttribute("title", "Click to mark as 'Not Done'");
    thisNode.parentElement.parentElement.setAttribute("status", `${todos[itemPos].done ? 'Not-done' : 'Done'}`);
    thisNode.parentElement.nextElementSibling.style.textDecoration = "line-through";
    thisNode.parentElement.nextElementSibling.style.color = "gray";
  }
  todos[itemPos].done = !todos[itemPos].done;
  if (document.getElementById("filter-done").classList.contains("active")) {
    filterDone();
  }
  if (document.getElementById("filter-not-done").classList.contains("active")) {
    filterNotDone();
  }
}

// Toggle between edit/normal mode and action icons
const toggleEditAndIcons = (thisNode, itemPos) => {
  console.log("toggleEditAndIcons() called");
  if (todos[itemPos].editModeOn) {
    thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "false");
    thisNode.parentElement.parentElement.querySelector(".item-value").classList.remove("editable");
    thisNode.parentElement.style.display = "flex";
    thisNode.parentElement.nextElementSibling.style.display = "none";
  } else {
    thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "true");
    thisNode.parentElement.parentElement.querySelector(".item-value").focus();
    thisNode.parentElement.parentElement.querySelector(".item-value").classList.add("editable");
    thisNode.parentElement.style.display = "none";
    thisNode.parentElement.nextElementSibling.style.display = "flex";
  }
  todos[itemPos].editModeOn = !todos[itemPos].editModeOn;
}


// Filtering functions(3)

const filterAll = () => {
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].style.display = 'flex';
  }
}

const filterDone = () => {
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].getAttribute("status") === "Done") {
      allItems[i].style.display = 'flex';
    } else {
      allItems[i].style.display = "none";
    }
  }
}

const filterNotDone = () => {
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].getAttribute("status") === "Not-done") {
      allItems[i].style.display = 'flex';
    } else {
      allItems[i].style.display = "none";
    }
  }
}


// Events on click on filter buttons(3)

document.getElementById("filter-all").addEventListener("click", () => {
  document.getElementById("filter-all").classList.add("active");
  document.getElementById("filter-done").classList.remove("active");
  document.getElementById("filter-not-done").classList.remove("active");
  filterAll();
});

document.getElementById("filter-done").addEventListener("click", () => {
  document.getElementById("filter-all").classList.remove("active");
  document.getElementById("filter-done").classList.add("active");
  document.getElementById("filter-not-done").classList.remove("active");
  filterDone();
});

document.getElementById("filter-not-done").addEventListener("click", () => {
  document.getElementById("filter-all").classList.remove("active");
  document.getElementById("filter-done").classList.remove("active");
  document.getElementById("filter-not-done").classList.add("active");
  document.getElementById("filter-not-done").classList.add("active");
  filterNotDone();
});

// Toggle show/hide of more options
const moreOptListHeight = document.getElementById("more-opt-list").clientHeight;
const toggleMoreOpt = (thisNode) => {
  if (thisNode.querySelector("i").classList.contains("close-more")) {
    thisNode.querySelector("i").setAttribute("class", "fa-solid fa-ellipsis");
    document.getElementById("more-opt").style.height = `0px`;
  } else {
    thisNode.querySelector("i").setAttribute("class", "fa-solid fa-xmark close-more")
    document.getElementById("more-opt").style.height = `${moreOptListHeight}px`;
  }
}

// More options click events

const markAllDone = () => {
  if (todos.length > 0) {
    todos = todos.map(item => ({ ...item, done: true }));
  }
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].setAttribute("status", "Done");
    allItems[i].querySelector("span:first-child i").setAttribute("class", "fa-solid fa-circle-check clickable");
    allItems[i].querySelector("span.item-value").style.textDecoration = "line-through";
    allItems[i].querySelector("span.item-value").style.color = "gray";
  }
}
const markAllNotDone = () => {
  if (todos.length > 0) {
    todos = todos.map(item => ({ ...item, done: false }));
  }
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].setAttribute("status", "Not-done");
    allItems[i].querySelector("span:first-child i").setAttribute("class", "fa-regular fa-circle clickable");
    allItems[i].querySelector("span.item-value").style.textDecoration = "none";
    allItems[i].querySelector("span.item-value").style.color = "black";
  }
}
const deleteAll = () => {
  if (todos.length > 0) {
    todos = [];
  }
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].remove()
  }
}

// Dynamic year for footer
document.getElementById("this-year").innerText = new Date().getFullYear();