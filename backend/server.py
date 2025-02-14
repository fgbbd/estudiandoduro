import json
import os

from flask import Flask, redirect

app = Flask(__name__)
PORT = int(os.environ.get("PORT", 10000))

@app.route('/')
def home():
    return redirect('https://estudiando-duro.netlify.app/')

# Leer el archivo JSON con las URLs de los juegos
with open('../frontend/games.json', 'r', encoding='utf-8') as file:
    games_data = json.load(file)

# Obtener la URL desde el nombre del directorio
def get_game_url_from_dir(game_dir):
    game = next((g for g in games_data if g['dir'] == game_dir), None)
    return game['url'] if game else None

# Ruta principal de proxy
@app.route('/proxy/<game_id>')
def proxy(game_id):
    game_url = get_game_url_from_dir(game_id)
    if game_url:
        return redirect(game_url)
    return 'Not Found', 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
