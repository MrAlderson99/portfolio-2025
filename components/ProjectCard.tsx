import React from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onInteract?: () => void;
  theme?: 'cyan' | 'purple' | 'amber' | 'blue' | 'emerald'; // Theme prop for coloring
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInteract, theme = 'blue' }) => {
  // Dynamic color classes based on theme
  const getThemeClasses = () => {
    switch (theme) {
      case 'cyan': return {
        border: 'group-hover:border-cyan-500/50',
        shadow: 'group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]',
        title: 'group-hover:text-cyan-400',
        iconBg: 'group-hover:border-cyan-500/50',
        button: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/40'
      };
      case 'purple': return {
        border: 'group-hover:border-purple-500/50',
        shadow: 'group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]',
        title: 'group-hover:text-purple-400',
        iconBg: 'group-hover:border-purple-500/50',
        button: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/40'
      };
      case 'amber': return {
        border: 'group-hover:border-amber-500/50',
        shadow: 'group-hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]',
        title: 'group-hover:text-amber-400',
        iconBg: 'group-hover:border-amber-500/50',
        button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40'
      };
      case 'emerald': return {
        border: 'group-hover:border-emerald-500/50',
        shadow: 'group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]',
        title: 'group-hover:text-emerald-400',
        iconBg: 'group-hover:border-emerald-500/50',
        button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
      };
      default: return {
        border: 'group-hover:border-blue-500/50',
        shadow: 'group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]',
        title: 'group-hover:text-blue-400',
        iconBg: 'group-hover:border-blue-500/50',
        button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
      };
    }
  };

  const colors = getThemeClasses();

  return (
    <div className={`group relative flex flex-col p-6 bg-[#0f172a]/40 backdrop-blur-sm rounded-xl border border-white/5 transition-all duration-300 hover:-translate-y-1 ${colors.border} ${colors.shadow}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 bg-[#020617] rounded-lg border border-white/10 transition-colors ${colors.iconBg}`}>
          {project.icon}
        </div>
        {project.isInteractive && (
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-500/20 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            LIVE DEMO
          </span>
        )}
      </div>

      <h3 className={`text-xl font-bold transition-colors mb-3 ${colors.title} text-slate-100`}>
        {project.title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span 
            key={tag} 
            className="text-[10px] uppercase tracking-wider bg-[#020617] text-slate-400 px-2.5 py-1 rounded border border-white/10 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/5 text-slate-300 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <ExternalLink size={16} />
          Repo
        </a>
        
        {project.isInteractive && onInteract && (
          <button 
            onClick={onInteract}
            className={`flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg ${colors.button}`}
          >
            <Maximize2 size={16} />
            Interact
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;