//TODO SA REFAC BUTONUL DE ADAUGARE LA FAVORITE CA ACUM NU MAI MERGE 
//

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const historyButton = document.getElementById("historyButton");
const clearHistoryButton = document.getElementById("clearHistoryButton");
const favoritesButton = document.getElementById("favoritesButton");
const errorMessage = document.getElementById("errorMessage");
const clearFavoritesButton = document.getElementById("clearFavoritesButton");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    errorMessage.textContent = "";
    searchDictionary(query);
  } else {
    errorMessage.textContent = "Please enter a word";
  }
});

favoritesButton.addEventListener("click", () => {
  const favoritesModal = new bootstrap.Modal(document.getElementById("favoritesModal"));
  favoritesModal.show();
  displayFavorites(); // Populate favorites modal with items
});

clearFavoritesButton.addEventListener("click", clearFavorites);

historyButton.addEventListener("click", () => {
  const historyModal = new bootstrap.Modal(document.getElementById("historyModal"));
  historyModal.show();
  displayHistory();
});

clearHistoryButton.addEventListener("click", clearHistory);

// Funcție pentru a căuta în dicționar
function searchDictionary(query) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data);
      addToHistory(query);
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsContainer.innerHTML = '<p class="text-danger">No definitions found.</p>';
    });
}

// Funcție pentru a adăuga la istoricul căutărilor
function addToHistory(query) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!history.includes(query)) {
    history.push(query);
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }
}

// Afisez istoricul
function displayHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<p>No history available.</p>";
  } else {
    history.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      historyList.appendChild(listItem);
    });
  }
}

// Adaug la favorite
function addToFavorites(word) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(word)) {
    favorites.push(word);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${word} has been added to your favorites.`);
  } else {
    alert(`${word} is already in your favorites.`);
  }
}

// Afisez favoritele
function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesList = document.getElementById("favoritesList");
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>No favorites available.</p>";
  } else {
    favorites.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      favoritesList.appendChild(listItem);
    });
  }
}

// Funcție pentru a șterge favoritele
function clearFavorites() {
  localStorage.removeItem("favorites");
  displayFavorites();
  const favoritesModal = bootstrap.Modal.getInstance(document.getElementById("favoritesModal"));
  if (favoritesModal) {
    favoritesModal.hide();
  }
}

// Funcție pentru a șterge istoricul
function clearHistory() {
  localStorage.removeItem("searchHistory");
  displayHistory(); // Actualizează lista de istoric pentru a reflecta ștergerea
  const historyModal = bootstrap.Modal.getInstance(document.getElementById("historyModal"));
  if (historyModal) {
    historyModal.hide();
  }
}

// Funcție pentru a afișa rezultatele
function displayResults(data) {
  resultsContainer.innerHTML = "";

  data.forEach((entry) => {
    const wordCard = document.createElement("div");
    wordCard.classList.add("card", "mb-3", "p-3", "shadow-sm");
    resultsContainer.appendChild(wordCard);

    const word = document.createElement("h3");
    word.textContent = entry.word;
    word.classList.add("card-title");
    wordCard.appendChild(word);

    if (entry.phonetics) {
      entry.phonetics.forEach((phonetic) => {
        if (phonetic.text) {
          const phoneticText = document.createElement("p");
          phoneticText.textContent = `Phonetic: ${phonetic.text}`;
          phoneticText.classList.add("text-muted", "fst-italic", "mt-2");
          wordCard.appendChild(phoneticText);
        }

        if (phonetic.audio) {
          const audio = document.createElement("audio");
          audio.controls = true;
          audio.classList.add("w-100", "my-2");
          audio.src = phonetic.audio;
          wordCard.appendChild(audio);
        }
      });
    }

    // Add to favorites icon
    const favoriteIcon = document.createElement('i');
    favoriteIcon.classList.add('bi', 'bi-heart', 'text-danger', 'fs-4', 'mt-3', 'cursor-pointer');
    favoriteIcon.addEventListener('click', () => {
      addToFavorites(entry.word);
    });
    wordCard.appendChild(favoriteIcon);

    entry.meanings.forEach((meaning) => {
      const partOfSpeech = document.createElement("h4");
      partOfSpeech.textContent = meaning.partOfSpeech;
      partOfSpeech.classList.add("text-muted", "fst-italic", "mt-3");
      wordCard.appendChild(partOfSpeech);

      meaning.definitions.forEach((definition) => {
        const definitionText = document.createElement("p");
        definitionText.textContent = definition.definition;
        definitionText.classList.add("card-text", "mb-2");
        wordCard.appendChild(definitionText);
      });
    });
  });
}
