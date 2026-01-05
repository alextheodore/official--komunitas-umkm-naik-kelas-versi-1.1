
import type React from 'react';

export interface AppUser {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    businessName: string;
    role: 'user' | 'admin';
    joinDate: string;
    phoneNumber?: string;
    address?: string;
    businessCategory?: string;
    website?: string;
    nib?: string;
}

export interface Seller {
  id: string;
  name: string;
  businessName: string;
  profilePicture: string;
  phone: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  seller_id: string;
  seller?: Seller;
  price: number;
  stock: number;
  category: 'Kuliner' | 'Fashion' | 'Kerajinan' | 'Jasa' | 'Lainnya';
  description: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  dateListed: string;
}

export interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  category: 'Webinar' | 'Workshop' | 'Networking' | 'Kompetisi';
}

export interface Article {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  authorImage: string;
}

export interface ForumUser {
  id: string;
  name: string;
  profilePicture: string;
  businessName?: string;
}

export interface ForumPost {
  id: string;
  author_id: string;
  author?: ForumUser;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

export interface ForumThread {
  id: string;
  title: string;
  category: 'Tips Bisnis' | 'Pemasaran' | 'Manajemen' | 'Lainnya';
  author_id: string;
  author?: ForumUser;
  createdAt: string;
  posts: ForumPost[];
  views: number;
  upvotes: number;
  downvotes: number;
}

export interface Notification {
  id: string;
  type: 'comment' | 'event' | 'new_member' | 'wishlist_update';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
}
