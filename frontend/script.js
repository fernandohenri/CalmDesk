// Credenciais da API Imgflip
const USERNAME = 'bearod';
const PASSWORD = 'Bea@2025';

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

// Função para selecionar uma frase aleatória
function selecionarFraseAleatoria() {
    const indice = Math.floor(Math.random() * frasesAnimacao.length);
    return frasesAnimacao[indice];
}

// Função para gerar um meme
async function gerar_meme() {
    const template_id = '181913649';
    const texto_superior = "Usar APIs";
    const texto_inferior = "Criar memes automaticamente";

    const url = 'https://api.imgflip.com/caption_image';
    const params = new URLSearchParams({
        template_id: template_id,
        username: USERNAME,
        password: PASSWORD,
        text0: texto_superior,
        text1: texto_inferior
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url;
        } else {
            console.error("Erro na API:", data.error_message);
            return null;
        }
    } catch (error) {
        console.error("Erro ao gerar o meme:", error);
        return null;
    }
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

    horarioInicioAlmoco = new Date();
    const [hora, minuto] = horarioInicio.split(':');
    horarioInicioAlmoco.setHours(hora, minuto, 0, 0);

    duracaoAlmoco = duracao * 60 * 1000;

    // Resetar variáveis de notificação
    notificacao5MinExibida = false;
    notificacaoAlmocoTerminadoExibida = false;

    // Mostrar a tela do cronômetro de pré-almoço
    document.getElementById('telaConfigAlmoco').classList.remove('show');
    document.getElementById('telaPreAlmoco').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaPreAlmoco').classList.add('show');
    }, 10);

    // Iniciar o cronômetro de pré-almoço
    intervaloPreAlmoco = setInterval(atualizarCronometroPreAlmoco, 1000);
}

// Função para atualizar o cronômetro de pré-almoço
function atualizarCronometroPreAlmoco() {
    const agora = new Date();
    const tempoRestante = horarioInicioAlmoco.getTime() - agora.getTime();

    if (tempoRestante <= 0) {
        clearInterval(intervaloPreAlmoco);
        document.getElementById('iniciarAlmoco').style.display = 'block';
        notificacao5MinExibida = false;
        return;
    }

    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

    document.getElementById('tempoRestantePreAlmoco').textContent =
        `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    // Exibir notificação quando faltar 5 minutos (apenas uma vez)
    if (tempoRestante <= 5 * 60 * 1000 && !notificacao5MinExibida) {
        window.pywebview.api.notificar("Faltam 5 minutos para o seu almoço!");
        notificacao5MinExibida = true;
    }
}

// Função para iniciar o cronômetro do almoço
function iniciarCronometroAlmoco() {
    document.getElementById('iniciarAlmoco').style.display = 'none';

    // Mostrar a tela do cronômetro do almoço
    document.getElementById('telaPreAlmoco').classList.remove('show');
    document.getElementById('telaCronometroAlmoco').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaCronometroAlmoco').classList.add('show');
    }, 10);

    // Iniciar o cronômetro de almoço
    intervaloAlmoco = setInterval(atualizarCronometroAlmoco, 1000);
}

// Função para atualizar o cronômetro do almoço
function atualizarCronometroAlmoco() {
    const agora = new Date();
    const tempoRestante = horarioInicioAlmoco.getTime() + duracaoAlmoco - agora.getTime();

    if (tempoRestante <= 0) {
        clearInterval(intervaloAlmoco);
        document.getElementById('tempoRestante').textContent = "00:00";
        if (!notificacaoAlmocoTerminadoExibida) {
            window.pywebview.api.notificar("Horário de almoço terminado!");
            notificacaoAlmocoTerminadoExibida = true;
        }
        document.getElementById('voltarDoAlmoco').disabled = false;
        return;
    }

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

    horarioSaida = new Date();
    const [hora, minuto] = horario.split(':');
    horarioSaida.setHours(hora, minuto, 0, 0);

    notificacao5MinSaidaExibida = false;

    document.getElementById('telaConfigSaida').classList.remove('show');
    document.getElementById('telaPreSaida').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaPreSaida').classList.add('show');
    }, 10);

    intervaloSaida = setInterval(atualizarCronometroPreSaida, 1000);
}

// Função para atualizar o cronômetro de pré-saída
function atualizarCronometroPreSaida() {
    const agora = new Date();
    const tempoRestante = horarioSaida.getTime() - agora.getTime();

    if (tempoRestante <= 0) {
        clearInterval(intervaloSaida);
        document.getElementById('finalizarDia').style.display = 'block';
        notificacao5MinSaidaExibida = false;
        return;
    }

    const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

    document.getElementById('tempoRestantePreSaida').textContent =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

    if (tempoRestante <= 5 * 60 * 1000 && !notificacao5MinSaidaExibida) {
        window.pywebview.api.notificar("Faltam 5 minutos para o seu horário de saída!");
        notificacao5MinSaidaExibida = true;
    }
}
let fechamentoPermitido = false;

// Função para finalizar o dia
function finalizarDia() {
    fechamentoPermitido = true;
    window.pywebview.api.habilitar_fechamento();
    clearInterval(intervaloSaida);
    
    document.getElementById('telaPreSaida').classList.remove('show');
    document.getElementById('telaFinalizacao').style.display = 'block';
    setTimeout(() => {
        document.getElementById('telaFinalizacao').classList.add('show');
    }, 10);

    iniciarContagemRegressiva();
}

// Função para sair antecipadamente
function sairAntecipadamente() {
    if (confirm("Deseja realmente sair antes do horário configurado?")) {
        clearInterval(intervaloSaida);
        finalizarDia();
    }
}

// Função para iniciar contagem regressiva
function iniciarContagemRegressiva() {
    let contador = 10;
    document.getElementById('contagemRegressiva').textContent = 
        `Fechando em ${contador} segundos...`;
    
    intervaloFinalizacao = setInterval(() => {
        contador--;
        document.getElementById('contagemRegressiva').textContent = 
            `Fechando em ${contador} segundos...`;
        
        if (contador <= 0) {
            clearInterval(intervaloFinalizacao);
            window.pywebview.api.fechar_programa();
        }
    }, 1000);
}
// Bloqueia fechamento acidental
window.addEventListener('beforeunload', (e) => {
    if (!fechamentoPermitido) {
        e.preventDefault();
        window.pywebview.api.notificar("Use o botão 'Minimizar para bandeja'!");
    }
});
// Função para fechar imediatamente
function fecharAgora() {
    clearInterval(intervaloFinalizacao);
    window.pywebview.api.fechar_programa();
}

// Event listeners
document.getElementById('salvarHorarioSaida').addEventListener('click', salvarHorarioSaida);
document.getElementById('finalizarDia').addEventListener('click', finalizarDia);
document.getElementById('sairAntecipadamente').addEventListener('click', sairAntecipadamente);
document.getElementById('fecharAgora').addEventListener('click', fecharAgora);

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

                const url_meme = await gerar_meme();
                if (url_meme) {
                    const telaFeliz = document.getElementById('telaFeliz');
                    const memeImg = telaFeliz.querySelector('.meme');
                    memeImg.src = url_meme;
                    telaFeliz.style.display = 'block';
                    setTimeout(() => {
                        telaFeliz.classList.add('show');
                        setTimeout(() => {
                            mostrarTelaConfigAlmoco();
                        }, 5000);
                    }, 10);
                }
            }, 500);
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