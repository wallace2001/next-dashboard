"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import ImageUpload from "@/components/image-upload";
import { CREATE_PROJECT } from "@/graphql/actions/project/create-project.action";
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
    }),
    images: z.object({ url: z.string() }).array().min(1, { message: "Imagem é obrigatória." }),
});

const NewProjectPage = () => {
    const router = useRouter();
    const [createProjectMutation] = useMutation(CREATE_PROJECT);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            content: '',
            images: [],
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const formData = {
            id: undefined,
            title: data.title,
            description: data.description,
            content: data.content,
            imageUrl: data.images[0].url
        };

        createProjectMutation({
            variables: {
                projectDto: formData
            }
        }).then(() => {
            toast.success("Project created successfully!");
            router.push('/dashboard/projects');
        })
    }

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Novo Projeto</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-8">
                                        <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagem principal</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map(image => image.url)}
                                        // disabled={loading}
                                        onChange={(url) => field.onChange([{ url }])}
                                        onRemove={() => field.onChange([])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                <FormLabel>Detalhes do projeto (É preciso adicionar titulo e descrição novamente)</FormLabel>
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
 
export default NewProjectPage;