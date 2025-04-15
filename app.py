import webview
import threading
import pystray
from PIL import Image
from plyer import notification
import time
from datetime import datetime
import os
import sys

class App:
    def __init__(self):
        self.fechamento_permitido = False
        self.window = None
        self.tray_icon = None
        self.icon_path = os.path.join(os.path.dirname(__file__), 'icon.ico')  # Ícone na raiz

    def notificar(self, mensagem):
        try:
            notification.notify(
                title="CalmDesk",
                message=mensagem,
                timeout=5
            )
        except Exception as e:
            print(f"Erro ao exibir notificação: {e}")

    def iniciar_lembretes(self):
        while True:
            agora = datetime.now()
            if agora.minute % 2 == 0 and agora.second == 0:
                self.notificar("Hora de beber água! 🚰 Mantenha-se hidratado!")
            if agora.minute  % 1 == 0 and agora.second == 0:
                self.notificar("Hora de alongar! 💪 Faça uma pausa para se exercitar!")
            time.sleep(1)

    def minimizar_para_bandeja(self):
        if self.window:
            self.window.hide()
        self.criar_icone_bandeja()
        self.notificar("Aplicativo minimizado para bandeja")

    def criar_icone_bandeja(self):
        if self.tray_icon:  # Evita criar múltiplos ícones
            return

        try:
            # Tenta carregar o ícone personalizado
            image = Image.open(self.icon_path)
        except FileNotFoundError:
            # Fallback: ícone padrão azul se o arquivo não for encontrado
            image = Image.new('RGB', (64, 64), (30, 144, 255))  # DodgerBlue
            print("Ícone personalizado não encontrado, usando ícone padrão")

        menu = pystray.Menu(
            pystray.MenuItem('Restaurar', self.restaurar_janela),
            pystray.MenuItem('Sair', self.fechar_programa)
        )
        self.tray_icon = pystray.Icon("calmdesk", image, "CalmDesk", menu)
        threading.Thread(target=self.tray_icon.run, daemon=True).start()

    def restaurar_janela(self, icon=None, item=None):
        if self.window:
            self.window.show()
        if icon:
            icon.stop()
            self.tray_icon = None

    def fechar_programa(self, icon=None, item=None):
        self.fechamento_permitido = True
        if icon:
            icon.stop()
        if self.window:
            self.window.destroy()
        os._exit(0)
    def marcar_fechamento_permitido(self):
        self.fechamento_permitido = True
        if self.window:
            self.window.evaluate_js("document.body.classList.add('fechamento-permitido')")

    def desmarcar_fechamento_permitido(self):
        self.fechamento_permitido = False
        if self.window:
            self.window.evaluate_js("document.body.classList.remove('fechamento-permitido')")
    def handle_closing(self):
        if not self.fechamento_permitido:
            self.minimizar_para_bandeja()
            return False
        return True

    def run(self):
        self.window = webview.create_window(
            'CalmDesk',
            'frontend/index.html',
            width=400,
            height=500,
            resizable=False,
            frameless=False,
            on_top=True
        )

        # Configura os handlers de fechamento
        self.window.closing = self.handle_closing
        self.window.events.closing += self.handle_closing

        # Expõe funções para o JavaScript
        self.window.expose(
            self.minimizar_para_bandeja,
            self.notificar,
            self.fechar_programa,
            lambda x: setattr(self, 'fechamento_permitido', x),  # Corrigido para ser chamável
            self.marcar_fechamento_permitido,  # Adicionar este método
            self.desmarcar_fechamento_permitido  # Adicionar este método
        )

        # Inicia os lembretes em segundo plano
        threading.Thread(target=self.iniciar_lembretes, daemon=True).start()
        
        # Inicia a aplicação
        webview.start()

if __name__ == '__main__':
    app = App()
    app.run()