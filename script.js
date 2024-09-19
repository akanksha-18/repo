let offset = 0;
const limit = 20;
let typeFilter = '';
let searchQuery = '';
let localArray = [];
let tempArray = [];

async function fetchTypes() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
    let data = await response.json();
    localArray.push(data);
    console.log(localArray);
    
    let string = JSON.stringify(data);
    localStorage.setItem("Pokemons", string);
    
    populateTypeFilter(data.results);
}

function populateTypeFilter(types) {
    const typeFilter = document.getElementById('type-filter');
    types.forEach(type => {
        let option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
        typeFilter.appendChild(option);
    });
}

async function fetchPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await fetch(url);
    let data = await response.json();
    tempArray.push(...data.results); 

    let pokemonDetails = await Promise.all(
        data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
    );

    pokemonDetails = pokemonDetails.filter(pokemon => {
        let matchesType = typeFilter ? pokemon.types.some(type => type.type.name === typeFilter) : true;
        let matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });
    
    return pokemonDetails;
}

function showPokemons(pokemons) {
    let container = document.querySelector(".container");
    pokemons.forEach(pokemon => {
        let card = document.createElement("div");
        card.classList.add("flip-card");

        card.innerHTML = `
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}">
                    <h3>${pokemon.types.map(type => type.type.name).join(', ')}</h3>
                </div>
                <div class="flip-card-back">
                    <h3>${pokemon.name}</h3>
                    <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
                    <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
                    <p><strong>Height:</strong> ${pokemon.height}</p>
                    <p><strong>Weight:</strong> ${pokemon.weight}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

async function loadMorePokemons() {
    let pokemons = await fetchPokemons();
    showPokemons(pokemons);
    offset += limit; 
}

document.getElementById('type-filter').addEventListener('change', (e) => {
    typeFilter = e.target.value;
    offset = 0;  
    document.querySelector(".container").innerHTML = ''; 
    loadMorePokemons();
});

document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    offset = 0; 
    document.querySelector(".container").innerHTML = ''; 
    loadMorePokemons();
});

fetchTypes().then(() => {
    loadMorePokemons(); 
});

document.getElementById("load-more-btn").addEventListener("click", loadMorePokemons);
