// Caminho para o JSON (ajuste se necessário)
const DATA_URL = "dados.json";

// Elementos da DOM
const select = document.getElementById("consultaSelect");
const btn = document.getElementById("btnConsultar");
const resultado = document.getElementById("resultado");

/**
 * Mostra mensagens ou dados na tela.
 * @param {string | HTMLElement} content
 */
function render(content) {
  if (typeof content === "string") {
    resultado.innerHTML = `<div class="card"><p>${content}</p></div>`;
  } else {
    resultado.innerHTML = "";
    resultado.appendChild(content);
  }
}

/**
 * Constrói um card <div> com lista não‑ordenada.
 * @param {string} titulo
 * @param {string[]} itens
 * @returns {HTMLElement}
 */
function buildListCard(titulo, itens) {
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = titulo;
  card.appendChild(title);

  const ul = document.createElement("ul");
  itens.forEach((txt) => {
    const li = document.createElement("li");
    li.textContent = txt;
    ul.appendChild(li);
  });
  card.appendChild(ul);
  return card;
}

/**
 * Faz o fetch do JSON e processa o resultado segundo a seleção.
 */
async function consultar() {
  const opcao = select.value;
  if (!opcao) {
    render("Por favor, selecione uma consulta válida.");
    return;
  }

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error("Falha ao carregar o JSON");
    const data = await response.json();

/**
 * Formata um número como moeda brasileira.
 * @param {number} valor
 * @returns {string}
 */
function toBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


    switch (opcao) {
  case "funcionarios":
    render(
      `Total de Funcionários: <strong>${data.numeroFuncionarios}</strong>`
    );
    break;

  case "departamentos":
    render(buildListCard("Departamentos", data.departamentos));
    break;

  case "projetos":
    render(buildListCard("Projetos Atuais", data.projetosAtuais));
    break;

  case "salarioMedio":
    render(
      `Salário Médio: <strong>${toBRL(data.salarioMedio)}</strong>`
    );
    break;

  case "lucroMedio":
    render(
      `Lucro da Empresa: <strong>${toBRL(data.lucroMedio)}</strong>`
    );
    break;

  case "lideres":
  // Combina departamentos + líderes pela ordem nos arrays
  const pares = data.departamentos.map((dep, i) => {
    const lider = data.lideresDepartamentos[i] || "—";
    return `${dep}: ${lider}`;
  });
  render(buildListCard("Líderes dos Departamentos", pares));
  break;

  default:
    render("Consulta não reconhecida.");
}

  } catch (err) {
    console.error(err);
    render("Ocorreu um erro ao realizar a consulta. Verifique o console para detalhes.");
  }
}

btn.addEventListener("click", consultar);
