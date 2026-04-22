export type MediaItem = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  title: string;
  category?: 'classroom' | 'poster' | 'testimonial' | 'branding' | 'video' | 'misc';
  featured?: boolean;
  visible?: boolean;
};

export type HeroSlide = {
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait';
  featured?: boolean;
  visible?: boolean;
};

export type HeroFormula = {
  id: string;
  label: string;
  className: string;
  animation: {
    y: number[];
    rotate?: number[];
  };
  duration: number;
  darkClassName?: string;
  lightClassName?: string;
};

export const navItems = ['Home', 'Courses', 'FAQ', 'Results', 'About', 'Contact'];

export const heroSlideshowPool: HeroSlide[] = [
  { src: '/assets/classroom-1.png', alt: 'Vigyan Guru classroom session', orientation: 'landscape', featured: true, visible: true },
  { src: '/assets/classroom-3.jpg', alt: 'Vigyan Guru classroom teaching moment', orientation: 'landscape', featured: true, visible: true },
  { src: '/assets/classroom-5.jpg', alt: 'Vigyan Guru students in class', orientation: 'landscape', featured: true, visible: true },
  { src: '/assets/classroom-6.png', alt: 'Vigyan Guru classroom activity', orientation: 'landscape', featured: true, visible: true },
  { src: '/assets/collage-photo.jpg', alt: 'Vigyan Guru classroom collage', orientation: 'landscape', featured: true, visible: true },
  { src: '/assets/earlier_batch.jpg', alt: 'Vigyan Guru earlier batch photo', orientation: 'landscape', featured: true, visible: true },
  { src: '/assets/achievers_25-26.png', alt: 'Vigyan Guru achievers board', orientation: 'portrait', featured: false, visible: true },
  { src: '/assets/2018_poster.jpg', alt: 'Vigyan Guru 2018 poster', orientation: 'portrait', featured: false, visible: true },
  { src: '/assets/2018_poster_2.jpg', alt: 'Vigyan Guru 2018 alternate poster', orientation: 'portrait', featured: false, visible: true },
  { src: '/assets/jassal-testimonial.jpg', alt: 'Rahul Jassal testimonial portrait', orientation: 'portrait', featured: false, visible: true },
  { src: '/assets/rahul jassal.jpg', alt: 'Rahul Jassal portrait', orientation: 'portrait', featured: false, visible: true },
];

export const mediaLibrary: MediaItem[] = [
  { type: 'image', src: '/assets/2018_poster.jpg', alt: 'Vigyan Guru 2018 poster', title: '2018 Poster', category: 'poster', featured: false, visible: true },
  { type: 'image', src: '/assets/2018_poster_2.jpg', alt: 'Vigyan Guru 2018 poster alternate', title: '2018 Poster Alternate', category: 'poster', featured: false, visible: true },
  { type: 'image', src: '/assets/achievers_25-26.png', alt: 'Vigyan Guru achievers board', title: 'Achievers 2025-26', category: 'poster', featured: true, visible: true },
  { type: 'video', src: '/assets/At vigyan guru ...we do and learn..mp4', alt: 'Vigyan Guru learn and grow video', title: 'Learn and Grow Reel', category: 'video', featured: true, visible: true },
  { type: 'video', src: '/assets/classroom-reel.mp4', alt: 'Vigyan Guru Farewell reel', title: 'Farewell Reel', category: 'video', featured: true, visible: true },
  { type: 'image', src: '/assets/classroom-1.png', alt: 'Vigyan Guru Classroom 1', title: 'Classroom 1', category: 'classroom', featured: true, visible: true },
  { type: 'image', src: '/assets/classroom-3.jpg', alt: 'Vigyan Guru Classroom 2', title: 'Classroom 2', category: 'classroom', featured: true, visible: true },
  { type: 'image', src: '/assets/classroom-5.jpg', alt: 'Vigyan Guru Classroom 3', title: 'Classroom 3', category: 'classroom', featured: true, visible: true },
  { type: 'image', src: '/assets/classroom-6.png', alt: 'Vigyan Guru Classroom 4', title: 'Classroom 4', category: 'classroom', featured: true, visible: true },
  { type: 'image', src: '/assets/collage-photo.jpg', alt: 'Vigyan Guru classroom collage', title: 'Classroom Collage', category: 'classroom', featured: true, visible: true },
  { type: 'image', src: '/assets/earlier_batch.jpg', alt: 'Vigyan Guru earlier batch', title: 'Earlier Batch', category: 'misc', featured: true, visible: true },
  { type: 'image', src: '/assets/jassal-testimonial.jpg', alt: 'Rahul Jassal testimonial portrait', title: 'Topper Testimonial', category: 'testimonial', featured: false, visible: true },
  { type: 'image', src: '/assets/logo.png', alt: 'Vigyan Guru logo', title: 'Main Logo', category: 'branding', featured: false, visible: true },
  { type: 'image', src: '/assets/old services.jpg', alt: 'Vigyan Guru legacy services poster', title: 'Legacy Services', category: 'poster', featured: false, visible: true },
  { type: 'image', src: '/assets/original_logo.jpg', alt: 'Original Vigyan Guru logo', title: 'Original Logo', category: 'branding', featured: false, visible: true },
  { type: 'image', src: '/assets/poster_original.png', alt: 'Original Vigyan Guru poster', title: 'Original Poster', category: 'poster', featured: false, visible: true },
  { type: 'image', src: '/assets/rahul jassal.jpg', alt: 'Rahul Jassal portrait', title: 'Rahul Jassal', category: 'testimonial', featured: false, visible: true },
];

