document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("buscador");
    const gamesList = document.getElementById("games-list");
    const nomatch = document.getElementById("no-match");
    const suggestLink = document.getElementById("suggest-link");
    const footer = document.getElementById("footer")
    const clearIcon = document.getElementById("clear-icon");

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    let games = []; // Aquí guardaremos los juegos cargados

    // Cargar el JSON con fetch
    fetch("template/games.json")
        .then(response => response.json())
        .then(data => {
            games = data;
            reorderGamesByFavorites();
        })
        .catch(error => console.error("Error al cargar los juegos:", error));

    const showAllGames = () => {
        Array.from(gamesList.children).forEach(gameElement => {
            gameElement.style.display = "block";  // Mostrar todos los juegos
        });
    };

    const reorderGamesByFavorites = () => {
        // Obtener todos los elementos de juego
        const gameElements = Array.from(gamesList.children);

        // Separar los juegos en favoritos y no favoritos
        const favoriteGames = gameElements.filter(game => {
            return favorites.includes(game.id);
        });
        console.log(favoriteGames)
        const nonFavoriteGames = gameElements.filter(game => {
            return !favorites.includes(game.id);
        });
        console.log(nonFavoriteGames)
        // Limpiar la lista actual
        gamesList.innerHTML = '';

        // Añadir primero los favoritos con la clase especial
        favoriteGames.forEach(game => {
            game.classList.add('favorites');
            gamesList.appendChild(game);
        });

        // Añadir el resto de juegos
        nonFavoriteGames.forEach(game => {
            gamesList.appendChild(game);
        });
    };

    // Evento para filtrar juegos mientras se escribe
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const matchingDirs = games
        .filter(game => {
            return game.name && game.name.toLowerCase().trim().includes(query); // Verificar si game.name existe
        })
        .map(game => game.dir); // Obtener solo los 'dir' de los juegos coincidentes

        let foundMatch = false;

        // Mostrar u ocultar elementos en games-list según la búsqueda
        Array.from(gamesList.children).forEach(gameElement => {
            const isMatching = matchingDirs.includes(gameElement.id); // Verifica si hay coincidencia
            gameElement.style.display = isMatching ? "block" : "none";
            if (isMatching) {
                foundMatch = true; // Si hay un juego coincidente, cambiamos `foundMatch` a true
            }
        });

        // Mostrar o esconder el mensaje de "No hay juegos"
        if (!foundMatch) {
            nomatch.style.display = "block";
            // Actualizar el enlace con el valor del campo de búsqueda
            suggestLink.href = `https://tally.so/r/3yoBvW?name=${encodeURIComponent(query)}`;
            footer.style.display = "none";
        } else {
            nomatch.style.display = "none";
            footer.style.display = "flex"
        }
    });

    // Limpiar el input al hacer clic en la cruz
    clearIcon.addEventListener("click", () => {
        searchInput.value = "";
        showAllGames();
        footer.style.display = "flex";
        nomatch.style.display = "none"
    });

});
