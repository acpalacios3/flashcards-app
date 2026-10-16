
 // ==========================================
 // Application Data and HTML Elements
 // ==========================================

const decks = [];
let selectedDeckId = null;
let nextDeckId = 1;
let nextCardId = 1;
let studyOrder = [];
let currentStudyCardId = null;
let isCardFlipped = false;
let editingCardId = null;

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
const cardEditor = document.querySelector(".card-editor");
const saveCardButton = flashcardForm.querySelector('button[type="submit"]');

const flashcardSearch = document.getElementById("flashcard-search");
const searchResults = document.getElementById("search-results");
const shuffleButton = document.getElementById("shuffle-cards-button");

const studyCard = document.getElementById("study-card");
const studyCardContent = document.getElementById("study-card-content");
const studyCardAnswer = document.getElementById("study-card-answer");
const flipCardButton = document.getElementById("flip-card-button");
const previousCardButton = document.getElementById("previous-card-button");
const nextCardButton = document.getElementById("next-card-button");
const newCardButton = document.getElementById("new-card-button");


// ==========================================
// Deck Management
// ==========================================

function getSelectedDeck() {
  return decks.find((deck) => deck.id === selectedDeckId);
}

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
    flashcards: [],
  };

  decks.push(deck);
  selectedDeckId = deck.id;
  newDeckNameInput.value = "";

  resetDeckView(deck);
  renderDecks();
  renderDeckContent();
}

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

  resetDeckView(null);
  resetFlashcardForm();
  renderDecks();
  renderDeckContent();
}

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

    button.addEventListener("click", () => selectDeck(deck.id));

    item.append(button);
    deckList.append(item);
  });

  deckSelect.value = selectedDeckId ?? "";
  deckTitle.textContent = getSelectedDeck()?.name ?? "Select a deck";
}

function selectDeck(deckId) {
  selectedDeckId = deckId || null;

  resetFlashcardForm();
  resetDeckView(getSelectedDeck());
  renderDecks();
  renderDeckContent();
}

function resetDeckView(deck) {
  flashcardSearch.value = "";
  searchResults.replaceChildren();

  studyOrder = deck ? deck.flashcards.slice() : [];
  currentStudyCardId = studyOrder[0]?.cardId ?? null;
  isCardFlipped = false;

  studyCard.classList.remove("flipped");
  flipCardButton.setAttribute("aria-pressed", "false");
}


// ==========================================
// Flashcard CRUD
// ==========================================

function saveFlashcard(event) {
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

  if (editingCardId !== null) {
    const card = deck.flashcards.find(
      (item) => item.cardId === editingCardId
    );

    if (card) {
      card.question = question;
      card.answer = answer;
    }
  } else {
    const card = {
      cardId: nextCardId++,
      question,
      answer,
    };

    deck.flashcards.push(card);
    studyOrder.push(card);
    currentStudyCardId = card.cardId;
    isCardFlipped = false;
  }

  resetFlashcardForm();
  renderDeckContent();
  renderSearchResults();
}

function editFlashcard(cardId) {
  const deck = getSelectedDeck();

  const card = deck?.flashcards.find(
    (item) => item.cardId === cardId
  );

  if (!card) {
    return;
  }

  editingCardId = card.cardId;

  cardQuestionInput.value = card.question;
  cardAnswerInput.value = card.answer;

  saveCardButton.textContent = "Update flashcard";
  cardEditor.open = true;
  cardQuestionInput.focus();
}

function resetFlashcardForm() {
  editingCardId = null;
  flashcardForm.reset();
  saveCardButton.textContent = "Save flashcard";
}

function deleteFlashcard(cardId) {
  const deck = getSelectedDeck();

  if (!deck) {
    return;
  }

  deck.flashcards = deck.flashcards.filter(
    (card) => card.cardId !== cardId
  );

  studyOrder = studyOrder.filter(
    (card) => card.cardId !== cardId
  );

  if (currentStudyCardId === cardId) {
    currentStudyCardId = studyOrder[0]?.cardId ?? null;
    isCardFlipped = false;
  }

  if (editingCardId === cardId) {
    resetFlashcardForm();
  }

  renderDeckContent();
  renderSearchResults();
}

function renderFlashcards() {
  flashcardList.replaceChildren();

  const deck = getSelectedDeck();

  if (!deck) {
    flashcardList.textContent = "Select a deck to view flashcards.";
    return;
  }

  if (deck.flashcards.length === 0) {
    flashcardList.textContent = "This deck has no flashcards yet.";
    return;
  }

  deck.flashcards.forEach((card) => {
    const item = document.createElement("li");
    const question = document.createElement("p");
    const answer = document.createElement("p");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    question.textContent = card.question;
    answer.textContent = card.answer;

    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editFlashcard(card.cardId);
    });

    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteFlashcard(card.cardId);
    });

    item.append(question, answer, editButton, deleteButton);
    flashcardList.append(item);
  });
}


