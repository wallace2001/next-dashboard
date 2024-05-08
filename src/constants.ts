import { CircleUserRound, Contact, Home, MessageSquare, Newspaper, Settings } from "lucide-react";

export const ROUTES = [
    {
        label: 'Home',
        icon: Home,
        href: '/dashboard/home',
        color: 'text-foreground/50',
        bgColor: "bg-violet-500/40",
    },
    {
        label: 'Sobre',
        icon: CircleUserRound,
        href: '/dashboard/about',
        color: 'text-foreground/50',
        bgColor: "bg-pink-700/40",
    },
    {
        label: 'Contato',
        icon: Contact,
        href: '/dashboard/contact',
        color: 'text-foreground/50',
        bgColor: "bg-green-700/40",
    },
    {
        label: 'Projetos',
        icon: MessageSquare,
        href: '/dashboard/projects',
        color: 'text-foreground/50',
        bgColor: "bg-yellow-700/40",
    },
    {
        label: 'Experiências',
        icon: Settings,
        href: '/dashboard/experiences',
        color: 'text-foreground/50',
        bgColor: "bg-red-700/40",
    },
    {
        label: 'Artigos',
        icon: Newspaper,
        href: '/dashboard/articles',
        color: 'text-foreground/50',
        bgColor: "bg-blue-700/40",
    },
    {
        label: 'Curriculo',
        icon: Newspaper,
        href: '/dashboard/curriculum',
        color: 'text-foreground/50',
        bgColor: "bg-red-700/40",
    },
];