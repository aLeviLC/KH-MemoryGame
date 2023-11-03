const memoryGame = document.querySelector('.memory-game');
const timerElement = document.getElementById("timer");
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let time = 0;
let timerInterval; 
let url = "https://kh-mg-e2208-default-rtdb.firebaseio.com/"; //coneccion a bd
var rows = 4;
var cols = 3;

const btn4x3 = document.getElementById("btn4x3");
const btn4x4 = document.getElementById("btn4x4");
const btn5x4 = document.getElementById("btn5x4");
const startButton = document.getElementById("startButton");
const dimensionButtons = document.getElementById("dimensionButtons");

btn4x3.addEventListener("click", () => changeBoardSize(rows = 4, cols = 3));
btn4x4.addEventListener("click", () => changeBoardSize(rows = 4, cols = 4));
btn5x4.addEventListener("click", () => changeBoardSize(rows = 5, cols = 4));


//para cambiar el tamaño del tablero
function changeBoardSize(rows, cols) {
    openStartPopup();
    memoryGame.innerHTML = "";
    initGame(rows, cols);
}

//iniciar juego
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

//generar juego
function createBoard(rows, cols) {
    memoryGame.style.gridTemplateColumns = `repeat(${cols}, 150px)`;
    memoryGame.style.gridTemplateRows = `repeat(${rows}, 150px)`;

    cards.forEach(card => memoryGame.appendChild(card));
}

//diseño cartas (fotos)
function CardFoto(card) {
    if (!card.classList.contains('flipped') || card.classList.contains('matched')) {
        card.style.backgroundImage = `url('img/fondo.jpg')`;
    } else {
        card.style.backgroundImage = `url('img/${card.dataset.cardNumber}.jpg')`;
    }
}

//generar cartas
function createCardElement(number) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    CardFoto(card);
    card.dataset.cardNumber = number;
    card.addEventListener('click', () => flipCard(card));
    cards.push(card);
}

//voltear cartas
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


//comprobaciones
function checkAllCardsMatched() {
    return cards.every(card => card.classList.contains('matched'));
}

function checkForMatch() {
    if (firstCard.dataset.cardNumber === secondCard.dataset.cardNumber) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', () => flipCard(firstCard));
    secondCard.removeEventListener('click', () => flipCard(secondCard));
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    if (checkAllCardsMatched()) {
        const winPopup = document.getElementById("winPopup");
        winPopup.style.top = "0";
        const retryButton = document.getElementById("retryButton");
        clearInterval(timerInterval);
        const playerNameInput = document.getElementById("playerName");
        playerNameInput.addEventListener('input', () => {
            // Verifica si el cuadro de texto tiene algún valor
            if (playerNameInput.value.trim() !== '') {
                retryButton.disabled = false;
                retryButton.addEventListener("click", () => {
                    const playerName = playerNameInput.value;
                    var timefor = (time/100)/10;
        
                    let user= {
                        name: playerName,
                        time: timefor
                    }
        
                    console.log(JSON.stringify(user, null, 2));
                    fetch(`${url}/users.json`, {
                        method: 'POST',
                        body: JSON.stringify(user, null, 2),
                        headers: { 'Content-type': 'application/json; charset=UTF-8' }
                    })
                        .then(response => response.json())
                        .catch(error => console.error("Ha ocurrido un error: ", error));
        
                    playerNameInput.value = "";
        
                    RankConsult();
                    const winPopup = document.getElementById("winPopup");
                    winPopup.style.top = "100%";
                    changeBoardSize(rows, cols);
                });
            } else {
                retryButton.disabled = true;
            }
        });
    }
    resetBoard();
}


//devolver carta
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

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


//mezclar
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

window.addEventListener("load", openStartPopup);


//ventanas emergentes
function openStartPopup() {
    RankConsult();
    timerElement.textContent = `Time: 0.0`;
    clearInterval(timerInterval);
    const startPopup = document.getElementById("startPopup");
    startPopup.style.top = "0";
    startPopup.style.background = "linear-gradient(rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60))";
}

function closeStartPopup() {
    const startPopup = document.getElementById("startPopup");
    startPopup.style.top = "100%";
    RankConsult();
    startTimer();
    initGame(rows, cols);
}
startButton.addEventListener("click", closeStartPopup);


//timer
function startTimer() {
    clearInterval(timerInterval);
    time = 0;
    timerInterval = setInterval(function () {
        time += 100;
        const totalSeconds= time / 1000;
        const seconds = totalSeconds.toFixed(1);
        timerElement.textContent = `Time: ${seconds}`;
    }, 100);
}

//actualizar tabla score
async function RankConsult(){
    try {
        const response = await fetch(`${url}/users.json`);
        const users = await response.json();
        renderTable(users);   
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
    }
}

//tabla de score
function renderTable(data) {
    let tbody = document.getElementById('usersTable');
    let rowHTML = '';
    const sortedData = Object.keys(data).map(key => data[key]).sort((a, b) => a.time - b.time).slice(0, 10); // Obtiene solo las primeras 10 entradas

    sortedData.forEach((item, index) => {
        const position = index + 1;
        const crown = position === 1 ? '👑' : '';
        rowHTML += `<tr>
            <td>${crown} ${position}</td>
            <td>${item.name}</td>
            <td>${item.time} seg</td>
        </tr>`;
    });

    tbody.innerHTML = rowHTML;
}