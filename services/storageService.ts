import { BlogPost } from '../types';

const STORAGE_KEY = 'nebula_blog_posts';

const DUMMY_POSTS: BlogPost[] = [
  {
    id: 'welcome-to-nebula',
    title: 'Welcome to Nebula Blog',
    content: `# Hello World\n\nWelcome to **Nebula**, a next-generation blogging platform.\n\n## Features\n\n- ✨ **AI Powered**: Uses Gemini to help you write.\n- 🌑 **Dark Mode**: Easy on the eyes.\n- 📝 **Markdown**: Write cleanly and efficiently.\n\n\`\`\`javascript\nconsole.log("Hello from the future!");\n\`\`\`\n\nStart by logging into the admin panel to create your own posts!`,
    summary: 'A brief introduction to the Nebula blogging platform features.',
    coverImage: 'https://picsum.photos/id/1/800/400',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    author: 'System',
    tags: ['Update', 'Welcome']
  },
  {
    id: 'nebula-chinese-intro',
    title: '探索未来：Nebula 博客引擎',
    content: `# 你好，世界 👋\n\n欢迎使用 **Nebula**，这是一个专为未来设计的博客平台。\n\n## 核心特性\n\n- 🚀 **极速体验**：基于最新的 Web 技术构建。\n- 🎨 **优雅设计**：深色模式，玻璃拟态风格。\n- 🤖 **AI 辅助**：内置 Gemini 模型，辅助写作与润色。\n\n> "未来已来，只是分布不均。"\n\n### 代码演示\n\n\`\`\`python\ndef hello_nebula():\n    print("你好，Nebula！")\n\`\`\`\n\n我们希望你能在这里记录下你的每一个灵感瞬间。`,
    summary: '介绍 Nebula 博客系统的中文支持与核心功能演示。',
    coverImage: 'https://picsum.photos/id/20/800/400',
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now(),
    author: '管理员',
    tags: ['公告', '中文']
  },
  {
    id: 'ai-revolution-2025',
    title: 'The AI Revolution of 2025',
    content: `# The Age of Intelligence\n\nArtificial Intelligence has moved beyond simple chatbots. It's now an integral part of our creative process.\n\n## Key Advancements\n\n1. **Multimodal Models**: Understanding text, image, and audio simultaneously.\n2. **Contextual Awareness**: AI that remembers your project history.\n3. **Ethical AI**: Built-in safeguards for safe deployment.\n\nIt's an exciting time to be a developer!`,
    summary: 'Discussing the rapid advancements in AI technology and what it means for creators.',
    coverImage: 'https://picsum.photos/id/45/800/400',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now(),
    author: 'Sarah Connor',
    tags: ['AI', 'Tech', 'Future']
  },
  {
    id: 'react-hooks-guide',
    title: 'Mastering React Hooks',
    content: `# Why Hooks Changed Everything\n\nBefore hooks, we were drowning in class components and lifecycle methods. Now?\n\n\`\`\`tsx\nconst [count, setCount] = useState(0);\n\`\`\`\n\nSimple, elegant, and composable. In this guide, we'll explore \`useEffect\`, \`useMemo\`, and custom hooks.`,
    summary: 'A deep dive into modern React development patterns.',
    coverImage: 'https://picsum.photos/id/60/800/400',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now(),
    author: 'Dan A.',
    tags: ['React', 'Code', 'Tutorial']
  },
  {
    id: 'minimalist-design',
    title: 'The Power of Minimalism',
    content: `# Less is More\n\nIn a world of noise, clarity is power. Minimalist design isn't about removing features; it's about emphasizing the important ones.\n\n## Principles\n\n- Negative Space\n- Typography\n- Limited Color Palette\n\nCheck out the design of **Nebula** itself as an example!`,
    summary: 'Why minimalist design principles lead to better user experiences.',
    coverImage: 'https://picsum.photos/id/100/800/400',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    author: 'Jony I.',
    tags: ['Design', 'UX', 'Art']
  },
  {
    id: 'coffee-culture',
    title: 'Coffee: Fuel for Code',
    content: `# The Developer's Companion\n\nIs it possible to write code without coffee? Technically yes, but why risk it?\n\nWe explore different brewing methods:\n- V60\n- AeroPress\n- Espresso\n\nWhich one fits your coding style?`,
    summary: 'Exploring the intricate relationship between programming and caffeine.',
    coverImage: 'https://picsum.photos/id/106/800/400',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now(),
    author: 'Barista Joe',
    tags: ['Lifestyle', 'Coffee']
  },
  {
    id: 'space-travel',
    title: 'Mars: The Next Frontier',
    content: `# Red Planet Dreams\n\nWith Starship development accelerating, the dream of multi-planetary life is closer than ever.\n\n![Mars](https://picsum.photos/id/212/800/400)\n\nWhat will the first colony look like?`,
    summary: 'Speculating on the future of human space exploration.',
    coverImage: 'https://picsum.photos/id/212/800/400',
    createdAt: Date.now() - 86400000 * 400, // Last year
    updatedAt: Date.now(),
    author: 'Elon',
    tags: ['Space', 'Science']
  },
  {
    id: 'cyberpunk-aesthetics',
    title: 'Cyberpunk Aesthetics in Web Design',
    content: `# High Tech, Low Life\n\nNeon lights, dark backgrounds, and glitch effects. Cyberpunk isn't just a genre; it's a vibe.\n\n## How to achieve it\n\nUse \`box-shadow\` for glow effects and bold, contrasting colors like #00f0ff and #ff0099.`,
    summary: 'How to implement cyberpunk visual styles in CSS.',
    coverImage: 'https://picsum.photos/id/200/800/400',
    createdAt: Date.now() - 86400000 * 405,
    updatedAt: Date.now(),
    author: 'Neo',
    tags: ['Design', 'CSS', 'Cyberpunk']
  }
];

export const getPosts = (): BlogPost[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialize with dummy data if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DUMMY_POSTS));
      return DUMMY_POSTS;
    }
    return JSON.parse(stored).sort((a: BlogPost, b: BlogPost) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Failed to load posts", error);
    return [];
  }
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(p => p.id === id);
};

export const savePost = (post: BlogPost): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const deletePost = (id: string): void => {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};