import os
import requests
import json
from urllib.parse import urljoin, urlparse
import re
from bs4 import BeautifulSoup

# Función para descargar un archivo y guardarlo en la estructura relativa
def download_file(url, dir_name, base_url):
    try:
        response = requests.get(url, allow_redirects=False)
        response.raise_for_status()  # Raise an error for bad responses
        
        # Obtener la ruta relativa a partir de la base_url
        parsed_url = urlparse(url)
        # Eliminar la parte del dominio de la URL
        relative_path = os.path.relpath(parsed_url.path, start=base_url)
        
        # Crear la ruta completa dentro de dir_name
        file_path = os.path.join(dir_name, relative_path.lstrip('/'))  # Eliminar '/' inicial si existe

        # Normalizar la ruta para el sistema operativo
        file_path = os.path.normpath(file_path)

        # Crear las carpetas necesarias
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Descargar el archivo y guardarlo
        with open(file_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {file_path}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

# Función para descargar los recursos CSS y los archivos referenciados dentro de él
def download_css_assets(css_url, dir_name, base_url):
    try:
        response = requests.get(css_url, allow_redirects=False)
        response.raise_for_status()
        
        # Guardar el archivo CSS en la ruta relativa correcta
        parsed_url = urlparse(css_url)
        css_file_path = os.path.join(dir_name, os.path.relpath(parsed_url.path, start=base_url))
        os.makedirs(os.path.dirname(css_file_path), exist_ok=True)
        with open(css_file_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded CSS: {css_file_path}")
        
        # Buscar todas las URL dentro del archivo CSS
        urls = re.findall(r'url\((["\']?)(.*?)\1\)', response.text)
        for _, asset_url in urls:
            asset_url = urljoin(css_url, asset_url.strip(' "\''))  # Resolver URL relativa
            download_file(asset_url, dir_name, base_url)
    except Exception as e:
        print(f"Failed to download CSS assets from {css_url}: {e}")    
    
# Función para descargar todos los recursos de la página
def download_assets(url, dir_name):
    try:
        response = requests.get(url, allow_redirects=False)
        response.raise_for_status()
        
        # Crear el directorio principal para la página web
        os.makedirs(dir_name, exist_ok=True)
        
        # Guardar el archivo HTML como 'index.html'
        html_file_path = os.path.join(dir_name, 'index.html')
        with open(html_file_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded HTML: {html_file_path}")
        
        # Analizar el HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Obtener la base_url para calcular rutas relativas
        base_url = urlparse(url).path
        
        # Encontrar todos los enlaces a recursos (CSS, JS, Imágenes)
        asset_tags = soup.find_all(['link', 'script', 'img'])
        
        # Descargar los archivos de recursos
        for tag in asset_tags:
            if tag.name == 'link' and tag.get('href'):
                asset_url = urljoin(url, tag['href'])
                download_file(asset_url, dir_name, base_url)
                # Si es un archivo CSS, descargar sus recursos también
                if 'stylesheet' in tag.get('rel', []):
                    download_css_assets(asset_url, dir_name, base_url)
            elif tag.name == 'script' and tag.get('src'):
                asset_url = urljoin(url, tag['src'])
                download_file(asset_url, dir_name, base_url)
            elif tag.name == 'img' and tag.get('src'):
                asset_url = urljoin(url, tag['src'])
                download_file(asset_url, dir_name, base_url)
        
    except Exception as e:
        print(f"Failed to download assets from {url}: {e}")

def build_data(json_path, url, dir):
    # 1. Descargar el json
    # Descargar el JSON
    response = requests.get(urljoin(url, json_path), allow_redirects=False)
    if response.status_code != 200:
        print(f"Error descargando el JSON: {response.status_code}")
        return
    
    json_data = response.json()
    
    with open(f'{dir}/{json_path}', 'w') as file:
        json.dump(json_data, file, indent=4)

    # Obtener los URLs de los tres archivos desde el JSON
    data_url = json_data['dataUrl']
    wasm_code_url = json_data['wasmCodeUrl']
    wasm_framework_url = json_data['wasmFrameworkUrl']

    # Descargar los archivos
    files = [
        data_url,
        wasm_code_url,
        wasm_framework_url
    ]

    for filename in files:
        print(f"Descargando {filename}...")
        file_response = requests.get(urljoin(url, filename), allow_redirects=False)
        if file_response.status_code == 200:
            with open(os.path.join(dir, filename), 'wb') as file:
                file.write(file_response.content)
            print(f"{filename} descargado correctamente.")
        else:
            print(f"Error descargando {filename}: {file_response.status_code}")

if __name__ == "__main__":
    input_url = 'https://cdn.gh5t.com/games/slope//'
    dir_name = 'slope'
    # download_assets(input_url, os.path.join('game', dir_name))
    # download_file('https://watchdocumentaries.com/wp-content/uploads/games/granny-2/Build/Granny%202.loader.js', 'granny2', 'https://watchdocumentaries.com/wp-content/uploads/games/granny-2/')
    build_data('Build/slope.json', input_url, f'game/{dir_name}/')
