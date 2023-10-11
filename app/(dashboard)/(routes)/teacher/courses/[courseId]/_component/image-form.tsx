"use client"


import { ImageIcon, Pencil, PlusCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import FileUpload from "@/components/file-upload"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Course } from "@prisma/client"

interface ImageFormProps {
    initialData:Course;
    courseId:string;
}


const ImageForm = ({
    initialData,
    courseId
}:ImageFormProps) => {

    const [isEditing,setIsEditing]=useState(false)
    const router=useRouter()
    

    
    const onSubmit=async (values:any)=>{
        try{
            const res=await axios.patch(`/api/courses/${courseId}`,values)
            toast.success("Course updated successfully")
            toggleEdit()
            router.refresh();
        }catch(err){
            toast.error("Something went wrong")
        }
    }
    const toggleEdit=()=>{
        setIsEditing((current)=>!current)
    }
    
   
    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
                Course image
                <Button
                variant="ghost"
                onClick={()=>toggleEdit()}
                >
                    {isEditing && 
                    (<>
                    Cancel
                    </>)
                    }
                    {!isEditing && !initialData.imageUrl && 
                    (<>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add an image
                    </>)
                    }
                    {!isEditing && initialData.imageUrl &&
                    (<>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Edit image
                    </>)
                    }
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ?
            
            (<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
               <ImageIcon className="h-10 w-10 text-slate-500"/>
            </div>) :
            (<div className="relative aspect-video mt-2">
                <Image 
                alt="upload"
                fill
                className="object-cover rounded-md"
                src={initialData?.imageUrl}
                />
            </div>))
            
            }
            {isEditing && (
                <div>
                <FileUpload 
                endpoint="courseImage"
                onChange={(url)=>{
                    if(url){
                        onSubmit({imageUrl:url})
                    }
                }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    16:9 aspect ratio recommended
                </div>
                </div>
            )}
            
        </div>
     );
}
 
export default ImageForm;