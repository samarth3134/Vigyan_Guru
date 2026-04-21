import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Award, Users, BookOpen, TrendingUp, Star, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, Zap, Target, GraduationCap } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import emailjs from '@emailjs/browser';
import { Analytics } from '@vercel/analytics/react';

const logoImage = '/assets/logo.png';
const galleryImage1 = '/assets/classroom-1.png';
const galleryImage2 = '/assets/classroom-2.png';

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
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentClass: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const galleryImages = [galleryImage1, galleryImage2];

  // Auto-scroll gallery
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cursor tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Navbar with blur effect */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
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
              {['Home', 'Courses', 'Results', 'About', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-[#1F1F1F] hover:text-[#6D1B1B] transition-colors relative group"
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
              className="lg:hidden text-[#1F1F1F]"
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
              {['Home', 'Courses', 'Results', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[#1F1F1F] hover:text-[#6D1B1B] transition-colors"
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
      <section id="home" className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        {/* Floating formulas background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-20 text-6xl text-[#6D1B1B]"
          >
            H₂O
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-40 right-40 text-4xl text-[#6D1B1B]"
          >
            E=mc²
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-40 left-60 text-5xl text-[#6D1B1B]"
          >
            CO₂
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
                  className="text-4xl lg:text-5xl xl:text-6xl mb-6 text-[#1F1F1F]"
                  style={{ fontWeight: 700 }}
                >
                  Master CBSE Science with Confidence
                </motion.h1>
              </ParallaxText>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg lg:text-xl text-gray-600 mb-8"
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
              className="relative h-[400px] lg:h-[500px]"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                {galleryImages.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img}
                    alt={`Vigyan Guru Classroom ${index + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: currentGalleryIndex === index ? 1 : 0,
                      scale: currentGalleryIndex === index ? 1 : 1.1,
                    }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover"
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
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl text-center mb-12 text-[#1F1F1F]" style={{ fontWeight: 700 }}>
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
                  className="bg-white p-8 rounded-2xl shadow-md h-full"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 bg-[#E6A700] rounded-full flex items-center justify-center mb-4"
                  >
                    <item.icon className="text-white" size={40} strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-xl mb-3 text-[#1F1F1F]" style={{ fontWeight: 600 }}>{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section with Syllabus Modal */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl text-center mb-12 text-[#1F1F1F]" style={{ fontWeight: 700 }}>
              Our Courses
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 9 */}
            <AnimatedSection>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="border-t-4 border-[#E6A700] bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-2xl mb-4 text-[#1F1F1F]" style={{ fontWeight: 600 }}>Class 9 Science</h3>
                <ul className="space-y-3 mb-6 text-gray-600">
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
                className="border-t-4 border-[#E6A700] bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-2xl mb-4 text-[#1F1F1F]" style={{ fontWeight: 600 }}>Class 10 Science</h3>
                <ul className="space-y-3 mb-6 text-gray-600">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl text-center mb-12 text-[#1F1F1F]" style={{ fontWeight: 700 }}>
              What Our Students Say
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Real Testimonial - Featured */}
            <AnimatedSection>
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(230, 167, 0, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white p-8 rounded-2xl shadow-md border-2 border-[#E6A700] md:col-span-2"
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
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "Studying science at VIGYAN GURU (2017–18) has been a memorable journey. It was only by the able guidance of Monika ma'am that I was able to score 100/100 in science (and also became the tricity topper!!). I feared from physics and biology, but studying here made my interest grow in these. Ma'am provided us in-depth knowledge in all physics, chemistry and biology. The tests, homework sheets, printed notes, 3D animations along with the resourceful library were a huge aid to my success. I owe my success to VIGYAN GURU. Thank you Ma'am!!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E6A700] to-[#6D1B1B] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    R
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }} className="text-lg">Rahul Jassal</div>
                    <div className="text-sm text-[#E6A700] font-semibold">Tricity Topper, 2017-18</div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl text-center mb-12 text-[#1F1F1F]" style={{ fontWeight: 700 }}>
              Our Learning Environment
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {galleryImages.map((img, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative overflow-hidden rounded-2xl shadow-lg h-[300px]"
                >
                  <img src={img} alt={`Classroom ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-semibold">Interactive Learning Sessions</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with EmailJS */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl text-center mb-12 text-[#1F1F1F]" style={{ fontWeight: 700 }}>
              Get In Touch
            </h2>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection>
              <form ref={contactFormRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-[#1F1F1F]" style={{ fontWeight: 500 }}>Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D1B1B] transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#1F1F1F]" style={{ fontWeight: 500 }}>Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D1B1B] transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#1F1F1F]" style={{ fontWeight: 500 }}>Class</label>
                  <select
                    name="studentClass"
                    required
                    value={formData.studentClass}
                    onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D1B1B] transition-all"
                  >
                    <option value="">Select your class</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-[#1F1F1F]" style={{ fontWeight: 500 }}>Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D1B1B] transition-all"
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
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl mb-6 text-[#1F1F1F]" style={{ fontWeight: 600 }}>Contact Information</h3>

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
                        <div className="text-gray-600 whitespace-pre-line">{item.value}</div>
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
      <footer className="bg-[#6D1B1B] text-white py-12">
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
      <Analytics />
    </div>
  );
}