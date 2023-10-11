import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"
import { isTeacher } from "@/lib/teacher";

const {Video}=new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
);

export async function PATCH(req:Request,{params}:{params:{courseId:string}}){
    const {userId}=auth()
    if(!userId || !isTeacher(userId)){
        return new NextResponse("Unauthorized",{status:401})
    }
    
    const values=await req.json()
    
    if(!params.courseId){
        return new NextResponse("course ID is missing",{status:400})
    }
    try{
        const course=await db.course.update({
            where:{
                id:params.courseId 
            },
            data:{
                ...values
            }
        })
        return NextResponse.json(course)

    }catch(err){
        console.log(`[COURSE_ID],${err}`);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE (
    req:Request,
    {params}:{params:{courseId:string}}
){
    try{
        const {userId}=auth()
    if(!userId || !isTeacher(userId)){
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
      
    for(const chapter of course.chapters){
    if(chapter.muxData?.assetId){
            Video.Assets.del(chapter.muxData.assetId)     
    }
}

const deletedCourse=await db.course.delete({
    where:{
        id:params.courseId,
    },
    
})


        return NextResponse.json(deletedCourse)

    }catch(err){
    console.log(`[COURSE_ID_DELETE],${err}`);
    return new NextResponse("Internal error",{status:500})
    }
}
