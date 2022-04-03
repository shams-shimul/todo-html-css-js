// Handling dates and times
const createDayDate = () => {
  const thisDayDate = new Date();
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = weekDays[thisDayDate.getDay()];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[thisDayDate.getMonth()];
  return `${dayName}, ${monthName} ${thisDayDate.getDate()}, ${thisDayDate.getFullYear()}`;
};

// Generate the contents of each <li> and append to the list <ul>
const createAndInsertLi = (id, stringVal, status, date, time) => {
  const newElem = document.createElement("li");
  newElem.setAttribute("id", `item-${id}`);
  newElem.setAttribute("status", `${status ? "Done" : "Not-done"}`);
  newElem.innerHTML = `
    <span>
    <i class="${status
      ? "toggle checked fa solid fa-circle-check"
      : "toggle fa-regular fa-circle"
    } clickable" title="Click to mark as ${status ? "'Not Done'" : "'Done'"
    }" onclick="toggleDone(this)"></i>
    </span>
    <div class="item-wrap">
      <div class="item-value ${status && 'done'}" onkeydown="actionOnKeydown(this)">${stringVal}</div>
      <div class="item-datetimestamp ${status && 'done'}">
        Created on ${date} at ${time}
      </div>
    </div>
    <span class="action-icons set-1">
      <i class="fa-regular fa-pen-to-square clickable" title="Edit" onclick="editItem(this)"></i>
      <i class="fa-regular fa-trash-can clickable" title="Delete" onclick="deleteItem(this)"></i>
    </span>
    <span class="action-icons set-2">
      <i class="fa-regular fa-floppy-disk clickable" title="Save" onclick="saveEdit(this)"></i>
      <i class="fa-solid fa-xmark clickable" title="Cancel" onclick="cancelEdit(this)"></i>
    </span>
  `;
  document.querySelector("ul.todo-items").appendChild(newElem);
}

// Check whether all items are done, or not-done, or a mixture of both
const checkAllItemStatus = () => {
  // check if all items are 'done' or 'not-done'
  let allDoneCount = 0;
  let allNotDoneCount = 0;
  for (let i = 0; i < todos.length; i++) {
    todos[i].done ? ++allDoneCount : ++allNotDoneCount;
  }
  // If all items are 'done', disble 'mark all as done' button, else keep it enabled
  if (allDoneCount === todos.length) {
    document
      .querySelector("#more-opt-list li:first-child")
      .setAttribute("class", "disabled");
    document
      .querySelector("#more-opt-list li:first-child")
      .removeAttribute("onclick");
  } else {
    document
      .querySelector("#more-opt-list li:first-child")
      .setAttribute("class", "clickable");
    document
      .querySelector("#more-opt-list li:first-child")
      .setAttribute("onclick", "markAllDone(this)");
  }
  // If all items are 'not-done', disble 'mark all as not done' button, else keep it enabled
  if (allNotDoneCount === todos.length) {
    document
      .querySelector("#more-opt-list li:nth-child(2)")
      .setAttribute("class", "disabled");
    document
      .querySelector("#more-opt-list li:nth-child(2)")
      .removeAttribute("onclick");
  } else {
    document
      .querySelector("#more-opt-list li:nth-child(2)")
      .setAttribute("class", "clickable");
    document
      .querySelector("#more-opt-list li:nth-child(2)")
      .setAttribute("onclick", "markAllNotDone(this)");
  }
}

// Activate edit mode and toggle action icons
const editItem = thisNode => {
  const itemPos = thisNode.parentElement.parentElement
    .getAttribute("id")
    .substring(5);
  toggleEditAndIcons(thisNode, itemPos);
};

// Delete items
const deleteItem = thisNode => {
  const itemPos = Number(
    thisNode.parentElement.parentElement.getAttribute("id").substring(5)
  );
  --itemCount;
  todos.splice(itemPos, 1);
  if (itemCount === 0) {
    document.getElementById("filter-action-row").style.display = "none";
    document.querySelector(".todo-items").style.marginBottom = "0px";
    closeMoreOptList();
  }
  localStorage.setItem("korteHobe", JSON.stringify(todos));
  thisNode.parentElement.parentElement.remove();
  const allRows = document.querySelectorAll(
    ".todo-items>li:not(#filter-action-row)"
  );
  for (let i = 0; i < todos.length; i++) {
    if (i === itemPos || i > itemPos) {
      allRows[i].setAttribute("id", `item-${i}`);
    }
  }
  toggleAlert("Item Deleted");
};

