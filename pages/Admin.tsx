import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { getPosts, deletePost } from '../services/storageService';
import { Plus, Edit, Trash2, Search, LogOut } from 'lucide-react';

interface AdminProps {
  onEdit: (post: BlogPost | null) => void;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ onEdit, onLogout }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');

  const loadPosts = () => {
    setPosts(getPosts());
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      loadPosts();
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-32">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Dashboard
          </h1>
          <p className="text-gray-400">Manage your content and publications.</p>
        </div>
        <div className="flex items-center gap-3">
            <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-surface hover:bg-white/5 border border-white/10 text-gray-300 px-4 py-3 rounded-xl font-medium transition-all"
            title="Logout"
            >
            <LogOut size={20} />
            </button>
            <button
            onClick={() => onEdit(null)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/25 active:scale-95"
            >
            <Plus size={20} /> Create Post
            </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-white/5 p-1 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-white pl-12 pr-4 py-3 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-6 font-medium">Title</th>
              <th className="p-6 font-medium hidden md:table-cell">Date</th>
              <th className="p-6 font-medium hidden md:table-cell">Tags</th>
              <th className="p-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-6">
                  <div className="font-semibold text-white group-hover:text-primary transition-colors">{post.title}</div>
                  <div className="text-sm text-gray-500 md:hidden">{new Date(post.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="p-6 text-gray-400 hidden md:table-cell">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="p-6 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                  {post.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">{t}</span>
                  ))}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(post)}
                      className="p-2 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg text-gray-400 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-gray-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No posts found. Start writing!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;