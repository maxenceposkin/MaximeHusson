import React from 'react';

interface NavigationProps {
  onNavigate: (view: 'home' | 'work') => void;
  onOpenAbout: () => void;
  currentView: 'home' | 'work';
  title: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, onOpenAbout, currentView, title }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white pointer-events-none">
      <div 
        className="text-lg font-medium tracking-tight pointer-events-auto cursor-pointer select-none transition-opacity hover:opacity-70"
        onClick={() => onNavigate('home')}
      >
        {title.toUpperCase()}
      </div>
      
      <div className="flex gap-8 text-sm font-light pointer-events-auto">
        <button 
          onClick={() => onNavigate('work')}
          className={`transition-all decoration-1 underline-offset-4 ${currentView === 'work' ? 'underline' : 'hover:underline opacity-70 hover:opacity-100'}`}
        >
          WORK
        </button>
        <button 
          onClick={onOpenAbout}
          className="hover:underline underline-offset-4 decoration-1 transition-all opacity-70 hover:opacity-100"
        >
          INFO
        </button>
      </div>
    </nav>
  );
};