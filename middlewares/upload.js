import multer from "multer";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const tmpDir = path.join(__dirname, "..", "tmp");

const multerConfig = multer.diskStorage({ destination: tmpDir });

export const upload = multer({ storage: multerConfig });
