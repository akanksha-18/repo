// async function display(){
//     let response=await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
//     let result=await response.json();
//     console.log(result);
//     displayOnScreen(result.results);
// }


// function displayOnScreen(pokemonList){
//     let wrapper=document.querySelector(".wrapper");
//     wrapper.innerHTML='';
//     pokemonList.forEach(pokemon=>{
//         let card=document.createElement("div");
//         card.classList.add("pokemon-card");
//         card.innerHTML=`<div>${pokemon.name}</div>`
//         wrapper.appendChild(card);
//     })

// }
// display();

// async function display() {
    
//     let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
//     let result = await response.json();
//     console.log(result);

    
//     let pokemonPromises = result.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));

//     let pokemonDetailsList = await Promise.all(pokemonPromises);

    
//     displayOnScreen(pokemonDetailsList);
// }

// function displayOnScreen(pokemonList) {
//     let wrapper = document.querySelector(".wrapper");
//     wrapper.innerHTML = '';  

    
//     pokemonList.forEach(pokemonDetails => {
        
//         let card = document.createElement("div");
//         card.classList.add("pokemon-card");

        
//         card.innerHTML = `
//             <h3>${pokemonDetails.name}</h3>
//             <p><strong>Abilities:</strong> ${pokemonDetails.abilities.map(ability => ability.ability.name).join(', ')}</p>
//             <p><strong>Base Experience:</strong> ${pokemonDetails.base_experience}</p>
//             <p><strong>Height:</strong> ${pokemonDetails.height}</p>
//             <p><strong>Weight:</strong> ${pokemonDetails.weight}</p>
//             <p><strong>Types:</strong> ${pokemonDetails.types.map(type => type.type.name).join(', ')}</p>
//         `;

//         wrapper.appendChild(card);  
//     });
// }


// display();



// script.js
let offset = 0;
const limit = 20;
let typeFilter = '';
let searchQuery = '';

async function fetchTypes() {
    let response = await fetch('https://pokeapi.co/api/v2/type/');
    let data = await response.json();
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
    
    // Fetch detailed data for each Pokémon
    let pokemonDetails = await Promise.all(
        data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()))
    );

    // Filter Pokémon based on type and search query
    pokemonDetails = pokemonDetails.filter(pokemon => {
        let matchesType = typeFilter ? pokemon.types.some(type => type.type.name === typeFilter) : true;
        let matchesSearch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return pokemonDetails;
}

function showPokemons(pokemons) {
    let container = document.querySelector(".container");
    container.innerHTML = '';  // Clear the container

    pokemons.forEach(pokemon => {
        let card = document.createElement("div");
        card.classList.add("flip-card");

        card.innerHTML = `
            <div class="flip-card-inner">
                <!-- Front Side -->
                <div class="flip-card-front">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}">
                    <h3>${pokemon.types.map(type => type.type.name).join(', ')}</h3>
                </div>
                <!-- Back Side -->
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
    
    // Update the offset for the next request
    offset += limit;
}

// Add event listeners for the filters and search
document.getElementById('type-filter').addEventListener('change', (e) => {
    typeFilter = e.target.value;
    offset = 0;  // Reset offset when filter changes
    loadMorePokemons();
});

document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    offset = 0;  // Reset offset when search query changes
    loadMorePokemons();
});

// Initial load of Pokémon types for the filter
fetchTypes().then(() => {
    // Initial load of Pokémon
    loadMorePokemons();
});

// Add event listener to the "Load More" button
document.getElementById("load-more-btn").addEventListener("click", loadMorePokemons);
