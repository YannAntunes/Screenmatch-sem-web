import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');

const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescricao = document.getElementById('ficha-descricao');

//   CARREGAR INFORMAÇÕES DA SÉRIE
function carregarInfoSerie() {
    getDados(`/series/${serieId}`)
        .then(data => {
            fichaDescricao.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div>
                    <h2>${data.titulo}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de avaliações:</b> ${data.avaliacao}</p>
                        <p>${data.sinopse}</p>
                        <p><b>Estrelando:</b> ${data.atores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao obter informações da série:', error);
        });
}

//   CARREGAR TEMPORADAS (SELECT)

function carregarTemporadas() {
    getDados(`/series/${serieId}/temporadas/todas`)
        .then(data => {

            const temporadasUnicas = [
                ...new Set(data.map(t => t.temporada))
            ].sort((a, b) => a - b);

            listaTemporadas.innerHTML = '';

            // Opção padrão
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione a temporada';
            listaTemporadas.appendChild(optionDefault);

            // Temporadas numéricas
            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });

            // Todas as temporadas
            const optionTodas = document.createElement('option');
            optionTodas.value = 'todas';
            optionTodas.textContent = 'Todas as temporadas';
            listaTemporadas.appendChild(optionTodas);

            // Top 5 episódios
            const optionTop5 = document.createElement('option');
            optionTop5.value = 'top5';
            optionTop5.textContent = 'Top 5 episódios';
            listaTemporadas.appendChild(optionTop5);
        })
        .catch(error => {
            console.error('Erro ao obter temporadas:', error);
        });
}

 //  CARREGAR EPISÓDIOS
function carregarEpisodios() {
    const valor = listaTemporadas.value;

    fichaSerie.innerHTML = '';

    if (!valor) return;

    // TODAS AS TEMPORADAS
    if (valor === 'todas') {
        getDados(`/series/${serieId}/temporadas/todas`)
            .then(data => renderizarEpisodios(data))
            .catch(error => console.error(error));
        return;
    }

    // TOP 5 EPISÓDIOS
    if (valor === 'top5') {
        getDados(`/series/${serieId}/temporadas/top5`)
            .then(data => renderizarEpisodios(data))
            .catch(error => console.error(error));
        return;
    }

    // TEMPORADA ESPECÍFICA
    getDados(`/series/${serieId}/temporadas/${valor}`)
        .then(data => renderizarEpisodios(data))
        .catch(error => console.error(error));
}

//  RENDERIZAR EPISÓDIOS

function renderizarEpisodios(data) {
    fichaSerie.innerHTML = '';

    const temporadasUnicas = [...new Set(data.map(e => e.temporada))];

    temporadasUnicas.forEach(temporada => {
        const p = document.createElement('p');
        p.textContent = `Temporada ${temporada}`;

        const ul = document.createElement('ul');
        ul.className = 'episodios-lista';

        data
            .filter(e => e.temporada === temporada)
            .forEach(ep => {
                const li = document.createElement('li');
                li.textContent = `${ep.numeroEpisodio} - ${ep.titulo}`;
                ul.appendChild(li);
            });

        fichaSerie.appendChild(p);
        fichaSerie.appendChild(ul);
    });
}

//   EVENTOS E INIT
listaTemporadas.addEventListener('change', carregarEpisodios);

carregarInfoSerie();
carregarTemporadas();
