import {
  batchDetails as defaultBatchDetails,
  faqItems as defaultFaqItems,
  heroFormulas as defaultHeroFormulas,
  heroSlideshowPool as defaultHeroSlides,
  mediaLibrary as defaultMediaLibrary,
} from './site-data';
import { getSupabaseClient } from './supabase';

export type HomepageSettings = {
  heroHeading: string;
  heroSubheading: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export const defaultHomepageSettings: HomepageSettings = {
  heroHeading: 'Master CBSE Science with Confidence',
  heroSubheading: 'Expert coaching for Class 9 & 10 Science | Concept Clarity | Board Success',
  primaryCtaLabel: 'Contact Now',
  secondaryCtaLabel: 'Our Courses',
};

export type SiteContent = {
  batchDetails: typeof defaultBatchDetails;
  faqItems: typeof defaultFaqItems;
  heroFormulas: typeof defaultHeroFormulas;
  heroSlides: typeof defaultHeroSlides;
  homepageSettings: HomepageSettings;
  mediaLibrary: typeof defaultMediaLibrary;
};

export const defaultSiteContent: SiteContent = {
  batchDetails: defaultBatchDetails,
  faqItems: defaultFaqItems,
  heroFormulas: defaultHeroFormulas,
  heroSlides: defaultHeroSlides,
  homepageSettings: defaultHomepageSettings,
  mediaLibrary: defaultMediaLibrary,
};

function sortByOrder<T extends { display_order?: number | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export async function loadSiteContent(): Promise<SiteContent> {
  const supabase = getSupabaseClient();
  if (!supabase) return defaultSiteContent;

  const [
    settingsResponse,
    mediaResponse,
    slidesResponse,
    formulasResponse,
    faqResponse,
    batchResponse,
  ] = await Promise.all([
    supabase.from('site_settings').select('key, value'),
    supabase.from('media_items').select('*'),
    supabase.from('hero_slides').select('*'),
    supabase.from('hero_formulas').select('*'),
    supabase.from('faq_items').select('*'),
    supabase.from('batch_details').select('*'),
  ]);

  const settingsMap = new Map<string, unknown>();
  if (!settingsResponse.error && settingsResponse.data) {
    settingsResponse.data.forEach((row) => settingsMap.set(row.key, row.value));
  }

  const homepageSettings = {
    ...defaultHomepageSettings,
    ...(typeof settingsMap.get('homepage_settings') === 'object' && settingsMap.get('homepage_settings') !== null
      ? (settingsMap.get('homepage_settings') as Partial<HomepageSettings>)
      : {}),
  };

  return {
    homepageSettings,
    mediaLibrary: !mediaResponse.error && mediaResponse.data?.length
      ? sortByOrder(mediaResponse.data)
      : defaultMediaLibrary,
    heroSlides: !slidesResponse.error && slidesResponse.data?.length
      ? sortByOrder(slidesResponse.data)
      : defaultHeroSlides,
    heroFormulas: !formulasResponse.error && formulasResponse.data?.length
      ? sortByOrder(formulasResponse.data).map((formula) => ({
          ...formula,
          animation: {
            y: Array.isArray(formula.animation_y) ? formula.animation_y : [0, 0, 0],
            rotate: Array.isArray(formula.animation_rotate) ? formula.animation_rotate : undefined,
          },
        }))
      : defaultHeroFormulas,
    faqItems: !faqResponse.error && faqResponse.data?.length
      ? sortByOrder(faqResponse.data)
      : defaultFaqItems,
    batchDetails: !batchResponse.error && batchResponse.data?.length
      ? sortByOrder(batchResponse.data)
      : defaultBatchDetails,
  };
}
