'use client';

import { useRouter } from "next/navigation";
import Heading from "./Heading";
import { Button } from "./ui/button";

interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = "Página em construção",
    subtitle = "Tente novamente mais tarde, a página ainda está em construção...",
    showReset
}) => {

    const router = useRouter();

    return ( 
        <div className="
            h-[60vh]
            flex
            flex-col
            gap-2
            justify-center
            items-center
        ">
            <Heading
                center
                title={title}
                subtitle={subtitle}
            />

            <div className="w-48 mt-4">
                {showReset && (
                    <Button
                        onClick={() => router.push('/')}
                        className="w-full"
                    >
                        Voltar
                    </Button>
                )}
            </div>
        </div>
     );
}
 
export default EmptyState;