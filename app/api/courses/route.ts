import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST (req:Request) {
    const {title}=await req.json();
    const {userId}=auth();

    if(!userId || !isTeacher(userId)){
        return new NextResponse("Unauthorized",{status:401})
    }
    if(!title){
        return new NextResponse("title is missing",{status:400})
    }
    try{

        const course=await db.course.create({
            data:{
                userId,
                title
            }
        })
        return NextResponse.json(course)

    }catch(err){
        console.log(`[CREATE_COURSES],${err}`)
        return new NextResponse("Internal Error",{status:500})
    }
    
}