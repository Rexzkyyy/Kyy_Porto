import sharp from 'sharp';

// Convert hero portrait: PNG → WebP, resize to max 900px wide
const result = await sharp('src/assets/lb0.png')
  .resize(900, null, { withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile('public/hero-portrait.webp');

console.log('✅ Converted lb0.png → public/hero-portrait.webp');
console.log(`   Original: ~1,370 KB`);
console.log(`   Output: ${Math.round(result.size / 1024)} KB (${result.width}x${result.height})`);
