document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    const newElem = document.createElement("article");
    newElem.innerHTML = `
    ${todoVal}
    <span class="action-icons clickable">
      <i class="fa-regular fa-pen-to-square" title="Edit"></i>
      <i class="fa-solid fa-trash-can" title="Delete"></i>
    </span>
    `;
    document.querySelector("section.todo-items").appendChild(newElem);
    document.getElementById("todo").value = "";
  } else {
    alert("Empty inputs not allowed");
  }
});
