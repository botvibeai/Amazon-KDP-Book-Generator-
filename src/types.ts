export type BookType = 'coloring' | 'survival_guide' | 'planner' | 'cookbook' | 'assorted' | 'nonfiction' | 'custom';

export type PaperType = 'white' | 'cream';
export type ColorMode = 'black_and_white' | 'standard_color' | 'premium_color';
export type CoverFinish = 'matte' | 'glossy';

export interface KDPInteriorSpec {
  trimWidthInches: number; // 8.5
  trimHeightInches: number; // 11.0
  bleed: boolean;
  pageWidthInches: number; // 8.5 or 8.625
  pageHeightInches: number; // 11.0 or 11.25
  outerMarginInches: number; // 0.25 minimum
  gutterMarginInches: number; // 0.375 minimum (alternates inside)
  topMarginInches: number; // 0.25 minimum
  bottomMarginInches: number; // 0.25 minimum
  pageCount: number; // Min 24, Max 828
  paperType: PaperType;
  colorMode: ColorMode;
}

export interface FontPairing {
  id: string;
  name: string;
  genre: string;
  headingFont: string;
  subheadingFont: string;
  bodyFont: string;
  description: string;
}

export interface ColorPaletteRule {
  id: string;
  name: string;
  backgroundHex: string;
  titleHex: string;
  subtitleHex: string;
  accentHex: string;
  contrastRatio: number;
  contrastLevel: 'AAA' | 'AA' | 'FAIL';
  genre: string;
  // Cover Psychology Extensions
  psychologyArchetype?: string;
  emotionalTrigger?: string;
  buyerPersona?: string;
  subconsciousSignal?: string;
}

export interface CoverHeroImageOption {
  id: string;
  title: string;
  genre: string;
  url: string;
  psychologyHook: string;
  emotionalTrigger: string;
  buyerResponse: string;
  recommendedPaletteId: string;
}

export interface KDPCoverSpec {
  spineWidthInches: number; // 0.002252 * pageCount
  totalWidthInches: number; // 0.125 + 8.5 + spineWidth + 8.5 + 0.125
  totalHeightInches: number; // 11.25 (11.0 + 2*0.125)
  bleedInches: number; // 0.125
  spineTextAllowed: boolean; // Amazon requires >= 80 pages or >= 0.0625"
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  frontTitle: string;
  frontSubtitle: string;
  authorName: string;
  backCoverBlurb: string;
  backCoverBullets: string[];
  themeArtStyle: string;
  coverFinish: CoverFinish;
  // Cover Title & Psychology Studio enhancements
  fontPairingId?: string;
  titlePlacement?: 'top' | 'center' | 'hero';
  contrastRatio?: number;
  contrastApproved?: boolean;
  // ⭐ Psychology-Driven First Impression Enhancements
  coverImageUrl?: string;
  coverImageCaption?: string;
  coverImagePlacement?: 'hero_center' | 'full_bleed' | 'badge_framed' | 'none';
  psychologyBadge?: string;
  titleHookStyle?: 'sub_second_bold' | 'editorial_clean' | 'tactical_box' | 'golden_frame';
  emotionalTrigger?: string;
  buyerDemographic?: string;
  firstImpressionScore?: number;
}

export interface InternationalPricing {
  formulaUsed: string; // "Print Cost × 3 rounded to .99"
  printCostUSD: number;
  retailUS: number; // USD ($)
  retailUK: number; // GBP (£)
  retailCA: number; // CAD (C$)
  retailEU: number; // EUR (€)
  royaltyUS: number;
  royaltyUK: number;
  royaltyCA: number;
  royaltyEU: number;
  royaltyRate: number; // 0.60 (60%)
}

export interface KDPMetadata {
  title: string;
  subtitle: string;
  author: string;
  penName: string;
  descriptionHtml: string;
  descriptionWordCount?: number;
  keywords: string[]; // Exactly 7 backend keywords
  categories: [string, string]; // 2 KDP categories
  targetAudience: string;
  language: string;
  publishingRights: string;
  listPriceUSD: number;
  estimatedPrintCostUSD: number;
  estimatedRoyaltyUSD: number;
  territories: string;
  edition?: string;
  isbnProvidedByKDP: boolean;
  // Auto-SEO Engine fields
  seoScore?: number; // 0 to 100
  seoTitle?: string;
  seoSubtitle?: string;
  internationalPricing?: InternationalPricing;
}

export type PageType = 
  | 'half_title' 
  | 'title' 
  | 'copyright' 
  | 'toc' 
  | 'intro' 
  | 'coloring' 
  | 'content' 
  | 'checklist' 
  | 'diagram' 
  | 'planner_month' 
  | 'planner_week' 
  | 'habit_tracker' 
  | 'recipe'
  | 'blank_bleed_barrier' 
  | 'conclusion' 
  | 'notes';

export interface RecipeData {
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories?: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  ingredients: string[];
  instructions: string[];
  chefTip?: string;
}

export interface KDPPage {
  pageNumber: number;
  pageType: PageType;
  title: string;
  subtitle?: string;
  chapterNumber?: number;
  content?: string;
  paragraphs?: string[];
  bullets?: string[];
  warning?: string;
  proTip?: string;
  actionSteps?: string[];
  quote?: string;
  recipe?: RecipeData;
  illustrationSvgType?: 
    | 'coloring_lion'
    | 'coloring_dino'
    | 'coloring_rocket'
    | 'coloring_underwater'
    | 'coloring_mandala'
    | 'coloring_castle'
    | 'coloring_forest'
    | 'coloring_butterfly'
    | 'survival_car_kit'
    | 'survival_hypothermia'
    | 'survival_signaling'
    | 'survival_condensation'
    | 'survival_snow_trench'
    | 'survival_carbon_monoxide'
    | 'planner_month_grid'
    | 'planner_weekly_focus'
    | 'planner_habit_matrix'
    | 'planner_priority_quadrant'
    | 'swatch_test_palette'
    | 'recipe_pan_icon'
    | 'assorted_mindmap';
  illustrationDescription?: string;
  isBleedBarrier?: boolean;
}

export interface KDPBook {
  id: string;
  bookType: BookType;
  metadata: KDPMetadata;
  interiorSpec: KDPInteriorSpec;
  coverSpec: KDPCoverSpec;
  pages: KDPPage[];
  createdAt: string;
  aiMeta?: {
    providerUsed?: string;
    modelUsed?: string;
    durationMs?: number;
  };
}

export interface AIProviderInfo {
  id: string;
  name: string;
  connected: boolean;
  modelCount: number;
  description: string;
}

export interface FeaturedAIModel {
  id: string;
  provider: string;
  model?: string;
  name: string;
  badge?: string;
  description?: string;
}


export interface PreFlightCheck {
  id: string;
  label: string;
  specRequired: string;
  actualValue: string;
  passed: boolean;
  details: string;
}

export interface QualityValidatorReport {
  dpiCheck: { passed: boolean; value: string; details: string };
  noTransparencyCheck: { passed: boolean; value: string; details: string };
  noPixelationCheck: { passed: boolean; value: string; details: string };
  noCutoffTextCheck: { passed: boolean; value: string; details: string };
  correctTrimCheck: { passed: boolean; value: string; details: string };
  correctBleedCheck: { passed: boolean; value: string; details: string };
  correctGutterCheck: { passed: boolean; value: string; details: string };
  allPassed: boolean;
  score: number;
  rejectionRisk: string;
}
