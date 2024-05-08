"use client"

import EmptyState from "@/components/empty-state";

const NotFound = () => {
    return (
        <EmptyState
            title="Página não encontrada"
            subtitle="Essa página que você tentou buscar aparentemente não existe no nosso dominio."
        />
    );
}
 
export default NotFound;