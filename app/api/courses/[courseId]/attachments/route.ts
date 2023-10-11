import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { connect } from "http2";
import { NextResponse } from "next/server";

export async function POST(req:Request,{params}:{params:{courseId:string}}){
    const {userId}=auth()
    if(!userId || !isTeacher(userId)){
        return new NextResponse("Unauthorized",{status:401})
    }
    
    const {url}=await req.json()
    
    if(!params.courseId){
        return new NextResponse("course ID is missing",{status:400})
    }
    try{
        const courseOwner =await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        })
        if(!courseOwner){
            return new NextResponse("Unauthorized",{status:401})
        }
        const attachment=await db.attachment.create({
            data:{
                name:url.split("/").pop(),
                url:url, 
                courseId:params.courseId
            }
        })
        
        return NextResponse.json(attachment)

    }catch(err){
        console.log(`[COURSE_ID],${err}`);
        return new NextResponse("Internal Error",{status:500})
    }
}


