import getDados from "./getDados.js";

// MAPEAMENTO DAS SEÇÕES
const elementos = {
    top5: document.querySelector('[data-name="top5"]'),
    lancamentos: document.querySelector('[data-name="lancamentos"]'),
    series: document.querySelector('[data-name="series"]'),
    categoria: document.querySelector('[data-name="categoria"]')
};

const categoriaSelect = document.querySelector('[data-categorias]');
const sections = document.querySelectorAll('.section');

// FUNÇÃO PARA CRIAR LISTA DE SÉRIES
function criarListaFilmes(elemento, dados) {
    const ulExistente = elemento.querySelector('ul');
    if (ulExistente) ulExistente.remove();

    const ul = document.createElement('ul');
    ul.className = 'lista';

    ul.innerHTML = dados.map(serie => `
        <li>
            <a href="/detalhes.html?id=${serie.id}">
                <img src="${serie.poster}" alt="${serie.titulo}">
            </a>
        </li>
    `).join('');

    elemento.appendChild(ul);
}

// CARREGAR HOME (TODAS AS SÉRIES)
function carregarHome() {
    const urls = [
        '/series/top5',
        '/series/lancamentos',
        '/series'
    ];

    Promise.all(urls.map(url => getDados(url)))
        .then(([top5, lancamentos, series]) => {
            criarListaFilmes(elementos.top5, top5);
            criarListaFilmes(elementos.lancamentos, lancamentos);
            criarListaFilmes(elementos.series, series);

            sections.forEach(section => section.classList.remove('hidden'));
            elementos.categoria.classList.add('hidden');
        })
        .catch(() => {
            console.error('Erro ao carregar dados da home');
        });
}

// FILTRAR POR CATEGORIA
function carregarPorCategoria(categoria) {
    if (categoria === 'todos') {
        carregarHome();
        return;
    }

    getDados(`/series/categoria/${categoria}`)
        .then(series => {
            sections.forEach(section => section.classList.add('hidden'));
            elementos.categoria.classList.remove('hidden');

            criarListaFilmes(elementos.categoria, series);
        })
        .catch(() => {
            console.error('Erro ao carregar séries por categoria');
        });
}

// EVENTO SELECT
categoriaSelect.addEventListener('change', () => {
    carregarPorCategoria(categoriaSelect.value);
});

// INICIALIZA A HOME
carregarHome();
