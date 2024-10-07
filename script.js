let gameBoard = document.getElementById('game-board');
let timerElement = document.getElementById('time');
let scoreElement = document.getElementById('score');
let time = 30; 
timerElement.textContent = time;
let score = 0;
let timerInterval;
let countdownInterval; 
let hasStarted = false;
let hasFlippedCard = false;
let lockBoard = false; 
let firstCard, secondCard;
let totalCards = 12; 


const imagesArray = [
    { id: '1', url: 'https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649', alt: 'Global Image 1' },
    { id: '2', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s', alt: 'Global Image 2' },
    { id: '3', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuNw1fDzeYGH2BFi4ufuCv2EORvqxoEMDdoA&s', alt: 'Global Image 3' },
    { id: '4', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmwla6vUQK67X5KHksARyVrL4Evo509hBcCA&s', alt: 'Global Image 4' },
    { id: '5', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRXxfn1j1vKFy8yJeBGl2AS6Dcah-lKgHofg&s', alt: 'Global Image 5' },
    { id: '6', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQACCV57gMU4-oT-HOEWi-_sRAJYJt6NgfI_A&s', alt: 'Global Image 6' },
    { id: '7', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTijYiam9VOYeJoBjVtosIdfBtD04HqK3rJ7w&s', alt: 'Global Image 7' },
    { id: '8', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG-8kfHTQ3yeUx7KBIQQScJOuwcPAfvpqbUQ&s', alt: 'Global Image 8' },
    { id: '9', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsjrBAfnlHvK9ppljbj6uLMzae_S60u2y5lA&s', alt: 'Global Image 9' }
];


function getRandomImages() {
    let shuffledImages = [...imagesArray];
    shuffle(shuffledImages); 
    return shuffledImages.slice(0, totalCards / 2); 
}


function generateCards(images) {
    const imagePairs = [...images, ...images]; 
    shuffle(imagePairs); 

    imagePairs.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-id', image.id);

        card.innerHTML = `
            <img class="front-face" src="${image.url}" alt="${image.alt}">
            <img class="back-face" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8sBWRYWgt7ZK69UHIQ5uSJgLSELdjpoPpcw&s" alt="JS Badge">
        `;

        gameBoard.appendChild(card);
    });

    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return; 
    if (this === firstCard) return;

    if (!hasStarted) {
        startCountdown(); 
        hasStarted = true;
    }

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
        disableCards();
        score++;
        scoreElement.textContent = score;
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    checkGameEnd();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


function startCountdown() {
    timerElement.textContent = time;
    countdownInterval = setInterval(() => {
        time--;
        timerElement.textContent = time;

        if (time === 0) {
            stopGame();
        }
    }, 1000);
}


function stopGame() {
    clearInterval(countdownInterval); 
    lockBoard = true; 
    let flippedCards = document.querySelectorAll('.memory-card.flip');
    
    if (flippedCards.length === document.querySelectorAll('.memory-card').length) {
        alert(`You won the task in just ${30 - time} seconds!`);
    } else {
        alert(`Time is up! Your score is ${score}.`);
    }
}


function checkGameEnd() {
    let flippedCards = document.querySelectorAll('.memory-card.flip');
    if (flippedCards.length === document.querySelectorAll('.memory-card').length) {
        clearInterval(countdownInterval); // Stop the timer
        alert(`You won the task in just ${30 - time} seconds!`);
    }
}


generateCards(getRandomImages());
