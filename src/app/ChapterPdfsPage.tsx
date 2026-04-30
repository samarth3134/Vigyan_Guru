import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Download, ExternalLink, Eye, FileText, Moon, Sun, X } from 'lucide-react';
import { motion } from 'motion/react';
import { class10ChapterPdfs, class9ChapterPdfs, type ChapterPdf } from './chapter-pdfs';

const logoImage = '/assets/logo.png';

function ChapterGroup({
  className,
  chapters,
  isDarkMode,
  selectedHref,
  onSelectChapter,
}: {
  className: string;
  chapters: ChapterPdf[];
  isDarkMode: boolean;
  selectedHref: string;
  onSelectChapter: (chapter: ChapterPdf, className: string) => void;
}) {
  const headingTextClass = isDarkMode ? 'text-slate-100' : 'text-[#1F1F1F]';
  const bodyTextClass = isDarkMode ? 'text-slate-300' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-6 md:p-8 h-full ${isDarkMode ? 'bg-slate-950 border border-white/10 shadow-2xl' : 'bg-white shadow-lg'}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-[#E6A700] text-white flex items-center justify-center">
          <BookOpen size={24} />
        </div>
        <h2 className={`text-2xl ${headingTextClass}`} style={{ fontWeight: 700 }}>
          {className} Science
        </h2>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => {
          const isSelected = selectedHref === chapter.href;

          return (
            <motion.div
              key={`${className}-${chapter.chapter}`}
              whileHover={{ x: 4 }}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-xl p-4 border transition-colors ${
                isSelected
                  ? isDarkMode
                    ? 'bg-[#6D1B1B]/35 border-[#E6A700]'
                    : 'bg-[#FFF8E1] border-[#E6A700]'
                  : isDarkMode
                    ? 'bg-slate-900 border-white/10'
                    : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText className="text-[#E6A700] mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className={headingTextClass} style={{ fontWeight: 600 }}>
                    Chapter {chapter.chapter}
                  </p>
                  <p className={`${bodyTextClass} text-sm leading-relaxed`}>
                    {chapter.title}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectChapter(chapter, className)}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#E6A700] text-[#1F1F1F]'
                      : 'bg-[#6D1B1B] text-white hover:bg-[#8B2323]'
                  }`}
                  aria-label={`View ${className} Chapter ${chapter.chapter} PDF`}
                >
                  <Eye size={16} />
                  View
                </button>
                <a
                  href={`${window.location.origin}${chapter.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm transition-colors ${
                    isDarkMode
                      ? 'border-slate-700 text-slate-100 hover:border-[#E6A700] hover:text-[#E6A700]'
                      : 'border-gray-200 text-[#1F1F1F] hover:border-[#6D1B1B] hover:text-[#6D1B1B]'
                  }`}
                  aria-label={`Download ${className} Chapter ${chapter.chapter} PDF`}
                >
                  <Download size={16} />
                  PDF
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function ChapterPdfsPage() {
  const [selectedPdf, setSelectedPdf] = useState<{ className: string; chapter: ChapterPdf } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('vigyan-guru-theme') === 'dark';
  });

  useEffect(() => {
    window.localStorage.setItem('vigyan-guru-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const headingTextClass = isDarkMode ? 'text-slate-100' : 'text-[#1F1F1F]';
  const bodyTextClass = isDarkMode ? 'text-slate-300' : 'text-gray-600';
  const viewerSrc = selectedPdf
  ? `${window.location.origin}${selectedPdf.chapter.href}#toolbar=1&navpanes=0`
  : '';
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-[#1F1F1F]'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <nav className={`sticky top-0 z-50 backdrop-blur-md shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-950/85 border-b border-white/10' : 'bg-white/80'}`}>
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center">
              <img src={logoImage} alt="Vigyan Guru" className="h-16" />
            </a>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${isDarkMode ? 'border-slate-700 bg-slate-900 text-[#E6A700]' : 'border-gray-200 bg-white text-[#6D1B1B]'}`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <a
                href="/"
                className={`hidden sm:inline-flex h-11 items-center gap-2 rounded-lg border px-4 transition-colors ${isDarkMode ? 'border-slate-700 text-slate-100 hover:text-[#E6A700]' : 'border-gray-200 text-[#1F1F1F] hover:text-[#6D1B1B]'}`}
              >
                <ArrowLeft size={18} />
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <p className="text-[#E6A700] mb-3" style={{ fontWeight: 700 }}>
              NCERT Science Library
            </p>
            <h1 className={`text-4xl lg:text-5xl mb-4 ${headingTextClass}`} style={{ fontWeight: 700 }}>
              Chapter PDFs
            </h1>
            <p className={`text-lg max-w-3xl mx-auto ${bodyTextClass}`}>
              Class-wise NCERT science chapter PDFs for quick reading and revision.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <ChapterGroup
              className="Class 9"
              chapters={class9ChapterPdfs}
              isDarkMode={isDarkMode}
              selectedHref={selectedPdf?.chapter.href ?? ''}
              onSelectChapter={(chapter, className) => setSelectedPdf({ className, chapter })}
            />
            <ChapterGroup
              className="Class 10"
              chapters={class10ChapterPdfs}
              isDarkMode={isDarkMode}
              selectedHref={selectedPdf?.chapter.href ?? ''}
              onSelectChapter={(chapter, className) => setSelectedPdf({ className, chapter })}
            />
          </div>
        </div>
      </main>

      {selectedPdf ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPdf(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-950 border border-white/10' : 'bg-white'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={`flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="pr-12">
                <p className="text-sm text-[#E6A700]" style={{ fontWeight: 700 }}>
                  {selectedPdf.className} Science
                </p>
                <h2 className={`text-lg md:text-2xl ${headingTextClass}`} style={{ fontWeight: 700 }}>
                  Chapter {selectedPdf.chapter.chapter}: {selectedPdf.chapter.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`${window.location.origin}${selectedPdf.chapter.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm transition-colors ${isDarkMode ? 'border-slate-700 text-slate-100 hover:border-[#E6A700] hover:text-[#E6A700]' : 'border-gray-200 text-[#1F1F1F] hover:border-[#6D1B1B] hover:text-[#6D1B1B]'}`}
                >
                  <ExternalLink size={16} />
                  Open
                </a>
                <a
                  href={`${window.location.origin}${selectedPdf.chapter.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#6D1B1B] px-4 text-sm text-white transition-colors hover:bg-[#8B2323]"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPdf(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                aria-label="Close PDF viewer"
              >
                <X size={20} />
              </button>
            </div>

            <div className={`min-h-0 flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'}`}>
            <iframe
              key={selectedPdf.chapter.href}
              src={`${window.location.origin}${selectedPdf.chapter.href}`}
              title={`${selectedPdf.className} Chapter ${selectedPdf.chapter.chapter} PDF viewer`}
              className="h-full w-full"
            />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}
