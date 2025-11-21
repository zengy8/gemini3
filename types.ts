export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  createdAt: number;
  updatedAt: number;
  author: string;
  tags: string[];
}

export interface AIResponse {
  text: string;
}

export type ViewState = 'HOME' | 'POST_DETAIL' | 'ADMIN_LIST' | 'ADMIN_EDITOR';