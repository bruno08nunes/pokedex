const spanPokemonName = document.querySelector(".pokemon-name");
const spanPokemonID = document.querySelector(".pokemon-number");
const pokemonImage = document.querySelector(".pokemon-image");
const form = document.querySelector(".form");
const input = document.querySelector(".input-search");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const btnShare = document.querySelector(".btn-share");
const divTypes = document.querySelector(".types");

const urlParams = new URLSearchParams(window.location.search);
let pokemonParam = urlParams.get("pokemon");
let searchPokemon = pokemonParam ?? 1;

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();

        return data;
    }
};

const resetPokemon = () => {
    spanPokemonName.textContent = "Loading...";
    spanPokemonID.textContent = "";
    pokemonImage.classList.remove("second");
    while (divTypes.firstChild) {
        divTypes.removeChild(divTypes.firstChild);
    }
};

const renderNotFound = () => {
    spanPokemonName.textContent = "Not found";
    spanPokemonID.textContent = "??";
    pokemonImage.src = "assets/ghost.gif";
};

const defineSprite = (data) => {
    const isUntilGenerationV = data.id < 650;
    if (!isUntilGenerationV) {
        pokemonImage.classList.add("second");
    }
    const sprites = [
        data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
            "front_default"
        ],
        data["sprites"]["front_default"],
    ];
    const sprite = isUntilGenerationV ? sprites[0] : sprites[1];
    return sprite;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const addTypes = (types) => {
    types.forEach(({ type }) => {
        const imgType = document.createElement("img");
        imgType.src = `assets/${type.name}.png`;
        imgType.alt = capitalize(type.name);
        imgType.title = capitalize(type.name);
        divTypes.appendChild(imgType);
    });
};

const renderPokemonData = ({ name, id, sprite, types }) => {
    spanPokemonName.textContent = name;
    spanPokemonID.textContent = id;
    pokemonImage.src = sprite;
    pokemonImage.alt = name;
    spanPokemonName.title = name;

    addTypes(types);
};

const renderPokemon = async (pokemon) => {
    resetPokemon();
    const data = await fetchPokemon(pokemon);
    if (!data) {
        renderNotFound();
        return;
    }
    const sprite = defineSprite(data);

    renderPokemonData({ ...data, sprite });

    searchPokemon = data.id;

    input.value = "";
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

btnPrev.addEventListener("click", () => {
    if (searchPokemon > 1) {
        searchPokemon--;
        renderPokemon(searchPokemon);
    }
});

btnNext.addEventListener("click", () => {
    searchPokemon++;
    renderPokemon(searchPokemon);
});

btnShare.addEventListener("click", async () => {
    const type = "text/plain";
    const text = `${window.location.href}?pokemon=${spanPokemonName.textContent}`;
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
});

renderPokemon(searchPokemon);
