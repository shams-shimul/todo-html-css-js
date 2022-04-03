/* JS for meteor rain effect */
const meteor = _ => {
  let amount = 150;
  let rainBg = document.getElementById("rain-bg");
  let count = 0;

  while (count < amount) {
    let drop = document.createElement("i");
    drop.setAttribute("class", "meteor");
    let size = Math.random() * 5;
    let posX = Math.floor(Math.random() * window.innerWidth);
    let delay = Math.random() * -20;
    let duration = Math.random() * 5;

    drop.style.width = `${0.1 + size}px`;
    drop.style.left = `${posX}px`;
    drop.style.animationDelay = `${delay}s`;
    drop.style.animationDuration = `${1 + duration}s`;

    rainBg.appendChild(drop);
    count++;
  }
};
meteor();
/* JS for meteor rain effect */

/* JS for To-Do */

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
const alreadyThere = JSON.parse(localStorage.getItem("korteHobe"));

if (alreadyThere != null && alreadyThere.length > 0) {
  todos = alreadyThere;
  document.getElementById("filter-action-row").style.display = "flex";
  document.querySelector(".todo-items").style.marginBottom = "16px";
  checkAllItemStatus();
  alreadyThere.map((item, index) => {
    const { valueBeforeEdit, done, createdDate, createdTime } = item;
    createAndInsertLi(index, valueBeforeEdit, done, createdDate, createdTime);
  });
}

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
    localStorage.setItem("korteHobe", JSON.stringify(todos));
    document.getElementById("filter-all").classList.add("active");
    document.getElementById("filter-done").classList.remove("active");
    document.getElementById("filter-not-done").classList.remove("active");
    filterAll();
    createAndInsertLi(
      itemCount,
      todoVal,
      false,
      todos[itemCount].createdDate,
      todos[itemCount].createdTime
    );
    document.getElementById("todo").value = "";
    toggleAlert("Item Added");
    itemCount++;
    // console.log(todos);
  } else {
    alert("Empty inputs not allowed");
  }
});

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

// Close more-opt-list on click outside more-opt button

// Dynamic year for footer
document.getElementById("this-year").innerText = new Date().getFullYear();
