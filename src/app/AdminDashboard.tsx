import { useEffect, useMemo, useState } from 'react';
import { LogOut, Plus, Save, Shield, Trash2, Camera, AlertTriangle, Upload } from 'lucide-react';
import { defaultHomepageSettings, defaultSiteContent, type HomepageSettings } from './content';
import { getSupabaseClient } from './supabase';
import type { MediaItem } from './site-data';

type Status = { type: 'idle' | 'success' | 'error'; message: string };

type HeroSlideRecord = (typeof defaultSiteContent.heroSlides)[number] & { display_order?: number };
type HeroFormulaRecord = (typeof defaultSiteContent.heroFormulas)[number] & { display_order?: number };
type FaqRecord = (typeof defaultSiteContent.faqItems)[number] & { display_order?: number; visible?: boolean };
type BatchRecord = (typeof defaultSiteContent.batchDetails)[number] & { display_order?: number; visible?: boolean };
type MediaRecord = MediaItem & { display_order?: number };

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl text-slate-100" style={{ fontWeight: 700 }}>{title}</h2>
      <p className="text-slate-400 mt-1">{description}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const supabase = getSupabaseClient();
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(defaultHomepageSettings);
  const [mediaItems, setMediaItems] = useState<MediaRecord[]>(defaultSiteContent.mediaLibrary.map((item, index) => ({ ...item, display_order: index })));
  const [heroSlides, setHeroSlides] = useState<HeroSlideRecord[]>(defaultSiteContent.heroSlides.map((item, index) => ({ ...item, display_order: index })));
  const [heroFormulas, setHeroFormulas] = useState<HeroFormulaRecord[]>(defaultSiteContent.heroFormulas.map((item, index) => ({ ...item, display_order: index })));
  const [faqItems, setFaqItems] = useState<FaqRecord[]>(defaultSiteContent.faqItems.map((item, index) => ({ ...item, display_order: index, visible: true })));
  const [batchDetails, setBatchDetails] = useState<BatchRecord[]>(defaultSiteContent.batchDetails.map((item, index) => ({ ...item, display_order: index, visible: true })));
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; index: number } | null>(null);
  const [uploadingMediaIndex, setUploadingMediaIndex] = useState<number | null>(null);

  const missingSupabase = !supabase;
  const statusClass = useMemo(() => {
    if (status.type === 'success') return 'border-green-500/30 bg-green-500/10 text-green-200';
    if (status.type === 'error') return 'border-red-500/30 bg-red-500/10 text-red-200';
    return 'border-white/10 bg-white/5 text-slate-300';
  }, [status.type]);

  useEffect(() => {
    if (!supabase) {
      setSessionReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(Boolean(data.session));
      setSessionReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setSessionReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !isAuthenticated) return;

    async function loadAdminContent() {
      setLoading(true);
      const [
        settingsResponse,
        mediaResponse,
        slidesResponse,
        formulasResponse,
        faqResponse,
        batchResponse,
      ] = await Promise.all([
        supabase.from('site_settings').select('key, value'),
        supabase.from('media_items').select('*').order('display_order', { ascending: true }),
        supabase.from('hero_slides').select('*').order('display_order', { ascending: true }),
        supabase.from('hero_formulas').select('*').order('display_order', { ascending: true }),
        supabase.from('faq_items').select('*').order('display_order', { ascending: true }),
        supabase.from('batch_details').select('*').order('display_order', { ascending: true }),
      ]);

      if (!settingsResponse.error && settingsResponse.data) {
        const homepageRow = settingsResponse.data.find((row) => row.key === 'homepage_settings');
        if (homepageRow?.value && typeof homepageRow.value === 'object') {
          setHomepageSettings({ ...defaultHomepageSettings, ...(homepageRow.value as Partial<HomepageSettings>) });
        }
      }

      if (!mediaResponse.error && mediaResponse.data?.length) setMediaItems(mediaResponse.data);
      if (!slidesResponse.error && slidesResponse.data?.length) setHeroSlides(slidesResponse.data);
      if (!formulasResponse.error && formulasResponse.data?.length) {
        setHeroFormulas(formulasResponse.data.map((formula) => ({
          ...formula,
          animation: {
            y: Array.isArray(formula.animation_y) ? formula.animation_y : [0, 0, 0],
            rotate: Array.isArray(formula.animation_rotate) ? formula.animation_rotate : undefined,
          },
        })));
      }
      if (!faqResponse.error && faqResponse.data?.length) setFaqItems(faqResponse.data);
      if (!batchResponse.error && batchResponse.data?.length) setBatchDetails(batchResponse.data);
      setLoading(false);
    }

    loadAdminContent();
  }, [isAuthenticated, supabase]);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(authForm);
    setLoading(false);

    if (error) {
      setStatus({ type: 'error', message: error.message });
      return;
    }

    setStatus({ type: 'success', message: 'Signed in successfully.' });
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setStatus({ type: 'idle', message: '' });
  }

  async function handleMediaUpload(index: number, event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;

    setUploadingMediaIndex(index);
    const fileExt = file.name.split('.').pop();
    const fileName = `admin-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setMediaItems((prev) => prev.map((item, i) => 
        i === index ? { ...item, src: data.publicUrl } : item
      ));
      setStatus({ type: 'success', message: 'Media uploaded successfully.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Upload failed.' });
    } finally {
      setUploadingMediaIndex(null);
    }
  }

  function confirmDelete(type: string, index: number) {
    setDeleteConfirm({ type, index });
  }

  function cancelDelete() {
    setDeleteConfirm(null);
  }

  function executeDelete() {
    if (!deleteConfirm) return;
    const { type, index } = deleteConfirm;
    
    if (type === 'media') setMediaItems((prev) => prev.filter((_, i) => i !== index));
    else if (type === 'faq') setFaqItems((prev) => prev.filter((_, i) => i !== index));
    else if (type === 'batch') setBatchDetails((prev) => prev.filter((_, i) => i !== index));
    else if (type === 'heroSlide') setHeroSlides((prev) => prev.filter((_, i) => i !== index));
    else if (type === 'heroFormula') setHeroFormulas((prev) => prev.filter((_, i) => i !== index));
    
    setDeleteConfirm(null);
    setStatus({ type: 'success', message: 'Item removed. Click "Save All" to persist.' });
  }

  async function saveAll() {
    if (!supabase) return;
    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    const homepagePayload = { key: 'homepage_settings', value: homepageSettings };
    const formulaPayload = heroFormulas.map((item, index) => ({
      ...item,
      display_order: index,
      animation_y: item.animation.y,
      animation_rotate: item.animation.rotate ?? null,
    }));

    const [settingsResult, mediaResult, slideResult, formulaResult, faqResult, batchResult] = await Promise.all([
      supabase.from('site_settings').upsert(homepagePayload, { onConflict: 'key' }),
      supabase.from('media_items').upsert(mediaItems.map((item, index) => ({ ...item, display_order: index }))),
      supabase.from('hero_slides').upsert(heroSlides.map((item, index) => ({ ...item, display_order: index }))),
      supabase.from('hero_formulas').upsert(formulaPayload),
      supabase.from('faq_items').upsert(faqItems.map((item, index) => ({ ...item, display_order: index }))),
      supabase.from('batch_details').upsert(batchDetails.map((item, index) => ({ ...item, display_order: index }))),
    ]);

    const error = settingsResult.error || mediaResult.error || slideResult.error || formulaResult.error || faqResult.error || batchResult.error;
    setLoading(false);

    if (error) {
      setStatus({ type: 'error', message: error.message });
      return;
    }

    setStatus({ type: 'success', message: 'All content saved to Supabase.' });
  }

  if (missingSupabase) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="text-[#E6A700]" />
            <h1 className="text-3xl" style={{ fontWeight: 700 }}>Admin Setup Needed</h1>
          </div>
          <p className="text-slate-300 mb-6">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env`, then reload `/admin`.
          </p>
          <p className="text-slate-400">
            After that, I can also give you the exact Supabase SQL schema to paste into the SQL editor.
          </p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Loading admin...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <Shield className="text-[#E6A700]" />
            <h1 className="text-3xl" style={{ fontWeight: 700 }}>Admin Login</h1>
          </div>
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="Admin email"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
          />
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#6D1B1B] px-4 py-3 text-white transition hover:bg-[#8B2323]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          {status.message ? <div className={`rounded-xl border px-4 py-3 text-sm ${statusClass}`}>{status.message}</div> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl" style={{ fontWeight: 700 }}>Website Admin</h1>
            <p className="text-slate-400 mt-2">Manage homepage content, media, FAQ, timings, and hero content.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={saveAll} className="rounded-xl bg-[#6D1B1B] px-5 py-3 text-white inline-flex items-center gap-2">
              <Save size={18} />
              Save All
            </button>
            <button onClick={handleLogout} className="rounded-xl border border-white/10 px-5 py-3 inline-flex items-center gap-2">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {status.message ? <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${statusClass}`}>{status.message}</div> : null}

        <div className="grid gap-8">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <SectionHeader title="Homepage Content" description="Edit the main hero copy shown on the public site." />
            <div className="grid md:grid-cols-2 gap-4">
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" value={homepageSettings.heroHeading} onChange={(e) => setHomepageSettings((prev) => ({ ...prev, heroHeading: e.target.value }))} placeholder="Hero heading" />
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" value={homepageSettings.heroSubheading} onChange={(e) => setHomepageSettings((prev) => ({ ...prev, heroSubheading: e.target.value }))} placeholder="Hero subheading" />
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" value={homepageSettings.primaryCtaLabel} onChange={(e) => setHomepageSettings((prev) => ({ ...prev, primaryCtaLabel: e.target.value }))} placeholder="Primary CTA label" />
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" value={homepageSettings.secondaryCtaLabel} onChange={(e) => setHomepageSettings((prev) => ({ ...prev, secondaryCtaLabel: e.target.value }))} placeholder="Secondary CTA label" />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <SectionHeader title="Hero Slides" description="Manage the rotating slideshow on the homepage hero section." />
            <div className="space-y-4">
              {heroSlides.map((item, index) => (
                <div key={`${item.src}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4 md:grid-cols-[1.2fr_1fr_auto]">
                  <div className="space-y-3">
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.src} onChange={(e) => setHeroSlides((prev) => prev.map((entry, i) => i === index ? { ...entry, src: e.target.value } : entry))} placeholder="Image path" />
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.alt} onChange={(e) => setHeroSlides((prev) => prev.map((entry, i) => i === index ? { ...entry, alt: e.target.value } : entry))} placeholder="Alt text" />
                  </div>
                  <div className="space-y-3">
                    <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.orientation} onChange={(e) => setHeroSlides((prev) => prev.map((entry, i) => i === index ? { ...entry, orientation: e.target.value as 'landscape' | 'portrait' } : entry))}>
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                    <div className="flex gap-4 text-sm text-slate-300">
                      <label><input type="checkbox" checked={item.visible !== false} onChange={(e) => setHeroSlides((prev) => prev.map((entry, i) => i === index ? { ...entry, visible: e.target.checked } : entry))} /> Visible</label>
                      <label><input type="checkbox" checked={item.featured === true} onChange={(e) => setHeroSlides((prev) => prev.map((entry, i) => i === index ? { ...entry, featured: e.target.checked } : entry))} /> Featured</label>
                    </div>
                  </div>
                  <button className="rounded-xl border border-red-500/30 px-4 py-2 text-red-300 inline-flex items-center gap-2 self-start" onClick={() => confirmDelete('heroSlide', index)}>
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 rounded-xl border border-white/10 px-4 py-2 inline-flex items-center gap-2" onClick={() => setHeroSlides((prev) => [...prev, { id: crypto.randomUUID(), src: '', alt: '', orientation: 'landscape', featured: false, visible: true, display_order: prev.length }])}>
              <Plus size={16} />
              Add Hero Slide
            </button>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <SectionHeader title="Hero Formulas" description="Floating chemistry/physics formulas shown on the hero section." />
            <div className="space-y-4">
              {heroFormulas.map((item, index) => (
                <div key={`${item.id}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4 md:grid-cols-[1.5fr_1fr_auto]">
                  <div className="space-y-3">
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.id} onChange={(e) => setHeroFormulas((prev) => prev.map((entry, i) => i === index ? { ...entry, id: e.target.value } : entry))} placeholder="ID (e.g. formula1)" />
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.label} onChange={(e) => setHeroFormulas((prev) => prev.map((entry, i) => i === index ? { ...entry, label: e.target.value } : entry))} placeholder="Formula (HTML allowed)" />
                  </div>
                  <div className="space-y-3">
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.className} onChange={(e) => setHeroFormulas((prev) => prev.map((entry, i) => i === index ? { ...entry, className: e.target.value } : entry))} placeholder="CSS classes" />
                    <div className="flex gap-4 text-sm text-slate-300">
                      <label><input type="checkbox" checked={item.visible !== false} onChange={(e) => setHeroFormulas((prev) => prev.map((entry, i) => i === index ? { ...entry, visible: e.target.checked } : entry))} /> Visible</label>
                    </div>
                  </div>
                  <button className="rounded-xl border border-red-500/30 px-4 py-2 text-red-300 inline-flex items-center gap-2 self-start" onClick={() => confirmDelete('heroFormula', index)}>
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 rounded-xl border border-white/10 px-4 py-2 inline-flex items-center gap-2" onClick={() => setHeroFormulas((prev) => [...prev, { id: `formula${prev.length + 1}`, label: 'H₂O', className: 'absolute top-20 left-20 text-6xl text-[#4A1111]', animation: { y: [0, -20, 0] }, visible: true, display_order: prev.length }])}>
              <Plus size={16} />
              Add Formula
            </button>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <SectionHeader title="Media Library" description="Control gallery assets. Toggle `visible` or `featured` without deleting items." />
            <div className="space-y-4">
              {mediaItems.map((item, index) => (
                <div key={`${item.src}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4 md:grid-cols-[1.1fr_1.2fr_0.9fr_auto]">
                  <div className="space-y-3">
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.title} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, title: e.target.value } : entry))} placeholder="Title" />
                    <div className="flex gap-2">
                      <input className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.src} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, src: e.target.value } : entry))} placeholder="Asset path" />
                      <label className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 inline-flex items-center gap-1 cursor-pointer hover:bg-slate-800">
                        {uploadingMediaIndex === index ? <Upload size={16} className="animate-spin" /> : <Camera size={16} />}
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleMediaUpload(index, e)} />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.alt} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, alt: e.target.value } : entry))} placeholder="Alt text" />
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.category ?? ''} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, category: e.target.value as MediaRecord['category'] } : entry))} placeholder="Category" />
                  </div>
                  <div className="space-y-3">
                    <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.type} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, type: e.target.value as MediaRecord['type'] } : entry))}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <div className="flex gap-4 text-sm text-slate-300">
                      <label><input type="checkbox" checked={item.visible !== false} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, visible: e.target.checked } : entry))} /> Visible</label>
                      <label><input type="checkbox" checked={item.featured === true} onChange={(e) => setMediaItems((prev) => prev.map((entry, i) => i === index ? { ...entry, featured: e.target.checked } : entry))} /> Featured</label>
                    </div>
                  </div>
                  <button className="rounded-xl border border-red-500/30 px-4 py-2 text-red-300 inline-flex items-center gap-2 self-start" onClick={() => confirmDelete('media', index)}>
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 rounded-xl border border-white/10 px-4 py-2 inline-flex items-center gap-2" onClick={() => setMediaItems((prev) => [...prev, { type: 'image', title: '', src: '', alt: '', category: 'misc', featured: false, visible: true, display_order: prev.length }])}>
              <Plus size={16} />
              Add Media Item
            </button>
          </section>

          <section className="grid xl:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
              <SectionHeader title="FAQ Items" description="Manage the common questions shown on the site." />
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={`${item.question}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950 p-4 space-y-3">
                    <input className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.question} onChange={(e) => setFaqItems((prev) => prev.map((entry, i) => i === index ? { ...entry, question: e.target.value } : entry))} placeholder="Question" />
                    <textarea className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 min-h-[110px]" value={item.answer} onChange={(e) => setFaqItems((prev) => prev.map((entry, i) => i === index ? { ...entry, answer: e.target.value } : entry))} placeholder="Answer" />
                    <button className="rounded-lg border border-red-500/30 px-3 py-2 text-red-300" onClick={() => confirmDelete('faq', index)}>Remove</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 rounded-xl border border-white/10 px-4 py-2 inline-flex items-center gap-2" onClick={() => setFaqItems((prev) => [...prev, { question: '', answer: '', visible: true, display_order: prev.length }])}>
                <Plus size={16} />
                Add FAQ
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
              <SectionHeader title="Batch Timings" description="Manage class schedules and batch start dates." />
              <div className="space-y-4">
                {batchDetails.map((item, index) => (
                  <div key={`${item.className}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950 p-4 grid gap-3">
                    <input className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.className} onChange={(e) => setBatchDetails((prev) => prev.map((entry, i) => i === index ? { ...entry, className: e.target.value } : entry))} placeholder="Class name" />
                    <input className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.days} onChange={(e) => setBatchDetails((prev) => prev.map((entry, i) => i === index ? { ...entry, days: e.target.value } : entry))} placeholder="Days" />
                    <input className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.time} onChange={(e) => setBatchDetails((prev) => prev.map((entry, i) => i === index ? { ...entry, time: e.target.value } : entry))} placeholder="Time" />
                    <input className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" value={item.starts} onChange={(e) => setBatchDetails((prev) => prev.map((entry, i) => i === index ? { ...entry, starts: e.target.value } : entry))} placeholder="Starts" />
                    <button className="rounded-lg border border-red-500/30 px-3 py-2 text-red-300 w-fit" onClick={() => confirmDelete('batch', index)}>Remove</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 rounded-xl border border-white/10 px-4 py-2 inline-flex items-center gap-2" onClick={() => setBatchDetails((prev) => [...prev, { className: '', days: '', time: '', starts: '', visible: true, display_order: prev.length }])}>
                <Plus size={16} />
                Add Batch
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-400" size={24} />
              <h3 className="text-xl text-slate-100" style={{ fontWeight: 600 }}>Confirm Delete</h3>
            </div>
            <p className="text-slate-300 mb-6">Are you sure you want to delete this item? This action can be undone by clicking "Save All" if needed.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
