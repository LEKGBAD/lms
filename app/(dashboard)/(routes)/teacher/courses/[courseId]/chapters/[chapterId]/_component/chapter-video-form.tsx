"use client"


import { ImageIcon, Pencil, PlusCircle, Video, VideoIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import FileUpload from "@/components/file-upload"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Chapter, MuxData } from "@prisma/client"
import MuxPlayer from "@mux/mux-player-react"

interface ChapterVideoFormProps {
    initialData:Chapter & {muxData?:MuxData|null};
    courseId:string;
    chapterId:string
}


const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}:ChapterVideoFormProps) => {

    const [isEditing,setIsEditing]=useState(false)
    const router=useRouter()
    

    
    const onSubmit=async (values:any)=>{
        try{
            const res=await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values)
            toast.success("Chapter updated")
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
                Chapter video
                <Button
                variant="ghost"
                onClick={()=>toggleEdit()}
                >
                    {isEditing && 
                    (<>
                    Cancel
                    </>)
                    }
                    {!isEditing && !initialData.videoUrl && 
                    (<>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add a video
                    </>)
                    }
                    {!isEditing && initialData.videoUrl &&
                    (<>
                    <Pencil className="h-4 w-4 mr-2"/>
                    Edit video
                    </>)
                    }
                    
                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ?
            
            (<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
               <Video className="h-10 w-10 text-slate-500"/>
            </div>) :
            (<div className="relative aspect-video mt-2">
                <MuxPlayer 
                playbackId={initialData?.muxData?.playbackId || ""}
                />
            </div>))
            
            }
            {isEditing && (
                <div>
                <FileUpload 
                endpoint="chapterVideo"
                onChange={(url)=>{
                    if(url){
                        onSubmit({videoUrl:url})
                    }
                }}
                />
                <div className="text-xs text-muted-foreground mt-4">
                    Upload this chapters' video
                </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take few minutes to process. Refresh the page if video does not appear.
                </div>
            )}     
        </div>
     );
}
 
export default ChapterVideoForm;