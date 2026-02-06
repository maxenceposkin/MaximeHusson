import React, { useEffect } from 'react';
import { Project } from '../types';
import { X } from 'lucide-react';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Lock body scroll when modal is open
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
    <div className="fixed inset-0 z-[60] bg-[#050505] text-[#e5e5e5] flex flex-col animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-900">
        <h2 className="text-xl font-normal tracking-wide">{project.title}</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-white"
        >
          <X size={24} strokeWidth={1} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto p-4 md:p-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-20">
            <div className="md:col-span-4 lg:col-span-3 space-y-8 sticky top-10 self-start">
               <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Catégorie</p>
                  <p className="text-sm font-medium">{project.category}</p>
               </div>
               <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Année</p>
                  <p className="text-sm font-medium">{project.year}</p>
               </div>
               <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">À propos</p>
                  <p className="text-sm leading-relaxed text-neutral-400">{project.description}</p>
               </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 space-y-4">
              {project.images.map((img, idx) => (
                <div key={idx} className="w-full">
                  <img 
                    src={img} 
                    alt={`${project.title} - ${idx + 1}`} 
                    className="w-full h-auto object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 bg-neutral-900"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Project Teaser */}
          <div className="border-t border-neutral-900 pt-10 pb-20 text-center cursor-pointer hover:opacity-50 transition-opacity" onClick={onClose}>
             <p className="text-xs uppercase tracking-widest mb-2 text-neutral-500">Retourner à la galerie</p>
             <h3 className="text-2xl font-light">Voir tous les projets</h3>
          </div>
        </div>
      </div>
    </div>
  );
};