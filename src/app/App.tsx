import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Award, Users, BookOpen, TrendingUp, Star, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Zap, Target, GraduationCap, Sun, Moon } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import emailjs from '@emailjs/browser';

const logoImage = '/assets/logo.png';
const galleryImage1 = '/assets/classroom-1.png';
const galleryImage2 = '/assets/classroom-2.png';
const featuredVideo = '/assets/classroom-reel.mp4';
const testimonialImage = '/assets/jassal-testimonial.jpg';

type MediaItem = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  title: string;
};

type HeroSlide = {
  src: string;
  alt: string;
  orientation: 'landscape' | 'portrait';
};

const heroSlideshowPool: HeroSlide[] = [
  { src: '/assets/classroom-1.png', alt: 'Vigyan Guru classroom session', orientation: 'landscape' },
  { src: '/assets/classroom-3.jpg', alt: 'Vigyan Guru classroom teaching moment', orientation: 'landscape' },
  { src: '/assets/classroom-5.jpg', alt: 'Vigyan Guru students in class', orientation: 'landscape' },
  { src: '/assets/classroom-6.png', alt: 'Vigyan Guru classroom activity', orientation: 'landscape' },
  { src: '/assets/collage-photo.jpg', alt: 'Vigyan Guru classroom collage', orientation: 'landscape' },
  { src: '/assets/earlier_batch.jpg', alt: 'Vigyan Guru earlier batch photo', orientation: 'landscape' },
  { src: '/assets/achievers_25-26.png', alt: 'Vigyan Guru achievers board', orientation: 'portrait' },
  { src: '/assets/2018_poster.jpg', alt: 'Vigyan Guru 2018 poster', orientation: 'portrait' },
  { src: '/assets/2018_poster_2.jpg', alt: 'Vigyan Guru 2018 alternate poster', orientation: 'portrait' },
  { src: '/assets/jassal-testimonial.jpg', alt: 'Rahul Jassal testimonial portrait', orientation: 'portrait' },
  { src: '/assets/rahul jassal.jpg', alt: 'Rahul Jassal portrait', orientation: 'portrait' },
];

// Animated Section Wrapper
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax Text Component
function ParallaxText({ children, offset = 50 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative">
      {children}
    </motion.div>
  );
}

