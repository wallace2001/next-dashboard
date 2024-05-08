"use client";

import { uploadImage } from "@/actions/upload";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";
import 'react-quill/dist/quill.snow.css';

interface IEditor extends ControllerRenderProps {};

const Editor = ({ ...rest }: IEditor) => {
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false, loading: () => <p>Loading...</p> }),[]);

    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'size': [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' },
                { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'code-block'],
                ['clean']
            ],
        }
    };

    function gerarNomeAleatorio(tamanho: number) {
        const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let nomeAleatorio = '';
    
        for (let i = 0; i < tamanho; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            nomeAleatorio += caracteres.charAt(indice);
        }
    
        return nomeAleatorio;
    }

    return (
        <ReactQuill
            {...rest}
            modules={modules}
            onChange={async (a: string) => {
                var regex = /data:image\/[^;]+;base64,([^"]*)/;
                var matches = regex.exec(a);
                
                if (matches && matches.length > 1) {
                    const base64Content = matches[1];
                    const tipoImagem = matches[1].startsWith('/9j/') ? 'image/jpeg' : 'image/png';
                    const byteCharacters = atob(base64Content);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: tipoImagem });
                    const file = new File([blob], gerarNomeAleatorio(8), { type: tipoImagem });

                    const upload = await uploadImage(file);
                    const novaString = a.replace(/src="data:image\/[^;]+;base64,[^"]*"/, `src=${upload.url}`);
                    rest.onChange(novaString);
                } else {
                    rest.onChange(a);
                }
            }}
            theme="snow"
        />
    );
};

export default Editor;