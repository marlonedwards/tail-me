
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  LineChart, 
  User, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  { 
    title: 'Dashboard', 
    path: '/', 
    icon: LayoutDashboard 
  },
  { 
    title: 'Discover', 
    path: '/discover', 
    icon: Search
  },
  { 
    title: 'Trading', 
    path: '/trading', 
    icon: LineChart 
  },
  { 
    title: 'Profile', 
    path: '/profile', 
    icon: User 
  },
  { 
    title: 'Settings', 
    path: '/settings', 
    icon: Settings 
  },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white border-r border-gray-200 transition-all duration-300 z-10",
        isOpen ? "w-64" : "w-0 -ml-64 md:w-16 md:ml-0"
      )}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 rounded-md transition-colors",
                  isOpen ? "justify-start" : "justify-center",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn("h-5 w-5", !isOpen && "md:mx-auto")} />
                {isOpen && <span className="ml-3">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
