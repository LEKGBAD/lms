import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{courseId:string,attachmentId:string}}){
    const {userId}=auth()
    if(!userId || !isTeacher(userId)){
        return new NextResponse("Unauthorized",{status:401})
    }

    
    if(!params.courseId){
        return new NextResponse("course ID is missing",{status:400})
    }
    if(!params.attachmentId){
        return new NextResponse("course ID is missing",{status:400})
    }
    try{
        const courseOwner =await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            },
            include:{
                attachments:true
            }
        })
        if(!courseOwner){
            return new NextResponse("Unauthorized",{status:401})
        }

        
        const attachment=await db.attachment.delete({
            where:{
                id:params.attachmentId,
                courseId:params.courseId
            } })
        
        return NextResponse.json(attachment)

    }catch(err){
        console.log(`[ATTACHMENT_ID],${err}`);
        return new NextResponse("Internal Error",{status:500})
    }
}