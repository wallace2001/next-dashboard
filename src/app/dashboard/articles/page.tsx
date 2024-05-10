"use client";

import { Button } from "@/components/ui/button";
import { GET_ARTICLES } from "@/graphql/actions/article/get-article.action";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import Article from "./components/article";
import { useEffect } from "react";
import EmptyState from "@/components/empty-state";
import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import Loader from "@/components/Loader";

const ArticlesPage = () => {

    const router = useRouter();
    const { data: articles, refetch } = useQuery(GET_ARTICLES);
    const { data: profile, loading: profileLoading } = useQuery(FETCH_PROFILE);

    useEffect(() => {
        refetch();
    }, []);

    if (profileLoading) {
        return <Loader />
    }

    if (!profile?.fetchProfile && !profileLoading) {
        return (
            <EmptyState 
                title = "Seu usuário ainda não possui um perfil."
                subtitle= "Vá até a página 'Home' e comece a criar seu portfólio."
            />
        )
    }
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