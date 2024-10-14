// Item Render Script

const givenItemsContainer = document.querySelector('.given-items-container');
const hiddenItemsContainer = document.querySelector('.hidden-items-container');
const totalCorrectGuess = document.querySelector('.total-correct-guess');
const totalItems = document.querySelector('.total-items');
const guessContainer = document.querySelector('.guess-container');
const totalChecksMade = document.querySelector('.total-checks-made');

let playerItems = [];
let hiddenItems = [];
let checkCount = 0;

// Predefined colors
const itemColors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF',
    '#FF00FF', '#808080', '#333333', '#FFA500', '#E9967A'
];

const pickRandomColors = (length) => {
    const shuffledColors = [...itemColors].sort(() => 0.5 - Math.random());
    return shuffledColors.slice(0, length);
};

const createItem = (color, index) => {
    const item = document.createElement('div');
    item.classList.add('item');
    item.style.backgroundColor = color;
    item.setAttribute('draggable', true);
    item.setAttribute('data-index', index);
    return item;
};

const createItemBox = (index) => {
    const box = document.createElement('div');
    box.classList.add('item-box');
    box.setAttribute('data-index', index);
    return box;
};

const dragStart = function () {
    this.classList.add('dragging');
};

const dragEnd = function () {
    this.classList.remove('dragging');
};

const dragOver = (e) => {
    e.preventDefault();
};

const dragEnter = function (e) {
    e.preventDefault();
    this.classList.add('drag-over');
};

const dragLeave = function () {
    this.classList.remove('drag-over');
};

const drop = function () {
    this.classList.remove('drag-over');
    const draggedItem = document.querySelector('.dragging');
    const fromIndex = parseInt(draggedItem.getAttribute('data-index'));
    const toIndex = parseInt(this.getAttribute('data-index'));

    // Swap items in the playerItems array
    [playerItems[fromIndex], playerItems[toIndex]] = [playerItems[toIndex], playerItems[fromIndex]];

    renderItems();  // Only call renderItems without parameters
};

const setupDragAndDrop = () => {
    const items = document.querySelectorAll('.item');
    const boxes = document.querySelectorAll('.item-box');

    items.forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });

    boxes.forEach(box => {
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragenter', dragEnter);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });
};

const updateItemBoxVisibility = () => {
    const itemBoxes = document.querySelectorAll('.item-box');
    itemBoxes.forEach((box) => {
        box.style.border = isItemsBoxActive ? '1px solid var(--blue)' : '1px solid transparent';
    });
};

const renderItems = () => {
    // Clear existing contents
    givenItemsContainer.innerHTML = '';
    hiddenItemsContainer.innerHTML = '';

    const givenFragment = document.createDocumentFragment();
    const hiddenFragment = document.createDocumentFragment();

    playerItems.forEach((color, i) => {
        const itemBox = createItemBox(i);
        const playerItem = createItem(color, i);
        itemBox.appendChild(playerItem);
        givenFragment.appendChild(itemBox);
        
        const hiddenItem = createItem(hiddenItems[i], i);
        hiddenItem.classList.add('hide'); 
        hiddenFragment.appendChild(hiddenItem);
    });

    givenItemsContainer.appendChild(givenFragment);
    hiddenItemsContainer.appendChild(hiddenFragment);

    setupDragAndDrop();
    updateItemBoxVisibility();
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};



// Game Script

const enableGameInteractions = () => {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });

    document.querySelector('.check-items-button').classList.remove('remove');
    document.querySelector('.play-again-button').classList.add('remove');

};

const freezeBoard = () => {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.setAttribute('draggable', false);
        item.removeEventListener('dragstart', dragStart);
        item.removeEventListener('dragend', dragEnd);
    });

    document.querySelector('.check-items-button').classList.add('remove');
    document.querySelector('.play-again-button').classList.remove('remove');

};

const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
};

const initializeGame = (itemQuantity) => {
    const randomColors = pickRandomColors(itemQuantity);

    // Shuffle until we get a different order
    do {
        playerItems = shuffleArray([...randomColors]);
    } while (arraysAreEqual(playerItems, randomColors)); // Use custom comparison

    hiddenItems = [...randomColors];

    checkCount = 0;
    totalChecksMade.textContent = checkCount;

    renderItems(itemQuantity, hiddenItems);

    totalCorrectGuess.textContent = '0';
    totalItems.textContent = itemQuantity;

    // Hide win/lose messages
    document.querySelector('.win-message').classList.add('remove');
    document.querySelector('.lose-message').classList.add('remove');

   

    // Hide the hidden items
    const hiddenItemElements = hiddenItemsContainer.querySelectorAll('.item');
    hiddenItemElements.forEach(item => item.classList.add('hide'));

    // Enable dragging and buttons
    enableGameInteractions();
};

