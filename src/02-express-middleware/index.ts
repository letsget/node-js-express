import express from "express";
import booksRouter from "./routes";
import path from "path";
const PORT = 8000;
const app = express();


const projectRoot = process.cwd();
console.log('projectRoot', projectRoot);

app.use(express.static(path.join(projectRoot, "images")));

app.use(express.json());
app.use(booksRouter);

console.log(`Server is running on port ${PORT}`);
app.listen(PORT);
