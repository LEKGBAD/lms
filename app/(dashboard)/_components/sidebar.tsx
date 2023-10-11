import { usePathname } from "next/navigation";
import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

const Sidebar = () => {
    
    return ( 
        <div className="h-full border-r flex-col overflow-x-auto bg-white shadow-sm">
            
            <div className="p-6">
                <Logo />
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
            
        </div>
     );
}
 
export default Sidebar;