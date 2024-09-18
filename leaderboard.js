// Get form and leaderboard container elements
const form = document.getElementById('leaderboard-form');
const leaderboard = document.getElementById('leaderboard');

let leaderboardData = [];

// Load leaderboard data from localStorage when the page loads
window.onload = function () {
  const savedData = localStorage.getItem('leaderboardData');
  if (savedData) {
    leaderboardData = JSON.parse(savedData);
    updateLeaderboard();
  }
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get input values
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const country = document.getElementById('country').value;
  let score = parseInt(document.getElementById('score').value);

  // Create a new entry object
  const entry = { firstName, lastName, country, score };

  // Add the entry to the leaderboard data array
  leaderboardData.push(entry);

  // Save updated data to localStorage
  saveToLocalStorage();

  // Update the leaderboard UI
  updateLeaderboard();

  // Reset form
  form.reset();
});

// Function to update leaderboard UI
function updateLeaderboard() {
  // Sort leaderboard data by score in descending order
  leaderboardData.sort((a, b) => b.score - a.score);

  leaderboard.innerHTML = ''; // Clear the leaderboard

  leaderboardData.forEach((entry, index) => {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');

    // Entry details
    entryDiv.innerHTML = `
      <div>${entry.firstName} ${entry.lastName} (${entry.country})</div>
      <div>Score: ${entry.score}</div>
      <div>
        <button onclick="incrementScore(${index})">+5</button>
        <button onclick="decrementScore(${index})">-5</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;

    leaderboard.appendChild(entryDiv);
  });
}

// Save leaderboard data to localStorage
function saveToLocalStorage() {
  localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

// Increment score by 5
function incrementScore(index) {
  leaderboardData[index].score += 5;
  saveToLocalStorage();
  updateLeaderboard();
}

// Decrement score by 5
function decrementScore(index) {
  leaderboardData[index].score -= 5;
  saveToLocalStorage();
  updateLeaderboard();
}

// Delete an entry from the leaderboard
function deleteEntry(index) {
  leaderboardData.splice(index, 1);
  saveToLocalStorage();
  updateLeaderboard();
}
