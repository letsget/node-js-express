import multer from "multer";
import path from "path";

const projectRoot = process.cwd();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(projectRoot, "images"));
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const imageUploadMiddleware = multer({ storage: storage });