// Save edited items
const saveEdit = thisNode => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  todos[itemPos].alteredValue =
    thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  if (todos[itemPos].alteredValue !== todos[itemPos].valueBeforeEdit) {
    todos[itemPos].valueBeforeEdit = todos[itemPos].alteredValue;
    todos[itemPos].createdDate = createDayDate();
    todos[itemPos].createdTime = new Date().toLocaleTimeString();
    thisNode.parentElement.parentElement.querySelector(".item-datetimestamp").innerHTML = `
      Created on ${todos[itemPos].createdDate} at ${todos[itemPos].createdTime}
    `
    toggleAlert("Changes Saved");
  }
  localStorage.setItem("korteHobe", JSON.stringify(todos));
  toggleEditAndIcons(thisNode, itemPos);
};

// Cancel edit mode
const cancelEdit = thisNode => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  thisNode.parentElement.parentElement.querySelector(".item-value").innerText =
    todos[itemPos].valueBeforeEdit;
  toggleEditAndIcons(thisNode, itemPos);
};

// Save/cancel on 'Enter/Excape' Keypress on edit mode
const actionOnKeydown = thisNode => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  if (window.event.key === "Enter") {
    window.event.preventDefault();
    todos[itemPos].alteredValue = thisNode.innerText;
    if (todos[itemPos].alteredValue !== todos[itemPos].valueBeforeEdit) {
      todos[itemPos].valueBeforeEdit = todos[itemPos].alteredValue;
      toggleAlert("Changes Saved");
    }
    toggleEditAndIcons(
      thisNode.parentElement.nextElementSibling.nextElementSibling.firstElementChild,
      itemPos
    );
  }
  if (window.event.key === "Escape") {
    window.event.preventDefault();
    thisNode.innerText = todos[itemPos].valueBeforeEdit;
    toggleEditAndIcons(
      thisNode.nextElementSibling.nextElementSibling.lastElementChild,
      itemPos
    );
  }
  localStorage.setItem("korteHobe", JSON.stringify(todos));
};

// Show/Hide alert from top on adding/editing/deleting of items
const toggleAlert = label => {
  document.querySelector(".alert").innerText = label;
  document.querySelector(".alert").style.top = "35px";
  document.querySelector(".backdrop").style.visibility = "visible";
  setTimeout(() => {
    document.querySelector(".alert").style.top = "-25%";
    document.querySelector(".backdrop").style.visibility = "hidden";
  }, 2000);
};

// Toggle between done/not-done todos of items and visual appearance
const toggleDone = thisNode => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  if (todos[itemPos].done) {
    thisNode.setAttribute("class", "toggle fa-regular fa-circle clickable");
    thisNode.setAttribute("title", "Click to mark as 'Done'");
    thisNode.parentElement.parentElement.setAttribute(
      "status",
      `${todos[itemPos].done ? "Not-done" : "Done"}`
    );
    thisNode.parentElement.nextElementSibling.querySelector(".item-value").classList.remove("done");
    thisNode.parentElement.nextElementSibling.querySelector(".item-datetimestamp").classList.remove("done");
  } else {
    thisNode.setAttribute(
      "class",
      "toggle checked fa-solid fa-circle-check clickable"
    );
    thisNode.setAttribute("title", "Click to mark as 'Not Done'");
    thisNode.parentElement.parentElement.setAttribute(
      "status",
      `${todos[itemPos].done ? "Not-done" : "Done"}`
    );
    thisNode.parentElement.nextElementSibling.querySelector(".item-value").classList.add("done");
    thisNode.parentElement.nextElementSibling.querySelector(".item-datetimestamp").classList.add("done");
  }
  todos[itemPos].done = !todos[itemPos].done;
  localStorage.setItem("korteHobe", JSON.stringify(todos));

  // if 'Done' category is active, show 'done' items;
  if (document.getElementById("filter-done").classList.contains("active")) {
    filterDone(true);
  }
  // if 'Not Done Yet' category is active, show 'not-done' items;
  if (document.getElementById("filter-not-done").classList.contains("active")) {
    filterNotDone(true);
  }

  checkAllItemStatus();
};

// Toggle between edit/normal mode and action icons
const toggleEditAndIcons = (thisNode, itemPos) => {
  if (todos[itemPos].editModeOn) {
    thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "false");
    thisNode.parentElement.parentElement
      .querySelector(".item-value").classList.remove("editable");
  } else {
    thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "true");
    thisNode.parentElement.parentElement.querySelector(".item-value").focus();
    thisNode.parentElement.parentElement.querySelector(".item-value").classList.add("editable");
  }
  thisNode.parentElement.style.display = "none";
  if (thisNode.parentElement.classList.contains("set-1")) {
    thisNode.parentElement.nextElementSibling.style.display = "flex";
  }
  if (thisNode.parentElement.classList.contains("set-2")) {
    thisNode.parentElement.previousElementSibling.style.display = "flex";
  }
  todos[itemPos].editModeOn = !todos[itemPos].editModeOn;
};

