import webview
import threading
import pystray
from PIL import Image
from plyer import notification
import time
from datetime import datetime, timedelta
import os

# Variável global para controle de fechamento
fechamento_permitido = False

def notificar(mensagem):
    try:
        notification.notify(
            title="CalmDesk",
            message=mensagem,
            timeout=5
        )
    except Exception as e:
        print(f"Erro ao exibir notificação: {e}")

def iniciar_lembretes():
    while True:
        agora = datetime.now()
        if agora.minute % 2 == 0 and agora.second == 0:
            notificar("Hora de beber água! 🚰 Mantenha-se hidratado!")
        if agora.minute == 0 and agora.second == 0:
            notificar("Hora de alongar! 💪 Faça uma pausa para se exercitar!")
        time.sleep(1)

def minimizar_para_bandeja():
    window.hide()
    criar_icone_bandeja()
    notification.notify(title="CalmDesk", message="Aplicativo minimizado para bandeja", timeout=2)

def criar_icone_bandeja():
    imagem = Image.new("RGB", (64, 64), "white")
    menu = pystray.Menu(
        pystray.MenuItem("Restaurar", restaurar_janela),
        pystray.MenuItem("Sair", fechar_programa)
    )
    icone = pystray.Icon("calmdesk", imagem, "CalmDesk", menu)
    icone.run()

def restaurar_janela(icone, item):
    window.show()
    icone.stop()

def fechar_programa(icone=None, item=None):
    if icone:  # Se chamado pelo pystray
        icone.stop()
    window.destroy()
    os._exit(0)  # Força saída completa

def permitir_fechamento(permitir):
    global fechamento_permitido
    fechamento_permitido = permitir

def handle_closing():
    if not fechamento_permitido:
        minimizar_para_bandeja()
        return False
    return True  # Permite fechar quando for a tela final

window = webview.create_window(
    'CalmDesk',
    'frontend/index.html',
    width=400,
    height=500,
    resizable=False,
    frameless=False
)

# Configurações de fechamento
window.events.closed += lambda: None
window.closing = handle_closing

# Expõe funções para o JS
window.expose(
    minimizar_para_bandeja,
    notificar,
    fechar_programa,
    permitir_fechamento,
    lambda: window.evaluate_js("document.body.classList.add('fechamento-permitido')"),
    lambda: window.evaluate_js("document.body.classList.remove('fechamento-permitido')")
)

# Inicia os lembretes em segundo plano
threading.Thread(target=iniciar_lembretes, daemon=True).start()

webview.start()