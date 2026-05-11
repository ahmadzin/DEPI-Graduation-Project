import { Outlet, NavLink, useNavigate, Link } from "react-router-dom"; // أضف Link هنا
import { 
  LayoutDashboard, 
  Store, 
  FileText, 
  Utensils, 
  Package, 
  LogOut,
  ChevronRight,
  User,
  TrendingUp,
  Settings,
  HelpCircle
} from "lucide-react";
import useAuth from "../context/useAuth";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const superAdminLinks = [
    { to: "/superadmin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/superadmin/restaurants", label: "Restaurants", icon: Store },
    { to: "/superadmin/contracts", label: "Contracts", icon: FileText },
  ];

  const managerLinks = [
    { to: "/manager", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/manager/menu", label: "Menu", icon: Utensils },
    { to: "/manager/orders", label: "Orders", icon: Package },
  ];

  const links = user?.role === "SuperAdmin" ? superAdminLinks : managerLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              DigiDish
            </span>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role || "Role"}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" strokeWidth={1.5} />
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          {/* تغيير من button إلى Link */}
          <Link
            to="/help"
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-all duration-200"
          >
            <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
            <span>Help Center</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-80 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import { 
//   LayoutDashboard, 
//   Store, 
//   FileText, 
//   Utensils, 
//   Package, 
//   LogOut,
//   ChevronRight,
//   User,
//   TrendingUp,
//   Settings,
//   HelpCircle
// } from "lucide-react";
// import useAuth from "../context/useAuth";

// export default function DashboardLayout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const superAdminLinks = [
//     { to: "/superadmin", label: "Dashboard", icon: LayoutDashboard, end: true },
//     { to: "/superadmin/restaurants", label: "Restaurants", icon: Store },
//     { to: "/superadmin/contracts", label: "Contracts", icon: FileText },
//   ];

//   const managerLinks = [
//     { to: "/manager", label: "Dashboard", icon: LayoutDashboard, end: true },
//     { to: "/manager/menu", label: "Menu", icon: Utensils },
//     { to: "/manager/orders", label: "Orders", icon: Package },
//   ];

//   const links = user?.role === "SuperAdmin" ? superAdminLinks : managerLinks;

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <aside className="w-80 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">
//         <div className="px-6 py-6 border-b border-gray-100">
//           <div className="flex items-center gap-2.5 mb-6">
//             <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//               <span className="text-white text-sm font-bold">D</span>
//             </div>
//             <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//               DigiDish
//             </span>
//           </div>
          
//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
//                 <User className="w-5 h-5 text-white" strokeWidth={1.5} />
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
//                 <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role || "Role"}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 px-4 py-6 space-y-1.5">
//           {links.map((link) => {
//             const Icon = link.icon;
//             return (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 end={link.end}
//                 className={({ isActive }) =>
//                   `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
//                     isActive
//                       ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
//                       : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                   }`
//                 }
//               >
//                 <div className="flex items-center gap-3">
//                   <Icon className="w-4 h-4" strokeWidth={1.5} />
//                   <span>{link.label}</span>
//                 </div>
//                 <ChevronRight className="w-3.5 h-3.5 opacity-50" strokeWidth={1.5} />
//               </NavLink>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-gray-100 space-y-2">
//           <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all duration-200">
//             <HelpCircle className="w-4 h-4" strokeWidth={1.5} />
//             <span>Help Center</span>
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
//           >
//             <LogOut className="w-4 h-4" strokeWidth={1.5} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 ml-80 overflow-auto">
//         <div className="p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }
