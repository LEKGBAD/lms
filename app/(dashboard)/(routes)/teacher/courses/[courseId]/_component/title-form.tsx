"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface TitleFormProps {
    initialData:{
        title:string
    };
    courseId:string;
}
const formSchema=z.object({
    title:z.string().min(1,{
        message:"Title is required"
    })
})

const TitleForm = ({
    initialData,
    courseId
}:TitleFormProps) => {

    const [isEditing,setIsEditing]=useState(false)

    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData
    })
    
    const {isSubmitting,isValid}=form.formState;
    
    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
        try{
            const res=await axios.patch(`/api/courses/${courseId}`,values)
            toast.success("Title updated successfully")
            setIsEditing(false)
            router.refresh();
        }catch(err){
            toast.error("Something went wrong")
        }
    }
    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                Course title
                <Button 
                variant="ghost"
                onClick={()=>{
                    setIsEditing((current)=>!current);
                    form.setValue("title",initialData.title)
                }}
                >
                    {isEditing && 
                    <>
                    Cancel
                    </>
                    }
                    {!isEditing && 
                    <>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Edit title
                    </>
                    }
                    
                </Button>
            </div>
            {!isEditing && 
                <p className="text-sm mt-2">{initialData.title}</p>
            }
        {isEditing &&
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
            >
                <FormField 
                control={form.control}
                name="title"
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input 
                            disabled={isSubmitting}
                            placeholder="e.g. Advanced web programming"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <div className="flex items-center gap-x-2">
                    <Button
                    disabled={isSubmitting || !isValid}
                    type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
        }
        </div>
     );
}
 
export default TitleForm;