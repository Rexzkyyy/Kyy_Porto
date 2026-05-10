const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'assets');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.match(/\.(jpg|jpeg|png)$/i) && !file.includes('react.svg')) {
        const input = path.join(dir, file);
        const output = path.join(dir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
        
        sharp(input)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(output)
            .then(() => {
                console.log('Converted:', file, '->', path.basename(output));
                // Optional: Delete original to save space
                // fs.unlinkSync(input);
            })
            .catch(err => console.error('Error converting', file, err));
    }
});
