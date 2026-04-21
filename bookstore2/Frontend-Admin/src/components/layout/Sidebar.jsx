import { NavLink } from 'react-router-dom';
import { ADMIN_MENU } from '../../constants/menuConfig';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0 shadow-xl z-20">
      <div className="p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">B</div>
        <span>BOOKSTORE <span className="text-blue-400">ADMIN</span></span>
      </div>
      
      <nav className="mt-6 px-4 space-y-1">
        {ADMIN_MENU.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 