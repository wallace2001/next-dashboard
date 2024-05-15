"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Project } from "../../../../../types";

interface ProjectCardProps {
    item: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    item
}) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/projects/${item.id}`);
    }
    return (
        <div onClick={handleClick} className="md:h-[30rem] lg:h-[28rem] bg-backgroundContent text-white group cursor-pointer rounded-xl border p-3 space-y-4 text-sm flex-col group flex w-full justify-start font-medium hover:text-foreground hover:bg-foreground/15 transition">
            <div className="flex-1">
                <div className="flex justify-center items-center">
                    <div className="lg:w-[60%] w-full aspect-square rounded-xl bg-gray-300 relative">
                        <Image
                            src={item?.images[0].url}
                            fill
                            alt="Image"
                            className="object-cover rounded-md"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-lg mt-2 text-foreground">{item.title}</p>
                    <p className="text-sm text-gray-500 md:line-clamp-5 lg:line-clamp-4 overflow-hidden text-ellipsis">
                        {item.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;