const memoryGame = document.querySelector('.memory-game');
let cards = [];
let hasFlippedCard = false; //Carta volteada
let lockBoard = false; //bloquear o desbloquear barajas
let firstCard, secondCard; //Para seleccionar la primera y segunda carta, asi para comprobar si hacen match
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
    if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = card;
        CardFoto(card);
    } else {
        secondCard = card;
        CardFoto(card);
        checkForMatch();
    }
}

function CardFoto(card) {
    if (!card.classList.contains('flipped') || card.classList.contains('matched')) { //si hacen match se queda la imagen
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

//comprueba si hacen match
function checkForMatch() {
    if (firstCard.dataset.cardNumber === secondCard.dataset.cardNumber) {
        disableCards();
    } else {
        unflipCards();
    }
}

//disabilita las cartas del juego para estar intactas y se ponen en estado matched
function disableCards() {
    firstCard.removeEventListener('click', () => flipCard(firstCard));
    secondCard.removeEventListener('click', () => flipCard(secondCard));
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

//si no coinciden se voltean de vuelta a la imagen generica
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        CardFoto(firstCard);
        CardFoto(secondCard);
        resetBoard();
    }, 1000);
}

//resetea el tablero si no se hace match o si se quiere reiniciar el juego
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}