[app]
title = Terminal Survivor
package.name = terminalsurvivor
package.domain = org.hexaart
source.dir = .
source.include_exts = py,png,jpg,kv,atlas
version = 0.1

# Bagian yang tadinya bikin bentrok sudah saya hapus
requirements = python3,kivy==2.3.0

orientation = portrait
fullscreen = 1
android.permissions = INTERNET
android.api = 33
android.minapi = 21
android.ndk = 25b
android.sdk = 33
android.archs = arm64-v8a
android.accept_sdk_license = True
android.skip_update = False
p4a.branch = master

[buildozer]
log_level = 2
warn_on_root = 1
