"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { File, ImageIcon, Loader2, Pencil, PlusCircle, Trash, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import FileUpload from "@/components/file-upload"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Attachment, Course } from "@prisma/client"
import { db } from "@/lib/db"

interface AttachmentFormProps {
    initialData:Course & {attachments:Attachment[]};
    courseId:string;
}

const formSchema=z.object({
    url:z.string().min(1)
})


const AttachmentForm = ({
    initialData,
    courseId
}:AttachmentFormProps) => {

    const [isEditing,setIsEditing]=useState(false)
    const [deletingId,setdeletingId]=useState<string|null>(null)
    const router=useRouter()
    

    
    const onSubmit=async (values:any)=>{
        try{
            const res=await axios.post(`/api/courses/${courseId}/attachments`,values)
            toast.success("Course updated successfully")
            toggleEdit()
            router.refresh();
        }catch(err){
            toast.error("Something went wrong")
        }
    }

    const onDelete=async(attachmentId:string)=>{
        setdeletingId(attachmentId)
        try{
            await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`)
            toast.success("Attachment deleted")
            router.refresh();
        }catch(err){
            toast.error("Something went wrong")
        }
        finally{
            setdeletingId(null)
        }
    }
    const toggleEdit=()=>{
        setIsEditing((current)=>!current)
    }

    
   
    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                Course Attachments
                <Button
                variant="ghost"
                onClick={()=>toggleEdit()}
                >
                    {isEditing && 
                    (<>
                    Cancel
                    </>)
                    }
                    {!isEditing && 
                    (<>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add an attachment
                    </>)
                    }
                    
                    
                </Button>
            </div>
            {!isEditing && (
                <>
                {initialData.attachments.length===0 && (
                    <p className="text-sm text-slate-500 mt-2 italic">
                        No attachemnts yet
                    </p>
                )}
                {initialData.attachments.length>0 && (
                    <div className="space-y-2">
                        {initialData.attachments.map((attachment)=>(
                            <div
                            key={attachment.id}
                            className="flex items-center p-3 bg-sky-100 border-sky-200 border
                             text-sky-700 rounded-md"
                            >
                                <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                <p
                                className="text-xs line-clamp-1 cursor-pointer"
                                >
                                    {attachment.name}
                                </p>
                                {deletingId===attachment.id && (
                                    <Loader2 className="h-4 w-4 animate-spin ml-auto"/>
                                )}
                                {deletingId!==attachment.id && (
                                    <button 
                                    onClick={()=>onDelete(attachment.id)}
                                    className="ml-auto hover:opacity-75 transition"
                                    >
                                    <X className="h-4 w-4"/>
                                    </button>
                                )}
                            </div>
                        ))}

                    </div>
                )}
                </>
            )
            
            }
            {isEditing && (
                <div>
                <FileUpload 
                endpoint="courseAttachment"
                onChange={(url)=>{
                    if(url){
                        onSubmit({url:url})
                    }
                }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                   Add anything your student might need to complete the course
                </div>
                </div>
            )}
            
        </div>
     );
}
 
export default AttachmentForm;