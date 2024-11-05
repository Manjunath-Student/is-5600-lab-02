document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  generateUserList(userData, stocksData);

  // Registering the event listener on the save button.
  const saveButton = document.querySelector('#saveButton');
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();

    const id = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == id);

    if (userIndex !== -1) {
      const updatedUser = {
        ...userData[userIndex].user,
        firstname: document.querySelector('#firstname').value,
        lastname: document.querySelector('#lastname').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value,
      };
      userData[userIndex] = { ...userData[userIndex], user: updatedUser };
      generateUserList(userData, stocksData);
    }
  });

  // Registering the event listener on the delete button.
  const deleteButton = document.querySelector('#deleteButton');
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();

    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);

    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
      generateUserList(userData, stocksData);
    }
  });
});

// Function for generate the list of users.
function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  userList.innerHTML = '';

  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

// Function for handleing the user list clicks.
function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  const user = users.find(user => user.id == userId);

  if (user) {
    populateForm(user);
    renderPortfolio(user, stocks);
  }
}

// Function for populating the form with user data.
function populateForm(data) {
  const { user, id } = data;
  const formElements = ['#userID', '#firstname', '#lastname', '#address', '#city', '#email'];
  const values = [id, user.firstname, user.lastname, user.address, user.city, user.email];

  formElements.forEach((selector, index) => {
    document.querySelector(selector).value = values[index];
  });
}

// Function for rendering the user's portfolio.
function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  const portfolioDetails = document.querySelector('.portfolio-list');
  portfolioDetails.innerHTML = '';

  portfolio.map(({ symbol, owned }) => {
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');

    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);

    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });

  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

// Function for viewing the  stock information.
function viewStock(symbol, stocks) {
  const stockArea = document.querySelector('.stock-form');
  if (stockArea) {
    const stock = stocks.find(s => s.symbol == symbol);
    if (stock) {
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }
}

