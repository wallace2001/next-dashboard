"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ARTICLE } from "@/graphql/actions/article/create-article.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { GET_ARTICLE_BY_ID } from "@/graphql/actions/article/get-article-by-id.action";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { DialogDelete } from "@/components/dialog-delete";
import { DELETE_ARTICLE } from "@/graphql/actions/article/delete-article";
import { uploadImage } from "@/actions/upload";
import Editor from "@/components/Editor";

interface IParams {
    articleId?: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Titulo é obrigatório.",
    }),
    description: z.string().min(1, {
        message: "Descrição é obrigatório.",
    }),
    content: z.string().min(1, {
        message: "Content é obrigatório.",
    })
});

const ArticlePage = ({params}: {params: IParams}) => {

    const router = useRouter();
    const [createArticleMutation] = useMutation(CREATE_ARTICLE);
    const [deleteArticleMutation] = useMutation(DELETE_ARTICLE);
    const { data: article, refetch: refetchProfile } = useQuery(GET_ARTICLE_BY_ID, {
        variables: {
            getArticleDto: {
                id: params.articleId
            }
        }
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            content: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await createArticleMutation({ variables: { articleDto: {
            id: article?.getArticleById.id,
            title: data.title,
            description: data.description,
            content: data.content
        } } })
            .then(() => {
                toast.success("Article created successfully!");
                router.push('/dashboard/articles');
            });
    }

    function deleteArticle() {
        deleteArticleMutation({
            variables: {
                deleteArticleDto: {
                    id: article?.getArticleById.id
                }
            }
        }).then(() => {
            toast.success("Article deleted!");
            router.push('/dashboard/articles');
        });
    }

    useEffect(() => {
        form.reset({
            title: article?.getArticleById.title,
            description: article?.getArticleById.description,
            content: article?.getArticleById.content,
        });
    }, [form, article?.getArticleById]);

    return (
        <div>
            <Link href="/dashboard/articles" className=" my-4 col-span-1 w-10 h-10 rounded-full bg-foreground/10 flex justify-center items-center hover:bg-foreground/5">
                <IoArrowBackOutline className="text-foreground/40" />
            </Link>
            <h2 className="text-4xl mt-2 font-bold">{article?.getArticleById.title}</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titulo</FormLabel>
                                <FormControl>
                                    <Input className="bg-foreground/5 h-14" placeholder="Novo projeto utilizando ReactJS..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea className="bg-foreground/5 h-14" placeholder="Descrição" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conteudo (É preciso adicionar titulo novamente)</FormLabel>
                                <FormControl>
                                    <Editor {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-20 h-10 mr-4">Atualizar</Button>
                    <DialogDelete onDelete={deleteArticle} />
                    {/* <Button type="button" variant="destructive" className="ml-4 w-20 h-10">Deletar</Button> */}
                </form>
            </Form>
        </div>
    );
}
 
export default ArticlePage;