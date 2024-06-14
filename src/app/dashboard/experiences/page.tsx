"use client";

import Loader from "@/components/Loader";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CREATE_EXPERIENCE } from "@/graphql/actions/experience/create-experience.action";
import { DELETE_EXPERIENCE } from "@/graphql/actions/experience/delete-experience";
import { GET_EXPERIENCES } from "@/graphql/actions/experience/get-experience.action";
import { FETCH_PROFILE } from "@/graphql/actions/profile/fetch-profile.action";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import _ from "lodash";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Experience = { date: { from: string | number | Date; to: string | number | Date; }; id: string | null | undefined; name: any; }

const formSchema = z.object({
    competencies: z.array(z.object({
        idExperience: z.string().nullable().optional(),
        name: z.string().min(1, {
            message: 'Experiência obrigatória.'
        }),
        function: z.string().min(1),
        date: z.object({
            from: z.date(),
            to: z.date().optional()
        }).refine(data => {
            if (!data) throw new Error("Date is required.");

            return true;
        }),
    })),
});

const ExperiencesPage = () => {
    const [createExperienceMutation] = useMutation(CREATE_EXPERIENCE);
    const [deleteExperienceMutation] = useMutation(DELETE_EXPERIENCE);
    const { data: experiences, refetch } = useQuery(GET_EXPERIENCES);
    const { data: profile, loading: profileLoading } = useQuery(FETCH_PROFILE);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            competencies: experiences?.getExperiences
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'competencies',
    });

    useEffect(() => {
        experiences?.getExperiences.forEach((experience) => {
            const date = {
                from: new Date(experience.date.from),
                to: experience.date.to ? new Date(experience.date.to) : null,
            };

            const exists = fields.find(f => f.name === experience.name);

            if (!exists) {
                append({
                    idExperience: experience.id,
                    name: experience.name,
                    function: experience?.function,
                    date
                });
            }
        });
    }, [experiences?.getExperiences]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        const dataForm = data.competencies.map(competence => ({
            id: _.get(competence, 'idExperience', null),
            name: competence.name,
            function: competence?.function,
            date: competence.date
        }));

        await createExperienceMutation({
            variables: {
                createExperienceDto: dataForm
            }
        }).then(async () => {
            toast.success("Experience added successfully!");
        });

        window.location.reload();
    };

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
            <h2 className="text-4xl mt-2 font-bold">Experiências</h2>
            <Form {...form}>
                <Button className="mt-10" type="button" onClick={() => append({ idExperience: null, name: '', function: '', date: { from: '', to: '' } })}>Adicionar experiência</Button>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
                    {fields.map((item, index) => (
                        <div key={item.id} className="w-full mt-4 grid sm:grid-cols-8 gap-6 justify-center items-center">
                            <FormField
                                control={form.control}
                                name={`competencies.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="w-full col-span-3 md:col-span-4">
                                        <FormLabel>Experiência</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register(`competencies.${index}.name`)}
                                                defaultValue={item.name}
                                                className="w-full bg-foreground/5 h-14"
                                                placeholder="Nome da Empresa"

                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`competencies.${index}.function`}
                                render={({ field }) => (
                                    <FormItem className="w-full ml-4 col-span-4">
                                        <FormLabel>Função</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register(`competencies.${index}.function`)}
                                                defaultValue={item.function}
                                                className="w-full bg-foreground/5 h-14"
                                                placeholder="Função"

                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`competencies.${index}.date`}
                                render={({ field }) => (
                                    <FormItem className="grid gap-2 col-span-8">
                                        <FormLabel>Data</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "h-14 justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value?.from ? (
                                                        <>
                                                            {format(field.value?.from, "dd/MM/yyyy")} -{" "}
                                                            {console.log(field.value)}
                                                            {field.value?.to ? format(field.value?.to, "dd/MM/yyyy") : 'Atual'}
                                                        </>
                                                    ) : field.value?.from ? (
                                                        format(field.value?.from, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Selecione a data</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    selected={field?.value}
                                                    onSelect={date => {
                                                        field.onChange(date);
                                                        const reg = form.register(`competencies.${index}.date`);
                                                        reg.onChange({ target: date });
                                                    }}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    numberOfMonths={2}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                            <div className="col-span-8 flex justify-center">
                            <Button className="w-full h-14 mt-4" type="button" variant="destructive" onClick={async () => {
                                if (item.idExperience) {
                                    deleteExperienceMutation({
                                        variables: {
                                            deleteExperienceDto: {
                                                id: item.idExperience
                                            }
                                        }
                                    }).then(() => {
                                        toast.success("Experience deleted successfully!");
                                        const initialValues = {
                                            ...experiences?.getExperiences
                                        };
                                        form.reset(initialValues);
                                        remove(index);
                                        refetch();
                                    });
                                } else {
                                    remove(index);
                                }
                            }}>
                                Remover
                            </Button>
                            </div>
                        </div>
                    ))}
                    <Button type="submit" className="mt-8">Enviar</Button>
                </form>
            </Form>
        </div>
    );
}

export default ExperiencesPage;