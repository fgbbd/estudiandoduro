from PIL import Image
import os

# Configuración
INPUT_DIR = "../assets/"
CALIDAD = 60  # Calidad de compresión (0-100)


def comprimir_imagen(input_path, output_path, calidad=60):
    """Comprime una imagen y la guarda en otro directorio."""
    with Image.open(input_path) as img:
        img = img.convert("RGB")  # Asegura que no haya problemas con PNGs
        img.save(output_path, "WEBP", quality=calidad, optimize=True)

def procesar_directorio(input_dir, output_dir):
    """Recorre todas las imágenes de la carpeta y las comprime."""
    for filename in os.listdir(input_dir):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, os.path.splitext(filename)[0] + ".webp")

        # Filtrar solo imágenes (JPG, PNG, WEBP)
        if filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            print(f"🔄 Comprimiendo: {filename}")
            try:
                comprimir_imagen(input_path, output_path, CALIDAD)
                print(f"✅ Guardado en: {output_path}")
            except Exception as e:
                print(f"❌ Error con {filename}: {e}")

# Ejecutar el script
procesar_directorio(INPUT_DIR, INPUT_DIR)
print("🚀 ¡Compresión completada!")
