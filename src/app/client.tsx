/* eslint-disable @next/next/no-async-client-component */
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
    password: z.string().min(6, {
        message: "Senha deve ser maior do que 6 caracteres",
    }),
    email: z.string().email({
        message: "Email invalido.",
    }),
})


const AuthPage = () => {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && searchParams.get('error')) {
            toast.error('Email and password are incorrect!');
        }
        setIsMounted(true);
    }, [isMounted, searchParams]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true);
          try {
            await signIn("credentials", {
                email: data.email,
                password: data.password,
                callbackUrl: '/',
            });
          } catch (error) {
            toast.error('Email and password are incorrect!');
          } finally {
            setIsLoading(false);
          }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div className="w-full h-full lg:grid lg:grid-cols-8 flex items-center justify-center">
            <div className="w-full h-[100vh] col-span-3 bg-background flex flex-col justify-center items-center">
                <p className="text-foreground font-bold text-[17px]">Bem vindo de volta!</p>
                <p className="text-foreground/70 text-sm mt-2 mb-8">Por favor, faça o login para continuar</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full px-4 lg:px-16">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input className="bg-foreground/5 h-14" placeholder="email@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" className="bg-foreground/5 h-14" placeholder="Senha" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Lembrar de mim 
                                </label>
                            </div>

                            <Link href="#" className="text-sm">Esqueceu a senha ?</Link>
                        </div>

                        <Button type="submit" className="w-full h-14" disabled={isLoading}>Login</Button>
                    </form>
                </Form>
            </div>
            <div className="col-span-5 bg-foreground/5 h-[100vh] hidden lg:flex justify-center items-center">
                <Image
                    width={1280}
                    height={720}
                    className="w-full h-full object-cover"
                    src='/teste.jpg'
                    alt=""
                />
            </div>
        </div>
    );
}

export default AuthPage;