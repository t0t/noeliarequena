#!/bin/bash

# Directorio de videos
VIDEO_DIR="../images/expos"
cd "$(dirname "$0")"

# Asegurarse de que ffmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo "ffmpeg no está instalado. Por favor, instálalo primero."
    exit 1
fi

# Procesar cada video MP4
for video in "$VIDEO_DIR"/video_expo_*.mp4; do
    if [ -f "$video" ]; then
        # Obtener el número del video
        number=$(echo "$video" | grep -o '[0-9]\+' | head -1)
        # Crear nombre del poster
        poster="${video%.*}_poster.jpg"
        
        # Generar poster del primer frame
        ffmpeg -i "$video" -vframes 1 -q:v 2 "$poster"
        echo "Generado poster para video $number: $poster"
    fi
done

echo "¡Proceso completado!"
