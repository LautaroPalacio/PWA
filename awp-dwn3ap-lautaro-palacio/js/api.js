const storedFavorites = localStorage.getItem('favoritos');
const favoritos = storedFavorites ? JSON.parse(storedFavorites) : [];
const favoritesCount = document.getElementById('favoritesCount');

async function fetchUsers() {
    let data = [];
    
    const storedData = localStorage.getItem('userData');
    if (storedData) {
        data = JSON.parse(storedData);
        displayUsers(data);
    }

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        data = await response.json();

        localStorage.setItem('userData', JSON.stringify(data));

        displayUsers(data);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}

function displayUsers(data) {
    const userList = document.getElementById('user-list');

    userList.innerHTML = '';

    data.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'col-md-4 mb-4';

        userCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${user.name}</h5>
                    <p class="card-text">${user.email}</p>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userDetailsModal" data-user-name="${user.name}" data-user-email="${user.email}">
                        Ver Detalles
                    </button>
                    <i class="bi bi-suit-heart-fill" onclick="addToFavorites('${user.name}', '${user.email}')"></i>
                </div>
            </div>
        `;

        userList.appendChild(userCard);
    });
}


function addToFavorites(userName, userEmail) {
    const isAlreadyAdded = favoritos.some(user => user.name === userName);
    if (!isAlreadyAdded) {
        const user = { name: userName, email: userEmail };
        favoritos.push(user);

        localStorage.setItem('favoritos', JSON.stringify(favoritos));

        alert(`Usuario "${userName}" ha sido agregado a favoritos.`);
        updateFavoritesList();
        updateFavoritesCount();
    } else {
        alert(`Usuario "${userName}" ya está en la lista de favoritos.`);
    }
}

function removeFromFavorites(userName) {
    const index = favoritos.findIndex(user => user.name === userName);

    if (index !== -1) {
        favoritos.splice(index, 1);

        localStorage.setItem('favoritos', JSON.stringify(favoritos));

        updateFavoritesList();
        updateFavoritesCount();
    }
}

function showFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favoritos.forEach(user => {
        const listItem = document.createElement('li');
        listItem.className = 'mt-2';
        listItem.innerHTML = `
            Nombre: ${user.name}, Email: ${user.email}
            <button type="button" class="btn btn-danger btn-sm float-right" onclick="removeFromFavorites('${user.name}')">
                Eliminar
            </button>`;
        favoritesList.appendChild(listItem);
    });
}

function updateFavoritesList() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favoritos.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            Nombre: ${user.name}, Email: ${user.email} <br>
            <button type="button" class="btn btn-danger btn-sm float-right" onclick="removeFromFavorites('${user.name}')">
                Eliminar
            </button>`;
        favoritesList.appendChild(listItem);
    });
}

function updateFavoritesCount() {
    favoritesCount.textContent = favoritos.length.toString();
}
window.onload = () => {
    updateFavoritesList();
    updateFavoritesCount();
    fetchUsers();
};