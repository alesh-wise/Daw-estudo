async function checkServerAlive() {
    const statusElement = document.getElementById('status');
    if (!statusElement) {
        console.error('Elemento com id "status" não encontrado.');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/alive');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        statusElement.innerHTML = ` <p>${data.message}</p> <p> Livro: ${data.preview.title}<br> Autor: ${data.preview.author}<br> Preço: ${data.preview.price}€ </p> `;
    }
    catch (error) {
        statusElement.innerHTML = `<p>Erro ao contactar o servidor: ${error.message}</p> `;
    }
}
checkServerAlive();
export {};
//# sourceMappingURL=main.js.map