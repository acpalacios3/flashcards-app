
const STORAGE_KEY = "flashcards-study-app";
let storageCanWrite = true;

function loadState() {
  const emptyState = {
    version: 1,
    decks: [],
    activeDeckId: null,
  };

  try {
    const savedText = localStorage.getItem(STORAGE_KEY);

    if (savedText === null) {
      return emptyState;
    }

    const savedState = JSON.parse(savedText);

    if (
      savedState?.version !== 1 ||
      !Array.isArray(savedState.decks)
    ) {
      storageCanWrite = false;
      return emptyState;
    }

    const usedDeckIds = new Set();
    const usedCardIds = new Set();

    const decks = savedState.decks.map((deck) => {
      if (
        !deck ||
        (typeof deck.id !== "string" &&
          typeof deck.id !== "number") ||
        usedDeckIds.has(String(deck.id)) ||
        typeof deck.name !== "string" ||
        !Array.isArray(deck.flashcards)
      ) {
        throw new Error("Invalid saved deck data.");
      }

      usedDeckIds.add(String(deck.id));

      const flashcards = deck.flashcards.map((card) => {
        const cardId = card?.cardId ?? card?.id;

        if (
          !card ||
          (typeof cardId !== "string" &&
            typeof cardId !== "number") ||
          usedCardIds.has(String(cardId)) ||
          typeof card.question !== "string" ||
          typeof card.answer !== "string"
        ) {
          throw new Error("Invalid saved flashcard data.");
        }

        usedCardIds.add(String(cardId));

        return {
          ...card,
          cardId,
        };
      });

      return {
        ...deck,
        flashcards,
      };
    });

    return {
      version: 1,
      decks,
      activeDeckId: savedState.activeDeckId ?? null,
    };
  } catch (error) {
    // Do not overwrite unreadable or invalid saved data.
    storageCanWrite = false;
    return emptyState;
  }
}

function saveState(state) {
  if (
    !storageCanWrite ||
    !state ||
    !Array.isArray(state.decks)
  ) {
    return false;
  }

  try {
    console.log("💾 Data update:", state);
    
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        decks: state.decks,
        activeDeckId: state.activeDeckId ?? null,
      })
    );

    return true;
  } catch (error) {
    // Disable further writes if storage is unavailable.
    storageCanWrite = false;
    return false;
  }
}
