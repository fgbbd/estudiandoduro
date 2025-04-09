let frases = [];

fetch("/miguel/frases.json")
    .then(res => res.json())
    .then(data => {
        frases = data;
    });

const miguelonText = document.getElementById('miguelon-frase');
const miguelon = document.getElementById('miguelon');

setInterval(quizasMiguelon, 65 * 1000)

function quizasMiguelon() {
    const numero = Math.floor(Math.random() * 3)
    if (numero === 1) {
        mostrarMiguelon()
        setTimeout(quitarMiguelon, 12 * 1000)
    }
}

function mostrarMiguelon() {
    // Aquí puedes agregar alguna condición si es necesario
    const randomElement = frases[Math.floor(Math.random() * frases.length)];
    miguelonText.innerText = randomElement;

    miguelon.classList.add('show');
    miguelon.classList.remove('hide')
}

function quitarMiguelon() {
    miguelon.classList.add('hide');
    miguelon.classList.remove('show')
}

miguelon.addEventListener('click', () => {
    miguelon.classList.add("hide");
    miguelon.classList.remove("show");
})