const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('¡Servidor en ejecución!');
});

// Asegurarse de que el servidor escucha en el puerto adecuado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Leer el archivo JSON con las URLs de los juegos
const gamesData = JSON.parse(fs.readFileSync('games.json', 'utf-8'));

// Función para obtener la URL del juego desde el JSON
function getGameUrlFromDir(gameDir) {
    const game = gamesData.find(g => g.dir === gameDir);  // Buscar por 'dir' (id del juego)
    if (game) {
        return game.url;  // Retornar la URL desbloqueada
    } else {
        return null;  // Si no se encuentra el juego, retornar null o una URL predeterminada
    }
}

// Proxy para redirigir la solicitud al juego correcto
app.get('/proxy/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const gameUrl = getGameUrlFromDir(gameId);
    
    if (gameUrl) {
        res.redirect(gameUrl);  // Redirigir al juego con la URL desbloqueada
    } else {
        res.status(404).send("Juego no encontrado");
    }
});