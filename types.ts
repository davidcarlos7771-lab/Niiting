
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
  pinned?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string;
  imageUrls: string[];
  author: string;
  pinned?: boolean;
}

export interface SiteSettings {
  navbar: {
    logo: string;
    subtitle: string;
    links: {
      home: string;
      apparel: string;
      fibre: string;
      visual: string;
      journal: string;
    };
    socials: {
      instagram: string;
      facebook: string;
      youtube: string;
    };
  };
  hero: {
    tag: string;
    title: string;
    description: string;
    imageLeft: string;
    imageRight: string;
  };
  footer: {
    subscribeTitle: string;
    contactTag: string;
    contactEmail: string;
  };
  homeSections: {
    apparelTitle: string;
    apparelTag: string;
    fibreTitle: string;
    fibreTag: string;
    visualTitle: string;
    visualTag: string;
    archiveTitle: string;
    archiveTag: string;
  };
}

export interface User {
  isLoggedIn: boolean;
}
