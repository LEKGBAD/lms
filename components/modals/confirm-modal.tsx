"use client"

import { useEffect, useState } from "react";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTrigger
} from "../ui/alert-dialog";

interface ConfirmModalProps {
    children:React.ReactNode;
    onConfirm:()=>void
}
const ConfirmModal = ({
    children,
    onConfirm
}:ConfirmModalProps) => {
const [isMounted,setIsMounted]=useState(false)
    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }
    return ( 
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action can not be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    onClick={onConfirm}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
     );
}
 
export default ConfirmModal;