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