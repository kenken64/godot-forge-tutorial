FROM ghcr.io/linuxserver/baseimage-kasmvnc:ubuntunoble

ARG GODOT_VERSION=4.7.2
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl unzip libgl1-mesa-dri libgl1 libx11-6 libxcursor1 libxinerama1 libxi6 libxrandr2 \
    && curl -fL --retry 3 "https://downloads.godotengine.org/?version=${GODOT_VERSION}&flavor=stable&slug=linux.x86_64.zip&platform=linux.64" -o /tmp/godot.zip \
    && unzip -q /tmp/godot.zip -d /tmp/godot \
    && install -m 0755 "/tmp/godot/Godot_v${GODOT_VERSION}-stable_linux.x86_64" /usr/local/bin/godot \
    && rm -rf /tmp/godot /tmp/godot.zip /var/lib/apt/lists/*

ENV LIBGL_ALWAYS_SOFTWARE=1 \
    START_DOCKER=false \
    TITLE="Godot Forge Cloud Editor" \
    FM_HOME=/config/project

COPY force_kasmvnc_english.py /tmp/force_kasmvnc_english.py
RUN python3 /tmp/force_kasmvnc_english.py && rm /tmp/force_kasmvnc_english.py

COPY root/ /
RUN chmod 0755 /defaults/autostart
