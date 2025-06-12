const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const character = document.getElementById('character');
const heartsContainer = document.getElementById('heartsContainer');
const closeBtn = document.getElementById('closeBtn');
const letterTexts = document.querySelectorAll('.letter-text');
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');

let isOpened = false;

envelope.addEventListener('click', openLetter);
closeBtn.addEventListener('click', closeLetter);
popupClose.addEventListener('click', closePopup);
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

function resetGif() {
    const img = character.querySelector('img');
    if (img) {
        const currentSrc = img.src;
        // Adiciona um parâmetro único para forçar reload
        const timestamp = new Date().getTime();
        img.src = currentSrc + '?t=' + timestamp;
    }
}

function openLetter() {
    if (isOpened) return;
    isOpened = true;

    envelope.classList.add('opened');

    setTimeout(() => {
        letter.classList.add('show');
        closeBtn.classList.add('show');
        animateLetterText();
    }, 500);
}

function closeLetter() {
    // Para todas as animações em andamento
    clearAllAnimations();

    // Remove classes imediatamente
    letter.classList.remove('show');
    closeBtn.classList.remove('show');
    character.classList.remove('show');

    // Reset dos estilos inline
    letter.style.transform = '';
    letter.style.opacity = '';
    // Reset das animações dos textos
    letterTexts.forEach(text => {
        text.classList.remove('animate');
    });

    // Limpa corações e fecha popup
    clearHearts();
    resetGif()
    disableScroll();
    closePopup();

    // Reset do envelope após um delay para animação suave
    setTimeout(() => {
        envelope.classList.remove('opened');
    }, 300);

    // Reset completo do estado
    isOpened = false;
}

function animateLetterText() {
    // Limpa timeouts anteriores
    clearTextAnimationTimeouts();

    letterTexts.forEach((text, index) => {
        const timeout = setTimeout(() => {
            text.classList.add('animate');
        }, index * 500);
        textAnimationTimeouts.push(timeout);
    });

    characterTimeout = setTimeout(() => {
        showCharacterAndHearts();
    }, letterTexts.length * 500 + 1000);
}

function showCharacterAndHearts() {
    character.classList.add('show');
    positionCharacter();
    console.log('Character position set');

    // Aguarda a animação do boneco terminar (1s de transition + tempo extra)
    setTimeout(() => {
        startFloatingHearts();
    }, 5000);

    // Mostra o popup após as animações dos corações
    popupTimeout = setTimeout(() => {
        showPopup();
    }, 10000); // 1.5s do boneco + 3s dos corações + 2.5s de margem
}

let heartInterval = null; // Variável para controlar o intervalo dos corações
let textAnimationTimeouts = []; // Array para armazenar os timeouts das animações de texto
let characterTimeout = null; // Timeout para animação do boneco
let popupTimeout = null; // Timeout para o popup

function startFloatingHearts() {
    // Limpa qualquer intervalo anterior
    if (heartInterval) {
        clearInterval(heartInterval);
    }

    heartInterval = setInterval(() => {
        if (!character.classList.contains('show')) {
            clearInterval(heartInterval);
            heartInterval = null;
            return;
        }
        createFloatingHeart();
    }, 300);

    setTimeout(() => {
        if (heartInterval) {
            clearInterval(heartInterval);
            heartInterval = null;
        }
    }, 3000);
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️';

    const characterRect = character.getBoundingClientRect();
    heart.style.left = (characterRect.left + Math.random() * 100) + 'px';
    heart.style.top = (characterRect.top + Math.random() * 50) + 'px';

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 3000);
}

function showPopup() {
    popupOverlay.classList.add('show');
}

function closePopup() {
    popupOverlay.classList.remove('show');
}

function positionCharacter() {
    const letter = document.getElementById('letter');
    const character = document.getElementById('character');

    if (!letter || !character) return;

    const letterRect = letter.getBoundingClientRect();
    const characterSize = 120;
    const minDistance = 50;
    const margin = 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const positions = [
        {
            left: letterRect.right + minDistance,
            top: letterRect.top + (letterRect.height / 2) - (characterSize / 2),
            side: 'right'
        },
        {
            left: letterRect.left - minDistance - characterSize,
            top: letterRect.top + (letterRect.height / 2) - (characterSize / 2),
            side: 'left'
        },
        {
            left: letterRect.left + (letterRect.width / 2) - (characterSize / 2),
            top: letterRect.bottom + minDistance,
            side: 'bottom'
        },
        {
            left: letterRect.left + (letterRect.width / 2) - (characterSize / 2),
            top: letterRect.top - minDistance - characterSize,
            side: 'top'
        }
    ];

    for (let pos of positions) {
        const isValid =
            pos.left >= margin &&
            pos.left + characterSize <= viewportWidth - margin &&
            pos.top >= margin &&
            pos.top + characterSize <= viewportHeight - margin;

        if (isValid) {
            character.style.position = 'fixed';
            character.style.left = pos.left + 'px';
            character.style.top = pos.top + 'px';
            character.style.right = 'auto';
            character.style.bottom = 'auto';
            break;
        }
    }
}

function clearTextAnimationTimeouts() {
    textAnimationTimeouts.forEach(timeout => clearTimeout(timeout));
    textAnimationTimeouts = [];
}

function clearAllAnimations() {
    // Para timeouts das animações de texto
    clearTextAnimationTimeouts();

    // Para timeout do boneco
    if (characterTimeout) {
        clearTimeout(characterTimeout);
        characterTimeout = null;
    }

    // Para timeout do popup
    if (popupTimeout) {
        clearTimeout(popupTimeout);
        popupTimeout = null;
    }

    // Para intervalo dos corações
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

function clearHearts() {
    // Limpa todos os corações do DOM
    heartsContainer.innerHTML = '';

    // Para o intervalo dos corações se estiver rodando
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

window.addEventListener('resize', () => {
    if (character.classList.contains('show')) {
        positionCharacter();
    }
});