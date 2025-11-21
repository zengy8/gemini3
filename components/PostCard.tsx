import React from 'react';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
  onClick: (post: BlogPost) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <div 
      onClick={() => onClick(post)}
      className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 flex flex-row h-36 md:h-48"
    >
      {/* Image Section: Fixed width on both mobile (smaller) and desktop (larger) */}
      <div className="w-28 xs:w-32 md:w-64 shrink-0 overflow-hidden relative">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/5" />
      </div>
      
      {/* Content Section */}
      <div className="p-3 md:p-5 flex flex-col flex-grow min-w-0 justify-between">
        <div>
          <div className="flex gap-2 mb-1.5 md:mb-2 overflow-hidden">
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-sm xs:text-base md:text-xl font-bold mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm line-clamp-2 md:line-clamp-2 hidden xs:block">
            {post.summary}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-[10px] md:text-xs text-gray-500 mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="flex items-center gap-1 truncate max-w-[60px] md:max-w-none"><User size={10} className="md:w-3 md:h-3" /> {post.author}</span>
            <span className="flex items-center gap-1 whitespace-nowrap"><Calendar size={10} className="md:w-3 md:h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-secondary group-hover:translate-x-1 transition-transform hidden sm:block">
             <ArrowRight size={14} className="md:w-4 md:h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;