import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { generateArtistBio } from '../services/geminiService';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  bio: string;
  onUpdateBio: (newBio: string) => void;
}

export const AboutOverlay: React.FC<AboutOverlayProps> = ({ isOpen, onClose, bio, onUpdateBio }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    // Randomize keywords to get different results
    const keywordSets = [
        "lumière naturelle, mélancolie, architecture brute, silence",
        "mouvement, chaos urbain, grain argentique, portraits intimes",
        "minimalisme, abstraction, nature morte, vide",
        "cinématographie, couleurs néon, nuit, solitude"
    ];
    const randomKeywords = keywordSets[Math.floor(Math.random() * keywordSets.length)];
    
    const newBio = await generateArtistBio(randomKeywords);
    onUpdateBio(newBio);
    setIsGenerating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose}>
      <div 
        className="w-full md:w-[500px] h-full bg-[#0a0a0a] text-neutral-200 p-8 md:p-12 shadow-2xl flex flex-col justify-between overflow-y-auto animate-[slideInRight_0.4s_ease-out] border-l border-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex justify-between items-center mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-500">Info</span>
            <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
              <X className="text-white" size={24} strokeWidth={1} />
            </button>
          </div>

          <h2 className="text-3xl md:text-4xl font-light leading-tight mb-8">
            Photographe &<br/>Filmmaker
          </h2>

          <div className="space-y-6 text-sm md:text-base font-light leading-relaxed text-neutral-400">
            <p className="transition-all duration-500 ease-in-out whitespace-pre-wrap">
              {bio}
            </p>
            
            {/* AI Generator Trigger */}
            <button 
                onClick={handleGenerateBio}
                disabled={isGenerating}
                className="group flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600 hover:text-white transition-colors border border-neutral-800 rounded-full px-4 py-2 mt-4 hover:border-neutral-600"
            >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{isGenerating ? "Génération en cours..." : "Générer une bio IA"}</span>
            </button>
          </div>

          <div className="mt-16 space-y-8">
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-600 mb-4">Clients</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm text-neutral-400">
                <li>Vogue Paris</li>
                <li>Dior Homme</li>
                <li>Saint Laurent</li>
                <li>Cereal Mag</li>
                <li>Aesop</li>
                <li>Kinfolk</li>
              </ul>
            </div>
            
             <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-600 mb-4">Contact</h3>
              <a href="mailto:hello@studio.com" className="text-xl text-white hover:text-neutral-400 transition-colors">hello@studio.com</a>
              <div className="flex gap-4 mt-4 text-sm text-neutral-500">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">Behance</a>
                  <a href="#" className="hover:text-white transition-colors">Vimeo</a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-neutral-700">
          © {new Date().getFullYear()} STUDIO. Tous droits réservés.
        </div>
      </div>
    </div>
  );
};