"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface IArticle {
    article: {
        id: string;
        title: string;
        createdAt: string;
        description: string;
    };
}

const MAX_DESCRIPTION_LENGTH = 80;

const Article = ({ article }: IArticle) => {
    const { id, title, description, createdAt } = article;
    const truncatedDescription = description.length > MAX_DESCRIPTION_LENGTH
    ? description.substring(0, MAX_DESCRIPTION_LENGTH - 3) + '...' // Adiciona reticências se a descrição for maior que o limite
    : description;
    return (
        <div className="bg-backgroundContent text-white space-y-4 border rounded-md flex shadow flex-col">
        <div className="flex-1">
            <div className="space-y-1">
                <Link
                    href={`/dashboard/articles/${id}`}
                    key={'#'}
                    className={"text-sm flex-col group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-foreground hover:bg-foreground/5 rounded-lg transition"}
                >
                    <div className="w-full h-4 flex flex-row items-center mb-4">
                        <span className="w-[2px] h-full bg-foreground/30" />
                        <span className="ml-6 text-[12px] text-foreground">{format(new Date(createdAt), 'MMMM d, yyyy', { locale: ptBR })}</span>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[15px] mt-2 font-bold text-foreground/80">{title}</p>
                        <p className="text-sm mt-2 text-foreground/50">{truncatedDescription}</p>
                        <div className="flex justify-start items-center text-[#2CBDAA] mt-4">
                            <span>Ver projeto</span>
                            <MdOutlineKeyboardArrowRight />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    </div>
    );
}

export default Article;