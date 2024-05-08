"use client";

import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CREATE_CURRICULUM } from "@/graphql/actions/curriculum/create-curriculum.action";
import { GET_CURRICULUM } from "@/graphql/actions/curriculum/get-curriculum.action";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import _ from "lodash";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
    file: z.object({ url: z.string() }),
});

const CurriculumPage = () => {
    const [createCurriculumMutation] = useMutation(CREATE_CURRICULUM);
    const [isLoading, setIsLoading] = useState(false);
    const { data } = useQuery(GET_CURRICULUM);

    const curriculum = data?.getCurriculum;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file: {},
        }
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await createCurriculumMutation({ variables: { curriculumDto: {
            id: curriculum?.id || undefined,
            url: data.file.url,
        } } })
            .then(() => {
                toast.success("Curriculum uploaded successfully!");
                window.location.reload()
            });
    }
    
    useEffect(() => {
        if (curriculum?.id) {
            form.reset({
                file: { url: curriculum.url }
            });
        }
    }, [form, curriculum]);

    return (
        <div>
            <h2 className="text-4xl mt-2 font-bold">Curriculo</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Curriculo</FormLabel>
                                <FormControl>
                                    <div>
                                        <div className="mb-4 flex items-center ga-4">
                                            {field.value.url && (
                                                <div key={field.value.url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden m-4">
                                                <div className="z-10 absolute top-2 right-2">
                                                    <Button type="button" variant="destructive" onClick={() => field.onChange({url: ''})}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <object name="bane" width="400px" height="400px" data={field.value.url}></object>
                                            </div>
                                            )}
                                        </div>
                                        <UploadButton
                                            endpoint="portfolioAttachment"
                                            onClientUploadComplete={(res) => {
                                                field.onChange({ url: res[0].url })
                                                toast.success('Upload Completed.')
                                            }}
                                            onUploadProgress={(res) => {
                                                if (res >= 100) setIsLoading(false);
                                                else setIsLoading(true);
                                            }}
                                            onUploadError={(error: Error) => {
                                            // Do something with the error.
                                            alert(`ERROR! ${error.message}`);
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="mt-8" disabled={isLoading}>Enviar</Button>
                </form>
            </Form>
        </div>
    );
}

export default CurriculumPage;