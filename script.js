let itemCount = 0;
let states = [];

document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    states.push({ valueBeforeEdit: todoVal, alteredValue: todoVal, status: false, editModeOn: false });
    const newElem = document.createElement("article");
    newElem.setAttribute("id", `item-${itemCount}`);
    newElem.innerHTML = `
    <span>
      <i class="${states[itemCount].status ? 'fa solid fa-circle-check' : 'fa-regular fa-circle'} clickable" title="Click to mark as ${states[itemCount].status ? 'undone' : 'done'}" onclick="toggleStatus(this)"></i>
    </span>
    <span class="item-value">${todoVal}</span>
    <span class="action-icons set-1">
      <i class="fa-regular fa-pen-to-square clickable" title="Edit" onclick="editItem(this)"></i>
      <i class="fa-solid fa-trash-can clickable" title="Delete" onclick="deleteItem(this)"></i>
    </span>
    <span class="action-icons set-2">
      <i class="fa-solid fa-check clickable" title="Save" onclick="saveEditItem(this)"></i>
      <i class="fa-solid fa-xmark clickable" title="Save" onclick="cancelEdit(this)"></i>
    </span>
    `;
    document.querySelector("section.todo-items").appendChild(newElem);
    document.getElementById("todo").value = "";
    toggleAlert("Item Added");
    itemCount++;
    // console.log(states);
  } else {
    alert("Empty inputs not allowed");
  }
});

const editItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  states[itemPos].valueBeforeEdit = thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  toggleEditAndIcons(thisNode, itemPos);
}

const deleteItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  states.splice(itemPos, 1);
  thisNode.parentElement.parentElement.remove();
  toggleAlert("Item Deleted");
}

const saveEditItem = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  states[itemPos].alteredValue = thisNode.parentElement.parentElement.querySelector(".item-value").innerText;
  toggleEditAndIcons(thisNode, itemPos);
  states[itemPos].alteredValue !== states[itemPos].valueBeforeEdit && toggleAlert("Changes Saved")
}

const cancelEdit = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  thisNode.parentElement.parentElement.querySelector(".item-value").innerText = states[itemPos].valueBeforeEdit;
  toggleEditAndIcons(thisNode, itemPos);
}

const toggleStatus = (thisNode) => {
  const itemPos = thisNode.parentElement.parentElement.getAttribute("id").substring(5);
  if (states[itemPos].status) {
    thisNode.setAttribute("class", "fa-regular fa-circle clickable");
    thisNode.parentElement.nextElementSibling.style.textDecoration = "none";
    thisNode.parentElement.nextElementSibling.style.color = "initial";
  } else {
    thisNode.setAttribute("class", "fa-solid fa-circle-check clickable");
    thisNode.parentElement.nextElementSibling.style.textDecoration = "line-through";
    thisNode.parentElement.nextElementSibling.style.color = "gray";
  }
  states[itemPos].status = !states[itemPos].status;
}

const toggleEditAndIcons = (thisNode, itemPos) => {
  if (states[itemPos].editModeOn) {
    thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "false");
    thisNode.parentElement.parentElement.querySelector(".item-value").classList.remove("editable");
    thisNode.parentElement.style.display = "none";
    thisNode.parentElement.previousElementSibling.style.display = "flex";
  } else {
    thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "true");
    thisNode.parentElement.parentElement.querySelector(".item-value").focus();
    thisNode.parentElement.parentElement.querySelector(".item-value").classList.add("editable");
    if (thisNode.parentElement.previousElementSibling.classList.contains("action-icons")) {
      thisNode.parentElement.style.display = "none";
      thisNode.parentElement.previousElementSibling.style.display = "flex";
    } else {
      thisNode.parentElement.style.display = "none";
      thisNode.parentElement.nextElementSibling.style.display = "flex";
    }
  }
  states[itemPos].editModeOn = !states[itemPos].editModeOn;
}

const toggleAlert = (label) => {
  document.querySelector(".alert").innerText = label;
  document.querySelector(".alert").style.top = "35px";
  document.querySelector(".backdrop").style.visibility = "visible";
  setTimeout(() => {
    document.querySelector(".alert").style.top = "-25%";
    document.querySelector(".backdrop").style.visibility = "hidden";
  }, 2000);
}