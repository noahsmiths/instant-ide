import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import { buildImages, createNewContainer } from './docker';
import config from './config';
import * as elements from 'typed-html';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 8080;

app.use(express.urlencoded({extended: true}));
app.use('/', express.static(path.join(__dirname, '../frontend')));

app.get('/images', async (req, res) => {
    res.send(
        <div>
            {
                config.images.map((img) => {
                    return (
                        <div>
                            <img src={img.displayImage} />
                            <span>{img.displayName}</span>
                            <button
                                hx-trigger="click"
                                hx-post={`/container/${img.name}`}
                                hx-on="click: container_info_dialog.showModal()"
                                hx-target="#container-info-dialog-body"
                                hx-swap="innerHTML"
                            >
                                Create
                            </button>
                        </div>
                    );
                })
            }
        </div>
    )
});

app.post('/container/:image', async (req, res) => {
    let image = req.params.image;

    if (!image) {
        res.status(400);
        return;
    }

    let name = uuidv4();

    let hostPort = await createNewContainer(image, name);
    console.log(`${req.protocol}://${req.hostname}:${hostPort}`);

    res.send(
        <div>
            <a target="_blank" href={`${req.protocol}://${req.hostname}:${hostPort}`}>Go to code server</a>
        </div>
    )
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})