const startGame = () => {
    const itemQuantity = parseInt(homeItemQuantity.textContent) || 3;
    initializeGame(itemQuantity);
    
     // Ensure items box is active at game start
     isItemsBoxActive = true;
     updateItemBoxVisibility();
     itemsBoxCheckMark.classList.remove('hide');
     itemsBoxButton.classList.add('items-box-active');
};

const playAgain = () => {
    const itemQuantity = parseInt(modalItemQuantity.textContent) || 3;
    initializeGame(itemQuantity);
};


// Items Box Button Logic

const itemsBoxButton = document.querySelector('.items-box-button')
const itemsBoxCheckMark = document.querySelector('.items-box-checkmark')        
let isItemsBoxActive = true; 

const toggleItemsBox = () => {
    isItemsBoxActive = !isItemsBoxActive;
    const itemsBoxButton = document.querySelector('.items-box-button');
    const itemsBoxCheckMark = document.querySelector('.items-box-checkmark');
    
    itemsBoxButton.classList.toggle('items-box-active', isItemsBoxActive);
    if (itemsBoxCheckMark) {
        itemsBoxCheckMark.classList.toggle('hide', !isItemsBoxActive);
    }

    updateItemBoxVisibility();
};

// Check Items Button Logic

const calculatePoints = (itemCount, checkCount, isWin) => {
    if (!isWin) return 0; // Award 0 points if the player gave up

    // Base points for completing the game
    let basePoints = itemCount * 10;
    
    // Penalty for each check
    let penalty = checkCount * 5;
    
    // Bonus for completing with fewer checks
    let bonus = Math.max(0, (itemCount * 2 - checkCount) * 10);
    
    // Calculate total points (minimum 0)
    return Math.max(0, basePoints + bonus - penalty);
};

const updateStatusMessage = (isWin) => {
    statusModal.classList.remove('remove');
    document.querySelector(isWin ? '.win-message' : '.lose-message').classList.remove('remove');
    document.querySelector(isWin ? '.lose-message' : '.win-message').classList.add('remove');

    const itemCount = playerItems.length;
    const points = calculatePoints(itemCount, checkCount, isWin);

    document.querySelector('.item-count').textContent = itemCount;
    document.querySelector('.check-count').textContent = checkCount;
    document.querySelector('.game-points').textContent = points;

    const hiddenItemElements = hiddenItemsContainer.querySelectorAll('.item');
    hiddenItemElements.forEach(item => item.classList.remove('hide'));

    let correctCount = playerItems.reduce((count, item, index) => {
        return count + (item === hiddenItems[index] ? 1 : 0);
    }, 0);

    totalCorrectGuess.textContent = correctCount;
    guessContainer.classList.remove('hide');
};

const checkItems = () => {
    checkCount++;
    totalChecksMade.textContent = checkCount;

    let correctCount = playerItems.reduce((count, item, index) => {
        return count + (item === hiddenItems[index] ? 1 : 0);
    }, 0);

    totalCorrectGuess.textContent = correctCount;
    guessContainer.classList.remove('hide');

    if (correctCount === playerItems.length) {
        updateStatusMessage(true);
        freezeBoard();
    }
};

const giveUp = () => {
    updateStatusMessage(false);
    freezeBoard();
};


// Other Buttons Logic

const actions = {
    'home-item-decrease-button': () => homeAdjustQuantity(-1),
    'home-item-increase-button': () => homeAdjustQuantity(1),
    'play-game-button': () => {
        introductionContainer.classList.add('remove');
        gameContainer.classList.remove('remove');
        startGame();
    },
    'check-items-button': checkItems,
    'give-up-button': giveUp,
    'items-box-button': toggleItemsBox,
    'play-again-button': () => {
        statusModal.classList.add('remove');
        playAgain();
    },
    'modal-item-decrease-button': () => modalAdjustQuantity(-1),
    'modal-item-increase-button': () => modalAdjustQuantity(1),
    'spectate-button': () => statusModal.classList.add('remove'),
};

document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    // Check if any action corresponds to the clicked button
    for (const [className, action] of Object.entries(actions)) {
        if (button.classList.contains(className)) {
            action(); // Execute the corresponding action
            break; // Exit loop after the first match
        }
    }
});

window.onclick = (event) => {
    if (event.target == statusModal) {
        statusModal.classList.add('remove');
    }
};