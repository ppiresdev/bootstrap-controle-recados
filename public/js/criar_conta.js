"use strict";
const inputUsuarioEl = document.getElementById("inputCriarUser");
const inputSenhaEl = document.getElementById("inputCriarPassword");
const inputRepetirSenhaEl = document.getElementById("inputRepetirPassword");
const btnCriarContaEl = document.getElementById("btnCriarConta");
//Função criarUsuario está associada ao evento click do botão #btnCriarConta
//O cadastro é feito com e-mail do usuário
//Não permite e-mail repetido
//É sugerido que o e-mail seja digitado em letras minúsculas
//Caso seja digitada alguma letra maiúscula, ele será convertida para minúscula
//Assim, A@gmail.com e a@gmail.com são compreendidos como e-mails iguais
const criarUsuario = (event) => {
    event.preventDefault();
    const email = inputUsuarioEl.value.toLowerCase();
    const senha = inputSenhaEl.value;
    const senhaRepetida = inputRepetirSenhaEl.value;
    const emailValido = validaInput(inputUsuarioEl, padraoEmail);
    const senhaValida = validaInput(inputSenhaEl, padraoSenha);
    const camposPreenchidosCorretamente = emailValido && senhaValida && senha === senhaRepetida;
    const usuarioJaExiste = verificaSeUsuarioRepetido();
    //Caso haja alguma irregularidade no preenchimento dos campos,
    //são exibidas as respectivas mensagens de erros,
    //que estão disponíveis no objeto objMsgsErro em utils.ts
    ocultaMsgErroUsuarioRepetido();
    exibeMsgsPreenchimentoEmail(inputUsuarioEl);
    exibeMsgsPreenchimentoSenha(inputSenhaEl);
    exibeMsgsPreenchimentoRepetirSenha(inputRepetirSenhaEl);
    if (camposPreenchidosCorretamente && !usuarioJaExiste) {
        const usuario = {
            email: email,
            senha: senha,
            recados: [],
        };
        //gravar usuário
        insereObjetoNaLocalStorage("usuarios", usuario);
        gravaNaSessionStorage("usuarioCorrente", usuario.email.toLowerCase());
        document.location.href = "./recados.html";
    }
    if (usuarioJaExiste) {
        exibeMsgErroUsuarioRepetido();
    }
};
const verificaSeUsuarioRepetido = () => {
    const listaUsuarios = recuperaDaLocalStorage("usuarios");
    const emailDigitado = inputUsuarioEl.value.toLowerCase();
    const usuarioJaExiste = !!listaUsuarios.find((us) => us.email === emailDigitado);
    return usuarioJaExiste;
};
//Evento para o botão "CRIAR CONTA AGORA"
btnCriarContaEl?.addEventListener("click", criarUsuario);
