// shared-core/lib/autoExport.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function autoExportFrom(dirName) {
  const dirPath = path.resolve(__dirname, '..', dirName);
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.js'));

  const exports = {};

  for (const file of files) {
    const name = file.replace('.js', '');
    const module = await import(pathToFileURL(path.join(dirPath, file)));
    exports[name] = module;
  }

  return exports;
}
