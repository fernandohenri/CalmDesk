# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

# Lista de arquivos adicionais (mesma estrutura)
added_files = [
    ('frontend/index.html', 'frontend'),
    ('frontend/script.js', 'frontend'),
    ('frontend/styles.css', 'frontend'),
    ('images/raiva.png', 'images'),
    ('images/neutro.png', 'images'),
    ('images/feliz.png', 'images'),
    ('icon.icns', '.')  # Note a mudança para .icns
]

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=[
        'webview.platforms.cocoa',  # Plataforma específica para macOS
        'plyer.platforms.macosx.notification',
        'pystray._darwin'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

app = BUNDLE(
    EXE(
        pyz,
        a.scripts,
        a.binaries,
        a.zipfiles,
        a.datas,
        name='CalmDesk',
        debug=False,
        strip=False,
        upx=True,
        console=False,
        icon='icon.icns',  # Ícone no formato macOS
    ),
    name='CalmDesk.app',
    icon='icon.icns',
    bundle_identifier='com.seudominio.calmdesk',
)