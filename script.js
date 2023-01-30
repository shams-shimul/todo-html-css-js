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
window.addEventListener('resize', meteor)
/* JS for meteor rain effect */

/* JS for To-Do */

document.getElementById("day-date").innerHTML = `
  <i class="bi bi-calendar3"></i> ${createDayDate()}
`;
setInterval(() => {
  document.getElementById("time-now").innerHTML = `
    <i class="bi bi-hourglass-split"></i>
    ${new Date().toLocaleTimeString().substring(0, 8).trim()}
    <span>${new Date().toLocaleTimeString().substring(8).trim()}</span>
  `;
}, 1000);

let itemCount = 0;
let todos = [];
const alreadyThere = JSON.parse(localStorage.getItem("korteHobe"));

const showAlreadyThere = () => {
  if (alreadyThere != null && alreadyThere.length > 0) {
    todos = alreadyThere;
    document.getElementById("filter-action-row").style.display = "flex";
    checkAllItemStatus();
    todos.map((item, index) => {
      const { valueBeforeEdit, done, createdDate, createdTime } = item;
      createAndInsertLi(index, valueBeforeEdit, done, createdDate, createdTime);
    });
  }
}

showAlreadyThere();

document.getElementById("todo-input-form").addEventListener("submit", e => {
  e.preventDefault();
  const todoVal = document.getElementById("todo").value;
  if (todoVal) {
    if (todos.length === 0) {
      document.getElementById("filter-action-row").style.display = "flex";
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
document.addEventListener("click", e => {
  if (e.target.closest('#more-btn, #more-opt-list')) {
    return
  }
  closeMoreOptList()
})

// Dynamic year for footer
document.getElementById("this-year").innerText = new Date().getFullYear();

// Search
const searchItem = (input) => {
  const searchStr = input.value.toLowerCase();
  const searchResult = todos.filter(todo => todo.valueBeforeEdit.toLowerCase().includes(searchStr))
  if (searchResult.length === 0) {
    document.querySelector("ul.todo-items").innerHTML = `
      <li id="search-result">
        <i class="fa-solid fa-circle-exclamation"></i> No such items found!
      </li>
    `;
  } else {
    if (document.getElementById("search-result")) {
      document.getElementById("search-result").remove();
    }
    document.querySelector('.todo-items').innerHTML = ''
    searchResult.forEach((item, index) => {
      const { valueBeforeEdit, done, createdDate, createdTime } = item;
      createAndInsertLi(index, valueBeforeEdit, done, createdDate, createdTime);
    });
  }
}