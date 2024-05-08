"use client";

import _, { isEmpty } from "lodash";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface IMultipleSelect extends ControllerRenderProps {
    data: {
        id: string;
        name: string;
        icon: string;
    }[];
    onSelect?: (item: any) => void;
    onDelete?: (name: string) => void;
}

const MultipleSelect = ({
    data,
    onSelect,
    onDelete,
    ...rest
}: IMultipleSelect) => {
    const [selects, setSelect] = useState<string[]>([]);

    const handleSelect = async (value: string) => {
        rest.onChange([...selects, value].join(', '));
        setSelect(prev => [...prev, value]);
        if (onSelect) {
            const item = data.find(d => d.name === value);
            onSelect(item);
        }
    };

    const deleteSelect = async (value: string) => {
        const items = selects.filter(s => s !== value);
        setSelect(items);
        rest.onChange(items.join(', '));

        if (onDelete) {    
            const item = data.find(d => d.name === value);
            onDelete(item as any);
        }
    };

    useEffect(() => {
        const restValues = isEmpty(rest.value) ? [] : rest.value.split(', ');
        setSelect(restValues);
    }, [rest.value]);

    return (
        <>
            <Select {...rest} value="" onValueChange={handleSelect}>
                <SelectTrigger className="bg-foreground/5 h-14">
                    <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="max-h-[250px]">
                    <SelectGroup>
                        {_.difference(data?.map(d => d.name), selects).map(value => (
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="w-full flex justify-start flex-wrap bg-foreground/5">
                {selects.map(select => (
                    <div className="flex m-4 relative bg-foreground/10 rounded-md p-2" key={select}>
                        <Button
                            type="button"
                            onClick={() => deleteSelect(select)}
                            className="absolute top-[-4px] right-[-3px] w-4 h-4 bg-destructive" variant="default" size="icon"
                        >
                            <X size={12} />
                        </Button>
                        {select}
                    </div>
                ))}
            </div>
        </>
    );
}

export default MultipleSelect;