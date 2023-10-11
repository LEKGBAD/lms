import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "@/components/course-progress";

interface CourseSidebarProps {
    course:Course & {
        chapters: (Chapter & {userProgress:UserProgress[]|null})[]};
    progressCount:number;
}

const CourseSidebar =async  ({
    course,
    progressCount
}:CourseSidebarProps) => {

    const {userId}=auth();

    if(!userId){
        return redirect("/")
    }
    const purchase=await db.purchase.findUnique({
        where:{
            userId_courseId:{userId,courseId:course.id},
            userId
        }
    })

    
    return ( 
        <div className="flex flex-col h-full border-r overflow-y-auto shadow-sm">
            <div className="flex flex-col p-8 border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress 
                        variant="success"
                        value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter)=>(
                    <CourseSidebarItem 
                    key={chapter.id}
                    id={chapter.id}
                    label={chapter.title}
                    isCompleted={chapter?.userProgress?.[0]?.isComplete!}
                    courseId={course.id}
                    isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
     );
}
 
export default CourseSidebar;