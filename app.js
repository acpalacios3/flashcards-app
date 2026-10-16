
// ==========================================
// Application Data
// ==========================================

const decks = [];
let selectedDeckId = null;
let nextDeckId = 1;
let nextCardId = 1;

// Get HTML elements
const createForm = document.getElementById("create-deck-form");
const newDeckNameInput = document.getElementById("new-deck-name");
const deckList = document.getElementById("deck-list");
const deckSelect = document.getElementById("deck-select");
const deckTitle = document.getElementById("deck-title");

const renameForm = document.getElementById("rename-deck-form");
const renamedDeckNameInput = document.getElementById("renamed-deck-name");
const deleteDeckButton = document.getElementById("delete-deck-button");

const flashcardForm = document.getElementById("flashcard-form");
const cardQuestionInput = document.getElementById("card-question");
const cardAnswerInput = document.getElementById("card-answer");
const flashcardList = document.getElementById("flashcard-list");
const cardCount = document.querySelector(".card-count");


// ==========================================
// Deck Management
// ==========================================

// Get the selected deck
function getSelectedDeck() {
  return decks.find((deck) => deck.id === selectedDeckId);
}

// Create a new deck
function createDeck(event) {
  event.preventDefault();

  const name = newDeckNameInput.value.trim();

  if (!name) {
    alert("Enter a deck name.");
    newDeckNameInput.focus();
    return;
  }

  const deck = {
    id: String(nextDeckId++),
    name,
    flashcards: []
  };

  decks.push(deck);
  selectedDeckId = deck.id;

  newDeckNameInput.value = "";
  renderDecks();
  renderFlashcards();
}

// Rename the selected deck
function renameDeck(event) {
  event.preventDefault();

  const deck = getSelectedDeck();

  if (!deck) {
    alert("Select a deck to rename.");
    return;
  }

  const name = renamedDeckNameInput.value.trim();

  if (!name) {
    alert("Enter a deck name.");
    renamedDeckNameInput.focus();
    return;
  }

  deck.name = name;
  renamedDeckNameInput.value = "";
  renderDecks();
}

// Delete the selected deck
function deleteDeck() {
  const deck = getSelectedDeck();

  if (!deck) {
    alert("Select a deck to delete.");
    return;
  }

  if (!confirm(`Delete the deck "${deck.name}"?`)) {
    return;
  }

  const index = decks.findIndex((item) => item.id === deck.id);
  decks.splice(index, 1);

  selectedDeckId = null;

  renderDecks();
  renderFlashcards();
}

// Display the decks in the sidebar and selector
function renderDecks() {
  deckList.replaceChildren();
  deckSelect.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose a deck";
  deckSelect.append(placeholder);

  decks.forEach((deck) => {
    const option = document.createElement("option");
    option.value = deck.id;
    option.textContent = deck.name;
    deckSelect.append(option);

    const item = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = deck.name;
    button.classList.toggle("active", deck.id === selectedDeckId);

    if (deck.id === selectedDeckId) {
      button.setAttribute("aria-current", "true");
    }

    button.addEventListener("click", () => {
      selectedDeckId = deck.id;
      renderDecks();
      renderFlashcards();
    });

    item.append(button);
    deckList.append(item);
  });

  deckSelect.value = selectedDeckId ?? "";
  deckTitle.textContent = getSelectedDeck()?.name ?? "Select a deck";
}


// ==========================================
// Flashcard Management
// ==========================================

// Create a flashcard in the selected deck
function createFlashcard(event) {
  event.preventDefault();

  const deck = getSelectedDeck();

  if (!deck) {
    alert("Select a deck first.");
    return;
  }

  const question = cardQuestionInput.value.trim();
  const answer = cardAnswerInput.value.trim();

  if (!question || !answer) {
    alert("Enter both a question and an answer.");
    return;
  }

  deck.flashcards.push({
    id: nextCardId++,
    question,
    answer
  });

  flashcardForm.reset();
  renderFlashcards();
}

// Display flashcards for the selected deck
function renderFlashcards() {
  flashcardList.replaceChildren();

  const deck = getSelectedDeck();

  if (!deck) {
    flashcardList.textContent = "Select a deck to view flashcards.";
    cardCount.textContent = "0 flashcards";
    return;
  }

  if (deck.flashcards.length === 0) {
    flashcardList.textContent = "This deck has no flashcards yet.";
  }

  deck.flashcards.forEach((card) => {
    const item = document.createElement("li");
    const question = document.createElement("p");
    const answer = document.createElement("p");
    const deleteButton = document.createElement("button");

    question.textContent = card.question;
    answer.textContent = card.answer;

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      deleteFlashcard(card.id);
    });

    item.append(question, answer, deleteButton);
    flashcardList.append(item);
  });

  cardCount.textContent =
    `${deck.flashcards.length} flashcards`;
}

// Delete a flashcard from the selected deck
function deleteFlashcard(cardId) {
  const deck = getSelectedDeck();

  if (!deck) return;

  deck.flashcards = deck.flashcards.filter(
    (card) => card.id !== cardId
  );

  renderFlashcards();
}


// ==========================================
// Application Initialization
// ==========================================

function initializeApp() {
  // Register deck event listeners
  createForm.addEventListener("submit", createDeck);
  renameForm.addEventListener("submit", renameDeck);
  deleteDeckButton.addEventListener("click", deleteDeck);

  deckSelect.addEventListener("change", () => {
    selectedDeckId = deckSelect.value || null;
    renderDecks();
    renderFlashcards();
  });

  // Register flashcard event listeners
  flashcardForm.addEventListener("submit", createFlashcard);

  // Render the initial interface
  renderDecks();
  renderFlashcards();
}

// Start the application
initializeApp();
