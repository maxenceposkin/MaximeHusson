
import React, { useEffect } from 'react';
import { Project } from '../types';
import { X } from 'lucide-react';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black text-white flex flex-col animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-10 md:px-12 border-b border-white/5">
        <h2 className="text-xs font-light tracking-[0.4em] uppercase">{project.title}</h2>
        <button 
          onClick={onClose}
          className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all"
        >
          Close <X size={20} strokeWidth={1} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-8 md:p-20">
          
          <div className="flex flex-col lg:flex-row gap-20 mb-32">
            <div className="lg:w-1/4 space-y-12 sticky top-10 self-start">
               <div>
                  <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mb-4">Focus</p>
                  <p className="text-sm font-light tracking-[0.1em]">{project.category}</p>
               </div>
               <div>
                  <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mb-4">Edition</p>
                  <p className="text-sm font-light tracking-[0.1em]">{project.year}</p>
               </div>
               <div>
                  <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] mb-4">Context</p>
                  <p className="text-sm leading-[1.8] font-light text-neutral-400 tracking-wide">{project.description}</p>
               </div>
            </div>

            <div className="lg:w-3/4 space-y-24">
              {project.images.map((img, idx) => (
                <div key={idx} className="w-full bg-neutral-950 overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${project.title} - ${idx + 1}`} 
                    className="w-full h-auto object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-white/5 pt-24 pb-48 text-center cursor-pointer group" onClick={onClose}>
             <p className="text-[10px] uppercase tracking-[0.6em] mb-4 text-white/20 group-hover:text-white/60 transition-colors">Return to Index</p>
             <h3 className="text-4xl md:text-6xl font-extralight tracking-[0.1em] uppercase group-hover:tracking-[0.2em] transition-all duration-1000">See All Projects</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
