// TODO: Implementar a função assíncrona para adicionar livro via POST
function setupFormHandler(): void {
    const form = document.getElementById('product-form') as HTMLFormElement | null;
    if (!form) return;

    form.addEventListener('submit', async (event: Event) => {
        event.preventDefault();
         // Impede o recarregamento clássico da página
        // Captura os valores introduzidos nos inputs
        const nameInput = document.getElementById('name') as
            HTMLInputElement;
        const supplierInput = document.getElementById('supplier') as
            HTMLInputElement;
        const priceInput = document.getElementById('price') as
            HTMLInputElement;
        const categoryInput = document.getElementById('ProductsCategory') as
            HTMLSelectElement;
        const stockInput = document.getElementById('stock') as
            HTMLInputElement;
        const descriptionInput = document.getElementById('description') as
            HTMLTextAreaElement;

        const payload = {
            name: nameInput.value,
            supplier: supplierInput.value,
            price: Number(priceInput.value),
            category: Number(categoryInput.value),
            stock: Number(stockInput.value),
            description: descriptionInput.value
        };

        // ...envio de POST
        try{
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if(response.ok) {
                const newProduct = await response.json();
                form.reset();
            }
            else {
                const err = await response.json();
                console.error ('Erro ao criar produto', response.status, err);
            }
        }
        catch (error: any){
            console.error('Erro ao submeter o formulario', error);
        }
        
    });
};

// TODO: Instanciar o EventSource para escutar a stream SSE em '/api/events' e
//processar as mensagens recebidas(eventSource.onmessage)
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
};

// Executar as chamadas às funções
setupFormHandler();
initLivefeed();