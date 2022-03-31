const createDayDate = () => {
  const thisDayDate = new Date();
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Firday",
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
document.getElementById("day-date").innerHTML = `
  <span class="material-icons">today</span> ${createDayDate()}
`;
setInterval(() => {
  document.getElementById("time-now").innerHTML = `
    <span class="material-icons">schedule</span>
    ${new Date().toLocaleTimeString().substring(0, 8).trim()}
    <span>${new Date().toLocaleTimeString().substring(8).trim()}</span>
  `;
}, 1000);

let itemCount = 0;
let todos = [];
document.getElementById("todo").focus();
document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    if (todos.length === 0) {
      document.getElementById("filter-action-row").style.display = "flex";
      document.querySelector(".todo-items").style.marginBottom = "16px";
    }
    todos.push({
      valueBeforeEdit: todoVal,
      alteredValue: todoVal,
      done: false,
      createdDate: createDayDate(),
      createdTime: new Date().toLocaleTimeString(),
      editModeOn: false,
    });
    const newElem = document.createElement("li");
    newElem.setAttribute("id", `item-${itemCount}`);
    newElem.setAttribute(
      "status",
      `${todos[itemCount].done ? "Done" : "Not-done"}`
    );
    newElem.innerHTML = `
      <span>
        <i class="${todos[itemCount].done
        ? "fa solid fa-circle-check"
        : "fa-regular fa-circle"
      } clickable" title="Click to mark as ${todos[itemCount].done ? "'Not Done'" : "'Done'"
      }" onclick="toggleDone(this)"></i>
      </span>
      <div class="item-wrap">
        <div class="item-value" onkeydown="actionOnKeydown(this)">${todoVal}</div>
        <div class="item-datetimestamp">Created on ${todos[itemCount].createdDate
      } at ${todos[itemCount].createdTime.substr(0, 8)} ${todos[
        itemCount
      ].createdTime.substr(-2)}</div>
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
    document.getElementById("todo").value = "";
    toggleAlert("Item Added");
    itemCount++;
    // console.log(todos);
  } else {
    alert("Empty inputs not allowed");
  }
});

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
  if (itemCount === 0) {
    document.getElementById("filter-action-row").style.display = "none";
    document.getElementById("more-btn").classList.remove("open");
    document
      .querySelector("#more-btn i")
      .setAttribute("class", "fa-solid fa-ellipsis");
    document.getElementById("more-opt").style.height = "0px";
    document.querySelector(".todo-items").style.marginBottom = "16px";
  }
  todos.splice(itemPos, 1);
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
  const itemPos = thisNode.parentElement.parentElement
    .getAttribute("id")
    .substring(5);
  todos[itemPos].alteredValue =
    thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  if (todos[itemPos].alteredValue !== todos[itemPos].valueBeforeEdit) {
    todos[itemPos].valueBeforeEdit = todos[itemPos].alteredValue;
    toggleAlert("Changes Saved");
  }
  toggleEditAndIcons(thisNode, itemPos);
};

// Cancel edit mode
const cancelEdit = thisNode => {
  const itemPos = thisNode.parentElement.parentElement
    .getAttribute("id")
    .substring(5);
  thisNode.parentElement.parentElement.querySelector(".item-value").innerText =
    todos[itemPos].valueBeforeEdit;
  toggleEditAndIcons(thisNode, itemPos);
};

// Save/cancel on 'Enter/Excape' Keypress on edit mode
const actionOnKeydown = thisNode => {
  console.log(thisNode);
  const itemPos = thisNode.parentElement.parentElement
    .getAttribute("id")
    .substring(5);
  if (window.event.key === "Enter") {
    window.event.preventDefault();
    todos[itemPos].alteredValue = thisNode.innerText;
    if (todos[itemPos].alteredValue !== todos[itemPos].valueBeforeEdit) {
      todos[itemPos].valueBeforeEdit = todos[itemPos].alteredValue;
      toggleAlert("Changes Saved");
    }
    toggleEditAndIcons(
      thisNode.parentElement.nextElementSibling.nextElementSibling
        .firstElementChild,
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
  const itemPos = thisNode.parentElement.parentElement
    .getAttribute("id")
    .substring(5);
  if (todos[itemPos].done) {
    thisNode.setAttribute("class", "fa-regular fa-circle clickable");
    thisNode.setAttribute("title", "Click to mark as 'Done'");
    thisNode.parentElement.parentElement.setAttribute(
      "status",
      `${todos[itemPos].done ? "Not-done" : "Done"}`
    );
    thisNode.parentElement.nextElementSibling
      .querySelector(".item-value")
      .classList.remove("done");
    thisNode.parentElement.nextElementSibling
      .querySelector(".item-datetimestamp")
      .classList.remove("done");
  } else {
    thisNode.setAttribute("class", "fa-solid fa-circle-check clickable");
    thisNode.setAttribute("title", "Click to mark as 'Not Done'");
    thisNode.parentElement.parentElement.setAttribute(
      "status",
      `${todos[itemPos].done ? "Not-done" : "Done"}`
    );
    thisNode.parentElement.nextElementSibling
      .querySelector(".item-value")
      .classList.add("done");
    thisNode.parentElement.nextElementSibling
      .querySelector(".item-datetimestamp")
      .classList.add("done");
  }
  todos[itemPos].done = !todos[itemPos].done;

  // if 'Done' category is active, show 'done' items;
  if (document.getElementById("filter-done").classList.contains("active")) {
    filterDone(true);
  }
  // if 'Not Done Yet' category is active, show 'not-done' items;
  if (document.getElementById("filter-not-done").classList.contains("active")) {
    filterNotDone(true);
  }

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
};

// Toggle between edit/normal mode and action icons
const toggleEditAndIcons = (thisNode, itemPos) => {
  if (todos[itemPos].editModeOn) {
    thisNode.parentElement.parentElement
      .querySelector(".item-value")
      .setAttribute("contentEditable", "false");
    thisNode.parentElement.parentElement
      .querySelector(".item-value")
      .classList.remove("editable");
  } else {
    thisNode.parentElement.parentElement
      .querySelector(".item-value")
      .setAttribute("contentEditable", "true");
    thisNode.parentElement.parentElement.querySelector(".item-value").focus();
    thisNode.parentElement.parentElement
      .querySelector(".item-value")
      .classList.add("editable");
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

// Filter buttons click events

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
  filterDone(true);
});

document.getElementById("filter-not-done").addEventListener("click", () => {
  document.getElementById("filter-all").classList.remove("active");
  document.getElementById("filter-done").classList.remove("active");
  document.getElementById("filter-not-done").classList.add("active");
  document.getElementById("filter-not-done").classList.add("active");
  filterNotDone(true);
});

// Toggle show/hide of more options
const moreOptListHeight = document.getElementById("more-opt-list").clientHeight;
const toggleMoreOpt = thisNode => {
  if (thisNode.querySelector("i").classList.contains("close-more")) {
    document.getElementById("more-btn").classList.remove("open");
    thisNode.querySelector("i").setAttribute("class", "fa-solid fa-ellipsis");
    document.getElementById("more-opt").style.height = "0px";
  } else {
    document.getElementById("more-btn").classList.add("open");
    thisNode
      .querySelector("i")
      .setAttribute("class", "fa-solid fa-xmark close-more");
    document.getElementById("more-opt").style.height = `${moreOptListHeight}px`;
  }
};

// More options click events

const markAllDone = thisNode => {
  todos = todos.map(item => ({ ...item, done: true }));
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].setAttribute("status", "Done");
    allItems[i]
      .querySelector("span:first-child i")
      .setAttribute("class", "fa-solid fa-circle-check clickable");
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
};

const markAllNotDone = thisNode => {
  todos = todos.map(item => ({ ...item, done: false }));
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].setAttribute("status", "Not-done");
    allItems[i]
      .querySelector("span:first-child i")
      .setAttribute("class", "fa-regular fa-circle clickable");
    allItems[i].querySelector("div.item-value").classList.remove("done");
    allItems[i]
      .querySelector("div.item-datetimestamp")
      .classList.remove("done");
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
};

const deleteAll = () => {
  todos = [];
  itemCount = 0;
  const allItems = document.querySelectorAll("[status]");
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].remove();
  }
  document.getElementById("filter-action-row").style.display = "none";
  document.getElementById("more-btn").classList.remove("open");
  document
    .querySelector("#more-btn i")
    .setAttribute("class", "fa-solid fa-ellipsis");
  document.getElementById("more-opt").style.height = "0px";
  document.querySelector(".todo-items").style.marginBottom = "0";

  document
    .querySelector("#more-opt-list li:first-child")
    .setAttribute("class", "clickable");
  document
    .querySelector("#more-opt-list li:first-child")
    .setAttribute("onclick", "markAllDone()");
  document
    .querySelector("#more-opt-list li:nth-child(2)")
    .setAttribute("class", "disabled");
  document
    .querySelector("#more-opt-list li:nth-child(2)")
    .removeAttribute("onclick");
};

// Close more-opt-list on click outside more-opt button

// Dynamic year for footer
document.getElementById("this-year").innerText = new Date().getFullYear();