// ==========================================
// Search
// ==========================================

function searchFlashcards() {
  renderSearchResults();
}

function renderSearchResults() {
  searchResults.replaceChildren();

  const query = flashcardSearch.value.trim().toLowerCase();

  if (!query) {
    return;
  }

  const deck = getSelectedDeck();

  if (!deck) {
    showSearchMessage("Select a deck to search flashcards.");
    return;
  }

  if (deck.flashcards.length === 0) {
    showSearchMessage("This deck has no flashcards yet.");
    return;
  }

  const matches = deck.flashcards.filter(
    (card) =>
      card.question.toLowerCase().includes(query) ||
      card.answer.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    showSearchMessage("No matching flashcards.");
    return;
  }

  matches.forEach((card) => {
    const item = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = `${card.question} — ${card.answer}`;

    button.addEventListener("click", () => {
      showStudyCard(card);
    });

    item.append(button);
    searchResults.append(item);
  });
}

function showSearchMessage(message) {
  const item = document.createElement("li");
  item.textContent = message;
  searchResults.append(item);
}


// ==========================================
// Study Mode and Shuffle
// ==========================================

function renderStudyCard() {
  const card = studyOrder.find(
    (item) => item.cardId === currentStudyCardId
  );

  if (!card) {
    studyCardContent.textContent = getSelectedDeck()
      ? "This deck has no flashcards yet."
      : "Select a deck to begin studying.";

    studyCardAnswer.textContent = "Flip the card to reveal the answer.";

    studyCard.classList.remove("flipped");
    isCardFlipped = false;
    flipCardButton.setAttribute("aria-pressed", "false");

    return;
  }

  studyCardContent.textContent = card.question;
  studyCardAnswer.textContent = card.answer;

  studyCard.classList.toggle("flipped", isCardFlipped);

  flipCardButton.setAttribute(
    "aria-pressed",
    String(isCardFlipped)
  );
}

function showStudyCard(card) {
  currentStudyCardId = card.cardId;
  isCardFlipped = false;
  renderStudyCard();
}

function flipStudyCard() {
  if (currentStudyCardId === null) {
    return;
  }

  isCardFlipped = !isCardFlipped;

  studyCard.classList.toggle("flipped", isCardFlipped);

  flipCardButton.setAttribute(
    "aria-pressed",
    String(isCardFlipped)
  );
}

function moveStudyCard(direction) {
  if (studyOrder.length === 0) {
    return;
  }

  let currentIndex = studyOrder.findIndex(
    (card) => card.cardId === currentStudyCardId
  );

  if (currentIndex === -1) {
    currentIndex = 0;
  } else {
    currentIndex =
      (currentIndex + direction + studyOrder.length) %
      studyOrder.length;
  }

  showStudyCard(studyOrder[currentIndex]);
}

function shuffleFlashcards() {
  const deck = getSelectedDeck();

  if (!deck) {
    alert("Select a deck before shuffling.");
    return;
  }

  if (deck.flashcards.length === 0) {
    alert("This deck has no flashcards to shuffle.");
    return;
  }

  // Shuffle a copy so the deck's original card order stays unchanged.
  studyOrder = deck.flashcards.slice();

  for (let index = studyOrder.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [studyOrder[index], studyOrder[randomIndex]] = [
      studyOrder[randomIndex],
      studyOrder[index],
    ];
  }

  showStudyCard(studyOrder[0]);
}

function renderStudyMode() {
  const deck = getSelectedDeck();
  const count = deck ? deck.flashcards.length : 0;

  cardCount.textContent =
    `${count} ${count === 1 ? "flashcard" : "flashcards"}`;

  renderStudyCard();
}

function renderDeckContent() {
  renderFlashcards();
  renderStudyMode();
}


// ==========================================
// Application Initialization
// ==========================================

function initializeApp() {
  createForm.addEventListener("submit", createDeck);
  renameForm.addEventListener("submit", renameDeck);
  deleteDeckButton.addEventListener("click", deleteDeck);

  deckSelect.addEventListener("change", () => {
    selectDeck(deckSelect.value);
  });

  flashcardForm.addEventListener("submit", saveFlashcard);
  flashcardSearch.addEventListener("input", searchFlashcards);
  shuffleButton.addEventListener("click", shuffleFlashcards);

  flipCardButton.addEventListener("click", flipStudyCard);
  previousCardButton.addEventListener("click", () => {
    moveStudyCard(-1);
  });
  nextCardButton.addEventListener("click", () => {
    moveStudyCard(1);
  });

  newCardButton.addEventListener("click", () => {
    if (!getSelectedDeck()) {
      alert("Select a deck before creating a flashcard.");
      return;
    }

    resetFlashcardForm();
    cardEditor.open = true;
    cardQuestionInput.focus();
  });

  renderDecks();
  renderDeckContent();
}

initializeApp();
