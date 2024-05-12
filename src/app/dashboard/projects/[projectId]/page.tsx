"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { DialogDelete } from "@/components/dialog-delete";
import ImageUpload from "@/components/image-upload";
import { CREATE_PROJECT } from "@/graphql/actions/project/create-project.action";
import { DELETE_PROJECT } from "@/graphql/actions/project/delete-project";
import { GET_PROJECT_BY_ID } from "@/graphql/actions/project/get-project-by-id.action";
import Editor from "@/components/Editor";

interface IParams {
    projectId?: string;
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
    }),
    images: z.object({ url: z.string() }).array().min(1, { message: "Imagem é obrigatória." }),
});


const ProjectPage = ({params}: {params: IParams}) => {
    const router = useRouter();
    const [createProjectMutation] = useMutation(CREATE_PROJECT);
    const [deleteProjectMutation] = useMutation(DELETE_PROJECT);
    const { data: project, refetch: refetchProfile } = useQuery(GET_PROJECT_BY_ID, {
        variables: {
            getProjectDto: {
                id: params.projectId
            }
        }
    });

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
            id: project?.getProjectById.id,
            title: data.title,
            description: data.description,
            content: data.content,
            imagesUrl: data.images
        };

        createProjectMutation({
            variables: {
                projectDto: formData
            }
        }).then(() => {
            toast.success("Project updated successfully!");
            router.push('/dashboard/projects');
        })
    }

    function deleteProject() {
        deleteProjectMutation({
            variables: {
                deleteProjectDto: {
                    id: project?.getProjectById.id
                }
            }
        }).then(() => {
            toast.success("Project deleted!");
            router.push('/dashboard/projects');
        });
    }

    useEffect(() => {
        if (project?.getProjectById.id) {
            form.reset({
                title: project?.getProjectById.title,
                description: project?.getProjectById.description,
                content: project?.getProjectById.content,
                images: project?.getProjectById.images
            });
        }
    }, [form, project?.getProjectById]);

    return (
        <div>
            <Link href="/dashboard/projects" className=" my-4 col-span-1 w-10 h-10 rounded-full bg-foreground/10 flex justify-center items-center hover:bg-foreground/5">
                <IoArrowBackOutline className="text-foreground/40" />
            </Link>
            <h2 className="text-4xl mt-2 font-bold">{project?.getProjectById.title}</h2>
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
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter(current => current.url !== url)])}
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
                    <Button type="submit" className="w-20 h-10 mr-4">Salvar</Button>
                    <DialogDelete onDelete={deleteProject} />
                </form>
            </Form>
        </div>
    );
}
 
export default ProjectPage;