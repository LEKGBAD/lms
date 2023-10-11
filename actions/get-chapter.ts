import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";


interface GetChapterProps{
    userId:string;
    courseId:string;
    chapterId:string;
}

export const getChapter=async ({
    userId,
    chapterId,
    courseId
}:GetChapterProps)=>{
    try{

        const purchase=await db.purchase.findUnique({
            where:{
                userId_courseId:{userId,courseId}
            }
        })
        const course=await db.course.findUnique({
            where:{
                id:courseId,
                isPublished:true
            },
            select:{
                price:true
            }
        })
        const chapter=await db.chapter.findUnique({
            where:{
                id:chapterId,
                isPublished:true
            },
            
        })

        if (!chapter || !course){
            throw new Error("chapter or course not found")
        }


        let muxData=null;
        let attachments:Attachment[]=[];
        let nextChapter:Chapter|null=null;

        if(purchase) {
            
            attachments=await db.attachment.findMany({
                where:{
                    courseId
                }
            })
            
        }
        if(chapter.isFree || purchase){
            muxData=await db.muxData.findUnique({
                where:{
                    chapterId
                }
            })
            nextChapter=await db.chapter.findFirst({
                where:{
                    position:{
                        gt:chapter?.position
                    },
                    isPublished:true,
                    courseId
                },
                orderBy:{
                    position:"asc"
                }
            })
        }

        const userProgress=await db.userProgress.findUnique({
            where:{
                userId_chapterId:{userId,chapterId}
            }
        })
        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase
        }

    }catch(err){
        console.log(`[GET_CHAPTERS]`,err);
        return {
            chapter:null,
            course:null,
            muxData:null,
            attachments:null,
            nextChapter:null,
            userProgress:null,
            purchase:null
        }
    }

}