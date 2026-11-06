import { app } from './app.js'; // Importa a aplicação Express configurada
export const PORT = 3000;

// TODO: Iniciar o servidor Express a escutar na porta PORT (app.listen) e
// apresentar mensagem de confirmação na consola
app.listen(PORT, () => {
    console.log(`[Backend] Servidor do Lab 3 a correr em
http://localhost:${PORT}`)
})