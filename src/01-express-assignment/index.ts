import express, { Response, Request } from "express";
import { library } from './library';
import { v4 as uuid } from "uuid";

const PORT = process.env.PORT || 8000;
console.log("server is running on Port", PORT);

const app = express();
app.use(express.json());

const API_URL: `/${string}` = "/api/books";

app.get(API_URL, (request: Request, response: Response) => {
    response.status(200).json(library);
});

app.get(`${API_URL}/:id`, (request: Request, response: Response) => {
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

app.post(`${API_URL}/login`, (request: Request, response: Response) => {
    response.status(200).json({ id: 1, mail: "test@mail.ru" });
});

app.post(`${API_URL}`, (request: Request, response: Response) => {
    const { body } = request;
    console.log("body", body);
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

    const newBook = {
        id: uuid(),
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    };

    library.push(newBook);
    response
        .status(200)
        .json({ message: "Книга была успешно добавлена" })
        .json(newBook);
});

app.delete(`${API_URL}/:id`, (request: Request, response: Response) => {
    const {
        params: { id },
    } = request;

    const foundBookIndex = library.findIndex((book) => book.id === id);

    if (foundBookIndex !== -1) {
        library.splice(foundBookIndex, 1);
        response.json({ message: `Книга с id ${id} удалена` });
    } else {
        response.json({ message: `Не удалось найти книгу с id ${id}` });
    }
});

app.put(`${API_URL}/:id`, (request: Request, response: Response) => {
    const { title, description, authors, favorite, fileCover, fileName } =
        request.body;

    const {
        params: { id },
    } = request;

    const bookIndex = library.findIndex((book) => book.id === id);

    if (bookIndex !== -1) {
        library.splice(bookIndex, 1, {
            id: id ? id : uuid(),
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        });
        return response.status(200).json({ message: "Книга успешно обновлена" });
    }

    return response.status(404).json({ error: "Не удалось обновить книгу" });
});

app.listen(PORT);