export default function App() {
  const contactFormRef = useRef<HTMLFormElement>(null);
  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [selectedClass, setSelectedClass] = useState<'9' | '10'>('9');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('vigyan-guru-theme') === 'dark';
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentClass: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [galleryImages] = useState(() => {
    const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
    const landscapes = shuffle(heroSlideshowPool.filter((slide) => slide.orientation === 'landscape'));
    const portraits = shuffle(heroSlideshowPool.filter((slide) => slide.orientation === 'portrait'));

    return [...landscapes, ...portraits].slice(0, 6);
  });
  const currentHeroSlide = galleryImages[currentGalleryIndex] ?? galleryImages[0];
  const headingTextClass = isDarkMode ? 'text-slate-100' : 'text-[#1F1F1F]';
  const bodyTextClass = isDarkMode ? 'text-slate-300' : 'text-gray-600';
  const cardSurfaceClass = isDarkMode ? 'bg-slate-900 border border-white/10 shadow-2xl' : 'bg-white shadow-md';
  const formFieldClass = isDarkMode
    ? 'w-full px-4 py-3 border border-slate-700 bg-slate-900 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E6A700] transition-all'
    : 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D1B1B] transition-all';

  const learningMedia = [
    { type: 'image' as const, src: galleryImage1, alt: 'Vigyan Guru Classroom 1' },
    { type: 'image' as const, src: galleryImage2, alt: 'Vigyan Guru Classroom 2' },
    { type: 'image' as const, src: '/assets/classroom-3.jpg', alt: 'Vigyan Guru Classroom 3' },
    { type: 'image' as const, src: '/assets/classroom-5.jpg', alt: 'Vigyan Guru Classroom 5' },
    { type: 'image' as const, src: '/assets/classroom-6.png', alt: 'Vigyan Guru Classroom 6' },
    { type: 'image' as const, src: '/assets/achievers_25-26.png', alt: 'Vigyan Guru achievers board' },
    { type: 'image' as const, src: '/assets/collage-photo.jpg', alt: 'Vigyan Guru classroom collage' },
  ];
  const mediaLibrary: MediaItem[] = [
    { type: 'image', src: '/assets/2018_poster.jpg', alt: 'Vigyan Guru 2018 poster', title: '2018 Poster' },
    { type: 'image', src: '/assets/2018_poster_2.jpg', alt: 'Vigyan Guru 2018 poster alternate', title: '2018 Poster Alternate' },
    { type: 'image', src: '/assets/achievers_25-26.png', alt: 'Vigyan Guru achievers board', title: 'Achievers 2025-26' },
    { type: 'video', src: '/assets/At vigyan guru ...we do and learn..mp4', alt: 'Vigyan Guru learn and grow video', title: 'Learn and Grow Reel' },
    { type: 'video', src: '/assets/classroom-reel.mp4', alt: 'Vigyan Guru Farewell reel', title: 'Farewell Reel' },
    { type: 'image', src: '/assets/classroom-1.png', alt: 'Vigyan Guru Classroom 1', title: 'Classroom 1' },
    { type: 'image', src: '/assets/classroom-3.jpg', alt: 'Vigyan Guru Classroom 2', title: 'Classroom 2' },
    { type: 'image', src: '/assets/classroom-5.jpg', alt: 'Vigyan Guru Classroom 3', title: 'Classroom 3' },
    { type: 'image', src: '/assets/classroom-6.png', alt: 'Vigyan Guru Classroom 4', title: 'Classroom 4' },
    { type: 'image', src: '/assets/collage-photo.jpg', alt: 'Vigyan Guru classroom collage', title: 'Classroom Collage' },
    { type: 'image', src: '/assets/earlier_batch.jpg', alt: 'Vigyan Guru earlier batch', title: 'Earlier Batch' },
    { type: 'image', src: '/assets/jassal-testimonial.jpg', alt: 'Rahul Jassal testimonial portrait', title: 'Topper Testimonial' },
    { type: 'image', src: '/assets/logo.png', alt: 'Vigyan Guru logo', title: 'Main Logo' },
    { type: 'image', src: '/assets/old services.jpg', alt: 'Vigyan Guru legacy services poster', title: 'Legacy Services' },
    { type: 'image', src: '/assets/original_logo.jpg', alt: 'Original Vigyan Guru logo', title: 'Original Logo' },
    { type: 'image', src: '/assets/poster_original.png', alt: 'Original Vigyan Guru poster', title: 'Original Poster' },
    { type: 'image', src: '/assets/rahul jassal.jpg', alt: 'Rahul Jassal portrait', title: 'Rahul Jassal' },
  ];

  // Auto-scroll gallery
  useEffect(() => {
    if (galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  // Cursor tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('vigyan-guru-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!selectedMedia) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMedia(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMedia]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      setFormStatus('error');
      window.alert(
        'Email service is not configured yet. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in your .env file.',
      );
      setTimeout(() => setFormStatus('idle'), 5000);
      return;
    }

    const templateParams = {
      from_name: formData.name,
      name: formData.name,
      phone: formData.phone,
      phone_number: formData.phone,
      class: formData.studentClass,
      class_name: formData.studentClass,
      student_class: formData.studentClass,
      message: formData.message,
    };

    try {
      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        templateParams,
        emailJsPublicKey,
      );
      setFormStatus('success');
      setFormData({ name: '', phone: '', studentClass: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Email send error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  const handleWhatsApp = () => {
    const whatsappNumber = '918699080802';
    const formElement = contactFormRef.current;
    const formValues = formElement ? new FormData(formElement) : null;
    const nameValue = (formValues?.get('name') as string) || formData.name;
    const phoneValue = (formValues?.get('phone') as string) || formData.phone;
    const classValue = (formValues?.get('studentClass') as string) || formData.studentClass;
    const messageValue = (formValues?.get('message') as string) || formData.message;
    const messageLines = [
      'Hello Madam, I wanted to inquire for admission',
      '',
      'Here are my details:',
      `Student Name: ${nameValue || 'Not provided'}`,
      `Phone: ${phoneValue || 'Not provided'}`,
      `Class: ${classValue || 'Not provided'}`,
      `Message: ${messageValue || 'Not provided'}`,
    ];
    const whatsappMessage = encodeURIComponent(messageLines.join('\n'));
    const isMobileDevice = /Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(navigator.userAgent);
    const mobileUrl = `whatsapp://send?phone=${whatsappNumber}&text=${whatsappMessage}`;
    const webUrl = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;

    if (isMobileDevice) {
      window.location.href = mobileUrl;
      return;
    }

    window.open(webUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-[#1F1F1F]'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Navbar with blur effect */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 backdrop-blur-md shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/85 border-b border-white/10' : 'bg-white/80'}`}
      >
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex items-center"
            >
              <img src={logoImage} alt="Vigyan Guru" className="h-16" />
            </motion.div>

            <div className="hidden lg:flex items-center gap-8">
              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-900 text-[#E6A700]' : 'border-gray-200 bg-white text-[#6D1B1B]'}`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              {['Home', 'Courses', 'Results', 'About', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`transition-colors relative group ${isDarkMode ? 'text-slate-100 hover:text-[#E6A700]' : 'text-[#1F1F1F] hover:text-[#6D1B1B]'}`}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6A700] group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#6D1B1B] text-white px-6 py-2.5 rounded-lg hover:bg-[#8B2323] transition-colors"
              >
                Enroll Now
              </motion.a>
            </div>

            <button
              className={`lg:hidden ${isDarkMode ? 'text-slate-100' : 'text-[#1F1F1F]'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 flex flex-col gap-4"
            >
              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-900 text-[#E6A700]' : 'border-gray-200 bg-white text-[#6D1B1B]'}`}
              >
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </button>
              {['Home', 'Courses', 'Results', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`transition-colors ${isDarkMode ? 'text-slate-100 hover:text-[#E6A700]' : 'text-[#1F1F1F] hover:text-[#6D1B1B]'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="bg-[#6D1B1B] text-white px-6 py-2.5 rounded-lg hover:bg-[#8B2323] transition-colors">
                Enroll Now
              </button>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section with Scrolling Gallery */}
      <section id="home" className={`relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-b from-slate-950 to-slate-900' : 'bg-gradient-to-b from-white to-gray-50'}`}>
        {/* Floating formulas background */}
        <div className={`hidden absolute inset-0 pointer-events-none ${isDarkMode ? 'opacity-20' : 'opacity-10'}`}>
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className={`absolute top-20 left-20 text-6xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            H₂O
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className={`absolute top-40 right-40 text-4xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            E=mc²
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className={`absolute bottom-40 left-60 text-5xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            CO₂
          </motion.div>
          <motion.div
            animate={{ y: [0, 16, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
            className={`absolute top-24 left-[42%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            CHâ‚ƒCOOH
          </motion.div>
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 11, repeat: Infinity }}
            className={`absolute top-1/2 right-16 text-4xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            NaOH
          </motion.div>
          <motion.div
            animate={{ y: [0, 14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className={`absolute bottom-20 right-[30%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            HCl
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className={`absolute bottom-24 left-12 text-4xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            NHâ‚„OH
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 13, repeat: Infinity }}
            className={`absolute top-14 right-[22%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            Hâ‚‚SOâ‚„
          </motion.div>
        </div>

        <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'opacity-20' : 'opacity-10'}`}>
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className={`absolute top-20 left-20 text-6xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            H<sub>2</sub>O
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className={`absolute top-10 right-[14%] text-4xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            E=mc<sup>2</sup>
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className={`absolute bottom-32 left-60 text-5xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            CO<sub>2</sub>
          </motion.div>
          <motion.div
            animate={{ y: [0, 16, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
            className={`absolute top-24 right-[26%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            CH<sub>3</sub>COOH
          </motion.div>
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 11, repeat: Infinity }}
            className={`absolute top-[12%] left-[42%] text-4xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            NaOH
          </motion.div>
          <motion.div
            animate={{ y: [0, 14, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className={`absolute bottom-[30%] right-[18%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            HCl
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, -4, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className={`absolute bottom-24 left-12 text-4xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            NH<sub>4</sub>OH
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 13, repeat: Infinity }}
            className={`absolute bottom-[14%] left-[34%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            H<sub>2</sub>SO<sub>4</sub>
          </motion.div>
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 9.5, repeat: Infinity }}
            className={`absolute top-[16%] left-[30%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            CaCO<sub>3</sub>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 10.5, repeat: Infinity }}
            className={`absolute top-[56%] right-[8%] text-3xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            KOH
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 11.5, repeat: Infinity }}
            className={`absolute bottom-[34%] left-[36%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            NaCl
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 12.5, repeat: Infinity }}
            className={`absolute bottom-[22%] left-[28%] text-3xl ${isDarkMode ? 'text-slate-200' : 'text-[#4A1111]'}`}
          >
            MgO
          </motion.div>
          <motion.div
            animate={{ y: [0, -11, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 14, repeat: Infinity }}
            className={`absolute top-[16%] left-[20%] text-3xl ${isDarkMode ? 'text-slate-300' : 'text-[#4A1111]'}`}
          >
            C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>
          </motion.div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <ParallaxText offset={30}>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`text-4xl lg:text-5xl xl:text-6xl mb-6 ${headingTextClass}`}
                  style={{ fontWeight: 700 }}
                >
                  Master CBSE Science with Confidence
                </motion.h1>
              </ParallaxText>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`text-lg lg:text-xl mb-8 ${bodyTextClass}`}
              >
                Expert coaching for Class 9 & 10 Science | Concept Clarity | Board Success
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(109, 27, 27, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#6D1B1B] text-white px-8 py-3.5 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                >
                  Contact Now
                  <ChevronRight size={20} />
                </motion.a>
                <motion.a
                  href="#courses"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-[#6D1B1B] text-[#6D1B1B] px-8 py-3.5 rounded-lg hover:bg-[#6D1B1B] hover:text-white transition-all text-center"
                >
                  Our Courses
                </motion.a>
              </motion.div>
            </div>

            {/* Scrolling Gallery */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`relative ${currentHeroSlide?.orientation === 'portrait' ? 'h-[520px] lg:h-[640px]' : 'h-[400px] lg:h-[500px]'}`}
            >
              <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900' : ''}`}>
                {galleryImages.map((slide, index) => (
                  <motion.img
                    key={index}
                    src={slide.src}
                    alt={slide.alt}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: currentGalleryIndex === index ? 1 : 0,
                      scale: currentGalleryIndex === index ? 1 : 1.1,
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className={`absolute inset-0 w-full h-full ${slide.orientation === 'portrait' ? (isDarkMode ? 'object-contain bg-slate-900 p-4' : 'object-contain bg-white p-4') : 'object-cover'}`}
                  />
                ))}
              </div>
              {/* Gallery indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentGalleryIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentGalleryIndex === index ? 'bg-[#E6A700] w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Enhanced Icons */}
      <section id="about" className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className={`text-3xl lg:text-4xl text-center mb-12 ${headingTextClass}`} style={{ fontWeight: 700 }}>
              Why Vigyan Guru?
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Small Batch Sizes', desc: 'Personal attention to every student with limited batch strength for effective learning.' },
              { icon: TrendingUp, title: 'Regular Tests & Progress Reports', desc: 'Weekly assessments and detailed progress tracking to monitor improvement.' },
              { icon: BookOpen, title: 'Concept-Based Learning', desc: 'Deep understanding of fundamentals rather than rote memorization.' },
              { icon: Award, title: 'Experienced Faculty', desc: 'Learn from teachers with proven track records in CBSE board exams.' }
            ].map((item, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`${cardSurfaceClass} p-8 rounded-2xl h-full`}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-[#E6A700] rounded-full flex items-center justify-center mb-4"
                  >
                    <item.icon className="text-white" size={40} strokeWidth={2.5} />
                  </motion.div>
                  <h3 className={`text-xl mb-3 ${headingTextClass}`} style={{ fontWeight: 600 }}>{item.title}</h3>
                  <p className={bodyTextClass}>{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section with Syllabus Modal */}
      <section id="courses" className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className={`text-3xl lg:text-4xl text-center mb-12 ${headingTextClass}`} style={{ fontWeight: 700 }}>
              Our Courses
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 9 */}
            <AnimatedSection>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`border-t-4 border-[#E6A700] rounded-2xl p-8 ${isDarkMode ? 'bg-slate-900 border border-white/10 shadow-2xl' : 'bg-white shadow-lg'}`}
              >
                <h3 className={`text-2xl mb-4 ${headingTextClass}`} style={{ fontWeight: 600 }}>Class 9 Science</h3>
                <ul className={`space-y-3 mb-6 ${bodyTextClass}`}>
                  {[
                    'Complete CBSE syllabus coverage',
                    'Physics, Chemistry & Biology',
                    'Interactive practical sessions',
                    'NSO & NSTSE preparation',
                    'Foundation for Class 10'
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <ChevronRight className="text-[#1B5E20] mt-0.5 flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedClass('9'); setShowSyllabus(true); }}
                  className="bg-[#6D1B1B] text-white px-6 py-3 rounded-lg hover:bg-[#8B2323] transition-colors w-full sm:w-auto"
                >
                  Explore Syllabus
                </motion.button>
              </motion.div>
            </AnimatedSection>

            {/* Class 10 */}
            <AnimatedSection>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`border-t-4 border-[#E6A700] rounded-2xl p-8 ${isDarkMode ? 'bg-slate-900 border border-white/10 shadow-2xl' : 'bg-white shadow-lg'}`}
              >
                <h3 className={`text-2xl mb-4 ${headingTextClass}`} style={{ fontWeight: 600 }}>Class 10 Science</h3>
                <ul className={`space-y-3 mb-6 ${bodyTextClass}`}>
                  {[
                    'Board exam focused preparation',
                    'Previous years\' question papers',
                    'Practical exam training',
                    'NTSE foundation course',
                    'Doubt clearing sessions'
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <ChevronRight className="text-[#1B5E20] mt-0.5 flex-shrink-0" size={20} />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedClass('10'); setShowSyllabus(true); }}
                  className="bg-[#6D1B1B] text-white px-6 py-3 rounded-lg hover:bg-[#8B2323] transition-colors w-full sm:w-auto"
                >
                  Explore Syllabus
                </motion.button>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Syllabus Modal */}
      {showSyllabus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSyllabus(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1F1F1F]">
                📘 CBSE Class {selectedClass} Science Syllabus
              </h3>
              <button
                onClick={() => setShowSyllabus(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {selectedClass === '9' ? (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-[#6D1B1B] mb-3">🔬 PHYSICS (Motion + Basics)</h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">Motion</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Distance & Displacement</li>
                        <li>Speed, Velocity</li>
                        <li>Acceleration</li>
                        <li>Graphs of Motion</li>
                        <li>Equations of Motion</li>
                      </ul>
                      <p className="font-semibold mt-3">Force and Laws of Motion</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Newton's Laws</li>
                        <li>Momentum</li>
                        <li>Conservation of Momentum</li>
                      </ul>
                      <p className="font-semibold mt-3">Gravitation</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Universal Law of Gravitation</li>
                        <li>Free Fall</li>
                        <li>Mass & Weight</li>
                        <li>Thrust & Pressure</li>
                        <li>Archimedes' Principle</li>
                      </ul>
                      <p className="font-semibold mt-3">Work and Energy</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Work</li>
                        <li>Kinetic & Potential Energy</li>
                        <li>Law of Conservation of Energy</li>
                        <li>Power</li>
                      </ul>
                      <p className="font-semibold mt-3">Sound</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Production & Propagation</li>
                        <li>Frequency, Amplitude</li>
                        <li>Speed of Sound</li>
                        <li>Echo</li>
                        <li>SONAR</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-[#6D1B1B] mb-3">🧪 CHEMISTRY (Basic Structure of Matter)</h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">Matter in Our Surroundings</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>States of Matter</li>
                        <li>Change of State</li>
                      </ul>
                      <p className="font-semibold mt-3">Is Matter Around Us Pure?</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Mixtures</li>
                        <li>Solutions</li>
                        <li>Separation Techniques</li>
                      </ul>
                      <p className="font-semibold mt-3">Atoms and Molecules</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Laws of Chemical Combination</li>
                        <li>Atomic & Molecular Mass</li>
                      </ul>
                      <p className="font-semibold mt-3">Structure of the Atom</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Electrons, Protons, Neutrons</li>
                        <li>Bohr's Model</li>
                        <li>Atomic Number & Mass Number</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-[#6D1B1B] mb-3">🌱 BIOLOGY (Fundamentals of Life)</h4>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-gray-700">
                      <li>The Fundamental Unit of Life (Cell)</li>
                      <li>Tissues (Plant & Animal)</li>
                      <li>Diversity in Living Organisms</li>
                      <li>Why Do We Fall Ill?</li>
                      <li>Natural Resources</li>
                      <li>Improvement in Food Resources</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-[#6D1B1B] mb-3">🔬 PHYSICS (More Numerical Heavy)</h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">Light – Reflection & Refraction</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Mirrors</li>
                        <li>Refraction</li>
                        <li>Image Formation</li>
                      </ul>
                      <p className="font-semibold mt-3">Human Eye & Colourful World</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Defects of Vision</li>
                        <li>Dispersion</li>
                        <li>Scattering</li>
                      </ul>
                      <p className="font-semibold mt-3">Electricity</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Ohm's Law</li>
                        <li>Resistance</li>
                        <li>Electric Power</li>
                        <li>Series & Parallel</li>
                      </ul>
                      <p className="font-semibold mt-3">Magnetic Effects of Electric Current</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Right Hand Rule</li>
                        <li>Electromagnet</li>
                        <li>Electric Motor</li>
                      </ul>
                      <p className="font-semibold mt-3">Sources of Energy</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Renewable & Non-renewable</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-[#6D1B1B] mb-3">🧪 CHEMISTRY (Reaction Based + Conceptual)</h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">Chemical Reactions and Equations</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Balancing</li>
                        <li>Types of Reactions</li>
                      </ul>
                      <p className="font-semibold mt-3">Acids, Bases and Salts</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>pH</li>
                        <li>Properties</li>
                      </ul>
                      <p className="font-semibold mt-3">Metals and Non-metals</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Reactivity Series</li>
                        <li>Ionic Compounds</li>
                      </ul>
                      <p className="font-semibold mt-3">Carbon and Its Compounds</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Covalent Bonding</li>
                        <li>Homologous Series</li>
                        <li>Ethanol, Ethanoic Acid</li>
                      </ul>
                      <p className="font-semibold mt-3">Periodic Classification of Elements</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-[#6D1B1B] mb-3">🌱 BIOLOGY (System-Based)</h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="font-semibold">Life Processes</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Nutrition</li>
                        <li>Respiration</li>
                        <li>Circulation</li>
                        <li>Excretion</li>
                      </ul>
                      <p className="font-semibold mt-3">Other Topics</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>Control and Coordination</li>
                        <li>How Do Organisms Reproduce</li>
                        <li>Heredity and Evolution</li>
                        <li>Environment & Resources</li>
                        <li>Sustainable Management</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Results Section with Parallax */}
      <section id="results" className="py-20 bg-[#6D1B1B] relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 right-0 w-64 h-64 bg-[#E6A700] opacity-10 rounded-full blur-3xl"
        />
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {[
              { icon: TrendingUp, value: '95%+', label: 'Students Score 80%+' },
              { icon: Award, value: '10+', label: 'Years Teaching Experience' },
              { icon: Users, value: '500+', label: 'Students Guided' }
            ].map((stat, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 bg-[#E6A700] rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <stat.icon size={32} />
                  </motion.div>
                  <div className="text-4xl lg:text-5xl mb-2" style={{ fontWeight: 700 }}>{stat.value}</div>
                  <div className="text-lg text-gray-200">{stat.label}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Real Testimonial */}
      <section className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className={`text-3xl lg:text-4xl text-center mb-12 ${headingTextClass}`} style={{ fontWeight: 700 }}>
              What Our Students Say
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Real Testimonial - Featured */}
            <AnimatedSection>
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(230, 167, 0, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`p-8 rounded-2xl border-2 border-[#E6A700] md:col-span-2 ${isDarkMode ? 'bg-slate-900 shadow-2xl' : 'bg-white shadow-md'}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="text-[#E6A700] fill-current" size={20} />
                    </motion.div>
                  ))}
                </div>
                <p className={`mb-6 text-lg leading-relaxed ${bodyTextClass}`}>
                  "Studying science at VIGYAN GURU (2017–18) has been a memorable journey. It was only by the able guidance of Monika ma'am that I was able to score 100/100 in science (and also became the tricity topper!!). I feared from physics and biology, but studying here made my interest grow in these. Ma'am provided us in-depth knowledge in all physics, chemistry and biology. The tests, homework sheets, printed notes, 3D animations along with the resourceful library were a huge aid to my success. I owe my success to VIGYAN GURU. Thank you Ma'am!!"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonialImage}
                    alt="Rahul Jassal"
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#E6A700]"
                  />
                  <div>
                    <div style={{ fontWeight: 600 }} className="text-lg">Rahul Jassal</div>
                    <div className="text-sm text-[#E6A700] font-semibold">Tricity Topper, 2017-18</div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`p-4 rounded-2xl border md:col-span-2 ${isDarkMode ? 'bg-slate-900 border-white/10 shadow-2xl' : 'bg-white border-gray-200 shadow-md'}`}
              >
                <video
                  src={featuredVideo}
                  controls
                  muted
                  playsInline
                  className="w-full rounded-xl max-h-[520px] object-cover"
                />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className={`text-3xl lg:text-4xl text-center mb-12 ${headingTextClass}`} style={{ fontWeight: 700 }}>
              Our Complete Media Gallery
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <p className={`text-center max-w-3xl mx-auto mb-8 text-lg ${bodyTextClass}`}>
              Scroll through photos, posters, testimonials, and classroom videos from the full media library.
            </p>
          </AnimatedSection>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {mediaLibrary.map((item, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  onClick={() => setSelectedMedia(item)}
                  className={`relative overflow-hidden rounded-2xl shadow-lg h-[360px] w-[280px] md:w-[340px] shrink-0 snap-start cursor-pointer ${isDarkMode ? 'bg-slate-900' : 'bg-[#F8F5EF]'}`}
                >
                  {item.type === 'image' ? (
                    <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <video
                        src={item.src}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover bg-black"
                        onClick={(event) => event.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedMedia(item);
                        }}
                        className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-4 py-2 text-sm text-white transition hover:bg-black/85"
                        aria-label={`Open ${item.title} in enlarged view`}
                      >
                        Enlarge
                      </button>
                    </>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 pointer-events-none">
                    <p className="text-white font-semibold">{item.title}</p>
                    <p className="text-white/80 text-sm">
                      {item.type === 'video' ? 'Tap to enlarge video' : 'Tap to enlarge image'}
                    </p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {selectedMedia ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedMedia(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-6xl rounded-3xl overflow-hidden bg-[#111111] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              aria-label="Close media viewer"
            >
              <X size={22} />
            </button>

            <div className="max-h-[85vh] overflow-auto">
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  className="w-full max-h-[75vh] object-contain bg-black"
                />
              ) : (
                <video
                  src={selectedMedia.src}
                  controls
                  muted
                  playsInline
                  autoPlay
                  className="w-full max-h-[75vh] bg-black"
                />
              )}
            </div>

            <div className={`px-6 py-4 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
              <p className={`text-lg ${headingTextClass}`} style={{ fontWeight: 700 }}>
                {selectedMedia.title}
              </p>
              <p className={`text-sm ${bodyTextClass}`}>
                {selectedMedia.type === 'video' ? '' : selectedMedia.alt}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}

      {/* Contact Section with EmailJS */}
      <section id="contact" className={`py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className={`text-3xl lg:text-4xl text-center mb-12 ${headingTextClass}`} style={{ fontWeight: 700 }}>
              Get In Touch
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <form ref={contactFormRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm mb-2 ${headingTextClass}`} style={{ fontWeight: 500 }}>Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={formFieldClass}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${headingTextClass}`} style={{ fontWeight: 500 }}>Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={formFieldClass}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${headingTextClass}`} style={{ fontWeight: 500 }}>Class</label>
                  <select
                    name="studentClass"
                    required
                    value={formData.studentClass}
                    onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                    className={formFieldClass}
                  >
                    <option value="">Select your class</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm mb-2 ${headingTextClass}`} style={{ fontWeight: 500 }}>Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={formFieldClass}
                    placeholder="Your message"
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-8 py-3 rounded-lg transition-all ${
                    formStatus === 'sending'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : formStatus === 'success'
                      ? 'bg-green-600'
                      : formStatus === 'error'
                      ? 'bg-red-600'
                      : 'bg-[#6D1B1B] hover:bg-[#8B2323]'
                  } text-white`}
                >
                  {formStatus === 'sending'
                    ? 'Sending...'
                    : formStatus === 'success'
                    ? '✓ Message Sent!'
                    : formStatus === 'error'
                    ? '✗ Failed. Try WhatsApp'
                    : 'Submit'}
                </motion.button>
              </form>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="bg-[#1B5E20] text-white px-6 py-3 rounded-lg hover:bg-[#2E7D32] transition-colors w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Contact via WhatsApp
                </motion.button>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-slate-900 border border-white/10' : 'bg-gray-50'}`}>
                <h3 className={`text-xl mb-6 ${headingTextClass}`} style={{ fontWeight: 600 }}>Contact Information</h3>

                <div className="space-y-4">
                  {[
                    { icon: Phone, label: 'Phone', value: '+91 8699080802' },
                    { icon: Mail, label: 'Email', value: 'vigyanguru891@gmail.com' },
                    { icon: MapPin, label: 'Address', value: '#891 Sector 16\nPanchkula, Haryana' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4"
                    >
                      <item.icon className="text-[#E6A700] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <div style={{ fontWeight: 500 }}>{item.label}</div>
                        <div className={`${bodyTextClass} whitespace-pre-line`}>{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mt-8 rounded-lg overflow-hidden shadow-md"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.999734000761!2d76.83239917434145!3d30.69028357460476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f9383cff983cf%3A0x8d99e2a725820c43!2sVigyan%20Guru%20%7C%7C%20Science%20Classes%20for%209th%20%26%2010th!5e0!3m2!1sen!2sin!4v1772427708671!5m2!1sen!2sin"
                    width="100%"
                    height="256"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vigyan Guru Location"
                  ></iframe>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer with Animated Social Icons */}
      <footer className={`text-white py-12 ${isDarkMode ? 'bg-slate-900 border-t border-white/10' : 'bg-[#6D1B1B]'}`}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <motion.div whileHover={{ y: -5 }}>
              <img src={logoImage} alt="Vigyan Guru" className="h-16 mb-4" />
              <p className="text-gray-300 text-sm">
                A Premium Institute for NSO, NSTSE, NTSE, and Board Exams
              </p>
            </motion.div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontWeight: 600 }}>Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                {['Home', 'Courses', 'Results', 'About', 'Contact'].map((link, index) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a href={`#${link.toLowerCase()}`} className="hover:text-[#E6A700] transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontWeight: 600 }}>Contact Info</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>+91 8699080802</li>
                <li>vigyanguru891@gmail.com</li>
                <li>#891 Sector 16, Panchkula, Haryana</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg mb-4" style={{ fontWeight: 600 }}>Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, link: 'https://www.facebook.com/vgyan.guru' },
                  { Icon: Instagram, link: 'https://www.instagram.com/vigyan_guru_pkl/' },
                  { Icon: Youtube, link: 'https://youtube.com/shorts/XVh_KoCb1Rw?si=w4qJTP9wotn7NbnO' }
                ].map(({ Icon, link }, index) => (
                  <motion.a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, backgroundColor: '#E6A700', borderColor: '#E6A700' }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 border-2 border-[#E6A700] rounded-full flex items-center justify-center transition-colors"
                  >
                    <Icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white border-opacity-20 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; 2026 Vigyan Guru. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
