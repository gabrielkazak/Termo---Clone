let ganhou = false;
let palavra;
let palavras
let linhaAtiva;
let contaLinha = 1;
let tentativaUm;
let tentativaDois;
let tentativaTres;
let tentativaQuatro;
let tentativaCinco;
let chute;
let arrayPalavra;
let titulo = document.querySelector(".titulo")
let cardFinal = document.querySelector("#card_final")
let overlay = document.querySelector("#overlay")
let textoFinal = document.querySelector("#texto_final")
let btnFinal = document.querySelector("#btn_final")

/*
classes definidas:
    tentativa (é o bloco de tentativva padrao)
    se tentativa estiver na div ativa, assume a forma de um bloco de texto disponivel para inserção de texto
    tentativa_missplace é a letra certa fora do lugar
    tentativa_placed é a letra certo no lugar certo
    tentativa_wrong é a letra errada no lugar errado
*/

//Percorre o arquivo de texto que contem as palavras e envia o array como retorno
async function carregarPalavras() {
    try{
        const resposta = await fetch("palavras.txt");
        const texto = await resposta.text();
        return texto.split(",").map(p=>p.replace(/"/g, "").trim());
    } catch(erro){
        console.error("Erro ao carregar as palavras", erro);
        return []
    } 
}

//Eventos realizados ao iniciar a pagina: receber o array de palavras, selecionar todos os 5 campos da linha a ser utilizada e sortear a palavra
document.addEventListener('DOMContentLoaded', async function(){
    palavras = await carregarPalavras();
    selecionaAtiva();
    selecionaPalavra();
});

//Sobreescrevendo a função natural da tecla enter e utilizando ela para validar o input do usuario
document.addEventListener('keydown', function (e){
    if(e.key === 'Enter'){
        e.preventDefault();
        palavraExiste();
        console.log("Enter")
    }
})

//Configurando o backspace para apagar os caracteres digitados
document.addEventListener('keydown', function (e){
    let tentativa = [tentativaUm, tentativaDois, tentativaTres, tentativaQuatro, tentativaCinco];

    if(contador == 1){
        return
    }
    if(e.key === 'Backspace'){
        contador --;
        tentativa[contador-1].textContent = ''
    }
})

//Configurando o botao de enter do teclado do jogo
document.getElementById("enter").addEventListener("click", function(){
    let eventoEnter = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles:true
    })
    document.dispatchEvent(eventoEnter)
})

//Configurando o botao de backspace do teclado do jogo
document.getElementById("backspace").addEventListener("click", function () {
    let eventoBP = new KeyboardEvent("keydown", {
        key: "Backspace",
        code: "Backspace",
        keyCode: 8,
        which: 8,
        bubbles: true
    });

    document.dispatchEvent(eventoBP);
});

//Verifica se a tecla pressionada pelo usuário é um caracter valido, e só libera o input se for válido
document.addEventListener("keydown", function (e) {
    let letra = e.key.toUpperCase();

    if (/^[A-Z]$/.test(letra)) {  // Verifica se a tecla pressionada é uma letra
        updateDisplay(letra);
    }
});

//Ssorteia a palavra vinda do array pelo indice gerado por, math.floor que arredonda a resposta pra baixo, math.Random sorteia um numero de 0 a 1, e então é multiplicado pelo tamanho da lista, o que permite que todas as palavras possam ser escolhidas, o metodo toUpperCase envia a palavra como maiuscula, padronizando o input//Posterior a isso, a palavra é dividida em um array que será utilizado adiante
function selecionaPalavra(){
    palavra = palavras[Math.floor(Math.random()*palavras.length)].toUpperCase()
    arrayPalavra = palavra.split('')
}

//Seleciona os inputs que irao receber as letras, com base no elemento pai, que terá a classe ativa
function selecionaAtiva(){
    linhaAtiva = document.querySelector(".tentativa_row.ativa"); 
    if (linhaAtiva) {
        tentativaUm = linhaAtiva.querySelector(".tentativa_1"); 
        tentativaDois = linhaAtiva.querySelector(".tentativa_2"); 
        tentativaTres = linhaAtiva.querySelector(".tentativa_3"); 
        tentativaQuatro = linhaAtiva.querySelector(".tentativa_4"); 
        tentativaCinco = linhaAtiva.querySelector(".tentativa_5");
    }
}