export const heroFormulas: HeroFormula[] = [
  { id: 'h2o', label: 'H<sub>2</sub>O', className: 'absolute top-20 left-20 text-6xl', darkClassName: 'text-slate-200', lightClassName: 'text-[#4A1111]', animation: { y: [0, -20, 0], rotate: [0, 5, 0] }, duration: 8 },
  { id: 'emc2', label: 'E=mc<sup>2</sup>', className: 'absolute top-10 right-[14%] text-4xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, 20, 0], rotate: [0, -5, 0] }, duration: 10 },
  { id: 'co2', label: 'CO<sub>2</sub>', className: 'absolute bottom-32 left-60 text-5xl', darkClassName: 'text-slate-200', lightClassName: 'text-[#4A1111]', animation: { y: [0, -15, 0] }, duration: 7 },
  { id: 'acetic', label: 'CH<sub>3</sub>COOH', className: 'absolute top-24 right-[26%] text-3xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, 16, 0], rotate: [0, -3, 0] }, duration: 9 },
  { id: 'naoh', label: 'NaOH', className: 'absolute top-[12%] left-[42%] text-4xl', darkClassName: 'text-slate-200', lightClassName: 'text-[#4A1111]', animation: { y: [0, -18, 0] }, duration: 11 },
  { id: 'hcl', label: 'HCl', className: 'absolute bottom-[30%] right-[18%] text-3xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, 14, 0], rotate: [0, 4, 0] }, duration: 12 },
  { id: 'nh4oh', label: 'NH<sub>4</sub>OH', className: 'absolute bottom-24 left-12 text-4xl', darkClassName: 'text-slate-200', lightClassName: 'text-[#4A1111]', animation: { y: [0, -12, 0], rotate: [0, -4, 0] }, duration: 10 },
  { id: 'h2so4', label: 'H<sub>2</sub>SO<sub>4</sub>', className: 'absolute bottom-[14%] left-[34%] text-3xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, 10, 0] }, duration: 13 },
  { id: 'caco3', label: 'CaCO<sub>3</sub>', className: 'absolute top-[16%] left-[30%] text-3xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, -14, 0], rotate: [0, 3, 0] }, duration: 9.5 },
  { id: 'koh', label: 'KOH', className: 'absolute top-[56%] right-[8%] text-3xl', darkClassName: 'text-slate-200', lightClassName: 'text-[#4A1111]', animation: { y: [0, 12, 0] }, duration: 10.5 },
  { id: 'nacl', label: 'NaCl', className: 'absolute bottom-[34%] left-[36%] text-3xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, -10, 0], rotate: [0, -3, 0] }, duration: 11.5 },
  { id: 'mgo', label: 'MgO', className: 'absolute bottom-[22%] left-[28%] text-3xl', darkClassName: 'text-slate-200', lightClassName: 'text-[#4A1111]', animation: { y: [0, 15, 0] }, duration: 12.5 },
  { id: 'glucose', label: 'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>', className: 'absolute top-[16%] left-[20%] text-3xl', darkClassName: 'text-slate-300', lightClassName: 'text-[#4A1111]', animation: { y: [0, -11, 0], rotate: [0, 2, 0] }, duration: 14 },
];

export const batchDetails = [
  {
    className: 'Class 10',
    days: 'Tuesday, Thursday, Saturday, Sunday',
    time: '5:30 PM - 7:00 PM',
    starts: 'March 15, 2026',
  },
  {
    className: 'Class 9',
    days: 'Monday, Wednesday, Friday, Sunday',
    time: '5:30 PM - 7:00 PM',
    starts: 'April 5, 2026',
  },
];

export const faqItems = [
  {
    question: 'What are the batch timings?',
    answer: 'Both Class 9 and Class 10 science batches run from 5:30 PM to 7:00 PM on their scheduled days.',
  },
  {
    question: 'When do the 2026-27 batches begin?',
    answer: 'Class 10 begins on March 15, 2026. Class 9 begins on April 5, 2026, with admissions continuing into the second week of April.',
  },
  {
    question: 'How many teaching days are there each week?',
    answer: 'Each batch has four teaching days per week, including Sunday, so students get regular concept revision and testing support.',
  },
  {
    question: 'Is there focus on concept clarity and critical thinking?',
    answer: 'Yes. Vigyan Guru emphasizes fundamental understanding, critical thinking, and long-term academic development instead of rote learning.',
  },
  {
    question: 'Can parents share concerns or feedback about classes?',
    answer: 'Yes. Vigyan Guru welcomes feedback from both students and parents regarding class mode, lecture style, and any concerns throughout the session.',
  },
  {
    question: 'Where is the institute located and how can we register?',
    answer: 'Vigyan Guru is located at 891, Sector 16, Panchkula. For registration, call or WhatsApp +91 86990 80802.',
  },
];
