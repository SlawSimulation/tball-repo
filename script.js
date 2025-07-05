async function loadCharacters(gameId, containerId) {
  const response = await fetch('data/frame-data.json');
  const data = await response.json();
  const characters = data[gameId];

  const container = document.getElementById(containerId);
  characters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <img src="${char.artwork}" alt="${char.name}">
      <h3>${char.name}</h3>
      <p><strong>Style:</strong> ${char.style}</p>
      <p><strong>Main Move:</strong> ${char.main_move}</p>
      <p><strong>Frame:</strong> ${char.frame_data}</p>
    `;
    container.appendChild(card);
  });
}

window.onload = () => {
  loadCharacters('tekken3', 'tekken3-characters');
  loadCharacters('ttt2', 'ttt2-characters');
  loadCharacters('tekken8', 'tekken8-characters');
};