//Contador das colunas de input
let contador = 1;

//Atualiza o conteudo textual dos input utilizando um switch que toma como base o contador de colunas, contador ao chegar no fim da linha é mantido em 6 para sempre poder apagar o ultimo elemento primeiro
function updateDisplay(c){
    if(ganhou){
        return
    }

    let char = c
    switch(contador){
        case 1:
            tentativaUm.textContent = char;
            break;
        case 2:
            tentativaDois.textContent = char;
            break;
        case 3:
            tentativaTres.textContent = char;
            break;
        case 4:
            tentativaQuatro.textContent = char;
            break;
        case 5:
            tentativaCinco.textContent = char;
            break;
    }
    contador++;
     if(contador>6){
        contador = 6;
    }
}

//Verifica primeiramente se todos os campos estão diferentes de nulo, depois cria uma string teste ao concatenar todas as letras utilizadas
//é então verificado se o array de palavras inclui a palavra testada pelo usuario, isso é feito para evitar que o usuario trapasseie com palavras como "AEIOU" ou "PQRST", tornando o jogo mais desafiador
function palavraExiste(){
    if (
        tentativaUm.textContent != '' &&
        tentativaDois.textContent != '' &&
        tentativaTres.textContent != '' &&
        tentativaQuatro.textContent != '' &&
        tentativaCinco.textContent != ''
    ) {
        let teste = tentativaUm.textContent + tentativaDois.textContent + tentativaTres.textContent + tentativaQuatro.textContent + tentativaCinco.textContent;
        
        if (palavras.includes(teste.toLowerCase())) {
            verificaPalavra();
            
            setTimeout(() => {
                if (verificaVitoria()){
                    ganhou = true
                    fimDeJogo()
                    return;
                }
                atualizarLinhaAtiva();
            }, 500);
        } else {
            return;
        }
    } else {
        return;
    }
}

//Quando o usuario testar uma palavra valida, mas que nao é a palavra alvo, a proxima linha de caracteres vai receber a classe ativa, e vai ficar disponivel para receber inputs
function atualizarLinhaAtiva() {
    let linhaAtiva = document.querySelector(".tentativa_row.ativa");

    if (linhaAtiva) {
        let todasAsLinhas = document.querySelectorAll(".tentativa_row");
        let indexAtual = Array.from(todasAsLinhas).indexOf(linhaAtiva);
        
        //Se testou a ultima linha, chama o fim de jogo
        if (indexAtual === todasAsLinhas.length - 1) {
            fimDeJogo()
            return;
        }

        linhaAtiva.classList.remove("ativa");

        let proximaLinha = todasAsLinhas[indexAtual + 1];
        proximaLinha.classList.add("ativa");

        selecionaAtiva();
        contador = 1;
        contaLinha++;
    }
}

//Verifica o status de letra a letra, validando se a letra existe na palavra, se esta na posição certa ou errada e etc
function verificaPalavra() {
    let letrasVerificadas = [];
    let letrasContadas = {};

    // Conta quantas vezes cada letra aparece na palavra-alvo
    for (let i = 0; i < arrayPalavra.length; i++) {
        letrasContadas[arrayPalavra[i]] = (letrasContadas[arrayPalavra[i]] || 0) + 1;
    }

    let tentativa = [tentativaUm, tentativaDois, tentativaTres, tentativaQuatro, tentativaCinco];

    // Primeira verificação: letras no lugar certo (tentativa_placed)
    for (let i = 0; i < tentativa.length; i++) {
            if (tentativa[i].textContent === arrayPalavra[i]) {
                tentativa[i].classList.remove('tentativa');
                tentativa[i].classList.add('tentativa_placed');
                letrasVerificadas.push(i);
                letrasContadas[arrayPalavra[i]]--;
            }
    }

    // Segunda verificação: letras na palavra, mas fora do lugar (tentativa_missplace)
    for (let i = 0; i < tentativa.length; i++) {
            let letra = tentativa[i].textContent;
            if (
                letra !== arrayPalavra[i] &&  // Não pode estar na posição correta
                arrayPalavra.includes(letra) &&  // Deve existir na palavra-alvo
                !letrasVerificadas.includes(i) &&  // Ainda não foi marcada como placed
                letrasContadas[letra] > 0 // Ainda restam ocorrências da letra disponíveis
            ) {
                tentativa[i].classList.remove('tentativa');
                tentativa[i].classList.add('tentativa_missplace');
                letrasVerificadas.push(i);
                letrasContadas[letra]--;
            }
        
    }

    // Terceira verificação: letras erradas (tentativa_wrong)
    for (let i = 0; i < tentativa.length; i++) {
            let letra = tentativa[i].textContent;
            if (!letrasVerificadas.includes(i)) { // Se ainda não foi classificada como placed ou misplaced
                tentativa[i].classList.remove('tentativa');
                tentativa[i].classList.add('tentativa_wrong');
            }
    }
    atualizaBotoes()
}

