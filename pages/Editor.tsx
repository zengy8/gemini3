import React, { useState } from 'react';
import { BlogPost } from '../types';
import { savePost } from '../services/storageService';
import { generateSummary, suggestTitle, improveContent } from '../services/geminiService';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Save, Sparkles, X, Eye, Edit3, Loader2, Wand2, RefreshCw } from 'lucide-react';

interface EditorProps {
  post?: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}

const Editor: React.FC<EditorProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [summary, setSummary] = useState(post?.summary || '');
  const [coverImage, setCoverImage] = useState(post?.coverImage || `https://picsum.photos/800/400?random=${Date.now()}`);
  const [tags, setTags] = useState(post?.tags.join(', ') || '');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState<string | null>(null);

  const handleSave = () => {
    if (!title || !content) {
        alert('Title and content are required');
        return;
    }

    const newPost: BlogPost = {
      id: post?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4),
      title,
      content,
      summary,
      coverImage,
      createdAt: post?.createdAt || Date.now(),
      updatedAt: Date.now(),
      author: post?.author || 'Admin',
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    savePost(newPost);
    onSave();
  };

  const handleGenerateSummary = async () => {
    setIsLoadingAI('summary');
    const result = await generateSummary(content);
    setSummary(result);
    setIsLoadingAI(null);
  };

  const handleSuggestTitle = async () => {
    setIsLoadingAI('title');
    const result = await suggestTitle(content);
    if (result) setTitle(result);
    setIsLoadingAI(null);
  };

  const handleImproveContent = async () => {
    setIsLoadingAI('content');
    const result = await improveContent(content);
    setContent(result);
    setIsLoadingAI(null);
  };

  const regenerateImage = () => {
    setCoverImage(`https://picsum.photos/800/400?random=${Date.now()}`);
  };

  return (
    // FIXED: Added fixed, inset-0 and z-[100] to cover the navbar and ensure full screen focus
    <div className="fixed inset-0 z-[100] flex flex-col bg-dark overflow-hidden animate-in fade-in duration-200">
      {/* Toolbar */}
      <div className="h-16 border-b border-white/10 bg-surface flex items-center justify-between px-6 shrink-0 z-10 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
            <X size={24} />
          </button>
          <h2 className="font-semibold text-lg">{post ? 'Edit Post' : 'New Post'}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
          >
            {isPreview ? <><Edit3 size={16} /> Edit</> : <><Eye size={16} /> Preview</>}
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Save size={18} /> Publish
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        {/* Meta Sidebar */}
        <div className="w-full lg:w-80 border-r border-white/10 bg-dark/50 overflow-y-auto p-6 shrink-0 flex flex-col gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Cover Image URL</label>
            <input 
              type="text" 
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
            />
            <div className="mt-2 h-32 rounded-lg overflow-hidden bg-surface border border-white/5 relative group cursor-pointer" onClick={regenerateImage}>
                <img src={coverImage} className="w-full h-full object-cover opacity-75" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://picsum.photos/800/400')} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-1 text-white/90">
                        <RefreshCw size={24} />
                        <span className="text-xs font-medium">Click to Refresh</span>
                    </div>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Tags (comma separated)</label>
            <input 
              type="text" 
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Tech, AI, React..."
              className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-medium text-gray-500 uppercase">Summary</label>
              <button 
                onClick={handleGenerateSummary}
                disabled={!!isLoadingAI}
                className="text-xs flex items-center gap-1 text-secondary hover:text-secondary/80 disabled:opacity-50"
              >
                {isLoadingAI === 'summary' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate
              </button>
            </div>
            <textarea 
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={4}
              className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-grow flex flex-col h-full overflow-hidden relative bg-dark">
            {/* Title Input Area */}
            <div className="p-6 pb-4">
               <div className="relative group">
                 <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder-gray-600 focus:outline-none"
                  />
                  <button 
                    onClick={handleSuggestTitle}
                    disabled={!!isLoadingAI || !content}
                    className="absolute -top-6 right-0 text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1 rounded-full flex items-center gap-2 transition-colors disabled:opacity-0 group-hover:disabled:opacity-0 opacity-0 group-hover:opacity-100"
                  >
                     {isLoadingAI === 'title' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                     AI Suggest
                  </button>
               </div>
            </div>

            {/* Split View / Preview */}
            <div className="flex-grow overflow-hidden relative">
              {isPreview ? (
                <div className="h-full overflow-y-auto p-6 pt-0 max-w-4xl mx-auto">
                   <MarkdownRenderer content={content} />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="absolute top-2 right-6 z-10">
                     <button 
                        onClick={handleImproveContent}
                        disabled={!!isLoadingAI || !content}
                        className="text-xs bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all backdrop-blur-md"
                      >
                         {isLoadingAI === 'content' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                         Magic Fix
                      </button>
                  </div>
                  <textarea 
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write your masterpiece in Markdown..."
                    className="w-full h-full bg-transparent p-6 pt-0 text-lg text-gray-300 focus:outline-none resize-none font-mono"
                  />
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;