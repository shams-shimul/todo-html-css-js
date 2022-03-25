let itemCount = 0;
let states = [];

document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    states.push({ valueBeforeEdit: todoVal, alteredValue: todoVal, done: false, editModeOn: false });
    const newElem = document.createElement("li");
    newElem.setAttribute("id", `item-${itemCount}`);
    newElem.setAttribute("status", `${states[itemCount].done ? "Done" : "Not-done"}`);
    newElem.innerHTML = `
      <span>
        <i class="${states[itemCount].done ? 'fa solid fa-circle-check' : 'fa-regular fa-circle'} clickable" title="Click to mark as ${states[itemCount].done ? "'Not Done'" : "'Done'"}" onclick="toggleDone(this)"></i>
      </span>
      <span class="item-value">${todoVal}</span>
      <span class="action-icons set-1">
        <i class="fa-regular fa-pen-to-square clickable" title="Edit" onclick="editItem(this)"></i>
        <i class="fa-solid fa-trash-can clickable" title="Delete" onclick="deleteItem(this)"></i>
      </span>
      <span class="action-icons set-2">
        <i class="fa-solid fa-check clickable" title="Save"></i>
        <i class="fa-solid fa-xmark clickable" title="Save"></i>
      </span>
    `;
    document.querySelector("section.todo-items>ul").appendChild(newElem);
    document.getElementById("todo").value = "";
    toggleAlert("Item Added");
    itemCount++;
    // console.log(states);
  } else {
    alert("Empty inputs not allowed");
  }
});

// Activate edit mode and toggle action icons
const editItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  states[itemPos].valueBeforeEdit = thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
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
  })
  thisNode.parentElement.nextElementSibling.querySelector("i:last-child").addEventListener("click", () => {
    cancelEdit(thisNode, itemPos);
    toggleEditAndIcons(thisNode, itemPos);
  })
}

// Delete items
const deleteItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  states.splice(itemPos, 1);
  thisNode.parentElement.parentElement.remove();
  toggleAlert("Item Deleted");
}

// Save edited items
const saveEdit = (thisNode, itemPos) => {
  states[itemPos].alteredValue = thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  states[itemPos].alteredValue !== states[itemPos].valueBeforeEdit && toggleAlert("Changes Saved")
}

// Cancel edit mode
const cancelEdit = (thisNode, itemPos) => {
  thisNode.parentElement.parentElement.querySelector(".item-value").innerText = states[itemPos].valueBeforeEdit;
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

// Toggle between done/not-done states of items and visual appearance
const toggleDone = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  if (states[itemPos].done) {
    thisNode.setAttribute("class", "fa-regular fa-circle clickable");
    thisNode.setAttribute("title", "Click to mark as 'Done'");
    thisNode.parentElement.parentElement.setAttribute("status", `${states[itemPos].done ? 'Not-done' : 'Done'}`);
    thisNode.parentElement.nextElementSibling.style.textDecoration = "none";
    thisNode.parentElement.nextElementSibling.style.color = "initial";
  } else {
    thisNode.setAttribute("class", "fa-solid fa-circle-check clickable");
    thisNode.setAttribute("title", "Click to mark as 'Not Done'");
    thisNode.parentElement.parentElement.setAttribute("status", `${states[itemPos].done ? 'Not-done' : 'Done'}`);
    thisNode.parentElement.nextElementSibling.style.textDecoration = "line-through";
    thisNode.parentElement.nextElementSibling.style.color = "gray";
  }
  states[itemPos].done = !states[itemPos].done;
  if (document.getElementById("filter-done").classList.contains("active")) {
    filterDone();
  }
  if (document.getElementById("filter-not-done").classList.contains("active")) {
    filterNotDone();
  }
}

// Toggle between edit/normal mode and action icons
const toggleEditAndIcons = (thisNode, itemPos) => {
  if (states[itemPos].editModeOn) {
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
  states[itemPos].editModeOn = !states[itemPos].editModeOn;
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


// Dynamic year for footer
document.getElementById("this-year").innerText = new Date().getFullYear();