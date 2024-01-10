const searchInput = document.getElementById("searchInput");
const autocompleteList = document.querySelector(".autocompleteList");
const repoList = document.querySelector(".repoList");

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

const searchRepositoriesDebounced = debounce(searchRepositories, 500);

searchInput.addEventListener("input", function () {
  const inputValue = searchInput.value.trim();

  if (inputValue === "") {
    autocompleteList.innerHTML = "";
    return;
  }
  searchRepositoriesDebounced(inputValue);
});

async function searchRepositories(query) {
  const apiUrl = `https://api.github.com/search/repositories?q=${query}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  displayAutocomplete(data.items);
}

function displayAutocomplete(repositories) {
  autocompleteList.innerHTML = "";

  repositories.slice(0, 5).forEach((element) => {
    const listItem = createElement("li", "autocompleteList__item");

    listItem.textContent = element.full_name;
    listItem.addEventListener("click", () => addRepository(element));
    autocompleteList.append(listItem);
  });
}

function addRepository(repo) {
  const listItem = createElement("li", "repoList__item");
  const textContainer = createElement("div", "text-container");

  textContainer.innerHTML = `
  <p>Name: ${repo.name}</p>
  <p>Owner: ${repo.owner.login}</p>
  <p>Stars: ${repo.stargazers_count}</p>
  `;
  const deleteButton = createElement("button", "btn");
  deleteButton.textContent = "✖";
  deleteButton.addEventListener("click", () => removeRepository(listItem));

  repoList.append(listItem);
  listItem.append(textContainer, deleteButton);

  searchInput.value = "";
  autocompleteList.innerHTML = "";
}

function createElement(nameEl, className) {
  const el = document.createElement(nameEl);
  el.classList.add(className);

  return el;
}

function removeRepository(listItem) {
  repoList.removeChild(listItem);
}
