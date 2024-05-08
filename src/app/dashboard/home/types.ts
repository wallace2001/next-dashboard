export type Link = {
    id: string;
    name: string;
    icon: string;
}

export type Tech = {
    id: string;
    name: string;
    icon: string;
}

export type LinkProfile = {
    id: string;
    linkId: string;
    link: Link;
    linkUrl: string;
}

export type Profile = {
    id: string;
    title: string;
    description: string;
    techs: Tech[];
    links: Link[];
    linkProfiles?: LinkProfile[];
};
