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

const createFormSchema = (fields: Record<string, z.ZodType<any, any>>) => {
    let schema: any = z.object({
        techs: z.string().min(1, {
            message: "Selecione as tecnologias.",
        }),
        links: z.string().min(1, {
            message: "Selecione as tecnologias.",
        }),
        title: z.string().min(1, {
            message: "Titulo é obrigatório.",
        }),
        description: z.string().min(1, {
            message: "Descrição é obrigatório.",
        }),
    });

    Object.entries(fields).forEach(([fieldName, fieldSchema]) => {
        schema = schema.extend({
            [fieldName]: fieldSchema,
        });
    });

    return schema;
};

const HomePage = () => {
    const [linksSelecteds, setLinksSelects] = useState<any[]>([]);

    const { data: techs } = useQuery(FETCH_TECHS);
    const { data: profile, refetch: refetchProfile } = useQuery(FETCH_PROFILE);
    const { data: links } = useQuery(FETCH_LINKS);

    const [ unlinkLinkProfileMutation ] = useMutation(UNLINK_LINK_PROFILE);
    const [ linkProfileMutation ] = useMutation(LINK_PROFILE);
    const [createProfileMutation] = useMutation(CREATE_PROFILE);

    const formSchema = createFormSchema({
        ...generateLinkFormSchema(
            profile?.fetchProfile.links || linksSelecteds
        ),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: generateDefaultValues(profile?.fetchProfile),
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const arrayTechs = generateArrayFromInput(data.techs, techs?.getAllTechs);
        const arrayLinks = generateArrayFromInput(data.links, links?.getAllLinks);
        const linksGroup = generateLinksGroup(data, profile?.fetchProfile);

        const dataForm = {
            title: data.title,
            description: data.description,
            linksGroup,
            techs: arrayTechs,
            links: arrayLinks,
            id: profile?.fetchProfile.id,
        };

        await createProfileMutation({ variables: { createProfileDto: dataForm } })
            .then(() => {
                toast.success("Food uploaded successfully!");
                const initialValues = generateInitialValues(profile?.fetchProfile);
                form.reset(initialValues);
                refetchProfile();
            });
    }

    function generateLinksGroup(data: z.infer<typeof formSchema>, profile: Profile | undefined): LinkProfile[] | unknown {
        return _.uniqBy([...profile?.links || [], ...linksSelecteds], 'name').map((link) => {
            if (!!data[link.icon]) {
                const exists = profile?.linkProfiles?.find((l) => l.link.icon === link.icon);
                const linkForm = {
                    id: exists?.id,
                    link: { id: link.id, name: link.name, icon: link.icon },
                    linkUrl: data[link.icon],
                };
                if (exists?.id) linkForm.id = exists.id;
                return linkForm;
            }
        }) ?? [];
    }
    
    useEffect(() => {
        if (profile?.fetchProfile) {
            const profileFormatted = generateInitialValues(profile?.fetchProfile);
            form.reset(profileFormatted);
        }
    }, [form, profile?.fetchProfile]);

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
                    <FormField
                        control={form.control}
                        name="links"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Links</FormLabel>
                                <FormControl>
                                    <MultipleSelect 
                                        onDelete={async (item: any) => {
                                            const items = linksSelecteds.filter(d => d.name !== item.name);
                                            await unlinkLinkProfileMutation({
                                                variables: {
                                                    unlinkLinkProfileDto: {
                                                        id: item.id
                                                    }
                                                }
                                            });
                                            refetchProfile();
                                            setLinksSelects(items);
                                        }} 
                                        onSelect={async (item: any) => {
                                            await linkProfileMutation({
                                                variables: {
                                                    linkProfileDto: {
                                                        id: item.id
                                                    }
                                                }
                                            });
                                            refetchProfile();
                                            setLinksSelects(prev => [...prev, item]);
                                        }} 
                                        data={links?.getAllLinks} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {(profile?.fetchProfile?.links || linksSelecteds)?.map((link: Link) => (
                        <FormField
                            control={form.control}
                            name={link.icon}
                            key={link.id}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link do {link.name}</FormLabel>
                                    <FormControl>
                                        <Input type="url" className="bg-foreground/5 h-14" placeholder={`Link do ${link.name}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="submit" className="w-20 h-10">Salvar</Button>
                </form>
            </Form>
        </div>
    );
}

export default HomePage;