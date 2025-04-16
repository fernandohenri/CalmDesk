document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('beforeunload', (e) => {
        if (!document.body.classList.contains('fechamento-permitido')) {
            e.preventDefault();
            window.pywebview.api.minimizar_para_bandeja();
            return "Deseja realmente sair? O aplicativo será minimizado para a bandeja.";
        }
        // Quando fechamento-permitido estiver ativo, não faz nada e permite o fechamento
    });
});

// Variáveis globais
let fechamentoPermitido = false;

// Lista de frases de animação
const frasesAnimacao = [
    "Hoje é um novo dia para brilhar! 💪",
    "Você é capaz de conquistar tudo o que deseja! 🚀",
    "Cada pequeno passo te leva mais perto do sucesso. 👣",
    "Acredite em si mesmo e vá em frente! 🌟",
    "O trabalho duro sempre compensa. 💼",
    "Sorria! Você está mais perto do que imagina. 😊",
    "Seja a mudança que você quer ver no mundo. 🌍",
    "Nada é impossível para quem acredita. ✨",
    "O sucesso começa com a decisão de tentar. 🎯",
    "Você é mais forte do que pensa! 💥"
];

// Variáveis de controle para notificações
let notificacao5MinExibida = false;
let notificacaoAlmocoTerminadoExibida = false;
let notificacaoSaidaTerminadoExibida = false;
let notificacaoHoraAlmocoExibida = false;


// Função para selecionar uma frase aleatória
function selecionarFraseAleatoria() {
    const indice = Math.floor(Math.random() * frasesAnimacao.length);
    return frasesAnimacao[indice];
}

// Variáveis globais para o exercício de respiração
let contadorRepeticoes = 0;
const totalRepeticoes = 3;

// Função para iniciar o exercício de respiração
function iniciarExercicioRespira() {
    const bola = document.getElementById('bola');
    const instrucao = document.getElementById('instrucao');

    function aspirar() {
        instrucao.textContent = "Aspire por 4 segundos...";
        bola.style.transform = "scale(1.5)";
        bola.style.transition = "transform 4s ease";
        setTimeout(segurar, 4000);
    }

    function segurar() {
        instrucao.textContent = "Segure por 1 segundo...";
        setTimeout(expirar, 1000);
    }

    function expirar() {
        instrucao.textContent = "Expire por 4 segundos...";
        bola.style.transform = "scale(1)";
        bola.style.transition = "transform 4s ease";
        setTimeout(() => {
            contadorRepeticoes++;
            if (contadorRepeticoes < totalRepeticoes) {
                aspirar();
            } else {
                mostrarTelaFeedback();
            }
        }, 4000);
    }

    aspirar();
}

// Função para mostrar a tela de feedback
function mostrarTelaFeedback() {
    document.getElementById('telaRaiva').classList.remove('show');
    document.getElementById('telaFeedback').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaFeedback').classList.add('show');
    }, 10);
}

// Função para mostrar a tela motivacional
function mostrarTelaMotivacional() {
    document.getElementById('telaFeedback').classList.remove('show');
    document.getElementById('telaMotivacional').style.display = 'block';
    const fraseMotivacional = selecionarFraseAleatoria();
    document.querySelector('.frase-motivacional').textContent = fraseMotivacional;
    setTimeout(() => {
        document.getElementById('telaMotivacional').classList.add('show');
    }, 10);
    setTimeout(() => {
        mostrarTelaConfigAlmoco();
    }, 5000);
}

// Função para repetir o exercício
function repetirExercicio() {
    contadorRepeticoes = 0;
    document.getElementById('telaFeedback').classList.remove('show');
    document.getElementById('telaRaiva').classList.add('show');
    iniciarExercicioRespira();
}

// Event listeners para os botões de feedback
document.getElementById('melhor').addEventListener('click', mostrarTelaMotivacional);
document.getElementById('pior').addEventListener('click', repetirExercicio);

// Função para mostrar a tela de raiva
function mostrarTelaRaiva() {
    document.getElementById('telaSentimentos').classList.remove('show');
    document.getElementById('telaRaiva').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaRaiva').classList.add('show');
        iniciarExercicioRespira();
    }, 10);
}

// Variáveis globais para o cronômetro do almoço
let horarioInicioAlmoco;
let duracaoAlmoco;
let intervaloPreAlmoco;
let intervaloAlmoco;

