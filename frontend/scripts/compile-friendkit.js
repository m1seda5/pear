import sass from 'sass';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compile Friendkit SCSS
const result = sass.compile(path.join(__dirname, '../../../friendkit-ui/src/assets/scss/core.scss'), {
  style: 'compressed',
  loadPaths: [
    path.join(__dirname, '../../../friendkit-ui/src/assets/scss'),
    path.join(__dirname, '../../../friendkit-ui/node_modules')
  ]
});

// Write the compiled CSS
fs.writeFileSync(
  path.join(__dirname, '../public/friendkit.css'),
  result.css
);

console.log('Friendkit CSS compiled successfully!'); 