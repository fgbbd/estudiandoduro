document.addEventListener("DOMContentLoaded", () => {
    const fullscreenButton = document.getElementById("fullscreen");
    const filename = window.location.pathname.split('/').pop();
    let favorito;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteButton = document.getElementById("favorite");
    const favoriteImg = favoriteButton.querySelector('img') || favoriteButton;

    // Set image fo favorite depending on state
    if (favorites.includes(filename)) {
        favorito = true;
        favoriteImg.src = "/assets/icons/favorite_on.svg";
    }
    else {
        favorito = false;
        favoriteImg.src = "/assets/icons/favorite.svg";
    }

    // Fullscreen
    fullscreenButton.addEventListener("click", () => {
        const gameContainer = document.getElementById('game');

        if (!document.fullscreenElement) {
            if (gameContainer.requestFullscreen) {
                gameContainer.requestFullscreen();
            } else if (gameContainer.mozRequestFullScreen) { // Firefox
                gameContainer.mozRequestFullScreen();
            } else if (gameContainer.webkitRequestFullscreen) { // Chrome, Safari y Opera
                gameContainer.webkitRequestFullscreen();
            } else if (gameContainer.msRequestFullscreen) { // IE/Edge
                gameContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });

    // Make the favorite button work
    favoriteButton.addEventListener("click", () => {
        if (!favorito) {
            favoriteImg.src = "/assets/icons/favorite_on.svg";
            favorites.push(filename);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            favorito = true; // Toggle the state to true
        }
        else {
            favoriteImg.src = "/assets/icons/favorite.svg"; // Set image to off state
            favorites = favorites.filter(item => item !== filename);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            favorito = false; // Toggle the state to false
        }
    });

});
