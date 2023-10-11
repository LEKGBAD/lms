"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Pencil, PlusCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Chapter, Course } from "@prisma/client"
import ChaptersList from "./chapters-list"

interface ChapterFormProps {
    initialData:Course & {chapters:Chapter[]};
    courseId:string;
}
const formSchema=z.object({
    title:z.string().min(1,{
        message:"Description is required"
    }),
   
})

const ChapterForm = ({
    initialData,
    courseId
}:ChapterFormProps) => {
    const [isCreating,setIsCreating]=useState(false)
    const [isUpdating,setIsUpdating]=useState(false)

    const router=useRouter()

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            title:""
        }
    })
    
    const {isSubmitting,isValid}=form.formState;
    
    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
        try{
            const res=await axios.post(`/api/courses/${courseId}/chapters`,values)
            toast.success("Chapter created")
            setIsCreating(false)
            router.refresh();
        }catch(err){
            toast.error("Something went wrong")
        }
    }

    const onReorder=async(updatedData:{id:string,position:number}[])=>{
        try{
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`,{updatedData})
            toast.success("Chapters reordered")
            router.refresh()
        }catch{
            toast.error("Something went wrong")
        }
        finally{
            setIsUpdating(false)
        }
    }

    const onEdit=(id:string)=>{
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }

    return ( 
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className=" absolute h-full w-full bg-slate-500/20 top-0 right-0 
                rounded-md flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-sky-700 animate-spin"/>
                </div>
            )}
            <div className="flex items-center justify-between mb-3">
                Course chapters
                <Button 
                variant="ghost"
                onClick={()=>{
                    setIsCreating((current)=>!current);
                }}
                >
                    {isCreating && 
                    <>
                    Cancel
                    </>
                    }
                    {!isCreating && 
                    <>
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Add a chapter
                    </>
                    }
                    
                </Button>
            </div>
           
        {isCreating &&
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
                            placeholder="e.g. Introduction to the course"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                    <Button
                    disabled={isSubmitting || !isValid}
                    type="submit"
                    >
                        Create
                    </Button>
                
            </form>
        </Form>
        }
        {!isCreating && (
            <div className={cn(
                "txt-xm mt-2",
                !initialData.chapters.length && "text-slate-500 italic"
            )}>
                {!initialData.chapters.length && "No chapters"}
                <ChaptersList 
                items={initialData.chapters || []}
                onEdit={onEdit}
                onReorder={onReorder}
                />
            </div>
        )}
        {!isCreating && (
            <p className="text-xs text-muted-foreground mt-4">
                Drag and drop to reorder the chapters
            </p>
        )}
        </div>
     );
}
 
export default ChapterForm;