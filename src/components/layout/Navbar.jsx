import { Link, useNavigate } from 'react-router-dom'; 
import { useAuthStore } from '../../store/authStore'; 
import { logoutUser } from '../../services/authService'; 
import { useEffect, useState } from 'react';
 
export default function Navbar() { 
  const { user, clearUser } = useAuthStore(); 
  const navigate = useNavigate(); 

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    setDarkMode(true);
  } else {
    document.documentElement.classList.remove('dark');
    setDarkMode(false);
  }
}, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark'); 
      localStorage.setItem('theme', 'light'); 
    } else {
      document.documentElement.classList.add('dark'); 
      localStorage.setItem('theme', 'dark'); 
    }

    setDarkMode(!darkMode);
  };

   
  const handleLogout = async () => { 
    const result = await logoutUser(); 
    if (result.success) { 
      clearUser(); // Limpiar estado de Zustand 
      navigate('/login'); 
    } 
  }; 
   
  return ( 
    <nav className="bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              Task Manager Pro
            </Link>
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white transition"
            >
              {darkMode ? 'Modo claro' : 'Modo oscuro'}
            </button>

            <span className="text-gray-700 dark:text-gray-300">
              {user?.displayName || user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Cerrar sesión
            </button>

          </div>

        </div>
      </div>
    </nav>
  ); 
} 
