"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import _ from "lodash";
import { CREATE_CONTACT } from "@/graphql/actions/contact/create-contact.action";
import { GET_CONTACT } from "@/graphql/actions/contact/get-contact.action";
import EmptyState from "@/components/empty-state";
import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import Loader from "@/components/Loader";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Titulo é obrigatório.",
    }),
    description: z.string().min(1, {
        message: "Descrição é obrigatório.",
    }),
});

const Contact = () => {
    const [createContactMutation] = useMutation(CREATE_CONTACT);
    const { data } = useQuery(GET_CONTACT);
    const { data: profile, loading: profileLoading } = useQuery(FETCH_PROFILE);

    const contact = data?.getContact;
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await createContactMutation({ variables: { contactDto: {
            title: data.title,
            description: data.description
        } } })
            .then(() => {
                toast.success("Contact uploaded successfully!");
                window.location.reload()
            });
    }
    
    useEffect(() => {
        if (contact?.id) {
            form.reset({
                title: contact.title,
                description: contact.description,
            });
        }
    }, [form, contact]);

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
            <h2 className="text-4xl mt-2 font-bold">Contato</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titulo</FormLabel>
                                <FormControl>
                                    <Input className="bg-foreground/5 h-14" placeholder="Desenvolvedor de software..." {...field} />
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
                    <Button type="submit" className="w-20 h-10">Salvar</Button>
                </form>
            </Form>
        </div>
    );
}

export default Contact;