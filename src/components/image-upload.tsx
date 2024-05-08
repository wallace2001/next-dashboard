import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ImageUploadProps {
    disabled?: boolean;
    isPdf?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value?: string[];
    valueButton?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    isPdf = false,
    valueButton,
    disabled,
    onChange,
    onRemove,
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center ga-4">
                {value?.map(url => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden m-4">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" variant="destructive" onClick={() => onRemove(url)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        {isPdf ? (
                             <object name="bane" width="400px" height="400px" data={url}></object>
                        ) : (
                            <Image 
                                fill
                                className="object-cover"
                                alt="image"
                                src={url}
                            />
                        )}
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={onUpload} options={{maxFiles: 1}} uploadPreset="alepqnnr">
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                            className="z-99"
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            {valueButton || "Importar imagem"}
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}
 
export default ImageUpload;