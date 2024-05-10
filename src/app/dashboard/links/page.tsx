"use client";

import { FETCH_LINKS } from "@/graphql/actions/links.action";
import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import { useMutation, useQuery } from "@apollo/client";
import { z } from "zod";
import { generateArrayFromInput, generateLinkFormSchema } from "../home/utils/generates";
import { useEffect, useState } from "react";
import { UNLINK_LINK_PROFILE } from "@/graphql/actions/profile/unlink-link-profile";
import { LINK_PROFILE } from "@/graphql/actions/profile/link-profile";
import { Link, LinkProfile, Profile } from "../home/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CREATE_PROFILE } from "@/graphql/actions/profile/create-profile.action";
import MultipleSelect from "@/components/multiple-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import EmptyState from "@/components/empty-state";
import Loader from "@/components/Loader";

const createFormSchema = (fields: Record<string, z.ZodType<any, any>>) => {
    let schema: any = z.object({
        links: z.string().min(1, {
            message: "Selecione as tecnologias.",
        })
    });

    Object.entries(fields).forEach(([fieldName, fieldSchema]) => {
        schema = schema.extend({
            [fieldName]: fieldSchema,
        });
    });

    return schema;
};

const LinksPage = () => {
    const [linksSelecteds, setLinksSelects] = useState<any[]>([]);

    const { data: profileData, refetch: refetchProfile, loading: profileLoading } = useQuery(FETCH_PROFILE);
    const { data: linksData } = useQuery(FETCH_LINKS);

    const [ unlinkLinkProfileMutation ] = useMutation(UNLINK_LINK_PROFILE);
    const [ linkProfileMutation ] = useMutation(LINK_PROFILE);
    const [ createProfileMutation ] = useMutation(CREATE_PROFILE);

    const profile = profileData?.fetchProfile;
    const links = linksData?.getAllLinks;

    const formSchema = createFormSchema({
        ...generateLinkFormSchema(
            profile?.links || linksSelecteds
        ),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
                links: profile?.links.map((l) => l.name).join(", "),
            ...profile?.linkProfiles?.reduce((acc: any, link) => {
                acc[link.link.icon] = link.linkUrl;
                return acc;
            }, {}),
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const arrayLinks = generateArrayFromInput(data.links, links);
        const linksGroup = generateLinksGroup(data, profile);

        const dataForm = {
            title: profile?.title,
            description: profile?.description,
            linksGroup,
            techs: profile?.techs.map(t => ({
                id: t?.id,
                icon: t?.icon,
                name: t?.name,
            })),
            links: arrayLinks,
            id: profile?.id,
        };

        await createProfileMutation({ variables: { createProfileDto: dataForm } })
            .then(() => {
                toast.success("Links updated successfully!");
                form.reset({
                    links: profile?.links.map((l) => l.name).join(", "),
                    ...profile?.linkProfiles?.reduce((acc: any, link) => {
                        acc[link.link.icon] = link.linkUrl;
                        return acc;
                    }, {}),
                });
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
        if (profile) {
            form.reset({
                links: profile?.links.map((l) => l.name).join(", "),
                ...profile?.linkProfiles?.reduce((acc: any, link) => {
                    acc[link.link.icon] = link.linkUrl;
                    return acc;
                }, {}),
            });
        }
    }, [form, profile]);

    if (profileLoading) {
        return <Loader />
    }

    if (!profile && !profileLoading) {
        return (
            <EmptyState 
                title = "Seu usuário ainda não possui um perfil."
                subtitle= "Vá até a página 'Home' e comece a criar seu portfólio."
            />
        )
    }

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Links</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full mt-8">
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
                                            profile?.id && window.location.reload();
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
                                            profile?.id && window.location.reload();
                                            setLinksSelects(prev => [...prev, item]);
                                        }} 
                                        data={links} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {profile?.links?.map((link: Link) => (
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
};

export default LinksPage;