import Image from "next/image";
import Link from "next/link";
import IconBadge from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import CourseProgress from "./course-progress";

interface CourseCardProps {
id:string;
title:string;
price:number;
chaptersLength:number;
progress:number;
imageUrl:string;
category:string;

}

const CourseCard = ({
id,
title,
price,
chaptersLength,
progress,
imageUrl,
category
}:CourseCardProps) => {
    return ( 
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg
            p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image 
                    alt={title}
                    fill
                    className="object-cover"
                    src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700
                    transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBadge size="sm" icon={BookOpen} />
                        </div>
                        <span>
                            {chaptersLength} {chaptersLength===1 ? "chapter" : "chapters"}
                        </span>
                    </div>
                </div>
                {progress !==null ? (
                    <div>
                        <CourseProgress 
                        variant={progress ===100 ? "success" : "default"}
                        size="sm"
                        value={progress}
                        />
                    </div>
                ) :
                (
                    <p className="text-md md:text-sm font-medium text-slate-700">
                    {formatPrice(price)}
                    </p>
                )}
            </div>
        </Link>
     );
}
 
export default CourseCard;