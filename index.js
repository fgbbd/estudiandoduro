document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("buscador");
    const gamesList = document.getElementById("games-list");
    const nomatch = document.getElementById("no-match");
    const suggestLink = document.getElementById("suggest-link"); 
    const footer = document.getElementById("footer")
    const clearIcon = document.getElementById("clear-icon");
    const favoriteButton = document.getElementById("favorite");

    let games = []; // Aquí guardaremos los juegos cargados
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Cargar el JSON con fetch
    fetch("template/games.json")
        .then(response => response.json())
        .then(data => {
            games = data;
            games = data.map(game => ({
                ...game,
                favorite: favorites.includes(game.dir) // Inicializar el estado de favorito
            })); // Guardamos los juegos en la variable global y se añade la propiedad favotite
            renderGames();
        })
        .catch(error => console.error("Error al cargar los juegos:", error));

    const showAllGames = () => {
        Array.from(gamesList.children).forEach(gameElement => {
            gameElement.style.display = "block";  // Mostrar todos los juegos

        });
    };

    // Función para actualizar el estado de favorito
    const updateFavorite = (gameDir) => {
        const gameIndex = games.findIndex(game => game.dir === gameDir);
        if (gameIndex !== -1) {
            games[gameIndex].favorite = !games[gameIndex].favorite; // Cambiar el estado de favorito
            if (games[gameIndex].favorite) {
                favorites.push(gameDir);
            } else {
                favorites = favorites.filter(dir => dir !== gameDir);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Guardar en localStorage
            renderGames(); // Volver a renderizar para reflejar el cambio
        }
    };

    // Función para renderizar la lista de juegos
    const renderGames = () => {
        gamesList.innerHTML = ''; // Limpiar la lista actual
        const sortedGames = games.slice().sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0;
        }); // Ordenar por favoritos primero

        sortedGames.forEach(game => {
            const gameElement = createGameElement(game);
            gamesList.appendChild(gameElement);
        });
    };

    // Evento para filtrar juegos mientras se escribe
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const matchingDirs = games
        .sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return 0;
        })

        .filter(game => {
            return game.name && game.name.toLowerCase().trim().includes(query); // Verificar si game.name existe
        })
        .map(game => game.dir); // Obtener solo los 'dir' de los juegos coincidentes

        let foundMatch = matchingDirs.length > 0;

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
        renderGames();
        footer.style.display = "flex";
        nomatch.style.display = "none"
    });

    // Botón de favorito
    favoriteButton.addEventListener("click", () => {
        if (favoriteButton.classList.contains("active")) {
            favoriteButton.classList.remove("active");

        } else {
            favoriteButton.classList.add("active");
        }
    })
});

function unblockedWebs() {
    
}