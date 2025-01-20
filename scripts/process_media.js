const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../images/expos');
const OUTPUT_DIR = path.join(__dirname, '../images/expos/processed');

// Crear directorio de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let imageCounter = 28;
let videoCounter = 1;

// Procesar imágenes
async function processImage(file) {
    const ext = path.extname(file).toLowerCase();
    const newName = `img${imageCounter}`;
    imageCounter++;
    
    if (['.heic', '.heif'].includes(ext)) {
        // Convertir HEIC a JPG usando ffmpeg
        const outputJpg = path.join(OUTPUT_DIR, `${newName}.jpg`);
        execSync(`ffmpeg -i "${file}" -quality 90 "${outputJpg}"`);
        console.log(`Converted ${file} to JPG`);
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const output = path.join(OUTPUT_DIR, `${newName}.jpg`);
        await sharp(file)
            .jpeg({ quality: 85, mozjpeg: true })
            .resize(2000, 2000, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFile(output);
        console.log(`Optimized ${file}`);
    }
}

// Procesar videos
function processVideo(file) {
    const ext = path.extname(file).toLowerCase();
    const newName = `video_expo_${videoCounter}`;
    videoCounter++;
    
    if (['.mov', '.mp4'].includes(ext)) {
        const output = path.join(OUTPUT_DIR, `${newName}.mp4`);
        // Comprimir video manteniendo buena calidad
        execSync(`ffmpeg -i "${file}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k "${output}"`);
        console.log(`Processed ${file}`);
    }
}

// Procesar todos los archivos
async function processAll() {
    const files = fs.readdirSync(INPUT_DIR);
    
    // Primero procesar imágenes
    for (const file of files) {
        const filePath = path.join(INPUT_DIR, file);
        const ext = path.extname(file).toLowerCase();
        
        try {
            if (['.jpg', '.jpeg', '.png', '.heic', '.heif'].includes(ext)) {
                await processImage(filePath);
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
    
    // Luego procesar videos
    for (const file of files) {
        const filePath = path.join(INPUT_DIR, file);
        const ext = path.extname(file).toLowerCase();
        
        try {
            if (['.mov', '.mp4'].includes(ext)) {
                processVideo(filePath);
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
}

processAll().then(() => {
    console.log('Processing complete!');
}).catch(console.error);
