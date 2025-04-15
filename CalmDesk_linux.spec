# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

added_files = [
    ('frontend/index.html', 'frontend'),
    ('frontend/script.js', 'frontend'),
    ('frontend/styles.css', 'frontend'),
    ('images/raiva.png', 'images'),
    ('images/neutro.png', 'images'),
    ('images/feliz.png', 'images'),
    ('icon.png', '.')  # Ícone no formato PNG para Linux
]

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=[
        'webview.platforms.gtk',  # Plataforma comum para Linux
        'plyer.platforms.linux.notification',
        'pystray._xorg'
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
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
    icon='icon.png',
)