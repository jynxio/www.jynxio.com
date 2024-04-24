import path from 'node:path';
import config from './config.json';
import * as fs from 'fs-extra';
import { fontSplit } from '@konghayao/cn-font-split';

import type { InputTemplate } from '@konghayao/cn-font-split';

//
const rawFolderPath = path.resolve() + '/src/fonts/raw';
const processedFolderPath = path.resolve() + '/src/fonts/processed';

//
for (const item of config) {
  const rawPath = rawFolderPath + '/' + item.filename + '.ttf';
  const processedPath = processedFolderPath + '/' + item.filename;

  await fs.ensureDir(processedPath);
  await split(rawPath, processedPath, item.cssProps);
}

//
async function split(
  inputPath: string,
  outputPath: string,
  cssProps: InputTemplate['css'],
) {
  await fontSplit({
    FontPath: inputPath,
    destFold: outputPath,
    targetType: 'woff2',
    chunkSize: 70 * 1024,
    testHTML: false,
    reporter: false,
    threads: {}, // 开启多线程
    css: cssProps,
    cssFileName: 'index.css',
  });
}
