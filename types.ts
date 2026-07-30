import React from 'react';

export type ViewState = 'home' | 'about' | 'services' | 'methodology' | 'cases' | 'blog' | 'contact' | 'admin' | 'simulation' | 'service-details' | 'case-details' | 'aplicacao' | 'equipe' | 'equipe-detalhe';

export interface SubService {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string; // Changed from ElementType to string for serialization
  ctaText?: string;
  subServices?: SubService[];
}

export interface NavItem {
  label: string;
  value: ViewState;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

export interface CaseItem {
  id: string;
  category: string;
  title: string;
  img: string;
  challenge: string;
  strategy: string;
  results: string[];
  testimony: string;
  author: string;
}

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}

export interface SiteContent {
  hero: HeroContent;
  services: ServiceItem[];
  cases: CaseItem[];
  blog: BlogPost[];
}

export interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: any) => void;
  resetToDefaults: () => void;
  storageType: 'local' | 'cloud';
}