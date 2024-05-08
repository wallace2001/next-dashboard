"use client";

import { Button } from "@/components/ui/button";
import { GET_ARTICLES } from "@/graphql/actions/article/get-article.action";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import Article from "./components/article";
import { useEffect } from "react";

const ArticlesPage = () => {

    const router = useRouter();
    const { data: articles, refetch: refetchProfile } = useQuery(GET_ARTICLES);

    useEffect(() => {
        refetchProfile();
    }, []);
    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Artigos</h2>

            <Button className="mt-4
            " type="button" onClick={() => router.push('/dashboard/articles/new-article')}>Novo Artigo</Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {articles?.getArticles.map(article => (
                    <Article key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
 
export default ArticlesPage;