// Filtering functions(3)

const filterAll = () => {
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].style.display = "flex";
  }
};

const filterDone = allOrDone => {
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].getAttribute("status") === "Done") {
      allItems[i].style.display = `${allOrDone ? "flex" : "none"}`;
    } else {
      allItems[i].style.display = "none";
    }
  }
};

const filterNotDone = allOrNotdone => {
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].getAttribute("status") === "Not-done") {
      allItems[i].style.display = `${allOrNotdone ? "flex" : "none"}`;
    } else {
      allItems[i].style.display = "none";
    }
  }
};

// Toggle show/hide of more options
const moreOptListHeight = document.getElementById("more-opt-list").clientHeight;
const openMoreOptList = () => {
  document.getElementById("more-btn").classList.add("open");
  document.querySelector("#more-btn i").setAttribute("class", "fa-solid fa-xmark close-more");
  document.getElementById("more-opt").style.height = `${moreOptListHeight}px`;
}
const closeMoreOptList = () => {
  document.getElementById("more-btn").classList.remove("open");
  document.querySelector("#more-btn i").setAttribute("class", "fa-solid fa-ellipsis");
  document.getElementById("more-opt").style.height = "0px";
}
const toggleMoreOpt = thisNode => {
  if (thisNode.querySelector("i").classList.contains("close-more")) {
    closeMoreOptList();
  } else {
    openMoreOptList()
  }
};

// 'More options' click events (3)

const markAllDone = thisNode => {
  todos = todos.map(item => ({ ...item, done: true }));
  localStorage.setItem("korteHobe", JSON.stringify(todos));
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].setAttribute("status", "Done");
    allItems[i].querySelector("span:first-child i").setAttribute(
      "class",
      "toggle checked fa-solid fa-circle-check clickable"
    );
    allItems[i].querySelector("div.item-value").classList.add("done");
    allItems[i].querySelector("div.item-datetimestamp").classList.add("done");
  }

  // When All/Done category is active, show 'done' items, else hide
  if (
    document.getElementById("filter-all").classList.contains("active") ||
    document.getElementById("filter-done").classList.contains("active")
  ) {
    filterDone(true);
  } else filterDone();

  // disabling the mark-all-done button
  thisNode.setAttribute("class", "disabled");
  thisNode.removeAttribute("onclick");
  thisNode.nextElementSibling.setAttribute("class", "clickable");
  thisNode.nextElementSibling.setAttribute("onclick", "markAllNotDone(this)");
  closeMoreOptList();
};

const markAllNotDone = thisNode => {
  todos = todos.map(item => ({ ...item, done: false }));
  localStorage.setItem("korteHobe", JSON.stringify(todos));
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].setAttribute("status", "Not-done");
    allItems[i].querySelector("span:first-child i").setAttribute("class", "toggle fa-regular fa-circle clickable");
    allItems[i].querySelector("div.item-value").classList.remove("done");
    allItems[i].querySelector("div.item-datetimestamp").classList.remove("done");
  }

  // When All/Not Done Yet category is active, show 'not-done' items, else hide
  if (
    document.getElementById("filter-all").classList.contains("active") ||
    document.getElementById("filter-not-done").classList.contains("active")
  ) {
    filterNotDone(true);
  } else filterNotDone();

  // disabling the mark-all-done button
  thisNode.setAttribute("class", "disabled");
  thisNode.removeAttribute("onclick");
  thisNode.previousElementSibling.setAttribute("class", "clickable");
  thisNode.previousElementSibling.setAttribute("onclick", "markAllDone(this)");
  closeMoreOptList();
};

const deleteAll = () => {
  todos = [];
  localStorage.clear();
  itemCount = 0;
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].remove();
  }
  document.querySelector(".todo-items").style.marginBottom = "0";
  document.getElementById("filter-action-row").style.display = "none";
  closeMoreOptList();
  document.querySelector("#more-opt-list li:first-child").setAttribute("class", "clickable");
  document.querySelector("#more-opt-list li:first-child").setAttribute("onclick", "markAllDone()");
  document.querySelector("#more-opt-list li:nth-child(2)").setAttribute("class", "disabled");
  document.querySelector("#more-opt-list li:nth-child(2)").removeAttribute("onclick");
};
