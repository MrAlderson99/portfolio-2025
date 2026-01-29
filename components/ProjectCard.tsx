import React from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onInteract?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onInteract }) => {
  return (
    <div className="group relative flex flex-col p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 group-hover:border-blue-500/50 transition-colors">
          {project.icon}
        </div>
        {project.isInteractive && (
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20 animate-pulse">
            LIVE DEMO
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors mb-2">
        {project.title}
      </h3>
      
      <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span 
            key={tag} 
            className="text-xs bg-slate-900 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-medium"
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
          className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ExternalLink size={16} />
          Repo
        </a>
        
        {project.isInteractive && onInteract && (
          <button 
            onClick={onInteract}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
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