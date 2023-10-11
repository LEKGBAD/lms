import { db } from "@/lib/db";
import {Course,Category, Chapter} from "@prisma/client";
import { getProgress } from "./get-progress";


type courseWithProgressWithCategory= Course & {
        category:Category;
        chapters:Chapter[];
        progress:number|null
    }



type DashboardCourses= {
    completedCourses:courseWithProgressWithCategory[],
    coursesInProgress:courseWithProgressWithCategory[],
}

export const getDashboardCourses=async (userId:string):Promise<DashboardCourses>=>{
    try{
        const purchasedCourses=await db.purchase.findMany({
            where:{
                userId
            },
            select:{
                course:{
                    include:{
                        chapters:{
                            where:{
                                isPublished:true
                            }
                        },
                        category:true
                    }
                }
            }
        })

        const courses=purchasedCourses.map((purchase)=>purchase.course) as courseWithProgressWithCategory[]

        for (const course of courses){
            const progress=await getProgress(userId,course.id)
            course["progress"]=progress
        }
        const completedCourses=courses.filter((course)=>course.progress===100)
        const coursesInProgress=courses.filter((course)=>(course.progress ?? 0)<100)

        return {
            completedCourses,
            coursesInProgress
        }

    }catch(err){
        console.log("GET_DASHBOARD_COURSES",err);
        return {
            completedCourses:[],
            coursesInProgress:[]
        }
    }

}