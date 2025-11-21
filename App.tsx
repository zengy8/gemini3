import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { BlogPost, ViewState } from './types';
import { getPosts, getPostById } from './services/storageService';
import { isAuthenticated, logout } from './services/authService';
import Admin from './pages/Admin';
import Editor from './pages/Editor';
import Login from './pages/Login';
import PostCard from './components/PostCard';
import MarkdownRenderer from './components/MarkdownRenderer';
import { LayoutDashboard, BookOpen, Github, Twitter, Calendar, ArrowLeft, Menu, X, Search, Clock, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';

// --- Shared Components ---

const Typewriter = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blink effect
  useEffect(() => {
    const timeout = setTimeout(() => setBlink(!blink), 500);
    return () => clearTimeout(timeout);
  }, [blink]);

  // Typing logic
  useEffect(() => {
    if (index >= words.length) return;

    // Pause at the end of the word
    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => {
        setReverse(true);
      }, 3000); // Pausing for 3 seconds
      return () => clearTimeout(timeout);
    }

    // Move to next word after deletion
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 75 : 150); // Deleting is faster than typing

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="text-primary inline-block whitespace-nowrap">
      {words[index].substring(0, subIndex)}
      <span className={`ml-1 inline-block ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
    </span>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-all animate-in fade-in slide-in-from-bottom-4 border border-white/10"
      title="Back to Top"
    >
      <ArrowUp size={24} />
    </button>
  );
};

// --- Page Specific Components ---

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isEditor = location.pathname === '/editor';
  if (isEditor) return null; // Editor has its own toolbar

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-dark/80 backdrop-blur-lg border-white/5 py-4' 
          : 'bg-transparent border-transparent backdrop-blur-none py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
             N
           </div>
           <span className="font-bold text-xl tracking-tight hidden sm:block">Nebula</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
           <Link to="/" className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}>Blog</Link>
           <Link to="/admin" className={`flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors ${location.pathname.includes('/admin') ? 'text-white' : 'text-gray-400'}`}>
             <LayoutDashboard size={16} /> Admin
           </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
           <div className="absolute top-full left-0 right-0 bg-surface border-b border-white/10 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-5 shadow-2xl">
             <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white">Blog</Link>
             <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-400">Admin</Link>
           </div>
        )}
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/editor') return null;

  return (
    <footer className="border-t border-white/5 bg-dark py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Nebula Blog Engine. Built with Gemini.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={20} /></a>
          <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

const POSTS_PER_PAGE = 5;

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    const lower = searchTerm.toLowerCase();
    return posts.filter(p => 
      p.title.toLowerCase().includes(lower) || 
      p.summary.toLowerCase().includes(lower) ||
      p.tags.some(t => t.toLowerCase().includes(lower))
    );
  }, [posts, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Group by Year (only for current page posts)
  const groupedPosts = useMemo(() => {
    const groups: Record<string, BlogPost[]> = {};
    currentPosts.forEach(post => {
      const year = new Date(post.createdAt).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(post);
    });
    return groups;
  }, [currentPosts]);

  const years = Object.keys(groupedPosts).sort((a, b) => parseInt(b) - parseInt(a));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      scrollToTop();
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Hero & Search */}
      <div className="text-center mb-20 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
         
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 tracking-tight relative z-10 min-h-[1.2em]">
          Ideas from the <Typewriter words={['Future', 'Technology', 'Innovation', 'Intelligence', 'Singularity']} />
        </h1>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-surface border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl">
               <Search className="ml-3 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Search for thoughts, tutorials..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-transparent text-white px-4 py-2 focus:outline-none placeholder:text-gray-500"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="max-w-5xl mx-auto min-h-[400px]">
        {years.length > 0 ? (
            years.map(year => (
            <div key={year} className="mb-16 relative">
                {/* Year Marker */}
                <div className="sticky top-24 z-30 mb-8 flex items-center">
                    <span className="text-5xl md:text-6xl font-bold text-white/5 select-none absolute -left-4 md:-left-12 -top-4">{year}</span>
                    <h2 className="text-2xl font-bold text-primary pl-2 relative z-10">{year}</h2>
                </div>

                <div className="border-l-2 border-white/5 ml-4 md:ml-8 pl-8 md:pl-12 relative space-y-12">
                    {groupedPosts[year].map(post => {
                        const date = new Date(post.createdAt);
                        const month = date.toLocaleString('default', { month: 'short' });
                        const day = date.getDate();

                        return (
                            <div key={post.id} className="relative group">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] md:-left-[57px] top-6 w-4 h-4 rounded-full bg-dark border-2 border-primary z-20 group-hover:scale-125 group-hover:bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                
                                {/* Date Badge */}
                                <div className="absolute -left-[120px] top-4 hidden xl:flex flex-col items-end pr-8 text-right">
                                   <span className="text-xl font-bold text-white">{month}</span>
                                   <span className="text-sm text-gray-500">{day}</span>
                                </div>

                                {/* Mobile Date (Inside or above) */}
                                <div className="xl:hidden flex items-center gap-2 text-gray-400 text-sm mb-2">
                                   <Clock size={14} />
                                   {month} {day}
                                </div>

                                <PostCard post={post} onClick={(p) => navigate(`/post/${p.id}`)} />
                            </div>
                        );
                    })}
                </div>
            </div>
            ))
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No posts found for "{searchTerm}"</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-primary hover:underline">Clear search</button>
            </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-xl bg-surface border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-gray-400 font-mono">
            Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl bg-surface border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const PostPage: React.FC = () => {
  const { id } = useParams();
  const post = getPostById(id || '');
  const navigate = useNavigate();

  if (!post) {
     return <div className="pt-40 text-center text-2xl font-bold text-gray-500">Post not found</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="h-[60vh] relative w-full overflow-hidden">
         <img src={post.coverImage} className="w-full h-full object-cover" alt={post.title} />
         <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-dark/60 to-dark" />
         <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20 max-w-5xl mx-auto">
            <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white mb-6 flex items-center gap-2 transition-colors">
               <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="flex gap-3 mb-4">
               {post.tags.map(t => (
                  <span key={t} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20 backdrop-blur-md">{t}</span>
               ))}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-300 text-sm md:text-base">
               <span className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-pink-500" /> {post.author}</span>
               <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</span>
            </div>
         </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-6 py-12 -mt-10 relative z-10">
        <div className="bg-surface/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl">
          <MarkdownRenderer content={post.content} />
        </div>
      </div>
    </div>
  );
}

const AdminRoute: React.FC = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [editingPost, setEditingPost] = useState<BlogPost | null | undefined>(undefined);

  if (!isAuth) {
      return <Login onLogin={() => setIsAuth(true)} />;
  }

  const handleLogout = () => {
      logout();
      setIsAuth(false);
  };

  if (editingPost !== undefined) {
      return (
          <Editor 
            post={editingPost} 
            onSave={() => setEditingPost(undefined)}
            onCancel={() => setEditingPost(undefined)}
          />
      )
  }

  return <Admin onEdit={setEditingPost} onLogout={handleLogout} />;
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30 selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </HashRouter>
  );
};

export default App;