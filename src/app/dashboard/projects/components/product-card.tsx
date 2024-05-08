"use client";

import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import IconButton from "../../../../components/ui/icon-button";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import { Project } from "../../../../../types";

interface ProjectCardProps {
    item: Project;
}

const MAX_DESCRIPTION_LENGTH = 80;

const ProjectCard: React.FC<ProjectCardProps> = ({
    item
}) => {
    const truncatedDescription = item.description.length > MAX_DESCRIPTION_LENGTH
    ? item.description.substring(0, MAX_DESCRIPTION_LENGTH - 3) + '...' // Adiciona reticências se a descrição for maior que o limite
    : item.description;
    
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/projects/${item.id}`);
    }
    return (
        <div onClick={handleClick} className="bg-backgroundContent text-white group cursor-pointer rounded-xl border p-3 space-y-4 text-sm flex-col group flex w-full justify-start font-medium hover:text-foreground hover:bg-foreground/15 transition">
            <div className="flex-1">
                <div className="flex justify-center items-center">
                    <div className="lg:w-[60%] h-[25rem] w-full aspect-square rounded-xl bg-gray-300 relative">
                        <Image
                            src={item?.image.url}
                            fill
                            alt="Image"
                            className="aspect-square object-cover rounded-md"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-lg mt-2">{item.title}</p>
                    <p className="text-sm text-gray-500">
                        {truncatedDescription}
                    </p>
                </div>
            </div>
            {/* <div className="flex items-center justify-between">
                <Currency value={item.price}/>
            </div> */}
        </div>
    );
}

export default ProjectCard;