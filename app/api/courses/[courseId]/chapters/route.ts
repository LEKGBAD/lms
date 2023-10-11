import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(req:Request,{params}:{params:{courseId:string}}){
try{
    const {userId}=auth()
    if(!userId || !isTeacher(userId)){
        return new NextResponse("Unauthorized",{status:401})
    }
    
    const {title}=await req.json()

    if(!title){
        return new NextResponse("title is missing",{status:400})
    }
    
    if(!params.courseId){
        return new NextResponse("course ID is missing",{status:400})
    }
    
    const courseOwner =await db.course.findUnique({
        where:{
            id:params.courseId,
            userId
        }
    })
    if(!courseOwner){
        return new NextResponse("Unauthorized",{status:401})
    }

    const lastChapter=await db.chapter.findFirst({
        where:{
            courseId:params.courseId
        },
        orderBy:{
            position:"desc"
        }
    })
    const newPosition=lastChapter ? lastChapter.position + 1 : 1
    
    const chapter=await db.chapter.create({
        data:{
            title,
            position:newPosition,
            courseId:params.courseId
        }
    })

    return NextResponse.json(chapter)
}catch(err){
    console.log(`[CHAPTERS],${err}`);
    return new NextResponse("Internal error",{status:500})
}
}