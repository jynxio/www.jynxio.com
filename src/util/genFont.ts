import { fontSplit } from 'cn-font-split';
import path from 'node:path';

/**
 *
 */
const [LXGWWENKAI_REGULAR_INPUT_PATH, LXGWWENKAI_REGULAR_OUTPUT_PATH] =
    createPath('LXGWWenKai-Regular');

const [LXGWWENKAI_MEDIUM_INPUT_PATH, LXGWWENKAI_MEDIUM_OUTPUT_PATH] =
    createPath('LXGWWenKai-Medium');

const [LXGWWENKAIMONO_REGULAR_INPUT_PATH, LXGWWENKAIMONO_REGULAR_OUTPUT_PATH] =
    createPath('LXGWWenKaiMono-Regular');

const [LXGWWENKAIMONO_MEDIUM_INPUT_PATH, LXGWWENKAIMONO_MEDIUM_OUTPUT_PATH] =
    createPath('LXGWWenKaiMono-Medium');

/**
 *
 */
await split(LXGWWENKAI_REGULAR_INPUT_PATH, LXGWWENKAI_REGULAR_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷',
    fontStyle: 'normal',
    fontWeight: '400',
    fontDisplay: 'swap',
});

await split(LXGWWENKAI_MEDIUM_INPUT_PATH, LXGWWENKAI_MEDIUM_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷',
    fontStyle: 'normal',
    fontWeight: '500',
    fontDisplay: 'swap',
});

await split(LXGWWENKAIMONO_REGULAR_INPUT_PATH, LXGWWENKAIMONO_REGULAR_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷等宽',
    fontStyle: 'normal',
    fontWeight: '400',
    fontDisplay: 'swap',
});

await split(LXGWWENKAIMONO_MEDIUM_INPUT_PATH, LXGWWENKAIMONO_MEDIUM_OUTPUT_PATH, {
    fontFamily: '霞鹜文楷等宽',
    fontStyle: 'normal',
    fontWeight: '500',
    fontDisplay: 'swap',
});

/**
 *
 */
async function split(inputPath: string, outputPath: string, cssProps: object) {
    await fontSplit({
        input: inputPath,
        outDir: outputPath,
        targetType: 'woff2',
        chunkSize: 50 * 1024, // 70kb
        reporter: false,
        testHtml: false,
        css: cssProps,
    });
}

/**
 *
 */
function createPath(name: string) {
    const inputPath = path.join(process.cwd(), 'src/asset', `${name}.ttf`); // File
    const outputPath = path.join(process.cwd(), 'src/asset/temporary', name); // Directory

    return [inputPath, outputPath] as const;
}
