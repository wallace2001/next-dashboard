"use client";

import { Button } from "@/components/ui/button";
import { GET_PROJECTS } from "@/graphql/actions/project/get-project.action";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProjectList from "./components/projects-list";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GET_PROJECT_PAGE } from "@/graphql/actions/project/get-project-page.action";
import { CREATE_PROJECT_PAGE } from "@/graphql/actions/project/create-project-page.action";
import toast from "react-hot-toast";
import EmptyState from "@/components/empty-state";
import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import Loader from "@/components/Loader";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Titulo é obrigatório.",
    }),
    description: z.string().min(1, {
        message: "Descrição é obrigatório.",
    })
});

const ProjectsPage = () => {

    const router = useRouter();
    const { data: projects, refetch } = useQuery(GET_PROJECTS);
    const [createProjectPageMutation] = useMutation(CREATE_PROJECT_PAGE);
    const { data: projectPageData } = useQuery(GET_PROJECT_PAGE);
    const { data: profileData, loading: profileLoading } = useQuery(FETCH_PROFILE);

    const projectPage = projectPageData?.getProjectPage;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        createProjectPageMutation({
            variables: {
                projectPageDto: {
                    id: projectPage?.id || undefined,
                    title: data.title,
                    description: data.description
                }
            }
        }).then(() => {
            toast.success('Project info updated');
            window.location.reload();
        });
    };

    useEffect(() => {
        refetch();

        if (projectPage?.id) {
            form.reset({
                title: projectPage.title,
                description: projectPage.description
            });
        }
    }, [projectPage]);

    if (profileLoading) {
        return <Loader />
    }

    if (!profileData?.fetchProfile && !profileLoading) {
        return (
            <EmptyState 
                title = "Seu usuário ainda não possui um perfil."
                subtitle= "Vá até a página 'Home' e comece a criar seu portfólio."
            />
        )
    }

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Projetos</h2>

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
                    <div className="w-full flex justify-end">
                        <Button type="submit" className="w-20 h-10 mr-4">Salvar</Button>
                    </div>
                </form>
            </Form>

            <Button 
                className="mt-8 h-12" 
                type="button" 
                onClick={() => router.push('/dashboard/projects/new-project')}
            >Novo projeto</Button>

            <ProjectList items={projects?.getProjects || []} />
        </div>
    );
}
 
export default ProjectsPage;