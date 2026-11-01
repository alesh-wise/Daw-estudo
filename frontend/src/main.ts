// TODO: Importar a interface Book a partir do ficheiro partilhado '../../shared/types'
import type { Product } from '../../shared/types'
/**
* Efetua um pedido HTTP GET ao backend utilizando a Fetch API nativa
*/
async function checkServerAlive(): Promise<void> {
    // TODO: Obter o elemento HTML com id "status"
    const elemento = document.getElementById("alive-status")
    if (!elemento) return;
    try {
        const response = await fetch('http://localhost:3000/api/alive')

        if (!response.ok) {
            throw new Error(`Erro na comunicação ${response.status}`)

        }
        const data = await response.json() as {
            message: string;
            status: string;
            timestamp: string;
            preview: Product;
        }

        elemento.innerText = `Mensagem: ${data.message} | Status: ${data.status} | Produto de Teste: ${data.preview.name} (€${data.preview.price})`;


    }
    // Executa a verificação ao carregar o script
    catch (error: any) {
        elemento.innerText = `Erro ao contactar o servido ${error.message}`
    }
}
checkServerAlive();

async function fetchCatalog(): Promise<void> {
 const catalogContainer = document.getElementById('books-catalog');
 if (!catalogContainer) return;
 try {
 // TODO: Efetuar o pedido HTTP GET para 'http://localhost:3000/api/books' usando fetch()
    const response = await fetch('http://localhost:3000/api/products')
    const data = await response.json() as Product[]
 // TODO: Converter a resposta para JSON (Book[])
    
    let string = "";

    data.forEach((product) => {
        string += `Mensagem:${product.name} por ${product.price} através do/a supplier ${product.supplier} \n`
    })
    catalogContainer.innerText=string;
 // TODO: Percorrer a lista de livros e injetar a estrutura HTML com os dados (título, autor, preço, stock) no innerHTML de catalogContainer
 } catch (error: any) {
 catalogContainer.innerHTML = `<p style="color: red;">Erro ao carregar
catálogo: ${error.message}</p>`;
 }
}
/**
* Inicializa a escuta de eventos em tempo real provenientes do servidor (SSE)
*/
function initLivefeed(): void {
    const feedContainer = document.getElementById('live-notifications');
    if (!feedContainer) return;
    // TODO: Instanciar o objeto EventSource a apontar para 'http://localhost:3000/api/events'
    const source = new EventSource('http://localhost:3000/api/events');
    // TODO: Definir o manipulador eventSource.onmessage para receber os eventos do servidor
    source.onmessage = event => {
        // TODO: Converter os dados do evento (event.data) para objeto JSON
        const data = JSON.parse(event.data) as
            {
                message: string;
            };
        // TODO: Criar um elemento parágrafo (<p>) com a mensagem da notificação e adicionar ao topo de feedContainer
        const novoParagrafo = document.createElement('p');
        novoParagrafo.innerText = data.message;
        if (feedContainer) {
            feedContainer.prepend(novoParagrafo);
        }
    };
}
// Execução inicial
fetchCatalog();
initLivefeed();