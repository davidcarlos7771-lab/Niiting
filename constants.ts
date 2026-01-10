
import { Category, PortfolioItem, BlogPost, SiteSettings } from './types';

// Browser-based "soft" security key. 
// If you forget your browser-set key, you can change 'admin123' here.
const a = 'admin123';
export const K = a;

export const INITIAL_SETTINGS: SiteSettings = {
  navbar: {
    logo: 'JOJO',
    subtitle: 'My Artisanal Story',
    links: {
      home: 'Home',
      apparel: 'Apparel Design',
      fibre: 'Fibre Arts',
      visual: 'Visual Arts',
      journal: 'Journal'
    },
    socials: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com'
    }
  },
  hero: {
    tag: 'Archive of Intentional Living',
    title: 'Where Couture Meets the Hearth',
    description: 'A living archive of fashion design, fiber crafts, and the art of intentional living.',
    imageLeft: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=1000',
    imageRight: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000'
  },
  footer: {
    subscribeTitle: 'Join the inner circle for pattern releases and design musings.',
    contactTag: 'TALK TO ME',
    contactEmail: 'jojo@niiting.com'
  },
  homeSections: {
    apparelTitle: 'Featured Collections',
    apparelTag: 'Apparel Design',
    fibreTitle: 'Featured Collections',
    fibreTag: 'Fibre Arts',
    visualTitle: 'Featured Collections',
    visualTag: 'Visual Arts',
    archiveTitle: 'Recent Journal Entries',
    archiveTag: 'The Archive'
  }
};

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    category: Category.APPAREL,
    title: 'The Ethereal Nomad',
    subtitle: 'The Professional Core',
    description: 'A study in fluid silhouettes and sustainable silk draping, exploring the intersection of movement and stasis.',
    imageUrls: ['https://images.unsplash.com/photo-1539109132314-34a93a553f61?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    category: Category.APPAREL,
    title: 'Sartorial Silence',
    subtitle: 'Fall Collection',
    description: 'Minimalist tailoring focused on the architecture of the human form.',
    imageUrls: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 1100000
  },
  {
    id: '11',
    category: Category.APPAREL,
    title: 'Linen & Light',
    subtitle: 'Summer Series',
    description: 'Exploring the breathability of natural fibers in harsh environments.',
    imageUrls: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 1200000
  },
  {
    id: '12',
    category: Category.APPAREL,
    title: 'The Urban Veil',
    subtitle: 'Concept Wear',
    description: 'Protective silhouettes for the modern city dweller.',
    imageUrls: ['https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 1300000
  },
  {
    id: '3',
    category: Category.FIBRE,
    title: 'Artisanal Handmades',
    subtitle: 'The Scalable Business',
    description: 'A collection of tactile crochet and knitwear designed for the modern hearth.',
    imageUrls: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 2000000
  },
  {
    id: '4',
    category: Category.FIBRE,
    title: 'Woven Echoes',
    subtitle: 'Tapestry Work',
    description: 'Hand-dyed wools forming abstract landscapes.',
    imageUrls: ['https://images.unsplash.com/photo-1528476513691-07e6f563d97f?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 2100000
  },
  {
    id: '5',
    category: Category.FIBRE,
    title: 'The Soft Edge',
    subtitle: 'Experimental Fibre',
    description: 'Blending metallic threads with organic linen.',
    imageUrls: ['https://images.unsplash.com/photo-1464820453369-31d2c0b651af?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 2200000
  },
  {
    id: '6',
    category: Category.FIBRE,
    title: 'Tactile Poetry',
    subtitle: 'Heirloom Knits',
    description: 'Designs meant to be passed down through generations.',
    imageUrls: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 2300000
  },
  {
    id: '7',
    category: Category.VISUAL,
    title: 'Spaces we Inhabit',
    subtitle: 'The Heart of the Home',
    description: 'Minimalist mobiles and wall hangings crafted from organic materials.',
    imageUrls: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 3000000
  },
  {
    id: '8',
    category: Category.VISUAL,
    title: 'Chromatic Stillness',
    subtitle: 'Acrylic Series',
    description: 'Exploring the boundary between color and emotion.',
    imageUrls: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 3100000
  },
  {
    id: '9',
    category: Category.VISUAL,
    title: 'Organic Forms',
    subtitle: 'Clay & Wood',
    description: 'Sculptures that mimic the erosion of time.',
    imageUrls: ['https://images.unsplash.com/photo-1525904097878-94fb15835963?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 3200000
  },
  {
    id: '10',
    category: Category.VISUAL,
    title: 'Silent Architect',
    subtitle: 'Drafting Series',
    description: 'Ink on paper studies of imaginary landscapes.',
    imageUrls: ['https://images.unsplash.com/photo-1456086272160-b28b0645b729?auto=format&fit=crop&q=80&w=1000'],
    createdAt: Date.now() - 3300000
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'On Motherhood and the Needle',
    date: 'October 28, 2024',
    content: 'Exploring the shift in perspective that parenthood brings to the creative process. How my son redefined my aesthetic from sharp edges to soft, protective layers of intentional design. This is a journey through the changing nature of my studio practice since becoming a mother.',
    imageUrls: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000'],
    author: 'Elena'
  },
  {
    id: 'b2',
    title: 'The Global Shift Toward Slow Fashion',
    date: 'October 26, 2024',
    content: 'Why intentional living is becoming a necessity in the modern wardrobe. We are seeing a profound move away from the frantic cycles of consumption toward a more considered, heirloom-focused approach to dressing.',
    imageUrls: ['https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1000'],
    author: 'Elena'
  },
  {
    id: 'b3',
    title: 'The Morning Ritual of Creation',
    date: 'October 24, 2024',
    content: 'The quiet hours before the world wakes are the most fertile for new ideas. It starts with a simple cup of tea and the feel of the linen between my fingers.',
    imageUrls: ['https://images.unsplash.com/photo-1492133969098-09ba496aa16a?auto=format&fit=crop&q=80&w=1000'],
    author: 'Elena'
  },
  {
    id: 'b4',
    title: 'Texture as Language',
    date: 'October 22, 2024',
    content: 'A deep dive into how fiber can communicate emotions that words often fail to capture. Rough wool vs. smooth silk tells a story of conflict and resolution.',
    imageUrls: ['https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=1000'],
    author: 'Elena'
  }
];
