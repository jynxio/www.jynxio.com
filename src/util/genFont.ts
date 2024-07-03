import path from "node:path";
import { fontSplit } from "cn-font-split";

/**
 *
 */
const [LXGWWENKAI_LIGHT_200_INPUT_PATH, LXGWWENKAI_LIGHT_200_OUTPUT_PATH] =
    createPath("LXGWWenKai-Light");

const [LXGWWENKAI_REGULAR_400_INPUT_PATH, LXGWWENKAI_REGULAR_400_OUTPUT_PATH] =
    createPath("LXGWWenKai-Regular");

const [LXGWWENKAI_BOLD_700_INPUT_PATH, LXGWWENKAI_BOLD_700_OUTPUT_PATH] =
    createPath("LXGWWenKai-Bold");

const [LXGWWENKAIMONO_LIGHT_200_INPUT_PATH, LXGWWENKAIMONO_LIGHT_200_OUTPUT_PATH] =
    createPath("LXGWWenKaiMono-Light");

const [LXGWWENKAIMONO_REGULAR_400_INPUT_PATH, LXGWWENKAIMONO_REGULAR_400_OUTPUT_PATH] =
    createPath("LXGWWenKaiMono-Regular");

const [LXGWWENKAIMONO_BOLD_700_INPUT_PATH, LXGWWENKAIMONO_BOLD_700_OUTPUT_PATH] =
    createPath("LXGWWenKaiMono-Bold");

/**
 *
 */
await split(LXGWWENKAI_LIGHT_200_INPUT_PATH, LXGWWENKAI_LIGHT_200_OUTPUT_PATH, {
    fontFamily: "霞鹜文楷",
    fontStyle: "normal",
    fontWeight: 200,
    fontDisplay: "swap",
});

await split(LXGWWENKAI_REGULAR_400_INPUT_PATH, LXGWWENKAI_REGULAR_400_OUTPUT_PATH, {
    fontFamily: "霞鹜文楷",
    fontStyle: "normal",
    fontWeight: 400,
    fontDisplay: "swap",
});

await split(LXGWWENKAI_BOLD_700_INPUT_PATH, LXGWWENKAI_BOLD_700_OUTPUT_PATH, {
    fontFamily: "霞鹜文楷",
    fontStyle: "normal",
    fontWeight: 700,
    fontDisplay: "swap",
});

await split(LXGWWENKAIMONO_LIGHT_200_INPUT_PATH, LXGWWENKAIMONO_LIGHT_200_OUTPUT_PATH, {
    fontFamily: "霞鹜文楷等宽",
    fontStyle: "normal",
    fontWeight: 200,
    fontDisplay: "swap",
});

await split(LXGWWENKAIMONO_REGULAR_400_INPUT_PATH, LXGWWENKAIMONO_REGULAR_400_OUTPUT_PATH, {
    fontFamily: "霞鹜文楷等宽",
    fontStyle: "normal",
    fontWeight: 400,
    fontDisplay: "swap",
});

await split(LXGWWENKAIMONO_BOLD_700_INPUT_PATH, LXGWWENKAIMONO_BOLD_700_OUTPUT_PATH, {
    fontFamily: "霞鹜文楷等宽",
    fontStyle: "normal",
    fontWeight: 700,
    fontDisplay: "swap",
});

/**
 *
 */
async function split(inputPath: string, outputPath: string, cssProps: object) {
    await fontSplit({
        FontPath: inputPath,
        destFold: outputPath,
        targetType: "woff2",
        chunkSize: 50 * 1024, // 70kb
        testHTML: false,
        reporter: false,
        threads: {}, // 开启多线程
        css: cssProps,
        cssFileName: "index.css",
    });
}

/**
 *
 */
function createPath(name: string) {
    const inputPath = path.join(process.cwd(), "src/asset", `${name}.ttf`); // File
    const outputPath = path.join(process.cwd(), "src/asset/temporary", name); // Directory

    return [inputPath, outputPath];
}
