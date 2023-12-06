import "./App.css";

import DevImage from "../shared/DevImage.js";
import DevImageContainer from "./components/DevImageContainer.js";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";

function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [devImages, setDevImages] = useState<DevImage[]>([]);
    const [containerUrl, setContainerUrl] = useState<string>('');

    function createContainer(id: string) {
        onOpen();

        fetch('/api/container', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.url) {
                    alert('Error creating container');
                    console.error(data);
                    return;
                }
                
                setContainerUrl(data.url);
            })
            .catch((err) => {
                console.error(err);
                alert('Error creating container');
            })
    }

    useEffect(() => {
        fetch('/api/images')
            .then((res) => res.json())
            .then((images: DevImage[]) => {
                setDevImages(images);
            })
            .catch((err) => {
                console.error(err);
                alert("Error fetching images");
            });
    }, []);

    return (
        <>
            <div className=" flex flex-row justify-center p-4 gap-4">
                {
                    devImages.map((image) => {
                        return (
                            <DevImageContainer key={image.id} displayName={image.displayName} id={image.id} onPress={createContainer} displayImage={image.displayImage} />
                        )
                    })
                }
            </div>
            <Modal isOpen={isOpen}>
                <ModalContent>
                    <ModalHeader>Remote Container</ModalHeader>
                    <ModalBody>
                        {
                            containerUrl ?
                                <a className="text-lg" href={containerUrl} target="_blank">Go to container!</a>
                            :
                                <h3 className="text-lg">Loading...</h3>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

export default App;
