import { library } from "../library";
import {NextFunction, Request, Response} from "express";

export const resolveBookByIndex = (request: any, response: Response, next: NextFunction) => {
    const {
        params: { id },
    } = request;

    const bookIndex = library.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
        return response
            .status(404)
            .json({ error: `Книга с id ${id} не найдена в библиотеке` });
    }

    request.bookIndex = bookIndex;
    next();
};

export const validateBook = (request: Request, response: Response, next: NextFunction) => {
    const { body } = request;
    if (!body) {
        response.status(403).json({ error: "Запрос не может быть пустым" });
    }
    const { title, description, authors, favorite, fileCover, fileName } = body;

    const isFullRequestBody = [
        title,
        description,
        authors,
        typeof favorite === "boolean",
        fileCover,
        fileName,
    ].every(Boolean);

    if (!isFullRequestBody) {
        return response
            .status(403)
            .json({ error: "Пожалуйста, заполните все поля" });
    }

    next();
};
