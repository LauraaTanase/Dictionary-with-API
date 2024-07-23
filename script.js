//TODO LIST:
//1.Sa fac o functie sa pot adauga un cuvant la favorite
//2.Sa fac un buton in modalul de history unde pot sa sterg history-ul
//3.Sa mai lucrez la design-ul paginilor
//Pup paaaa


const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const historyButton =document.getElementById("historyButton")

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchDictionary(query);
  }
});



//TODO EROAARE AICII!!!
historyButton.addEventListener('click', () => {
    displayHistory(); // Populate modal with search history
    const historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    historyModal.show();
  });


// Function to search the dictionary
function searchDictionary(query) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then(response => response.json())
    .then(data => {
      displayResults(data);
      addToHistory(query); // Add the search query to history
    })
    .catch(error => {
      console.error('Error:', error);
      resultsContainer.innerHTML = '<p class="text-danger">No definitions found.</p>';
    });
}
// Add the search query to history
function addToHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(query)) {
      history.push(query);
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
  }

  // Display search history in the modal
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
  
    if (history.length === 0) {
      historyList.innerHTML = '<p>No history available.</p>';
    } else {
      history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        historyList.appendChild(listItem);
      });
    }
  }
// Function to display results
function displayResults(data) {
  resultsContainer.innerHTML = '';

  data.forEach(entry => {
    const wordCard = document.createElement('div');
    wordCard.classList.add('card', 'mb-3', 'p-3', 'shadow-sm');
    resultsContainer.appendChild(wordCard);

    const word = document.createElement('h3');
    word.textContent = entry.word;
    word.classList.add('card-title');
    wordCard.appendChild(word);


    //Afisare transcrire fonetica//
    if (entry.phonetics) {
        entry.phonetics.forEach(phonetic => {
          if (phonetic.text) {
            const phoneticText = document.createElement('p');
            phoneticText.textContent = `Phonetic: ${phonetic.text}`;
            phoneticText.classList.add('text-muted', 'fst-italic', 'mt-2');
            wordCard.appendChild(phoneticText);
          }
        });
      }

    if (entry.phonetics) {
      entry.phonetics.forEach(phonetic => {
        if (phonetic.audio) {
          const audio = document.createElement('audio');
          audio.controls = true;
          audio.classList.add('w-100', 'my-2');
          audio.src = phonetic.audio;
          wordCard.appendChild(audio);
        }
      });
    }

    entry.meanings.forEach(meaning => {
      const partOfSpeech = document.createElement('h4');
      partOfSpeech.textContent = meaning.partOfSpeech;
      partOfSpeech.classList.add('text-muted', 'fst-italic', 'mt-3');
      wordCard.appendChild(partOfSpeech);

      meaning.definitions.forEach(definition => {
        const definitionText = document.createElement('p');
        definitionText.textContent = definition.definition;
        definitionText.classList.add('card-text', 'mb-2');
        wordCard.appendChild(definitionText);
      });
    });
  });
}
