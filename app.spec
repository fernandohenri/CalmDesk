# -*- mode: python ; coding: utf-8 -*-
block_cipher = None

# Lista de arquivos adicionais a serem incluídos
added_files = [
    ('frontend/index.html', 'frontend'),
    ('frontend/script.js', 'frontend'),
    ('frontend/styles.css', 'frontend'),
    ('frontend/images/meme.jpg', 'frontend/images'), 
    ('icon.ico', '.')
]

# Configuração principal
a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=[
        'webview.platforms.win32',
        'webview.platforms.cef',
        'plyer.platforms.win.notification',
        'pystray._win32'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

# Configuração do bundle
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='CalmDesk',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Sem janela de console
    icon='icon.ico',
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    onefile=True  # Cria um único arquivo executável
)

# Opcional: Configuração para criar um instalador
# coll = COLLECT(
#     exe,
#     a.binaries,
#     a.zipfiles,
#     a.datas,
#     strip=False,
#     upx=True,
#     upx_exclude=[],
#     name='CalmDesk'
# )