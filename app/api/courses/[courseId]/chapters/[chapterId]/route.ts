import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"

const {Video}=new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
);


export async function PATCH(req:Request,{params}:{params:{courseId:string,chapterId:string}}){
try{
    const {userId}=auth()
    if(!userId){
        return new NextResponse("Unauthorized",{status:401})
    }
    
    const {isPublished,...values} =await req.json()

    
    if(!params.courseId){
        return new NextResponse("course ID is missing",{status:400})
    }

    if(!params.chapterId){
        return new NextResponse("chapter ID is missing",{status:400})
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

    
    const chapter=await db.chapter.update({
        where:{
            id:params.chapterId,
            courseId:params.courseId
        },
        data:{
            ...values 
        }
    })

    if(values.videoUrl){
        const existingMuxData=await db.muxData.findFirst({
            where:{
                chapterId:params.chapterId
            }
        })
        if(existingMuxData){
            Video.Assets.del(existingMuxData.assetId)
            await db.muxData.delete({
                where:{
                    id:existingMuxData.id
                }
            })
        }
        const asset=await Video.Assets.create({
            input:values.videoUrl,
            playback_policy:"public",
            test:false
        })
        const muxData=await db.muxData.create({
            data:{
                chapterId:params.chapterId,
                assetId:asset.id,
                playbackId:asset.playback_ids?.[0]?.id
            }
        })
    }

    return NextResponse.json(chapter)
}catch(err){
    console.log(`[CHAPTERS_ID],${err}`);
    return new NextResponse("Internal error",{status:500})
}
}

export async function DELETE (
    req:Request,
    {params}:{params:{courseId:string,chapterId:string}}
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

    if(!params.chapterId){
        return new NextResponse("chapter ID is missing",{status:400})
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
    const existingChapter=await db.chapter.findUnique({
        where:{
            id:params.chapterId,
            courseId:params.courseId
        }
    })
    if(!existingChapter){
        return new NextResponse("Chapter not found",{status:404})
    }
    if(existingChapter.videoUrl){
        const existingMuxData=await db.muxData.findFirst({
            where:{
                chapterId:params.chapterId
            }
        })
        if(existingMuxData){
            Video.Assets.del(existingMuxData.assetId)
            await db.muxData.delete({
                where:{
                    id:existingMuxData.id
                }
            })
        }
    }

    const chapter=await db.chapter.delete({
        where:{
            id:params.chapterId,
            courseId:params.courseId
        }
    })

    const publishedChapter=await db.chapter.findMany({
        where:{
            courseId:params.courseId,
            isPublished:true
        }
    })
    if(!publishedChapter.length){
        await db.course.update({
            where:{
                id:params.courseId,
            },
            data:{
                isPublished:false
            }
        })
    }

        return NextResponse.json(chapter)

    }catch(err){
    console.log(`[CHAPTERS_ID_DELETE],${err}`);
    return new NextResponse("Internal error",{status:500})
    }
}
