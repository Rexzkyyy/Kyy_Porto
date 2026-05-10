import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'assets');
const files = fs.readdirSync(dir);

for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i) && !file.includes('react.svg')) {
        const input = path.join(dir, file);
        const output = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        try {
            await sharp(input)
                .resize({ width: 800, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(output);
            console.log('Converted:', file, '->', path.basename(output));
        } catch (err) {
            console.error('Error converting', file, err);
        }
    }
}
