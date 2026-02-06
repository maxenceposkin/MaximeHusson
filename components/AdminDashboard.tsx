import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Edit2, Save, LogOut, Settings, Image as ImageIcon, ArrowLeft, Video, Home } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  bio: string;
  setBio: (bio: string) => void;
  showreelUrl: string;
  setShowreelUrl: (url: string) => void;
  onClose: () => void;
}

const EmptyProject: Project = {
  id: '',
  title: '',
  category: '',
  year: new Date().getFullYear().toString(),
  description: '',
  coverImage: '',
  images: []
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, setProjects, bio, setBio, showreelUrl, setShowreelUrl, onClose }) => {
  // Password Management
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState(() => localStorage.getItem('portfolio_password') || 'Husson');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Dashboard State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio' | 'settings'>('home');
  
  // Settings State
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Code incorrect');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword.length < 4) {
          alert("Le mot de passe doit contenir au moins 4 caractères");
          return;
      }
      localStorage.setItem('portfolio_password', newPassword);
      setStoredPassword(newPassword);
      setNewPassword('');
      alert("Mot de passe mis à jour avec succès");
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (editingProject.id) {
      // Edit existing
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    } else {
      // Create new
      const newProject = { ...editingProject, id: Date.now().toString() };
      setProjects([newProject, ...projects]);
    }
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const updateEditingProject = (field: keyof Project, value: any) => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, [field]: value });
  };

  const handleAddImage = () => {
      if (!editingProject) return;
      setEditingProject({
          ...editingProject,
          images: [...editingProject.images, '']
      });
  };

  const handleImageChange = (index: number, value: string) => {
      if (!editingProject) return;
      const newImages = [...editingProject.images];
      newImages[index] = value;
      setEditingProject({ ...editingProject, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
      if (!editingProject) return;
      const newImages = editingProject.images.filter((_, i) => i !== index);
      setEditingProject({ ...editingProject, images: newImages });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light tracking-wide">HUSSON ADMIN</h1>
            <p className="text-sm text-neutral-500">Entrez le code de sécurité</p>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-center tracking-widest focus:outline-none focus:border-white transition-colors"
            placeholder="●●●●"
            autoFocus
          />
          <button type="submit" className="w-full bg-white text-black py-3 rounded font-medium text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors">
            Accéder
          </button>
          <button type="button" onClick={onClose} className="w-full text-neutral-500 text-xs hover:text-white transition-colors">
            Retour au site
          </button>
        </form>
      </div>
    );
  }

  // Edit Form Overlay
  if (editingProject) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] w-full max-w-6xl max-h-[90vh] flex flex-col border border-neutral-800 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-800">
            <h2 className="text-lg font-medium text-white">{editingProject.id ? 'Modifier le projet' : 'Nouveau projet'}</h2>
            <div className="flex gap-4">
                 <button onClick={() => setEditingProject(null)} className="text-neutral-500 hover:text-white flex items-center gap-2 text-sm">
                    <X size={18} />
                    <span>Annuler</span>
                </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form id="projectForm" onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* LEFT COLUMN: INFO */}
                <div className="space-y-6">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500 border-b border-neutral-800 pb-2">Informations Générales</h3>
                    
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Titre</label>
                        <input 
                        type="text" 
                        value={editingProject.title}
                        onChange={(e) => updateEditingProject('title', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none"
                        required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neutral-500">Année</label>
                            <input 
                            type="text" 
                            value={editingProject.year}
                            onChange={(e) => updateEditingProject('year', e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none"
                            required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neutral-500">Catégorie</label>
                            <input 
                            type="text" 
                            value={editingProject.category}
                            onChange={(e) => updateEditingProject('category', e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none"
                            required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Description</label>
                        <textarea 
                        value={editingProject.description}
                        onChange={(e) => updateEditingProject('description', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none h-40 resize-none"
                        required
                        />
                    </div>

                    <div className="space-y-3 pt-4">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Image de couverture</label>
                        <input 
                        type="text" 
                        value={editingProject.coverImage}
                        onChange={(e) => updateEditingProject('coverImage', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none"
                        placeholder="https://..."
                        required
                        />
                         {editingProject.coverImage && (
                            <div className="w-full h-48 bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                                <img src={editingProject.coverImage} className="w-full h-full object-cover" alt="Cover preview" />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: IMAGES */}
                <div className="space-y-6">
                     <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500">Galerie Photo</h3>
                        <button type="button" onClick={handleAddImage} className="text-xs flex items-center gap-1 bg-white text-black px-2 py-1 rounded hover:bg-neutral-200">
                            <Plus size={12} /> Ajouter une image
                        </button>
                    </div>

                    <div className="space-y-6">
                        {editingProject.images.length === 0 && (
                            <div className="text-center py-12 text-neutral-600 border border-dashed border-neutral-800 rounded">
                                <ImageIcon className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucune image dans la galerie</p>
                            </div>
                        )}

                        {editingProject.images.map((img, idx) => (
                            <div key={idx} className="bg-neutral-900/50 p-4 rounded border border-neutral-800 space-y-3 group">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={img}
                                        onChange={(e) => handleImageChange(idx, e.target.value)}
                                        className="flex-1 bg-neutral-900 border border-neutral-800 p-2 text-sm rounded focus:border-white outline-none"
                                        placeholder="URL de l'image..."
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage(idx)}
                                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-neutral-800 rounded transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {img && (
                                    <div className="relative w-full h-40 bg-black/50 rounded overflow-hidden flex items-center justify-center">
                                         {/* Object contain ensures we see the full image regardless of aspect ratio */}
                                        <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                     <button type="button" onClick={handleAddImage} className="w-full py-3 border border-dashed border-neutral-700 text-neutral-500 hover:text-white hover:border-neutral-500 rounded transition-colors text-sm">
                        + Ajouter une autre image
                    </button>
                </div>
            </form>
          </div>
          
          <div className="p-6 border-t border-neutral-800 bg-[#0a0a0a]">
             <button form="projectForm" type="submit" className="w-full bg-white text-black py-4 rounded font-medium hover:bg-neutral-200 transition-colors tracking-widest uppercase text-sm">
                Enregistrer le projet
              </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Admin Nav */}
      <nav className="border-b border-neutral-900 px-6 py-4 flex justify-between items-center sticky top-0 bg-[#050505] z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-medium tracking-tight">HUSSON ADMIN</h1>
          <div className="flex gap-4 text-sm">
            <button 
              onClick={() => setActiveTab('home')}
              className={`${activeTab === 'home' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors flex items-center gap-2`}
            >
              <Home size={16} /> Accueil
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`${activeTab === 'projects' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}
            >
              Projets
            </button>
            <button 
              onClick={() => setActiveTab('bio')}
              className={`${activeTab === 'bio' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}
            >
              Biographie
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`${activeTab === 'settings' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}
            >
              Paramètres
            </button>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span>Quitter</span>
        </button>
      </nav>

      <main className="max-w-screen-xl mx-auto p-6 md:p-10">
        
        {activeTab === 'home' && (
          <div className="max-w-2xl space-y-6">
             <h2 className="text-xl font-light">Vidéo Showreel (Accueil)</h2>
             <p className="text-sm text-neutral-500">Cette vidéo tourne en boucle sur la page d'accueil. Utilisez un lien direct (mp4, webm) pour un meilleur résultat.</p>
             
             <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">URL de la vidéo</label>
                    <input 
                        type="text"
                        value={showreelUrl}
                        onChange={(e) => setShowreelUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none"
                    />
                </div>

                {showreelUrl && (
                    <div className="w-full aspect-video bg-black rounded overflow-hidden border border-neutral-800 relative group">
                        <video 
                            src={showreelUrl} 
                            className="w-full h-full object-cover" 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <p className="text-xs uppercase tracking-widest">Aperçu</p>
                        </div>
                    </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-light">Gestion des projets ({projects.length})</h2>
              <button 
                onClick={() => setEditingProject(EmptyProject)}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-neutral-200 transition-colors"
              >
                <Plus size={16} />
                <span>Nouveau Projet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-[#0a0a0a] border border-neutral-900 p-4 rounded-lg flex items-center justify-between group hover:border-neutral-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <img 
                        src={project.coverImage} 
                        alt={project.title} 
                        className="w-16 h-12 object-cover rounded bg-neutral-900"
                    />
                    <div>
                      <h3 className="font-medium text-neutral-200">{project.title}</h3>
                      <p className="text-xs text-neutral-500">{project.category} — {project.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                        onClick={() => setEditingProject(project)}
                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'bio' && (
          <div className="max-w-2xl space-y-6">
             <h2 className="text-xl font-light">Éditer la biographie</h2>
             <p className="text-sm text-neutral-500">Cette description apparaît dans la section "Info" du site.</p>
             <div className="space-y-4">
                <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full h-64 bg-[#0a0a0a] border border-neutral-800 p-4 rounded text-neutral-300 focus:border-white outline-none leading-relaxed"
                />
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md space-y-8">
             <div>
                <h2 className="text-xl font-light mb-2">Sécurité</h2>
                <p className="text-sm text-neutral-500">Modifiez le mot de passe d'accès à l'interface d'administration.</p>
             </div>
             
             <form onSubmit={handleChangePassword} className="space-y-4 bg-[#0a0a0a] border border-neutral-900 p-6 rounded">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-500">Nouveau mot de passe</label>
                    <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nouveau code..."
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none"
                    />
                </div>
                <button type="submit" className="w-full bg-white text-black py-3 rounded font-medium hover:bg-neutral-200 transition-colors text-sm">
                    Mettre à jour
                </button>
             </form>
          </div>
        )}
      </main>
    </div>
  );
};