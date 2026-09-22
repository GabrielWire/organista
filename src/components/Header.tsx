import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Music,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Users,
  BookOpen,
  User,
  LayoutDashboard,
  Shield,
  UserCheck,
  UserCog,
  Award,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const { currentUser, userData, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    if (path === '/aluno') return location.pathname === '/aluno';
    return location.pathname.startsWith(path);
  };

  const isAdmin = role === 'admin';
  const isExaminadora = role === 'examinadora' || role === 'examinador';
  const isInstrutora = role === 'instrutora' || role === 'instrutor' || role === 'professor';
  const isStaff = isAdmin || isExaminadora || isInstrutora;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-2.5 sm:py-3 gap-2.5 sm:gap-3">
          
          {/* Logo & School Branding */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center shadow-sm shadow-purple-600/30 text-white font-bold shrink-0 group-hover:scale-105 transition-transform">
                <Music className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold tracking-tight text-indigo-700 dark:text-indigo-400 text-base sm:text-lg uppercase">
                    CCB
                  </span>
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold border-l border-slate-300 dark:border-slate-700 pl-2">
                    Portal das Organistas
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  Hinário 5 (Fases 1 a 5) &bull; Método Oficial Vol. 1 ao 4 &bull; MSA
                </p>
              </div>
            </Link>

            {/* Mobile Actions (Theme + Logout) */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              </button>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  title="Sair da conta"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-rose-600 dark:text-slate-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links based on Role */}
          {currentUser && (
            <div className="flex items-center gap-1 w-full md:w-auto justify-center overflow-x-auto py-1">
              <nav className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold shrink-0">
                {isStaff ? (
                  <>
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/admin')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Painel</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/instrutores"
                        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                          isActive('/admin/instrutores') || isActive('/admin/professores')
                            ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <UserCog className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Instrutoras</span>
                      </Link>
                    )}

                    <Link
                      to="/admin/alunos"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/admin/alunos')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Alunas</span>
                    </Link>

                    <Link
                      to="/admin/metodos"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/admin/metodos')
                          ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Método (Vol. 1-4)</span>
                    </Link>

                    <Link
                      to="/admin/msa"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/admin/msa')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Gestão MSA</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/aluno"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/aluno')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Início</span>
                    </Link>

                    <Link
                      to="/aluno/metodo"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/aluno/metodo')
                          ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Meu Método</span>
                    </Link>

                    <Link
                      to="/aluno/progresso"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/aluno/progresso')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Meus Hinos</span>
                    </Link>

                    <Link
                      to="/aluno/msa"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/aluno/msa')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Meu MSA</span>
                    </Link>

                    <Link
                      to="/aluno/perfil"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition-all ${
                        isActive('/aluno/perfil')
                          ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Perfil</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}

          {/* User Profile, Theme & Logout (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            {currentUser && userData ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
                  {userData.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="leading-none text-left">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block max-w-[130px] truncate">
                    {userData.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {isAdmin ? (
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> Administradora
                      </span>
                    ) : isExaminadora ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                        <Award className="w-2.5 h-2.5" /> Examinadora
                      </span>
                    ) : isInstrutora ? (
                      <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-0.5">
                        <GraduationCap className="w-2.5 h-2.5" /> Instrutora
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <UserCheck className="w-2.5 h-2.5" /> Organista
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Desktop Theme Switcher */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Logout Button */}
            {currentUser && (
              <button
                onClick={handleLogout}
                title="Sair da conta"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-slate-200 dark:border-slate-700 hover:border-rose-300 text-xs font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors shadow-2xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
