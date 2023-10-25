const memoryGame = document.querySelector('.memory-game');
let hasFlippedCard = false; //Carta volteada
let lockBoard = false; //bloquear o desbloquear barajas
let cards = [];
var rows = 4;
var cols = 3;

//Enlace para hacer funcionar los botones
const btn4x3 = document.getElementById("btn4x3");
const btn4x4 = document.getElementById("btn4x4");
const btn5x4 = document.getElementById("btn5x4");
const dimensionButtons = document.getElementById("dimensionButtons");

//Al dar click rows y col cambian su valor para mandarlos a la funcion de cambiar dimension
btn4x3.addEventListener("click", () => changeBoardSize(rows = 4, cols = 3));
btn4x4.addEventListener("click", () => changeBoardSize(rows = 4, cols = 4));
btn5x4.addEventListener("click", () => changeBoardSize(rows = 5, cols = 4));

function changeBoardSize(rows, cols) {
    initGame(rows, cols);
}

//funcion para iniciar juego y mezclarlos
function initGame(rows, cols) {
    cards = [];
    memoryGame.innerHTML = "";
    const totalCards = rows * cols;
    for (let i = 1; i <= totalCards / 2; i++) {
        createCardElement(i);
        createCardElement(i);
    }
    cards = shuffleArray(cards);
    createBoard(rows, cols);
}

function createBoard(rows, cols) {
    memoryGame.style.gridTemplateColumns = `repeat(${cols}, 150px)`;
    memoryGame.style.gridTemplateRows = `repeat(${rows}, 150px)`;

    cards.forEach(card => memoryGame.appendChild(card));
}

function createCardElement(number) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    CardFoto(card);
    card.dataset.cardNumber = number;
    card.addEventListener('click', () => flipCard(card));
    cards.push(card);
}

//Funcion de voltear carta
function flipCard(card) {
    card.classList.add('flipped');
    CardFoto(card);
}

function CardFoto(card) {
    if (!card.classList.contains('flipped')) {
        card.style.backgroundImage = `url('img/fondo.jpg')`;
    } else {
        card.style.backgroundImage = `url('img/${card.dataset.cardNumber}.jpg')`;
    }
}

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}