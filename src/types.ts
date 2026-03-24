import React from 'react';

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified?: boolean;
    role?: string;
  };
  content: string;
  image?: string;
  video?: string;
  link?: {
    url: string;
    title: string;
    description: string;
    image: string;
  };
  likes: number;
  comments: number;
  shares: number;
  time: string;
  type: 'text' | 'image' | 'video' | 'link';
  tags?: string[];
}

export interface Story {
  id: string;
  userName: string;
  userAvatar: string;
  thumbnail: string;
  isSeen?: boolean;
  content?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isHot?: boolean;
  description?: string;
  seller?: {
    name: string;
    avatar: string;
    rating: number;
  };
  gallery?: string[];
  specs?: { [key: string]: string };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  logo: string;
  type: string;
  postedAt: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  isAvailable: boolean;
  priceStart?: string;
  experience?: number;
  completedWorks?: number;
  bio?: string;
  gallery?: string[];
  services?: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'on_the_way' | 'in_progress' | 'completed';
  totalPrice: number;
  address: string;
  notes?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  accentColor: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'product' | 'job' | 'service';
  actionLabel: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface TickerItem {
  id: string;
  text: string;
  type: 'gold' | 'news' | 'poultry' | 'currency';
}

export interface AppModule {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  subModules?: AppModule[];
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
