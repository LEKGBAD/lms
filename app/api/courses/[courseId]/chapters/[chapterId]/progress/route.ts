import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

export  async function PUT(
    req:Request,
    {params}:{params:{courseId:string,chapterId:string}}
){
    try{
        const {isCompleted}=await req.json();
        const {userId}=auth();
        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        if(!params.courseId || !params.chapterId){
            return new NextResponse("CourseId,ChapterId is missing",{status:400})
        }
        
        const chapter=await db.chapter.findUnique({
            where:{
                id:params.chapterId,
                isPublished:true,
                courseId:params.courseId,
            }
        })

        if(!chapter){
            return new NextResponse("Course or Chapter not found",{status:404})
        }
        const userProgress=await db.userProgress.upsert({
            where:{
                userId_chapterId:{userId,chapterId:params.chapterId}
            },
            update:{
                isComplete:isCompleted
            },
            create:{
                userId,
                chapterId:params.chapterId,
                isComplete:isCompleted
            }
        })

        return NextResponse.json(userProgress)

    }catch(err){
        console.log("[CHAPTER_ID_PROGRESS]",err)
        return new NextResponse("Internal error",{status:500})
    }
}