export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  href: string
}

export interface NavigationConfig {
  brandName: string
  links: NavigationLink[]
}

export interface HeroConfig {
  eyebrow: string
  titleLines: string[]
  leadText: string
  supportingNotes: string[]
}

export interface ManifestoConfig {
  videoPath: string
  text: string
}

export interface FacilityArticle {
  title: string
  paragraphs: string[]
}

export interface FacilityItem {
  slug: string
  name: string
  code: string
  address: string
  status: string
  email: string
  phone: string
  ctaText: string
  ctaHref: string
  image: string
  utcOffset: number
  article: FacilityArticle
}

export interface FacilitiesConfig {
  sectionLabel: string
  detailBackText: string
  detailNotFoundText: string
  detailReturnText: string
  items: FacilityItem[]
}

export interface ObservationConfig {
  sectionLabel: string
  videoPath: string
  statusText: string
  latLabel: string
  lonLabel: string
  initialLat: number
  initialLon: number
}

export interface ArchiveItem {
  src: string
  label: string
}

export interface ArchivesConfig {
  sectionLabel: string
  vaultTitle: string
  closeText: string
  items: ArchiveItem[]
}

export interface FooterConfig {
  copyrightText: string
  statusText: string
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "ImpactBridge — AI-Powered Social Impact Platform",
  siteDescription: "ImpactBridge transforms how NGOs collect, analyze, and act on community needs. AI-powered resource allocation and volunteer coordination for maximum social impact.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "ImpactBridge",
  links: [
    { label: "Mission", href: "#manifesto" },
    { label: "Systems", href: "#facilities" },
    { label: "Live Feed", href: "#observation" },
    { label: "Archive", href: "#archives" },
  ],
}

export const heroConfig: HeroConfig = {
  eyebrow: "Google Solution Challenge 2025 / SDG 1, 3, 10, 11, 17",
  titleLines: [
    "TURNING",
    "SCATTERED DATA",
    "INTO ACTION",
  ],
  leadText: "ImpactBridge is the operating system for social impact. We close the gap between identified community needs and available human resources — at scale, in any language, even offline.",
  supportingNotes: [
    "1.6 billion people lack access to basic social services. 73% of NGO field data is lost before analysis. Volunteer mismatch rates are 4x higher than they should be.",
    "NeedsScan Engine digitizes paper surveys, voice notes, and field reports into structured need-profiles using Gemini multimodal AI.",
    "MatchMind Engine pairs volunteers to community needs in under 90 seconds with 91% match accuracy — down from 72 hours manually.",
  ],
}

export const manifestoConfig: ManifestoConfig = {
  videoPath: "/videos/manifesto.mp4",
  text: "We envision a world where no community need goes unaddressed due to poor data flow or volunteer mismatch. By combining Gemini 2.5 Pro's multimodal intelligence with real-time volunteer coordination, ImpactBridge empowers every grassroots organization — regardless of size, budget, or technical literacy — with the same AI-driven coordination capabilities available to the world's largest humanitarian organizations. Our Social Need Graph maps community needs, available resources, volunteer skills, and geographic data into a single queryable intelligence layer that powers every feature of the platform.",
}

