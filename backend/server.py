from flask import Flask, redirect
import json

app = Flask(__name__)
PORT = 8000

@app.route('/')
def home():
    return redirect('https://estudiando-duro.netlify.app/')

# Leer el archivo JSON con las URLs de los juegos
with open('../frontend/games.json', 'r', encoding='utf-8') as file:
    games_data = json.load(file)

def get_game_url_from_dir(game_dir):
    game = next((g for g in games_data if g['dir'] == game_dir), None)
    return game['url'] if game else None

@app.route('/proxy/<game_id>')
def proxy(game_id):
    game_url = get_game_url_from_dir(game_id)
    if game_url:
        return redirect(game_url)
    return 'Not Found', 404

if __name__ == '__main__':
    app.run(port=PORT, debug=True)