// Função para mostrar a tela de configuração do horário de almoço
function mostrarTelaConfigAlmoco() {
    document.getElementById('telaSentimentos').classList.remove('show');
    document.getElementById('telaConfigAlmoco').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaConfigAlmoco').classList.add('show');
    }, 10);
}

// Função para salvar o horário de almoço e iniciar o cronômetro de pré-almoço
function salvarHorarioAlmoco() {
    const horarioInicio = document.getElementById('horarioInicio').value;
    const duracao = parseInt(document.getElementById('duracaoAlmoco').value);

    if (!horarioInicio || isNaN(duracao)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Configura o horário
    horarioInicioAlmoco = new Date();
    const [hora, minuto] = horarioInicio.split(':');
    horarioInicioAlmoco.setHours(hora, minuto, 0, 0);

        // Verifica se o horário é menor que a hora atual
    const agora = new Date();
    if (horarioInicioAlmoco <= agora) {
        alert("O horário de início do almoço não pode ser menor ou igual à hora atual.");
        return; // Impede a continuação da função
    }
    // Verifica se já faltam ≤5 minutos
    const tempoRestante = horarioInicioAlmoco.getTime() - agora.getTime();
    const minutosRestantes = Math.floor(tempoRestante / (1000 * 60));

    if (tempoRestante <= 5 * 60 * 1000 && tempoRestante > 0) {
        window.pywebview.api.notificar(
            `Seu almoço começa em ${minutosRestantes} minuto${minutosRestantes !== 1 ? 's' : ''}!`
        );
    }
    if (tempoRestante <= 0) {
        clearInterval(intervaloAlmoco);
        document.getElementById('tempoRestante').textContent = "00:00";
        
        if (!notificacaoHoraAlmocoExibida) {
            window.pywebview.api.notificar("Hora de almoçar!");
            notificacaoHoraAlmocoExibida = true;
        }
        return;
    }
    // Restante da função (iniciar cronômetro, etc.)
    duracaoAlmoco = duracao * 60 * 1000;
    document.getElementById('telaConfigAlmoco').classList.remove('show');
    document.getElementById('telaPreAlmoco').style.display = 'block';
    intervaloPreAlmoco = setInterval(atualizarCronometroPreAlmoco, 1000);
}

// Função para atualizar o cronômetro de pré-almoço
function atualizarCronometroPreAlmoco() {
    const agora = new Date();
    const tempoRestante = horarioInicioAlmoco.getTime() - agora.getTime();

    if (tempoRestante <= 0) {
        clearInterval(intervaloPreAlmoco);
        document.getElementById('iniciarAlmoco').style.display = 'block';
        
        // Notificação quando ZERAR (hora de almoçar)
        if (!notificacaoHoraAlmocoExibida) {
            window.pywebview.api.notificar("Hora de almoçar! 🍽️");
            notificacaoHoraAlmocoExibida = true;
        }
        return;
    }

    // Apenas atualiza o cronômetro (sem alertas)
    const minutos = Math.floor(tempoRestante / (1000 * 60));
    const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);
    document.getElementById('tempoRestantePreAlmoco').textContent = 
        `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

// Função para iniciar o cronômetro do almoço
// Função para iniciar o cronômetro do almoço (só quando o botão é clicado)
function iniciarCronometroAlmoco() {
    // 1. Esconde o botão "Iniciar Almoço"
    document.getElementById('iniciarAlmoco').style.display = 'none';
    
    // 2. Atualiza o horário de início para AGORA (momento do clique)
    horarioInicioAlmoco = new Date(); // <- Isso é o mais importante!
    
    // 3. Mostra a tela do cronômetro
    document.getElementById('telaPreAlmoco').classList.remove('show');
    document.getElementById('telaCronometroAlmoco').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('telaCronometroAlmoco').classList.add('show');
    }, 10);
    
    // 4. Inicia o cronômetro (se já existir um, limpa antes)
    if (intervaloAlmoco) clearInterval(intervaloAlmoco);
    intervaloAlmoco = setInterval(atualizarCronometroAlmoco, 1000);
}

// Função para atualizar o cronômetro do almoço
function atualizarCronometroAlmoco() {
    const agora = new Date();
    const tempoRestante = horarioInicioAlmoco.getTime() + duracaoAlmoco - agora.getTime();
    const voltarBtn = document.getElementById('voltarDoAlmoco');

    if (tempoRestante <= 0) {
        clearInterval(intervaloAlmoco);
        document.getElementById('tempoRestante').textContent = "00:00";
        
        // Habilita o botão e aplica o estilo azul
        voltarBtn.disabled = false;
        voltarBtn.classList.add('ativo'); // <- Adiciona a classe "ativo"

        if (!notificacaoAlmocoTerminadoExibida) {
            window.pywebview.api.notificar("Horário de almoço terminado!");
            notificacaoAlmocoTerminadoExibida = true;
        }
        return;
    }

    // Mantém o botão desativado e cinza enquanto o tempo não zerar
    voltarBtn.disabled = true;
    voltarBtn.classList.remove('ativo'); // <- Remove a classe "ativo"

    // Atualiza o cronômetro
    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);
    document.getElementById('tempoRestante').textContent =
        `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}
