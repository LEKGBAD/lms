import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"

const {Video}=new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
);


export async function PATCH (
    req:Request,
    {params}:{params:{courseId:string}}
){
    try{
        const {userId}=auth()
    if(!userId){
        return new NextResponse("Unauthorized",{status:401})
    }
    
    // const {isPublished,...values} =await req.json()

    
    if(!params.courseId){
        return new NextResponse("course ID is missing",{status:400})
    }

    
    const course =await db.course.findUnique({
        where:{
            id:params.courseId,
            userId
        },
        include:{
            chapters:{
                include:{
                    muxData:true
                }
            }
        }
    })
    if(!course){
        return new NextResponse("Unauthorized",{status:401})
    }
   
    
   const hasPublishedChapter=course.chapters.some((chapter)=>chapter.isPublished)
   
   if(!hasPublishedChapter){
    return new NextResponse("No chapter is published",{status:400})
   }
   
   const publishedCourse=await db.course.update({
    where:{
        id:params.courseId,
    },
    data:{
        isPublished:true
    }
    })
    

    

        return NextResponse.json(publishedCourse)

    }catch(err){
    console.log(`[COURSE_ID_PUBLISH],${err}`);
    return new NextResponse("Internal error",{status:500})
    }
}
