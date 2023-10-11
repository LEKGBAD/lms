import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
    req:Request,
    {params}:{params:{courseId:string}}
){
    try{
        const {userId}=auth();
        const {updatedData}=await req.json()

        if(!userId){
            return new NextResponse("Unauthorized",{status:401})
        }

        if(!params.courseId){
            return new NextResponse("Course ID is missing",{status:400})
        }

        if(!updatedData){
            return new NextResponse("Updata data is missiong",{status:400})
        }
        const courseOwner=await db.course.findUnique({
            where:{
                id:params.courseId,
                userId
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized",{status:401})
        }

        for(let item of updatedData){
            await db.chapter.update({
                where:{
                    id:item.id
                },
                data:{
                    position:item.position
                }
            })
        }

        return new NextResponse("sucess",{status:200})
    }
    catch(err){
        console.log(`[REORDER],${err}`);
        return new NextResponse("Internal error",{status:500})
    }
}