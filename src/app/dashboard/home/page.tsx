"use client";

import MultipleSelect from "@/components/multiple-select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FETCH_LINKS } from "@/graphql/actions/links.action";
import { CREATE_PROFILE } from "@/graphql/actions/profile/create-profile.action";
import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import { FETCH_TECHS } from "@/graphql/actions/techs.action";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Link, LinkProfile, Profile } from "./types";
import { generateArrayFromInput, generateDefaultValues, generateInitialValues, generateLinkFormSchema } from "./utils/generates";
import _ from "lodash";
import { UNLINK_LINK_PROFILE } from "@/graphql/actions/profile/unlink-link-profile";
import { LINK_PROFILE } from "@/graphql/actions/profile/link-profile";
import Loader from "@/components/Loader";

const formSchema = z.object({
    techs: z.string().min(1, {
        message: "Selecione as tecnologias.",
    }),
    title: z.string().min(1, {
        message: "Titulo é obrigatório.",
    }),
    description: z.string().min(1, {
        message: "Descrição é obrigatório.",
    }),
});

const HomePage = () => {

    const { data: techs } = useQuery(FETCH_TECHS);
    const { data: profileData, refetch: refetchProfile, loading: profileLoading } = useQuery(FETCH_PROFILE);

    const profile = profileData?.fetchProfile;

    const [createProfileMutation] = useMutation(CREATE_PROFILE);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: generateDefaultValues(profile),
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const arrayTechs = generateArrayFromInput(data.techs, techs?.getAllTechs);

        const dataForm = {
            title: data.title,
            description: data.description,
            techs: arrayTechs,
            id: profile?.id,
        };

        await createProfileMutation({ variables: { createProfileDto: dataForm } })
            .then(() => {
                toast.success("Profile uploaded successfully!");
                const initialValues = generateInitialValues(profile);
                form.reset(initialValues);
                refetchProfile();
            }).catch(err => {
                toast.error("Error to created profile.");
            });
    }

    useEffect(() => {
        if (profile) {
            const profileFormatted = generateInitialValues(profile);
            form.reset(profileFormatted);
        }
    }, [form, profile]);

    if (profileLoading) {
        return <Loader />
    }

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Home</h2>
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

                    <FormField
                        control={form.control}
                        name="techs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tecnologias</FormLabel>
                                <FormControl>
                                    <MultipleSelect data={techs?.getAllTechs} {...field} />
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

export default HomePage;