export const facilitiesConfig: FacilitiesConfig = {
  sectionLabel: "Core Systems",
  detailBackText: "Back to Systems",
  detailNotFoundText: "System not found.",
  detailReturnText: "Return to overview",
  items: [
    {
      slug: "needscan",
      name: "NeedScan Engine",
      code: "NS-001",
      address: "Data Ingestion Layer",
      status: "Operational — Processing 2,000+ needs/month",
      email: "needscan@impactbridge.app",
      phone: "+91 OCR-VOICE-SMS",
      ctaText: "Submit a Need →",
      ctaHref: "/needs/submit",
      image: "/images/facility-needscan.jpg",
      utcOffset: 0,
      article: {
        title: "Digitizing Any Format Into Structured Action",
        paragraphs: [
          "The NeedsScan Engine is the data ingestion and intelligence layer of ImpactBridge. It accepts community need data in any format — a photograph of a handwritten paper survey, a voice message in any of 47 languages, an SMS or WhatsApp message, a direct digital form submission, or a bulk CSV upload.",
          "After ingestion, every need is automatically categorized into medical, food, shelter, education, livelihood, safety, water sanitation, mental health, elderly care, or child protection. Gemini Vision OCR processes images with 94%+ field extraction accuracy. Google Speech-to-Text transcribes voice with automatic language detection and punctuation.",
          "Each need is geo-tagged using Google Maps Platform, urgency-scored on a 0-100 scale using a fine-tuned Vertex AI classifier, and added to the Social Need Graph. The deduplication engine uses vector similarity search to detect duplicate submissions. The entire pipeline completes in under 5 seconds per input.",
        ],
      },
    },
    {
      slug: "matchmind",
      name: "MatchMind Engine",
      code: "MM-002",
      address: "Volunteer Matching Layer",
      status: "Operational — 91% Match Accuracy",
      email: "matchmind@impactbridge.app",
      phone: "+91 AI-MATCH-PRO",
      ctaText: "View Volunteers →",
      ctaHref: "/volunteers",
      image: "/images/facility-matchmind.jpg",
      utcOffset: 5.5,
      article: {
        title: "AI Multi-Factor Volunteer Task Orchestration",
        paragraphs: [
          "The MatchMind Engine is the volunteer-task orchestration layer. It continuously runs a multi-factor matching algorithm considering: volunteer skill match to need type (30%), geographic proximity (25%), availability window (20%), past impact score (10%), current workload (10%), and language match (5%).",
          "Every volunteer profile and community need is represented as a dense 768-dimensional vector embedding using Vertex AI text-embedding-004. The system queries the Vertex AI Matching Engine for top-50 volunteers by vector similarity in under 100ms, then applies hard filters for geography, availability, and active status.",
          "The matching algorithm outputs a ranked shortlist with confidence scores and human-readable explanations generated by Gemini. Coordinators can accept AI recommendations with one tap or override with manual selection. The entire match generation completes in under 3 seconds.",
        ],
      },
    },
    {
      slug: "impactpulse",
      name: "ImpactPulse Dashboard",
      code: "IP-003",
      address: "Analytics & Reporting Layer",
      status: "Operational — Live Intelligence",
      email: "impactpulse@impactbridge.app",
      phone: "+91 LIVE-DATA-NOW",
      ctaText: "Open Dashboard →",
      ctaHref: "/dashboard",
      image: "/images/facility-impactpulse.jpg",
      utcOffset: -5,
      article: {
        title: "Command Center for Social Impact Decision-Making",
        paragraphs: [
          "The ImpactPulse Dashboard is the intelligence visualization and decision-support layer for NGO coordinators and leadership. It provides a live geographic heatmap of community needs overlaid on Google Maps, resource allocation visualization showing where volunteers are deployed versus where needs are concentrated, and predictive need forecasting using BigQuery ML ARIMA_PLUS models.",
          "The dashboard includes automated donor-ready impact reports generated by Gemini in any language, volunteer performance analytics with recognition leaderboards, retention risk scoring for at-risk volunteers, and skills gap analysis showing which categories are underrepresented in the volunteer pool.",
          "Predictive forecasting incorporates weather data, public health surveillance feeds, agricultural calendar data, and local event calendars to anticipate need spikes 7-14 days in advance. Real-time anomaly detection triggers coordinator alerts when submission rates exceed baseline thresholds or urgency scores cluster rapidly in a geographic area.",
        ],
      },
    },
    {
      slug: "reach",
      name: "Community Reach",
      code: "CR-004",
      address: "WhatsApp Bot / IVR / SMS",
      status: "Operational — 47 Languages",
      email: "reach@impactbridge.app",
      phone: "+91 WHATSAPP-IVR",
      ctaText: "Report a Need →",
      ctaHref: "/needs/submit",
      image: "/images/facility-whatsapp.jpg",
      utcOffset: 8,
      article: {
        title: "Zero-Smartphone, Zero-Literacy Need Reporting",
        paragraphs: [
          "ImpactBridge meets users where they already are. The WhatsApp Business API integration allows community members to submit needs, receive updates, and communicate with coordinators through the world's most popular messaging platform. No app download required.",
          "For areas with no smartphone access, the Twilio IVR phone line enables need reporting via voice call in any of 47 languages. Speech-to-Text transcribes the message, Gemini NLP extracts structured information, and the need enters the same processing pipeline as digital submissions.",
          "SMS submissions work on any feature phone. The offline-first Flutter mobile app syncs data opportunistically when connectivity returns. Every channel produces the same structured, geo-tagged, urgency-scored need document — ensuring no community voice is left unheard regardless of their technology access.",
        ],
      },
    },
  ],
}

export const observationConfig: ObservationConfig = {
  sectionLabel: "Live Coordination Feed",
  videoPath: "/videos/observation.mp4",
  statusText: "LIVE — REAL-TIME MATCHING ACTIVE",
  latLabel: "IMPACT LAT",
  lonLabel: "IMPACT LON",
  initialLat: 30.901,
  initialLon: 75.8573,
}

export const archivesConfig: ArchivesConfig = {
  sectionLabel: "Impact Archive",
  vaultTitle: "Open Impact Vault",
  closeText: "Close Vault",
  items: [
    {
      src: "/images/archive-medical.jpg",
      label: "Medical Response — Rural Punjab, March 2026",
    },
    {
      src: "/images/archive-education.jpg",
      label: "Education Outreach — Community Learning Program",
    },
    {
      src: "/images/archive-food.jpg",
      label: "Food Security — Distribution Event, 12,000 Served",
    },
    {
      src: "/images/archive-shelter.jpg",
      label: "Shelter Construction — Volunteer Team Build",
    },
  ],
}

export const footerConfig: FooterConfig = {
  copyrightText: "© 2026 ImpactBridge — Google Solution Challenge",
  statusText: "ALL SYSTEMS OPERATIONAL",
}
