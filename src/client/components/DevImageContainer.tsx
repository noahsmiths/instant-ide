import { Button, Image } from "@nextui-org/react";
import DevImage from "../../shared/DevImage.js";

interface devImagePropType extends DevImage {
    onPress(id: string): any
}

function DevImageContainer(props: devImagePropType) {
    const { displayName, id, displayImage, onPress } = props;

    return (
        <Button variant="ghost" className=" flex flex-col w-fit h-fit pb-2 pt-3" onPress={() => onPress(id)}>
            <Image width={100} src={displayImage} />
            <h3 className=" text-2xl text-center">{ displayName }</h3>
        </Button>
    );
}

export default DevImageContainer;