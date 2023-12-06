import config from "./config.js";
import { createNewContainer } from "./docker.js";
import express from "express";
import { v4 as uuidv4 } from 'uuid';
import ViteExpress from "vite-express";

const app = express();

app.use(express.json());

app.get('/api/images', (_, res) => {
    res.json(config.images);
});

app.post('/api/container', async (req, res, next) => {
    try {
        const id = req.body.id;

        if (id === undefined || config.images.find(image => image.id === id) === undefined) {
            res.status(404).send(`Invalid 'id' provided`);
        }

        const name = uuidv4();

        const hostPort = await createNewContainer(id, name);
        const url = `${req.protocol}://${req.hostname}:${hostPort}`;
        console.log(url);

        res.json({
            url: url
        });
    } catch (err) {
        next(err);
    }
});

ViteExpress.listen(app, 3000, () => {
    console.log('Server is listening on port 3000...');
});
