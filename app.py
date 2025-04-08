import webview
import threading
import pystray
from PIL import Image
from plyer import notification
import time
from datetime import datetime

# Notificações do sistema
def notificar(mensagem):
    try:
        notification.notify(
            title="CalmDesk",
            message=mensagem,
            timeout=5
        )
    except Exception as e:
        print(f"Erro ao exibir notificação: {e}")

# Lembretes em background
def iniciar_lembretes():
    while True:
        agora = datetime.now()
        if agora.minute % 2 == 0 and agora.second == 0:
            notificar("Hora de beber água! 🚰 Mantenha-se hidratado!")
        if agora.minute == 0 and agora.second == 0:
            notificar("Hora de alongar! 💪 Faça uma pausa para se exercitar!")
        time.sleep(1)

# Minimizar para a bandeja
def minimizar_para_bandeja():
    window.hide()
    criar_icone_bandeja()

# Ícone da bandeja
def criar_icone_bandeja():
    imagem = Image.new("RGB", (64, 64), "white")
    menu = pystray.Menu(
        pystray.MenuItem("Restaurar", restaurar_janela),
        pystray.MenuItem("Sair", fechar_programa)
    )
    icone = pystray.Icon("calmdesk", imagem, "CalmDesk", menu)
    threading.Thread(target=icone.run, daemon=True).start()

def restaurar_janela(icone, item):
    window.show()
    icone.stop()

def fechar_programa(icone, item):
    icone.stop()
    window.destroy()

# Intercepta tentativa de fechar a janela (clique no X)
def fechar_janela(w):
    try:
        permitido = w.evaluate_js("document.body.classList.contains('fechamento-permitido')")
        if permitido:
            return True  # Permite fechar
        else:
            minimizar_para_bandeja()
            return False  # Cancela o fechamento
    except Exception as e:
        print(f"Erro ao avaliar JS: {e}")
        return False

# Criação da janela
window = webview.create_window(
    'CalmDesk',
    'frontend/index.html',
    width=400,
    height=500,
    resizable=False,
    confirm_close=True
)

# Expõe funções para o JS
window.expose(
    minimizar_para_bandeja,
    notificar,
    fechar_programa,
    lambda: window.evaluate_js("document.body.classList.add('fechamento-permitido')"),
    lambda: window.evaluate_js("document.body.classList.remove('fechamento-permitido')"),
)

# Inicia os lembretes em segundo plano
threading.Thread(target=iniciar_lembretes, daemon=True).start()

# Inicia a janela e captura o evento de fechamento
webview.start(fechar_janela, window)
