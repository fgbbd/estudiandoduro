document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        window.open("https://es.wikipedia.org/wiki/Especial:Aleatoria", "_blank");
    }
});