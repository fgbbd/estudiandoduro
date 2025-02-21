// Fullscreen
document.addEventListener("DOMContentLoaded", () => {
    const fullscreenButton = document.getElementById("fullscreen");

    fullscreenButton.addEventListener("click", () => {
        const gameContainer = document.getElementById("game-container");

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
});

// Redirect to proxy
let iframe = document.getElementById("gameFrame");
let isLoaded = false;

// Detectar cuando carga el iframe
iframe.onload = () => {
    isLoaded = true;
};

// Extraer el nombre del juego desde la URL del navegador
function getGameNameFromUrl() {
    let pathParts = window.location.pathname.split("/"); 
    return pathParts[pathParts.length - 1]; // Última parte de la URL
}

// Si no carga en 5 segundos, redirigir al proxy con el nombre del juego
setTimeout(() => {
    if (!isLoaded) {
        let gameName = getGameNameFromUrl();
        window.location.href = `https://estudiando-duro-backend.onrender.com/proxy/${gameName}`;
    }
}, 5000);