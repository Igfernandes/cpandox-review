
export enum Category {
  PEDIDOS_PESSOAIS = 'Pedidos Pessoais',
  PEDIDOS_EVENTOS = 'Pedidos para Eventos',
  PEDIDOS_TERCEIROS = 'Pedidos para Terceiros',
  TRABALHOS_INUSITADOS = 'Trabalhos Inusitados',
  SERVICOS_CELEBRIDADES = 'Serviços de Celebridades (do presente ou do passado)'
}

export type ListingType = 'request' | 'offer';

export enum GigStatus {
  OPEN = 'open',
  NEGOTIATING = 'negotiating',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DENIED = 'denied',
  NEGOTIATED = 'negotiated',
  WAITING_CONCLUSION = 'waiting_conclusion'
}

export interface SystemSettings {
  commissionRate: number;
  requesterFee: number;
  workerFee: number;
  bothFee: number;
  bothPromotionalFee: number;
  celebrityFee: number;
  promotionalUserLimit: number;
  platformPixKey: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  walletBalance: number;
  status?: string;
  email?: string;
  // New sensitive fields for registration
  cpf?: string;
  address?: string;
  role?: 'requester' | 'worker' | 'both';
  isVerified?: boolean;
  isCelebrity?: boolean;
  celebrityCategory?: 'Athlete' | 'Artist' | 'Model' | 'SoccerPlayer' | 'Other';
  club?: string;
  // Financial & Contact info
  phone?: string;
  pixKey?: string;
  password?: string;
  warnings?: number;
  hasBiometrics?: boolean;
  canOfferServices?: boolean;
  canAcceptOffers?: boolean;
  hasRated?: boolean;
  subscriptionDate?: string;
  subscriptionEndDate?: string;
  isAdmin?: boolean;
  isMaster?: boolean;
  isSample?: boolean;
}

export interface Review {
  id: string;
  rating: number; // 1 to 5
  recommend: boolean;
  comment?: string;
  timestamp: string;
}

export interface GigRequest {
  id: string;
  type: ListingType; // 'request' means I want this, 'offer' means I do this
  author: User;
  title: string;
  description: string;
  category: Category;
  budget: number; // Pandora Coins
  location: string;
  deadline?: string; // Optional for offers
  createdAt: string;
  tags: string[];
  status: GigStatus;
  candidates: User[]; // Users interested in this gig
  hiredUserId?: string; // ID of the user hired for this gig
  denialReason?: string; // Motivo da recusa
  review?: Review;
  images?: string[];
  experienceLevel?: string;
  urgency?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  attachment?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface ChatSession {
  id: string;
  gigId?: string; // Optional link to specific gig
  participant: User;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

export type TicketType = 'complaint' | 'opinion' | 'idea';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  type: TicketType;
  content: string;
  status: 'pending' | 'reviewed';
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number; // Value in BRL
  coins: number; // Value in PND
  type: 'deposit' | 'escrow' | 'payment' | 'withdrawal';
  status: 'pending' | 'approved' | 'rejected';
  gigId?: string;
  pixCode?: string;
  timestamp: string;
  description?: string;
}
