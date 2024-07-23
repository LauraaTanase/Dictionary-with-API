const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchDictionary(query);
  }
});

// Function to search the dictionary
function searchDictionary(query) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(enData => {
      console.log('English data:', enData);

      // Check if data is returned and process accordingly
      if (!enData.length || (enData.title && enData.title === 'No Definitions Found')) {
        resultsContainer.innerHTML = '<p class="text-danger">No definitions found.</p>';
      } else {
        displayResults(enData);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      resultsContainer.innerHTML = '<p class="text-danger">No definitions found.</p>';
    });
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
