"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation } from "@apollo/client";
import { CREATE_ARTICLE } from "@/graphql/actions/article/create-article.action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Editor from "@/components/Editor";

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

const NewArticlePage = () => {
    const router = useRouter();
    const [createArticleMutation] = useMutation(CREATE_ARTICLE);

    const form = useForm<z.infer<typeof formSchema>>({
        shouldUnregister: false,
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            content: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await createArticleMutation({ variables: { articleDto: {
            title: data.title,
            description: data.description,
            content: data.content
        } } })
            .then(() => {
                toast.success("Article created successfully!");
                router.push('/dashboard/articles');
            });
    }

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Novo Artigo</h2>
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
                    <Button type="submit" className="w-20 h-10">Criar</Button>
                </form>
            </Form>
        </div>
    );
}
 
export default NewArticlePage;