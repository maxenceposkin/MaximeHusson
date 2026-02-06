
import React from 'react';

interface NavigationProps {
  onNavigate: (view: 'home' | 'work') => void;
  onOpenAbout: () => void;
  currentView: 'home' | 'work';
  title: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, onOpenAbout, currentView, title }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-10 md:px-12 flex justify-between items-center mix-blend-difference text-white">
      <div 
        className="text-[12px] font-light tracking-[0.5em] cursor-pointer hover:opacity-50 transition-opacity uppercase"
        onClick={() => onNavigate('home')}
      >
        {title}
      </div>
      
      <div className="flex gap-12 text-[10px] font-light tracking-[0.3em]">
        <button 
          onClick={() => onNavigate('work')}
          className={`hover-reveal py-1 transition-opacity ${currentView === 'work' ? 'opacity-100' : 'opacity-40'}`}
        >
          INDEX
        </button>
        <button 
          onClick={onOpenAbout}
          className="hover-reveal py-1 opacity-40 hover:opacity-100 transition-opacity"
        >
          INFO
        </button>
      </div>
    </nav>
  );
};
