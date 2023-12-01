import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Docker from 'dockerode';
import { ImageConfig } from './types';

export async function buildImages(imageList: ImageConfig[]) {
    let docker = new Docker();

    for (let image of imageList) {
        let imageName = image.name;
        let dockerfilePath = image.dockerfile;

        console.log(`Bulding ${imageName}...`);

        let imageBuilder = await docker.buildImage({
            context: __dirname,
            src: [dockerfilePath],
        }, {dockerfile: dockerfilePath, t: imageName});
        
        try {
            await new Promise((resolve, reject) => {
                docker.modem.followProgress(imageBuilder, (err, res) => err ? reject(err) : resolve(res));
            });
        
            console.log(`Done building ${imageName}`);
        } catch (err) {
            console.error(`Error building ${imageName}: `, err);
        }
    }
}

export async function createNewContainer(image: string, name: string) {
    let docker = new Docker();

    // let imageName = `${name}-image`;
    // let imageBuilder = await docker.buildImage({
    //     context: __dirname,
    //     src: ['./dockerfiles/Dockerfile-base'],
    // }, {dockerfile: './dockerfiles/Dockerfile-base', t: imageName});

    // console.log("building...");
    // await new Promise((resolve, reject) => {
    //     docker.modem.followProgress(imageBuilder, (err, res) => err ? reject(err) : resolve(res));
    // });

    // console.log("built.");
    // docker.listImages((err, imgs) => {
    //     imgs?.forEach((info) => console.log(info));
    //     console.log(imgs?.length);
    // });
    // await new Promise((res, rej)=>{setTimeout(res, 600000)});

    docker.createContainer({
        Image: "python",
        name: 'ubuntu-test',
        ExposedPorts: {
            '8080/tcp': {}
        },
        HostConfig: {
            PortBindings: {
                '8080/tcp': [{HostPort: ''}]
            }
        },
        // Cmd: ["code-server", "--auth", "none", "--bind-addr", "0.0.0.0:8080"]
    }, function (err, container) {
        console.log(err);
        if (err || !container) return;
        container.start(function (err, data) {
            console.log("started");
            console.error(err);
            console.log(data);
        });
    });

    return;
    // let container = await docker.run(image, ['bash', '-c', 'curl -fsSL https://code-server.dev/install.sh | sh && code-server --auth none --bind-addr 0.0.0.0:8080'], process.stdout, {
    //     ExposedPorts: {
    //         '8080/tcp': {}
    //     },
    //     HostConfig: {
    //         PortBindings: {
    //             '8080/tcp': [{HostPort: ''}]
    //         }
    //     }
    // });
}