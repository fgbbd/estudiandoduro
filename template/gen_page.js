const { create } = require('domain');
const fs = require('fs');

// Leer la lista de juegos
const games = JSON.parse(fs.readFileSync('games.json', 'utf-8'));
const webs = JSON.parse(fs.readFileSync('webs.json', 'utf-8'));

// Ordenar los juegos alfabéticamente
games.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

// Leer la plantilla de index
const indexTemplate = fs.readFileSync('index.template.html', 'utf-8');
// Leer la plantilla de página individual
const gameTemplate = fs.readFileSync('game.template.html', 'utf-8');

const webTemplate = fs.readFileSync('web.template.html', 'utf-8');

let gameListHtml = '';
let gameNames = '';
let websIndexHtml = '';

games.forEach(game => {
    const thumbPath = `/assets/img/${game.dir}.webp`;
    const gameLink = `/game/${game.dir}`; // Ahora generamos archivos individuales

    gameNames += `${game.name}, `

    // Generar lista de juegos para el index
    gameListHtml += `
        <a href="${gameLink}" class="game-item" id="${game.dir}">
            <img src="${thumbPath}" alt="Imagen miniatura del juego" class="thumb">
            <div class="game-header">
                <p>${game.name}</p>
            </div>
        </a>`;

    create_game(game);
});

setWebs()

const finalIndexHtml = indexTemplate
    .replace('<!-- GAMES_LIST -->', gameListHtml)
    .replace('[JUEGOS]', gameNames)
    .replace('<!-- WEBS_LIST -->', websIndexHtml);

fs.writeFileSync('../index.html', finalIndexHtml);
console.log('✅ index.html generado con éxito.');

function create_game(game) {
    let gameHtml = gameTemplate
        .replace('<!-- GAME_TITLE -->', game.name)
        .replace('replace_description', `Juega ${game.name} gratis desbloqueado en estudiandoduro. Juega gratis a este y muchos más juegos gratis y sin anuncios. `)
        .replace('replace_keywords', `${game.name}, gratis, desbloqueado, juego, estudiandoduro`)

    switch (game.type) {
        case 1:
            gameHtml = gameHtml
                .replace('<!-- GAME_IFRAME -->',
                    `<iframe src="/content/game/${game.dir}/" width="100%" height="600px" frameborder="0" scrolling="no"></iframe>`);
            break;

        case 2:
            gameHtml = gameHtml
                .replace('<!-- GAME_IFRAME -->',
                    `<iframe src="${game.url}" width="100%" height="600px" frameborder="0" scrolling="no"></iframe>`);
            break;
    }

    fs.writeFileSync(`../game/${game.dir}.html`, gameHtml);
    console.log(`✅ Generado: ${game.dir}.html (${game.type})`);
}

function setWebs() {
    webs.forEach(web => {
        websIndexHtml += `
            <a href="/web/${web.dir}" class="opcion">${web.name}</a>`

        let webHtml = webTemplate
            .replace('<!-- GAME_TITLE -->', web.name)
            .replace('[GAME_LINK]', web.url)
            .replace('<!-- WEB_IFRAME -->',
                `<iframe src="${web.url}" width="100%" height="600px" frameborder="0"></iframe>`)

        fs.writeFileSync(`../web/${web.dir}.html`, webHtml);
        console.log(`✅ Generado: ${web.dir}.html`);
    })
}