// Variáveis globais para o cronômetro de saída
let horarioSaida;
let intervaloSaida;
let intervaloFinalizacao;
let notificacao5MinSaidaExibida = false;

// Função para mostrar a tela de configuração de saída
function mostrarTelaConfigSaida() {
    document.getElementById('telaCronometroAlmoco').classList.remove('show');
    document.getElementById('telaConfigSaida').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaConfigSaida').classList.add('show');
    }, 10);
}

// Função para salvar o horário de saída
function salvarHorarioSaida() {
    const horario = document.getElementById('horarioSaida').value;
    
    if (!horario) {
        alert("Por favor, preencha o horário de saída.");
        return;
    }

    // Configura o horário com tratamento de timezone
    const agora = new Date();
    const [hora, minuto] = horario.split(':').map(Number);
    horarioSaida = new Date(agora);
    horarioSaida.setHours(hora, minuto, 0, 0);
    
    // Ajuste para horário futuro se já passou no dia
    if (horarioSaida <= agora) {
        alert("O horário de saida não pode ser menor ou igual à hora atual.");
        return; // Impede a continuação da função
    }

    // Verifica se já faltam ≤5 minutos
    const tempoRestante = horarioSaida.getTime() - agora.getTime();
    const minutosRestantes = Math.floor(tempoRestante / (1000 * 60));

    if (tempoRestante <= 5 * 60 * 1000 && tempoRestante > 0) {
        window.pywebview.api.notificar(
            `Sua saída será em ${minutosRestantes} minuto${minutosRestantes !== 1 ? 's' : ''}!`
        );
        alertaSaidaExibido = true;
    }

    // Transição para tela de pré-saída
    document.getElementById('telaConfigSaida').classList.remove('show');
    setTimeout(() => {
        document.getElementById('telaConfigSaida').style.display = 'none';
        document.getElementById('telaPreSaida').style.display = 'block';
        setTimeout(() => {
            document.getElementById('telaPreSaida').classList.add('show');
            
            // Inicia o cronômetro (garante que qualquer intervalo anterior seja limpo)
            if (intervaloSaida) clearInterval(intervaloSaida);
            intervaloSaida = setInterval(atualizarCronometroPreSaida, 1000);
        }, 10);
    }, 500);
}
// Função para atualizar o cronômetro de pré-saída
let alertaSaidaExibido = false; // Variável de controle


function atualizarCronometroPreSaida() {
    if (!horarioSaida) return;

    const agora = new Date();
    const tempoRestante = horarioSaida.getTime() - agora.getTime();

    if (tempoRestante <= 0) {
        clearInterval(intervaloSaida);
        document.getElementById('finalizarDia').style.display = 'block';
        document.getElementById('tempoRestantePreSaida').textContent = "00:00:00";
        if (!notificacaoSaidaTerminadoExibida) {
            window.pywebview.api.notificar("Seu expediente acabou");
            notificacaoSaidaTerminadoExibida = true;
        }
        return;
    }

    if (tempoRestante <= 0) {
        clearInterval(intervaloAlmoco);
        document.getElementById('tempoRestante').textContent = "00:00";
        
        // Habilita o botão e aplica o estilo azul
        voltarBtn.disabled = false;
        voltarBtn.classList.add('ativo'); // <- Adiciona a classe "ativo"

        if (!notificacaoSaidaTerminadoExibida) {
            window.pywebview.api.notificar("Seu expediente Acabou");
            notificacaoSaidaTerminadoExibida = true;
        }
        return;
    }

    const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

    document.getElementById('tempoRestantePreSaida').textContent =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    // Alerta único quando faltam ≤5 minutos
    if (tempoRestante <= 5 * 60 * 1000 && !alertaSaidaExibido) {
        const msg = minutos > 0 
            ? `Faltam ${minutos} minuto${minutos !== 1 ? 's' : ''} para sua saída!` 
            : `Faltam ${segundos} segundo${segundos !== 1 ? 's' : ''} para sua saída!`;
        
        window.pywebview.api.notificar(msg);
        alertaSaidaExibido = true;
    }
}

