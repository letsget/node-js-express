import { Router } from "express";
import { library } from "../library";
import { resolveBookByIndex, validateBook } from "./middleware";
import path from "path";
import { imageUploadMiddleware } from "./file-multer";
import { v4 as uuid } from "uuid";
import { Book } from "../types";

const projectRoot = process.cwd();

const imagesFolder = path.join(projectRoot, "images");
const router = Router();

const ROUTE_PATHS = {
  books: "/api/books",
  login: "/api/user/login",
};
router.get(ROUTE_PATHS.books, (request, response) => {
  response.status(200).json(library);
});

router.post(ROUTE_PATHS.login, (request, response) => {
  response.status(200).json({ id: 1, mail: "test@mail.ru" });
});

router.get(`${ROUTE_PATHS.books}/:id`, (request, response) => {
  const {
    params: { id },
  } = request;
  const foundBook = library.find((book) => book.id === id);

  if (!foundBook) {
    return response
      .status(404)
      .send({ message: `Книга по id ${id} не найдена` });
  }

  response.status(200).json(foundBook);
});

router.post(ROUTE_PATHS.books, validateBook, (request, response) => {
  const { body } = request;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = body;
  const newBook = {
    id: uuid(),
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  };

  library.push(newBook);
  response.status(200).json(newBook);
});

router.put(`${ROUTE_PATHS.books}/:id`, validateBook, (request, response) => {
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = request.body;

  const {
    params: { id },
  } = request;

  const bookIndex = library.findIndex((book) => book.id === id);

  library.splice(bookIndex, 1, {
    id: id ? id : uuid(),
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });
  return response.status(200).json({ message: "Книга успешно обновлена" });
});

interface CustomRequest extends Request {
  bookIndex: number;
}

router.delete(
  `${ROUTE_PATHS.books}/:id`,
  resolveBookByIndex,
  (request, response) => {
    const { bookIndex } = request as unknown as CustomRequest;

    library.splice(bookIndex, 1);
    return response
      .status(201)
      .json({ message: `Книга по индексу ${bookIndex} была успешно удалена` });
  }
);

router.post(
  `${ROUTE_PATHS.books}/:id/upload`,
  imageUploadMiddleware.single("img"),
  (request, response) => {
    try {
      if (request.file) {
        console.log("request.file", request.file);
        const { path } = request.file;
        console.log("path", path);
        response.json({ path });
      }
    } catch (err) {
      console.log("error", err);
    }
  }
);

router.get(`${ROUTE_PATHS.books}/:id/download`, (request, response) => {
  const {
    params: { id },
  } = request;

  response.json({ id });
  const bookFileName = library.find((book: Book) => book.id === id)?.fileBook;
  if (bookFileName) {
    const filePath = path.join(imagesFolder, bookFileName);
    response.download(filePath, bookFileName, (err) => {
      if (err) {
        console.error("Ошибка загрузки:", err);
        response.status(500).send("Ошибка загрузки файла");
      }
    });
  } else {
    response.json({ message: "Не удалось загрузить файл с данным id", id });
  }
});

export default router;
