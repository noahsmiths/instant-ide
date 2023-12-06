import Docker from 'dockerode';
import DevImage from '../shared/DevImage.js';

interface DevImageConfig extends DevImage {
    dockerfile: string
}

export async function buildImages(imageList: DevImageConfig[]) {
    let docker = new Docker();

    for (let image of imageList) {
        let imageName = image.id;
        let dockerfilePath = image.dockerfile;

        console.log(`Bulding ${imageName}...`);

        let imageBuilder = await docker.buildImage({
            context: __dirname,
            src: [dockerfilePath],
        }, {dockerfile: dockerfilePath, t: imageName});
        
        try {
            await new Promise((resolve, reject) => {
                docker.modem.followProgress(imageBuilder, (err: any, res: any) => err ? reject(err) : resolve(res));
            });
        
            console.log(`Done building ${imageName}`);
        } catch (err) {
            console.error(`Error building ${imageName}: `, err);
        }
    }
}

export function createNewContainer(image: string, name: string) {
    return new Promise((res, rej) => {
        let docker = new Docker();

        docker.createContainer({
            Image: image,
            name: name,
            ExposedPorts: {
                '8080/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '8080/tcp': [{HostPort: ''}]
                }
            },
        }, async function (err: any, container: any) {
            if (err) {
                rej(err);
            }

            try {
                await container?.start();
                let containerInfo = await container?.inspect();
                let ports = containerInfo?.NetworkSettings.Ports['8080/tcp'];

                if (ports && ports.length > 0) {
                    console.log(ports[0].HostPort);
                    res(ports[0].HostPort);
                } else {
                    rej('No ports opened on host');
                }
            } catch (err) {
                rej(err);
                return;
            }
        });
    });
}