let allCharacters = []; // Array para armazenar todos os personagens

async function fetchCharacters() {
    const loadingIndicator = document.getElementById('loading');
    
    loadingIndicator.style.display = 'block'; // Exibe o carregando

    try {
        const response = await fetch('https://apisimpsons.fly.dev/api/personajes?limit=1000');
        
        if (!response.ok) {
            throw new Error('Erro na resposta da rede: ' + response.statusText);
        }
        
        const data = await response.json();

        // Imprime os dados recebidos para depuração
        console.log('Dados recebidos:', data);

        // Verifica se data é um array
        if (Array.isArray(data)) {
            allCharacters = data; // Armazena todos os personagens
            displayCharacters(allCharacters); // Exibe todos os personagens inicialmente
        } else if (data && Array.isArray(data.docs)) { 
            allCharacters = data.docs; // Se os dados estiverem aninhados em 'docs'
            displayCharacters(allCharacters);
        } else {
            throw new Error('Os dados recebidos não são um array.');
        }

    } catch (error) {
        console.error('Erro ao buscar personagens:', error);
        document.getElementById('characters').innerHTML = '<p>Erro ao carregar personagens: ' + error.message + '</p>';
    } finally {
        loadingIndicator.style.display = 'none'; // Oculta o carregando independentemente do resultado
    }
}

function displayCharacters(characters) {
    const charactersDiv = document.getElementById('characters');
    
    charactersDiv.innerHTML = ''; // Limpa a lista antes de exibir
    
    if (!Array.isArray(characters) || characters.length === 0) {
        charactersDiv.innerHTML = '<p>Nenhum personagem encontrado.</p>';
        return;
    }
    
    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'character';
        
        characterDiv.innerHTML = `
            <img src="${character.Imagen}" alt="${character.Nombre}" width="100">
            <div class="character-details">
                <h2>${character.Nombre}</h2>
                <p><strong>História:</strong> ${character.Historia}</p>
                <p><strong>Gênero:</strong> ${character.Genero}</p>
                <p><strong>Estado:</strong> ${character.Estado}</p>
                <p><strong>Ocupação:</strong> ${character.Ocupacion}</p>
            </div>
        `;
        
        charactersDiv.appendChild(characterDiv);
    });
}

// Função para filtrar personagens pelo nome
function filterCharacters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredCharacters = allCharacters.filter(character => 
        character.Nombre.toLowerCase().includes(searchInput)
    );
    
    displayCharacters(filteredCharacters);
}

// Adiciona eventos para pesquisa
document.getElementById('searchButton').addEventListener('click', filterCharacters);
document.getElementById('searchInput').addEventListener('input', filterCharacters);

// Chama a função para buscar os personagens ao carregar a página
fetchCharacters();