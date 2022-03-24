document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    const newElem = document.createElement("article");
    newElem.innerHTML = `
    <span class="item-value">${todoVal}</span>
    <span class="action-icons set-1">
      <i class="fa-regular fa-pen-to-square clickable" title="Edit" onclick="editItem(this)"></i>
      <i class="fa-solid fa-trash-can clickable" title="Delete" onclick="deleteItem(this)"></i>
    </span>
    <span class="action-icons set-2">
      <i class="fa-solid fa-check clickable" title="Save" onclick="saveEditItem(this)"></i>
    </span>
    `;
    document.querySelector("section.todo-items").appendChild(newElem);
    document.getElementById("todo").value = "";
  } else {
    alert("Empty inputs not allowed");
  }
});

const editItem = (thisNode) => {
  thisNode.parentElement.parentElement.querySelector(".item-value").setAttribute("contentEditable", "true")
  thisNode.parentElement.parentElement.querySelector(".item-value").focus();
  thisNode.parentElement.parentElement.querySelector(".item-value").classList.add("editable")
  thisNode.parentElement.parentElement.querySelector(".item-value.editable").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.removeAttribute("contentEditable");
      e.target.classList.remove("editable");
      e.target.nextElementSibling.style.display = "initial"
      e.target.nextElementSibling.nextElementSibling.style.display = "none"
    }
  })
  thisNode.parentElement.style.display = "none";
  thisNode.parentElement.nextElementSibling.style.display = "block";
  thisNode.parentElement.nextElementSibling.addEventListener("hover", () => {
    alert()
  });
}

const deleteItem = (thisNode) => {
  thisNode.parentElement.parentElement.remove();
}

const saveEditItem = (thisNode) => {
  thisNode.parentElement.parentElement.querySelector(".item-value").removeAttribute("contentEditable");
  thisNode.parentElement.parentElement.querySelector(".item-value").classList.remove("editable");
  thisNode.parentElement.style.display = "none";
  thisNode.parentElement.previousElementSibling.style.display = "block";
}
