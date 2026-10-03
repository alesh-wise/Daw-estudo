import type { Book } from "../../shared/type";

async function checkServerAlive(): Promise<void> {
    const statusElement = document.getElementById('status');
    if (!statusElement) { console.error('Elemento com id "status" não encontrado.'); return; }
    try {
        const response = await fetch('http://localhost:3000/api/alive');
        if (!response.ok) { throw new Error(`Erro HTTP: ${response.status}`); }
        const data: {
            message: string;
            book: Book;
        } = await response.json();
        statusElement.innerHTML = ` <p>${data.message}</p> <p> Livro: ${data.book.title}<br> Autor: ${data.book.author}<br> Preço: ${data.book.price}€ </p> `;
    } catch (error: any) {
        statusElement.innerHTML = `<p>Erro ao contactar o servidor: ${error.message}</p> `;
    }
}
checkServerAlive();