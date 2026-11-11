import type { Product } from "../../shared/types.js";

let authToken: string | null = null; // Memória em runtime para guardar o token obtido no login

/**
 * Simulação automatizada de registo e login */
async function runDeveloperSecurityCheck(): Promise<void> {
  try {
    console.log("[Dev Check] A registar administrador para testes...");
    const regRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Professor Web",
        email: "professor@bookstore.com",
        password: "senha_secreta_ebk",
        role: "admin",
      }),
    });
    if (regRes.status === 201) {
      console.log("[Dev Check] Registo do administrador concluído!");
    } else {
      console.log(
        "[Dev Check] Utilizador já registado ou erro. A tentar login direto...",
      );
    }
    console.log("[Dev Check] A tentar efetuar login...");
    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "professor@bookstore.com",
        password: "senha_secreta_ebk",
      }),
    });
    if (loginRes.ok) {
      const loginData = await loginRes.json();
      authToken = loginData.token; // Guarda o token JWT gerado pelo backend
      console.log("[Dev Check] Login com sucesso! Token JWT capturado.");
    } else {
      console.error("[Dev Check] Falha ao autenticar utilizador.");
    }
  } catch (error: any) {
    console.error("[Dev Check] Erro de ligação de segurança:", error.message);
  }
}

/**
 * Carrega a lista de produtos do backend via Fetch API e renderiza no DOM
 */
async function fetchCatalog(): Promise<void> {
  const catalogContainer = document.getElementById("product-catalog");
  if (!catalogContainer) return;
  try {
    const response = await fetch("/api/products");
    if (!response.ok)
      throw new Error(`Erro na comunicação: Status HTTP ${response.status}`);

    const data = (await response.json()) as Product[];
    let string = "";
    data.forEach((product) => {
      string += `Mensagem:${product.name} por ${product.price} através do/a supplier ${product.supplier} \n`;
    });
    catalogContainer.innerText = string;
  } catch (error: any) {
    catalogContainer.innerHTML = `<p style="color: red;">Erro ao carregar catálogo: ${error.message}</p>`;
  }
}

/**
 * Adiciona um produto via POST (rota protegida: requer token JWT de admin)
 */
function setupFormHandler(): void {
  const form = document.getElementById(
    "product-form",
  ) as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault(); // Impede o recarregamento clássico da página

    const nameInput = document.getElementById("name") as HTMLInputElement;
    const supplierInput = document.getElementById(
      "supplier",
    ) as HTMLInputElement;
    const priceInput = document.getElementById("price") as HTMLInputElement;
    const categoryInput = document.getElementById(
      "ProductsCategory",
    ) as HTMLSelectElement;
    const stockInput = document.getElementById("stock") as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "description",
    ) as HTMLTextAreaElement;

    const payload = {
      name: nameInput.value,
      supplier: supplierInput.value,
      price: Number(priceInput.value),
      category: Number(categoryInput.value),
      stock: Number(stockInput.value),
      description: descriptionInput.value,
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const response = await fetch("/api/products", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await response.json();
        form.reset();
        await fetchCatalog(); // Atualiza a lista com o novo produto
      } else {
        const err = await response.json();
        console.error("Erro ao criar produto", response.status, err);
      }
    } catch (error: any) {
      console.error("Erro ao submeter o formulario", error);
    }
  });
}

/**
 * Escuta eventos em tempo real (SSE) provenientes do servidor
 */
function initLivefeed(): void {
  const feedContainer = document.getElementById("live-notifications");
  if (!feedContainer) return;

  const source = new EventSource("/api/events");
  source.onmessage = (event) => {
    const data = JSON.parse(event.data) as { message: string };
    const novoParagrafo = document.createElement("p");
    novoParagrafo.innerText = data.message;
    feedContainer.prepend(novoParagrafo);
  };
}

// Arranque do fluxo sequencial
async function init() {
  await runDeveloperSecurityCheck(); // Executa o login em primeiro lugar
  await fetchCatalog();
  setupFormHandler();
  initLivefeed();
}
init();