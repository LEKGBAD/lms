"use client"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const formShema=z.object({
    title:z.string().min(1,{
        message:"Title is required"
    }),

})

const CreatePage = () => {
    const router=useRouter();
    const form=useForm<z.infer <typeof formShema>>({
        resolver:zodResolver(formShema),
        defaultValues:{
            title:""
        }
    })
    const {isSubmitting,isValid}=form.formState
    const isLoading=isSubmitting;

    const onSubmit=async (values:z.infer<typeof formShema>)=>{
        try{
            const res=await axios.post("/api/courses",values)
            router.push(`/teacher/courses/${res?.data?.id}`)
            toast.success("Course created")
        }catch(err){
            toast.error("Something went wrong");
        }
    }
    return ( 
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name your course</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don't worry you can change this later
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 mt-8"
                    > 
                        <FormField 
                        control={form.control}
                        name="title"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Course title</FormLabel>
                                <FormControl>
                                    <Input 
                                    placeholder="e.g. Advanced web development"
                                    disabled={isSubmitting}
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex gap-x-2 items-center">
                            <Link href="/teacher/courses">
                             <Button 
                             variant="ghost"
                             type="button"
                             >Cancel
                             </Button>
                            </Link>
                            <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
     );
}
 
export default CreatePage;