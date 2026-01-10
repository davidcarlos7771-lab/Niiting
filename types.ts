
export enum Category {
  APPAREL = 'Apparel Design',
  FIBRE = 'Fibre Arts',
  VISUAL = 'Visual Arts',
  JOURNAL = 'Journal'
}

export interface PortfolioItem {
  id: string;
  category: Category;
  title: string;
  subtitle?: string;
  description: string;
  imageUrls: string[];
  createdAt: number;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
  author: string;
}

export interface User {
  isLoggedIn: boolean;
}
