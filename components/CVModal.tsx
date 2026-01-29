import React, { useState } from 'react';
import { X, Mail, MapPin, Linkedin, FileText, Briefcase, GraduationCap, Code, Globe, Languages } from 'lucide-react';

interface CVModalProps {
  onClose: () => void;
}

const resumeData = {
  pt: {
    basics: {
      name: "Lucielton Manoel da Silva",
      label: "Product Owner | Data Strategist | MSc Candidate in AI (XAI)",
      email: "lucieltonmanoel@gmail.com",
      location: "Recife, PE - Brasil",
      linkedin: "linkedin.com/in/lucielton",
      summary: "Product Owner e Analista de Dados com sólida base em Engenharia de Software (Full Stack) e Mestrando em Inteligência Artificial (XAI). Atuação focada na interseção entre estratégia de produto, telemetria e ciência de dados. Experiência comprovada em liderar o ciclo de vida de produtos SaaS, desde o Discovery até a análise de métricas. Perfil hands-on: utiliza SQL, Python e R para extrair insights e validar hipóteses."
    },
    work: [
      {
        name: "Mobs2 (Telemetria & IoT)",
        position: "Product Owner & Data Strategist",
        period: "Jul 2025 - Presente",
        summary: "Liderança de produtos de gestão de frotas e resíduos baseados em dados.",
        highlights: [
          "Liderança do produto Waste SGF, integrando app mobile e sistema web para gestão de resíduos.",
          "Idealização do Configurador Mobile, reduzindo em estimada 40% o tempo de setup de hardware em campo.",
          "Implementação de painéis de BI e Machine Learning para análise de ociosidade de frotas e predição de manutenção."
        ]
      },
      {
        name: "CBV - Colégio Boa Viagem",
        position: "Instrutor de Tecnologia e Inovação",
        period: "Fev 2024 - Jul 2025",
        summary: "Período focado em comunicação técnica e preparação acadêmica.",
        highlights: [
          "Tradução de conceitos complexos de tecnologia para públicos não-técnicos.",
          "Desenvolvimento de Soft Skills de liderança e oratória."
        ]
      },
      {
        name: "Tech6 Group",
        position: "Full Stack Software Engineer",
        period: "Nov 2022 - Jan 2024",
        summary: "Desenvolvimento para o mercado norte-americano (Fathom Realty).",
        highlights: [
          "Desenvolvimento de plataforma imobiliária (EUA) com .NET Core, React e AWS.",
          "Implementação de testes automatizados e cultura de CI/CD."
        ]
      },
      {
        name: "T4i Group",
        position: "Lead Developer (End-to-End)",
        period: "Mai 2022 - Set 2022",
        highlights: [
          "Arquitetura e desenvolvimento solo de SaaS escolar usando React e PostgreSQL."
        ]
      },
      {
        name: "Procenge",
        position: "Frontend Developer",
        period: "Mai 2021 - Mai 2022",
        highlights: [
          "Modernização de ERP (Pirâmide 360) desenvolvendo módulos fiscais em Angular 2+."
        ]
      }
    ],
    research: [
      {
        name: "Lab Evante / CNPq",
        position: "Pesquisador em Educational Data Mining (Bolsista)",
        period: "Jul 2018 - Fev 2021",
        summary: "Pioneirismo em Data Science aplicado à educação.",
        highlights: [
          "Desenvolvimento de dashboards de Learning Analytics com R Shiny e Tidyverse.",
          "Mineração de dados educacionais para predição de evasão escolar (Python/Pandas).",
          "Co-autor de artigo publicado na revista Renote."
        ]
      }
    ],
    education: [
      {
        institution: "UFRPE - Universidade Federal Rural de Pernambuco",
        area: "Mestrado em Informática Aplicada (IA & XAI)",
        period: "Jan 2025 - Presente",
        detail: "Foco em Explainable AI e Big Data"
      },
      {
        institution: "UFRPE - Universidade Federal Rural de Pernambuco",
        area: "Licenciatura em Computação",
        period: "Concluído Dez 2023",
        detail: "Graduação"
      }
    ],
    skills: {
      product: ["Scrum", "Kanban", "Product Discovery", "User Stories", "Jira", "Roadmap"],
      data: ["Python", "SQL", "R", "Pandas", "Power BI", "Machine Learning", "XAI (SHAP/DALEX)"],
      eng: [".NET Core", "React", "Docker", "Git", "CI/CD", "Telemetria/IoT"]
    },
    labels: {
      experience: "Experiência Profissional",
      research: "Pesquisa Acadêmica",
      education: "Formação Acadêmica",
      skills: "Competências Técnicas",
      prod: "Produto",
      eng: "Engenharia"
    }
  },
  en: {
    basics: {
      name: "Lucielton Manoel da Silva",
      label: "Product Owner | Data Strategist | MSc Candidate in AI (XAI)",
      email: "lucieltonmanoel@gmail.com",
      location: "Recife, PE - Brazil",
      linkedin: "linkedin.com/in/lucielton",
      summary: "Technical Product Owner and Data Analyst with a strong background in Software Engineering (Full Stack) and currently pursuing a Master's in AI (XAI). Specialized in bridging the gap between product strategy, telemetry data, and business value. Proven experience in leading SaaS product lifecycles, from Discovery to metric analysis. Hands-on profile: proficient in SQL, Python, and R to extract insights and validate hypotheses."
    },
    work: [
      {
        name: "Mobs2 (Telemetry & IoT)",
        position: "Product Owner & Data Strategist",
        period: "July 2025 - Present",
        summary: "Leading fleet management and waste management data-driven products.",
        highlights: [
          "Lead Product Owner for 'Waste SGF', integrating mobile apps and web systems for waste management operations.",
          "Conceived and led the 'Mobile Configurator' app, reducing hardware field setup time by an estimated 40%.",
          "Implemented BI dashboards and Machine Learning modules to analyze fleet idleness and predict maintenance needs."
        ]
      },
      {
        name: "CBV - Colégio Boa Viagem",
        position: "Technology & Innovation Instructor",
        period: "Feb 2024 - July 2025",
        summary: "Sabbatical period focused on technical communication skills and academic preparation.",
        highlights: [
          "Translated complex technical concepts for non-technical audiences.",
          "Developed leadership and public speaking soft skills."
        ]
      },
      {
        name: "Tech6 Group",
        position: "Full Stack Software Engineer",
        period: "Nov 2022 - Jan 2024",
        summary: "Remote development for the North American real estate market (Fathom Realty).",
        highlights: [
          "Developed critical modules for a US-based real estate platform using .NET Core, React, and AWS.",
          "Implemented automated testing pipelines and CI/CD culture."
        ]
      },
      {
        name: "T4i Group",
        position: "Lead Developer (End-to-End)",
        period: "May 2022 - Sept 2022",
        highlights: [
          "Solo architecture and development of a School Management SaaS using React and PostgreSQL."
        ]
      },
      {
        name: "Procenge",
        position: "Frontend Developer",
        period: "May 2021 - May 2022",
        highlights: [
          "ERP Modernization (Pirâmide 360), developing fiscal modules in Angular 2+."
        ]
      }
    ],
    research: [
      {
        name: "Lab Evante / CNPq",
        position: "Data Science Researcher (Grant Fellow)",
        period: "July 2018 - Feb 2021",
        summary: "Pioneering work in Educational Data Mining.",
        highlights: [
          "Developed Learning Analytics dashboards using R Shiny and Tidyverse.",
          "Mined educational datasets to predict student dropout rates using Python/Pandas.",
          "Co-authored a research paper published in 'Renote' journal."
        ]
      }
    ],
    education: [
      {
        institution: "UFRPE - Federal Rural University of Pernambuco",
        area: "M.Sc. in Applied Informatics (AI & XAI)",
        period: "Jan 2025 - Present",
        detail: "Focus on Explainable AI and Big Data"
      },
      {
        institution: "UFRPE - Federal Rural University of Pernambuco",
        area: "B.Sc. in Computing",
        period: "Concluded Dec 2023",
        detail: "Bachelor Degree"
      }
    ],
    skills: {
      product: ["Scrum", "Kanban", "Product Discovery", "User Stories", "Jira", "Roadmap Strategy"],
      data: ["Python", "SQL", "R", "Pandas", "Power BI", "Machine Learning", "XAI (SHAP/DALEX)"],
      eng: [".NET Core", "React", "Docker", "Git", "CI/CD", "Telemetry/IoT"]
    },
    labels: {
      experience: "Professional Experience",
      research: "Academic Research",
      education: "Education",
      skills: "Skills",
      prod: "Product",
      eng: "Engineering"
    }
  }
};

