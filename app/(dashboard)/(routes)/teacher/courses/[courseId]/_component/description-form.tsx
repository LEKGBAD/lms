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
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Course } from "@prisma/client"

interface DescriptionFormProps {
    initialData:Course;
    courseId:string;
}
const formSchema=z.object({
    description:z.string().min(1,{
        message:"Description is required"
    })
})

const DescriptionForm = ({
    initialData,
    courseId
}:DescriptionFormProps) => {
    const [isEditing,setIsEditing]=useState(false)
    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            description:initialData.description||""
        }
    })
    
    const {isSubmitting,isValid}=form.formState;
    
    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
        try{
            const res=await axios.patch(`/api/courses/${courseId}`,values)
            toast.success("Course updated successfully")
            setIsEditing(false)
            router.refresh();
        }catch(err){
            toast.error("Something went wrong")
        }
    }
    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                Course description
                <Button 
                variant="ghost"
                onClick={()=>{
                    setIsEditing((current)=>!current);
                    form.setValue("description",initialData.description||"")
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
                    Edit description
                    </>
                    }
                    
                </Button>
            </div>
            {!isEditing && 
                <p className={cn("text-sm mt-2",!initialData.description && "text-slate-500 italic")}>
                    {initialData.description || "No description"}
                </p>
            }
        {isEditing &&
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
            >
                <FormField 
                control={form.control}
                name="description"
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Textarea 
                            disabled={isSubmitting}
                            placeholder="e.g. This course is about ..."
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
 
export default DescriptionForm;