function finalizarDia() {
    // 1. Habilita o fechamento real do programa
    window.pywebview.api.marcar_fechamento_permitido();
    
    // 2. Para qualquer cronômetro ativo
    clearInterval(intervaloSaida);
    
    // 3. Mostra a tela final
    const telaPreSaida = document.getElementById('telaPreSaida');
    const telaFinalizacao = document.getElementById('telaFinalizacao');
    
    telaPreSaida.style.display = 'none';
    telaPreSaida.classList.remove('show');
    
    telaFinalizacao.style.display = 'block';
    setTimeout(() => {
        telaFinalizacao.classList.add('show');
        
        // 4. Fecha o programa após 2 segundos
        setTimeout(() => {
            window.pywebview.api.fechar_programa();
        }, 2000);
    }, 10);
}

// Event listeners
document.getElementById('salvarHorarioSaida').addEventListener('click', salvarHorarioSaida);
document.getElementById('finalizarDia').addEventListener('click', finalizarDia);

// Modificação da função voltarDoAlmoco
function voltarDoAlmoco() {
    clearInterval(intervaloAlmoco);
    notificacaoAlmocoTerminadoExibida = false;
    document.getElementById('telaCronometroAlmoco').classList.remove('show');
    setTimeout(() => {
        mostrarTelaConfigSaida();
    }, 10);
}

// Event listeners para os botões da tela de configuração do almoço
document.getElementById('salvarHorarioAlmoco').addEventListener('click', salvarHorarioAlmoco);
document.getElementById('iniciarAlmoco').addEventListener('click', iniciarCronometroAlmoco);
document.getElementById('voltarDoAlmoco').addEventListener('click', voltarDoAlmoco);

// Alternar entre as telas com transição
document.getElementById('comecarDia').addEventListener('click', () => {
    const telaInicial = document.getElementById('telaInicial');
    const telaSentimentos = document.getElementById('telaSentimentos');

    telaInicial.classList.add('hide');
    setTimeout(() => {
        telaInicial.style.display = 'none';
        telaSentimentos.style.display = 'block';
        setTimeout(() => telaSentimentos.classList.add('show'), 10);
    }, 500);
});

// Capturar a escolha do usuário com animação
const emojiOptions = document.querySelectorAll('.emoji-option');
emojiOptions.forEach(option => {
    option.addEventListener('click', async () => {
        const feeling = option.getAttribute('data-value');

        if (feeling === 'feliz') {
            const telaSentimentos = document.getElementById('telaSentimentos');
            telaSentimentos.classList.add('hide');
            setTimeout(async () => {
                telaSentimentos.style.display = 'none';

                const telaFeliz = document.getElementById('telaFeliz');
                const memeImg = telaFeliz.querySelector('.meme');
                memeImg.src = 'images/meme.jpg'; 
                telaFeliz.style.display = 'block';
                setTimeout(() => {
                    telaFeliz.classList.add('show');
                    // Adicione este setTimeout para esconder o meme após 5 segundos
                    setTimeout(() => {
                        telaFeliz.classList.remove('show');
                        setTimeout(() => {
                            telaFeliz.style.display = 'none';
                            mostrarTelaConfigAlmoco(); // Vai para a tela de config almoço
                        }, 500); // Tempo da animação de saída
                    }, 5000); // Tempo que o meme fica visível
                    }, 10);
                    }
                    , 500);
        } else if (feeling === 'neutro') {
            const telaSentimentos = document.getElementById('telaSentimentos');
            telaSentimentos.classList.add('hide');
            setTimeout(() => {
                telaSentimentos.style.display = 'none';

                const frase = selecionarFraseAleatoria();
                const telaAnimacao = document.getElementById('telaAnimacao');
                const fraseElement = telaAnimacao.querySelector('.frase');
                fraseElement.textContent = frase;
                telaAnimacao.style.display = 'block';
                setTimeout(() => {
                    telaAnimacao.classList.add('show');
                    setTimeout(() => {
                        mostrarTelaConfigAlmoco();
                    }, 5000);
                }, 10);
            }, 500);
        } else if (feeling === 'raiva') {
            mostrarTelaRaiva();
        }
    });
});
// Botão "Minimizar para a bandeja" na tela de animação
document.getElementById('minimizarAnimacao').addEventListener('click', () => {
    window.pywebview.api.minimizar_para_bandeja();
});