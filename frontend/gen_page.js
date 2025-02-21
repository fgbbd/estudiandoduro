const fs = require('fs');

// Leer la lista de juegos
const games = JSON.parse(fs.readFileSync('games.json', 'utf-8'));

// Leer la plantilla de index
const indexTemplate = fs.readFileSync('index.template.html', 'utf-8');
// Leer la plantilla de página individual
const gameTemplate = fs.readFileSync('game.template.html', 'utf-8');

let gameListHtml = '';

games.forEach(game => {
    const thumbPath = `assets/img/${game.dir}.webp`;
    const gameLink = `game/${game.dir}.html`; // Ahora generamos archivos individuales

    // Generar lista de juegos para el index
    gameListHtml += `
        <div class="game-item">
            <a href="${gameLink}">
                <img src="${thumbPath}" alt="${game.name}">
                <h3>${game.name}</h3>
            </a>
        </div>
    `;

    // Generar cada página de juego usando la plantilla
    let gameHtml = gameTemplate
        .replace('<!-- GAME_TITLE -->', game.name)
        .replace('replace_description', `Juega ${game.name} gratis desbloqueado. `)
        .replace('replace_keywords', `${game.name}, gratis, desbloqueado, juego, estudia duro`)
        .replace('<!-- GAME_IFRAME -->', `<iframe src=${game.url} width="100%" height="600px" frameborder="0" scrolling="no"></iframe>`);

    fs.writeFileSync(`game/${game.dir}.html`, gameHtml);
    console.log(`✅ Generado: ${game.dir}.html`);
});

// Generar el index con la lista de juegos
const finalIndexHtml = indexTemplate.replace('<!-- GAMES_LIST -->', gameListHtml);
fs.writeFileSync('index.html', finalIndexHtml);
console.log('✅ index.html generado con éxito.');
