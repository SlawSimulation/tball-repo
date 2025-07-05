let allCharacters = {};

async function loadCharacters() {
  try {
    const response = await fetch('data/frame-data.json');
    const data = await response.json();
    allCharacters = data;
    renderCharacters();
  } catch (error) {
    console.error("Error loading character data:", error);
  }
}

function renderCharacters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const selectedGame = document.getElementById('game-filter').value;

  ['tekken3', 'ttt2', 'tekken8'].forEach(gameId => {
    const container = document.getElementById(`${gameId}-characters`);
    container.innerHTML = ''; // Clear previous

    // Skip if filtering by game and this isn't the selected one
    if (selectedGame !== 'all' && selectedGame !== gameId) {
      return;
    }

    allCharacters[gameId].forEach((char, index) => {
      if (!char.name.toLowerCase().includes(searchTerm)) return;

      const targetId = `char-details-${gameId}-${index}`;

      const card = document.createElement('div');
      card.className = 'character-card';
      card.innerHTML = `
        <img src="${char.artwork}" alt="${char.name}" />
        <h3>${char.name}</h3>
        <button class="toggle-btn" data-target="${targetId}">Show Details</button>
        <div id="${targetId}" class="character-details hidden">
          <p><strong>Style:</strong> ${char.style}</p>
          <p><strong>Main Move:</strong> ${char.main_move}</p>
          <p><strong>Frame:</strong> ${char.frame_data}</p>
        </div>
      `;

      container.appendChild(card);
    });
  });

  // Add toggle button listeners after rendering cards
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.getAttribute('data-target');
      const details = document.getElementById(targetId);
      const isHidden = details.classList.toggle('hidden');
      btn.textContent = isHidden ? 'Show Details' : 'Hide Details';
    };
  });
}

// Initialize everything and attach event listeners
window.onload = () => {
  loadCharacters();
  document.getElementById('search-input').addEventListener('input', renderCharacters);
  document.getElementById('game-filter').addEventListener('change', renderCharacters);
};
