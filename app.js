(() => {
  // Get the HTML elements used to manage decks
  const createForm = document.getElementById("create-deck-form");
  const newDeckNameInput = document.getElementById("new-deck-name");
  const deckList = document.getElementById("deck-list");
  const deckSelect = document.getElementById("deck-select");
  const deckTitle = document.getElementById("deck-title");
  const renameForm = document.getElementById("rename-deck-form");
  const renamedDeckNameInput = document.getElementById("renamed-deck-name");
  const deleteDeckButton = document.getElementById("delete-deck-button");

  // Store decks in memory and track the selected deck
  const decks = [];
  let selectedDeckId = null;
  let nextDeckId = 1;

  // Find the currently selected deck
  function getSelectedDeck() {
    return decks.find((deck) => deck.id === selectedDeckId);
  }

  // Render the deck list, selector, active deck, and title
  function renderDecks() {
    deckList.replaceChildren();
    deckSelect.replaceChildren();

    // Add the default option to the deck selector
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a deck";
    deckSelect.append(placeholder);

    // Display each deck in the list and selector
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

      // Mark the active deck for accessibility
      if (deck.id === selectedDeckId) {
        button.setAttribute("aria-current", "true");
      }

      // Select a deck when its button is clicked
      button.addEventListener("click", () => {
        selectedDeckId = deck.id;
        renderDecks();
      });

      item.append(button);
      deckList.append(item);
    });

    // Synchronize the selector and update the deck title
    deckSelect.value = selectedDeckId ?? "";
    deckTitle.textContent = getSelectedDeck()?.name ?? "Select a deck";
  }

  // Create a new deck
  createForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = newDeckNameInput.value.trim();

    // Validate the deck name
    if (!name) {
      alert("Enter a deck name.");
      newDeckNameInput.focus();
      return;
    }

    // Add the new deck and make it active
    const deck = { id: String(nextDeckId++), name };
    decks.push(deck);
    selectedDeckId = deck.id;
    newDeckNameInput.value = "";
    renderDecks();
  });

  // Select a deck using the dropdown
  deckSelect.addEventListener("change", () => {
    selectedDeckId = deckSelect.value || null;
    renderDecks();
  });

  // Rename the currently selected deck
  renameForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const deck = getSelectedDeck();

    // Ensure a deck is selected
    if (!deck) {
      alert("Select a deck to rename.");
      return;
    }

    const name = renamedDeckNameInput.value.trim();

    // Validate the new deck name
    if (!name) {
      alert("Enter a deck name.");
      renamedDeckNameInput.focus();
      return;
    }

    // Update the deck name and refresh the interface
    deck.name = name;
    renamedDeckNameInput.value = "";
    renderDecks();
  });

  // Delete the selected deck after confirmation
  deleteDeckButton.addEventListener("click", () => {
    const deck = getSelectedDeck();

    // Ensure a deck is selected
    if (!deck) {
      alert("Select a deck to delete.");
      return;
    }

    // Ask for confirmation before deleting
    if (!confirm(`Delete the deck "${deck.name}"?`)) {
      return;
    }

    // Remove the deck and clear the selection
    const deckIndex = decks.findIndex((item) => item.id === deck.id);
    decks.splice(deckIndex, 1);
    selectedDeckId = null;
    renderDecks();
  });

  // Render the initial interface
  renderDecks();
})();