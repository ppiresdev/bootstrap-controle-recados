"use strict";
const usuarioAtual = recuperaDaSessionStorage("usuarioCorrente");
const descricaoEl = document.getElementById("descricao");
const detalhamentoEl = document.getElementById("detalhamento");
const addRecadoEl = document.getElementById("addRecado");
const usuarioUsandoAppEl = document.getElementById("usuarioUsandoApp");
const alertSucessoEl = document.getElementById("alertSucesso");
const alertPreencherCamposEl = document.getElementById("alertPreencher");
const btnSairEl = document.getElementById("btnSair");
//Variável que define se o botão editar foi clicado pelo usuário.
//Ou seja, acaoEditar controla se estamos editando um recado ou salvando um novo
let acaoEditar = false;
//guarda o indice do recado que está sendo editado
//Usado nas funções editaRecado, salvarRecado e atualizaRecado
let indiceParaEditar = 0;
//Usado nas funções preparaExclusao e excluirRecado
let indiceParaExcluir = 0;
const validaRecados = () => {
    const descricao = descricaoEl.value;
    const detalhamento = detalhamentoEl.value;
    return descricao !== "" && detalhamento !== "";
};
const limpaInputs = () => {
    descricaoEl.value = "";
    detalhamentoEl.value = "";
};
const criaLinha = (recado, index) => {
    const novaLinha = document.createElement("tr");
    novaLinha.classList.add("align-middle");
    novaLinha.innerHTML = `
        <td data-title="#" class="text-center">${index + 1}</td>
        <td data-title="Descrição">${recado.descricao}</td>
        <td data-title="Detalhamento">${recado.detalhamento}</td>

        <td data-title="Ações" class="text-center">


        <button
        type="button"
        class="button red"
        data-bs-toggle="modal"
        data-bs-target="#excluirModal"
        onclick="preparaExclusao(${index})"
        >
          Excluir
        </button>
        <button type="button" onclick="editaRecado(${index})" class="button green">
          Editar
        </button>
      </td>
      `;
    document.querySelector("#tabelaRecados>tbody")?.appendChild(novaLinha);
};
const geraLinhasTabela = () => {
    const listaRecados = recuperaListaRecadosUsuarioAtual();
    listaRecados.forEach(criaLinha);
};
const editaRecado = (index) => {
    acaoEditar = true;
    indiceParaEditar = index;
    carregaRecadoNosInputs(index);
};
const recuperaListaRecadosUsuarioAtual = () => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    let listaRecados = [];
    const posicaoUsuarioNaLista = listaUsuarios.findIndex((us) => us.email === usuarioAtual);
    if (posicaoUsuarioNaLista > -1) {
        const objUsuario = listaUsuarios[posicaoUsuarioNaLista];
        listaRecados = objUsuario.recados;
    }
    return listaRecados;
};
const excluiTodasLinhasTabela = () => {
    const linhas = document.querySelectorAll("#tabelaRecados>tbody tr");
    linhas.forEach((linha) => linha.parentNode?.removeChild(linha));
};
const atualizaTabelaNaTela = () => {
    excluiTodasLinhasTabela();
    geraLinhasTabela();
};
const salvarRecado = (evento) => {
    evento.preventDefault();
    const recadosEstaoPreenchidos = validaRecados();
    if (recadosEstaoPreenchidos) {
        const descricao = descricaoEl.value;
        const detalhamento = detalhamentoEl.value;
        const recado = {
            descricao: descricao,
            detalhamento: detalhamento,
        };
        if (!acaoEditar) {
            gravaRecado(recado);
        }
        if (acaoEditar) {
            atualizaRecado(indiceParaEditar);
        }
        limpaInputs();
        exibeOcultaAlert(alertSucessoEl);
    }
    if (!recadosEstaoPreenchidos) {
        exibeOcultaAlert(alertPreencherCamposEl);
    }
    atualizaTabelaNaTela();
    descricaoEl.focus();
};
const atualizaRecado = (indice) => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    const posicaoUsuarioNaLista = posicaoUsuarioAtualNaListaUsuarios();
    const listaRecados = recuperaListaRecadosUsuarioAtual();
    const recado = listaRecados[indice];
    recado.descricao = descricaoEl.value;
    recado.detalhamento = detalhamentoEl.value;
    listaRecados[indice] = recado;
    listaUsuarios[posicaoUsuarioNaLista].recados = listaRecados;
    gravaNaLocalStorage("usuarios", listaUsuarios);
    acaoEditar = false;
};
const carregaRecadoNosInputs = (indice) => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    const posicaoUsuarioNaLista = posicaoUsuarioAtualNaListaUsuarios();
    if (posicaoUsuarioNaLista >= 0) {
        const listaRecados = listaUsuarios[posicaoUsuarioNaLista].recados;
        const recado = listaRecados[indice];
        descricaoEl.value = recado.descricao;
        detalhamentoEl.value = recado.detalhamento;
        descricaoEl.focus();
    }
};
const preparaExclusao = (indice) => (indiceParaExcluir = indice);
const excluirRecado = () => apagaRecado(indiceParaExcluir);
const apagaRecado = (indice) => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    const recado = listaUsuarios[indice];
    const posicaoUsuarioNaLista = posicaoUsuarioAtualNaListaUsuarios();
    limparInput(descricaoEl);
    limparInput(detalhamentoEl);
    if (posicaoUsuarioNaLista >= 0) {
        const listaRecados = listaUsuarios[posicaoUsuarioNaLista].recados;
        listaRecados.splice(indice, 1);
        listaUsuarios[posicaoUsuarioNaLista].recados = listaRecados;
        gravaNaLocalStorage("usuarios", listaUsuarios);
    }
    atualizaTabelaNaTela();
    descricaoEl.focus();
    exibeOcultaAlert(alertSucessoEl);
};
const gravaRecado = (recado) => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    let objUsuario;
    const posicaoUsuarioNaLista = posicaoUsuarioAtualNaListaUsuarios();
    if (posicaoUsuarioNaLista > -1) {
        objUsuario = listaUsuarios[posicaoUsuarioNaLista];
        objUsuario.recados.push(recado);
        listaUsuarios[posicaoUsuarioNaLista] = objUsuario;
        gravaNaLocalStorage("usuarios", listaUsuarios);
        limparInput(descricaoEl);
        limparInput(detalhamentoEl);
    }
};
const posicaoUsuarioAtualNaListaUsuarios = () => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    const posicaoUsuarioNaLista = listaUsuarios.findIndex((us) => us.email === usuarioAtual);
    return posicaoUsuarioNaLista;
};
const sairAplicacao = () => {
    limpaSessionStorage();
    document.location.href = "./index.html";
};
const exibeOcultaAlert = (alert) => {
    setTimeout(() => {
        alert.classList.toggle("d-none");
    }, 100);
    setTimeout(() => {
        alert.classList.toggle("d-none");
    }, 1200);
};
addRecadoEl.addEventListener("click", salvarRecado);
btnSairEl.addEventListener("click", sairAplicacao);
document.addEventListener("DOMContentLoaded", () => {
    atualizaTabelaNaTela();
    usuarioUsandoAppEl.innerHTML = `${usuarioAtual}`;
    descricaoEl.focus();
});
