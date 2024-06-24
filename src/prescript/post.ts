import path from "node:path";
import fs from "fs-extra";
import { POST_DIR_PATH, IMAGE_HOSTING_DIR_PATH } from "@/constant/post";

const imageHostingDirPath = path.join(process.cwd(), IMAGE_HOSTING_DIR_PATH);
await fs.emptyDir(imageHostingDirPath);

const postDirPath = path.join(process.cwd(), POST_DIR_PATH);
const postDir = await fs.readdir(postDirPath, { withFileTypes: true });

for (const post of postDir) {
    if (!post.isDirectory()) continue;

    const originalImgDirPath = path.join(process.cwd(), path.join(POST_DIR_PATH, post.name, "img"));

    if (!fs.existsSync(originalImgDirPath)) continue;

    const targetImgDirPath = path.join(process.cwd(), path.join(IMAGE_HOSTING_DIR_PATH, post.name));
    await fs.emptyDir(targetImgDirPath);

    fs.copy(originalImgDirPath, targetImgDirPath);
}
