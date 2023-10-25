const memoryGame = document.querySelector('.memory-game');
let cards = [];
var rows = 4;
var cols = 3;

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

const totalCards = rows * cols;
for (let i = 1; i <= totalCards / 2; i++) {
    createCardElement(i);
    createCardElement(i);
}
createBoard(rows, cols);

function CardFoto(card) {
    card.style.backgroundImage = `url('img/fondo.jpg')`;
}