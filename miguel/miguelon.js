let frasesMiguel = [];
let frasesPilar = [];

// Cargar las frases de Miguel y Pilar de manera asíncrona
fetch("/miguel/miguel.json")
    .then(res => res.json())
    .then(data => {
        frasesMiguel = data;
    });

fetch("/miguel/pilar.json")
    .then(res => res.json())
    .then(data => {
        frasesPilar = data;
    });

const miguelonEnunciado = document.getElementById('miguelon-texto');
const miguelon = document.getElementById('miguelon');
const imagenMiguelon = document.getElementById('miguelonImg');

// Esperar hasta que las frases estén cargadas antes de ejecutar quizasMiguelon
let datosCargados = false;
Promise.all([
    fetch("/miguel/miguel.json").then(res => res.json()),
    fetch("/miguel/pilar.json").then(res => res.json())
]).then(([dataMiguel, dataPilar]) => {
    frasesMiguel = dataMiguel;
    frasesPilar = dataPilar;
    datosCargados = true;
}).catch(err => console.error("Error al cargar las frases:", err));

setInterval(() => {
    if (datosCargados) {
        quizasMiguelon();
    }
}, 65 * 1000);

function quizasMiguelon() {
    const persona = Math.random() < 0.5 ? 'Miguel' : 'Pilar';
    const listaElegida = persona === 'Miguel' ? frasesMiguel : frasesPilar;
    const numero = Math.floor(Math.random() * 3);

    if (numero === 1) {
        mostrarMiguelon(persona, listaElegida);
        setTimeout(quitarMiguelon, 12 * 1000);
    }
}

function mostrarMiguelon(persona, listaElegida) {
    const personaMostrar = persona === 'Miguel' ? 'Miguelon' : 'Pilar';

    // Limpiar el contenido anterior y reemplazar solo el texto "Miguelon dice:"
    miguelonEnunciado.innerHTML = `${personaMostrar} dice: <div id="miguelon-frase"></div>`;

    imagenMiguelon.src = `/miguel/${persona.toLowerCase()}.webp`;

    const randomElement = listaElegida[Math.floor(Math.random() * listaElegida.length)];
    const miguelonText = document.getElementById('miguelon-frase');

    miguelonText.innerText = randomElement;
    miguelon.classList.add('show');
    miguelon.classList.remove('hide');
}

function quitarMiguelon() {
    miguelon.classList.add('hide');
    miguelon.classList.remove('show');
}

miguelon.addEventListener('click', () => {
    miguelon.classList.add("hide");
    miguelon.classList.remove("show");
});