const CVModal: React.FC<CVModalProps> = ({ onClose }) => {
  const [lang, setLang] = useState<'pt' | 'en'>('en');
  const resume = resumeData[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 shadow-2xl relative flex flex-col">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur">
            <div className="flex items-center gap-2 text-slate-100 font-bold">
                <FileText className="text-blue-500" /> Curriculum Vitae
            </div>
            <div className="flex gap-3 items-center">
                {/* Language Toggle */}
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button 
                        onClick={() => setLang('en')}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Languages size={12}/> EN
                    </button>
                    <button 
                        onClick={() => setLang('pt')}
                        className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded transition-colors ${lang === 'pt' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Languages size={12}/> PT
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-700 mx-1"></div>

                <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-slate-800">
                    <X size={20} />
                </button>
            </div>
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-10 space-y-10 text-slate-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{resume.basics.name}</h1>
                    <p className="text-lg text-emerald-400 font-medium">{resume.basics.label}</p>
                    <p className="text-slate-500 mt-4 max-w-2xl leading-relaxed text-sm">{resume.basics.summary}</p>
                </div>
                <div className="space-y-3 text-sm text-slate-400 min-w-[200px]">
                    <div className="flex items-center gap-2"><MapPin size={14}/> {resume.basics.location}</div>
                    <div className="flex items-center gap-2"><Mail size={14}/> {resume.basics.email}</div>
                    <div className="flex items-center gap-2"><Linkedin size={14}/> {resume.basics.linkedin}</div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Column (Left) */}
                <div className="md:col-span-2 space-y-8">
                    {/* Experience */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Briefcase size={18} className="text-blue-500"/> {resume.labels.experience}
                        </h3>
                        <div className="space-y-8 border-l-2 border-slate-800 ml-2 pl-6">
                            {resume.work.map((job, idx) => (
                                <div key={idx} className="relative">
                                    <span className="absolute -left-[33px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-700 ring-4 ring-slate-900"></span>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                        <h4 className="text-base font-bold text-slate-200">{job.name}</h4>
                                        <span className="text-xs font-mono text-slate-500">{job.period}</span>
                                    </div>
                                    <div className="text-sm text-blue-400 mb-2 font-medium">{job.position}</div>
                                    {job.summary && <p className="text-sm text-slate-400 mb-2 italic">{job.summary}</p>}
                                    {job.highlights && (
                                        <ul className="list-disc pl-4 space-y-1 text-sm text-slate-400 marker:text-slate-600">
                                            {job.highlights.map((h, i) => <li key={i}>{h}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Research */}
                    <section>
                         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Globe size={18} className="text-purple-500"/> {resume.labels.research}
                        </h3>
                         <div className="space-y-6 border-l-2 border-slate-800 ml-2 pl-6">
                            {resume.research.map((res, idx) => (
                                <div key={idx} className="relative">
                                    <span className="absolute -left-[33px] top-1.5 w-3.5 h-3.5 rounded-full bg-purple-900 ring-4 ring-slate-900"></span>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                        <h4 className="text-base font-bold text-slate-200">{res.name}</h4>
                                        <span className="text-xs font-mono text-slate-500">{res.period}</span>
                                    </div>
                                    <div className="text-sm text-purple-400 mb-2 font-medium">{res.position}</div>
                                    {res.summary && <p className="text-sm text-slate-400 mb-2 italic">{res.summary}</p>}
                                    <ul className="list-disc pl-4 space-y-1 text-sm text-slate-400 marker:text-slate-600">
                                        {res.highlights.map((h, i) => <li key={i}>{h}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-8">
                     {/* Education */}
                     <section>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <GraduationCap size={18} className="text-emerald-500"/> {resume.labels.education}
                        </h3>
                        <div className="space-y-4">
                            {resume.education.map((edu, idx) => (
                                <div key={idx} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                    <div className="font-bold text-slate-200 text-sm">{edu.area}</div>
                                    <div className="text-xs text-slate-400 mt-1">{edu.institution}</div>
                                    <div className="text-xs text-slate-500 mt-2 font-mono">{edu.period}</div>
                                    <div className="text-xs text-emerald-400 mt-1">{edu.detail}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Code size={18} className="text-orange-500"/> {resume.labels.skills}
                        </h3>
                        
                        <div className="mb-4">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">{resume.labels.prod}</div>
                            <div className="flex flex-wrap gap-1.5">
                                {resume.skills.product.map(s => <span key={s} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">{s}</span>)}
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Data & AI</div>
                            <div className="flex flex-wrap gap-1.5">
                                {resume.skills.data.map(s => <span key={s} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">{s}</span>)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">{resume.labels.eng}</div>
                            <div className="flex flex-wrap gap-1.5">
                                {resume.skills.eng.map(s => <span key={s} className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">{s}</span>)}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CVModal;