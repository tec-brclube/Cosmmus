import React from 'react';
import { BookOpen, Mic, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Blog: React.FC = () => {
  const { content } = useContent();
  const posts = content.blog;

  return (
    <div className="bg-transparent py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Conteúdos e Insights</h1>
          <p className="text-white/85">Mantenha-se atualizado com o Boletim Cosmmus.</p>
        </div>

        {/* Resource Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-brand-surface p-6 rounded-xl border border-white/5 flex flex-col items-center text-center gap-4">
                < BookOpen className="text-brand-cyan w-8 h-8" />
                <div>
                    <h3 className="font-bold text-white">Blog & E-books</h3>
                    <p className="text-sm text-white/85">Artigos técnicos e guias.</p>
                </div>
            </div>
            <div className="bg-brand-surface p-6 rounded-xl border border-white/5 flex flex-col items-center text-center gap-4">
                <Mic className="text-brand-pink w-8 h-8" />
                <div>
                    <h3 className="font-bold text-white">Podcasts</h3>
                    <p className="text-sm text-white/85">Conversas com especialistas.</p>
                </div>
            </div>
            <div className="bg-brand-surface p-6 rounded-xl border border-white/5 flex flex-col items-center text-center gap-4">
                <Mail className="text-purple-400 w-8 h-8" />
                <div>
                    <h3 className="font-bold text-white">Newsletter</h3>
                    <p className="text-sm text-white/85">Assine o Boletim Cosmmus.</p>
                </div>
            </div>
        </div>

        {/* Recent Posts */}
        <h2 className="text-2xl font-bold mb-8 text-center">Recentes no Blog</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <article 
              key={post.id} 
              className="bg-brand-surface/40 backdrop-blur-xl rounded-xl p-6 hover:bg-brand-surface/60 transition-all duration-500 border border-white/5 hover:border-brand-purple/30 text-center flex flex-col items-center shadow-2xl"
            >
                <div className="flex justify-between items-center mb-4 w-full">
                    <span className="text-brand-cyan text-xs font-bold uppercase bg-brand-cyan/10 px-2 py-1 rounded">{post.category}</span>
                    <span className="text-white/70 text-xs">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-white/85 text-sm mb-4">{post.excerpt}</p>
                <button className="text-brand-pink text-sm font-semibold hover:underline">Ler mais</button>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Blog;