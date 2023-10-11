import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const CourseIdPage =async ({
    params,
}:{params:{courseId:string}}) => {
    const {userId}=auth()
    if (!userId)
    return redirect("/")
const course=await db.course.findUnique({
    where:{
        id:params.courseId,
        isPublished:true
    },
    include:{
        chapters:{
            orderBy:{
                position:"asc"
            }
        }
    }
})
    if(!course){
        return redirect("/")
    }

    
    return redirect(`/courses/${params.courseId}/chapters/${course.chapters?.[0].id}`)
    
}
 
export default CourseIdPage;