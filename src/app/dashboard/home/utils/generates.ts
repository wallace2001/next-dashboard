import { z } from "zod";
import { Link, Profile } from "../types";

export function generateLinkFormSchema(links: Link[] | undefined): Record<string, z.ZodType<string>> {
    return links?.reduce((acc, link) => {
        acc[link.icon] = z.string().min(1, { message: "Descrição é obrigatório." });
        return acc;
    }, {} as Record<string, z.ZodType<string>>) ?? {};
}
export function generateDefaultValues(profile: Profile | undefined): Record<string, any> {
    return {
        title: profile?.title,
        techs: "",
        links: "",
        description: "",
        ...generateInitialValues(profile),
    };
}

export function generateArrayFromInput(input: string, options: Link[] | undefined): Link[] {
    if (!input || !options) return [];
    const inputArray = input.split(", ");
    return inputArray.map((item) => {
        const option = options.find((opt) => opt.name === item);
        return option ? { id: option.id, name: option.name, icon: option.icon } : { id: "", name: item, icon: "" };
    });
}

export function generateInitialValues(profile: Profile | undefined): Record<string, any> {
    return {
        ...profile,
        techs: profile?.techs.map((t) => t.name).join(", "),
        links: profile?.links.map((l) => l.name).join(", "),
        images: [],
        ...profile?.linkProfiles?.reduce((acc: any, link) => {
            acc[link.link.icon] = link.linkUrl;
            return acc;
        }, {}),
    };
}