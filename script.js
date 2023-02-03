/* JS for meteor rain effect */
const meteor = _ => {
  let amount;
  window.innerWidth <= 450 ? (amount = 20) : (amount = 100)
  let rainBg = document.getElementById("rain-bg");
  let count = 0;

  while (count < amount) {
    let drop = document.createElement("i");
    drop.setAttribute("class", "meteor");
    let width = Math.random() * 5;
    let height = Math.random() * 100;
    let posX = Math.floor(Math.random() * (window.innerWidth + 120));
    let delay = Math.random() * -20;
    let duration = Math.random() * 5;

    drop.style.width = `${0.1 + width}px`;
    drop.style.height = `${0.1 + height}px`;
    drop.style.left = `${posX}px`;
    drop.style.animationDelay = `${delay}s`;
    drop.style.animationDuration = `${1 + duration}s`;

    rainBg.appendChild(drop);
    count++;
  }
};
meteor();
window.addEventListener('resize', meteor)

/* JS for To-Do */

// Filter buttons for later use
const filterAllBtn = document.getElementById("filter-all");
const filterDoneBtn = document.getElementById("filter-done");
const filterNotDoneBtn = document.getElementById("filter-not-done");

document.getElementById("day-date").innerHTML = `
  <i class="bi bi-calendar3 header"></i> ${createDayDate()}
`;
setInterval(() => {
  document.getElementById("time-now").innerHTML = `
    <i class="bi bi-hourglass-split header"></i>
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
};

showAlreadyThere();

// Add new item to the list
const handleSubmit = event => {
  event.preventDefault();
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
    filterAllBtn.classList.add("active");
    filterDoneBtn.classList.remove("active");
    filterNotDoneBtn.classList.remove("active");
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
    document.getElementById("todo").blur();
  } else {
    toggleAlert(
      `<i class='bi bi-exclamation-octagon'></i> Empty inputs not allowed`
    );
  }
};

// Close more-opt-list on click outside more-opt button
document.addEventListener("click", e => {
  if (e.target.closest("#more-btn, #more-opt-list")) {
    return;
  }
  closeMoreOptList();
});

document.addEventListener("click", e => {
  const miniSearch = document.querySelector(".search-mini");
  if (
    e.target.closest(".search-mini") &&
    miniSearch.classList.contains("expanded")
  )
    return;
  miniSearch.classList.remove("expanded");
  // document.querySelector('#search-mini').value = ''
  // document.querySelector('#search').value = ''
  document.querySelector(".filter-btn-group").style.display = "initial";
  miniSearch.querySelector("input").value
    ? miniSearch.classList.add("dirty")
    : miniSearch.classList.remove("dirty");
});

// Filter buttons click events
let searchStr;
const handleFilterAll = () => {
  filterAllBtn.classList.add("active");
  filterDoneBtn.classList.remove("active");
  filterNotDoneBtn.classList.remove("active");
  filterAll();
  searchItem();
};
const handleFilterDone = () => {
  filterAllBtn.classList.remove("active");
  filterDoneBtn.classList.add("active");
  filterNotDoneBtn.classList.remove("active");
  filterDone();
  searchItem();
};
const handleFilterNotDone = () => {
  filterAllBtn.classList.remove("active");
  filterDoneBtn.classList.remove("active");
  filterNotDoneBtn.classList.add("active");
  filterNotDone();
  searchItem();
};

// Search
function searchItem(thisNode) {
  thisNode && (document.getElementById("search").value = thisNode.value);
  searchStr = document.getElementById("search").value;

  let allTodoNodes;
  if (filterAllBtn.classList.contains("active"))
    allTodoNodes = document.querySelectorAll("[status]");
  if (filterDoneBtn.classList.contains("active"))
    allTodoNodes = document.querySelectorAll("[status=Done]");
  if (filterNotDoneBtn.classList.contains("active"))
    allTodoNodes = document.querySelectorAll("[status=Not-done]");

  if (searchStr !== "") {
    let noMatchCount = 0;
    for (let i = 0; i < allTodoNodes.length; i++) {
      if (
        allTodoNodes[i]
          .querySelector(".item-value")
          .innerText.toLowerCase()
          .includes(searchStr)
      ) {
        document.getElementById("no-match-found")?.remove();
        allTodoNodes[i].style.display = "flex";
      } else {
        ++noMatchCount;
        allTodoNodes[i].style.display = "none";
      }
    }

    if (noMatchCount === allTodoNodes.length - 1) {
      document
        .querySelector(`ul.todo-items li[style="display: flex;"]`)
        .classList.add("lone-visible");
    } else {
      document.querySelector(".lone-visible")?.classList.remove("lone-visible");
    }

    const noMatchResult = document.createElement("li");
    noMatchResult.setAttribute("id", "no-match-found");
    noMatchResult.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill"></i> No such items found!
    `;
    if (noMatchCount === allTodoNodes.length) {
      document.getElementById("no-match-found") ??
        document.querySelector("ul.todo-items").appendChild(noMatchResult);
    }
  } else {
    for (let i = 0; i < allTodoNodes.length; i++) {
      allTodoNodes[i].style.display = "flex";
      document.getElementById("no-match-found")?.remove();
    }
  }
}

// Dynamic year for footer
document.getElementById("this-year").innerText = new Date().getFullYear();