//atualiza os botoes do teclado do jogo, com a mesma logica dos inputs do usuario
function atualizaBotoes() {
    let botoes = document.querySelectorAll("#keyboard_main button"); // Pega todos os botões dentro do teclado
    
    let tentativaAtual = [tentativaUm, tentativaDois, tentativaTres, tentativaQuatro, tentativaCinco];
    let letrasDigitadas = tentativaAtual.map(el => el.textContent);

    botoes.forEach(botao => {
        let letra = botao.textContent.toUpperCase();

        // Ignora botões especiais (Enter e Backspace)
        if (letra === "ENTER" || letra === "-") return;

        // Se a letra foi digitada, mas não faz parte da palavra, apaga
        if (!arrayPalavra.includes(letra) && letrasDigitadas.includes(letra)) {
            botao.classList.remove("botao", "botao_placed", "botao_missplace");
            botao.classList.add("botao_apagado");
        } 
        // Se a letra foi usada em uma tentativa, processa as cores
        else if (letrasDigitadas.includes(letra)) {
            let indicesNaPalavra = arrayPalavra
                .map((l, i) => (l === letra ? i : -1))
                .filter(i => i !== -1);
            let indicesNasTentativas = letrasDigitadas
                .map((l, i) => (l === letra ? i : -1))
                .filter(i => i !== -1);

            // Se a letra está no lugar certo
            if (indicesNaPalavra.some(i => indicesNasTentativas.includes(i))) {
                botao.classList.remove("botao", "botao_apagado", "botao_missplace");
                botao.classList.add("botao_placed");
            } 
            // Se a letra está na palavra, mas fora do lugar, só marca se o usuário testou
            else {
                botao.classList.remove("botao", "botao_apagado", "botao_placed");
                botao.classList.add("botao_missplace");
            }
        }
    });
}

//Verifica se todas as letras tem o atributo placed, que significa que é a letra certa no lugar certo
function verificaVitoria(){
    if(tentativaUm.classList[1] == 'tentativa_placed' && tentativaDois.classList[1] == 'tentativa_placed' && tentativaTres.classList[1] == 'tentativa_placed' && tentativaQuatro.classList[1] == 'tentativa_placed' && tentativaCinco.classList[1] == 'tentativa_placed'){
        return true
    }
    else{
        return false
    }
}

//Se o usuario ganhou, mostra a mensagem de vitoria, caso contrario, mostra a de derrota, e da display no card, com o botao de recomeço
function fimDeJogo(){
    cardFinal.style.display = "flex"
    overlay.style.display = "block"
    if(ganhou){
        if(contaLinha == 1){
            textoFinal.textContent = `Você é um gênio!!!\n Você acertou em ${contaLinha} tentativa`
        }
        else{
            textoFinal.textContent = `Parabéns!!!\n Você acertou em ${contaLinha} tentativas`
        }
    }
    else{
        textoFinal.textContent = `Infelizmente não foi dessa vez :(\n\n A palavra era ${palavra}`
    }
}

//Adiciona a possibilidade do usuario gerar uma nova palavra ao final do jogo
btnFinal.addEventListener("click", function(){
    location.reload()
    })
    