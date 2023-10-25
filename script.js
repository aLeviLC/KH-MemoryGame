const memoryGame = document.querySelector('.memory-game');
let hasFlippedCard = false; //Carta volteada
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
    openStartPopup();
    memoryGame.innerHTML = "";
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
    cards.push(card);
}

function CardFoto(card) {
    card.style.backgroundImage = `url('img/fondo.jpg')`;
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

function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

