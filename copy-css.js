import fs from 'fs';
import path from 'path';

const src = path.join('src', 'ModalBase.css');
const dest = path.join('dist', 'ModalBase.css');

try {
  fs.copyFileSync(src, dest);
  console.log('CSS copied.');
} catch (err) {
  console.log('CSS not copied:', err.message);
}
