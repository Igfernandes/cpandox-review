
import { Category, GigRequest, ChatSession, GigStatus, User } from './types';

// --- CONFIGURAÇÃO DO BACKEND (SUPABASE) ---
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SUPABASE_URL = (rawUrl && rawUrl !== 'undefined') ? rawUrl : ""; 
export const SUPABASE_ANON_KEY = (rawKey && rawKey !== 'undefined') ? rawKey : "";

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Visitante',
  avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  rating: 0,
  walletBalance: 0,
  isVerified: false // User starts unverified
};

export const MOCK_USERS_LIST: User[] = [
  { id: 'u_user_alex', name: 'Alex Pinto', cpf: '03531702750', password: '2020', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', rating: 5.0, walletBalance: 1000, isVerified: true, status: 'active', email: 'AlexPinto926@gmail.com', role: 'both', isAdmin: true, isMaster: true },
  { ...MOCK_USER, password: 'password123' },
  { id: 'u_adv1', name: 'Marcos P.', avatar: 'https://picsum.photos/id/1011/100/100', rating: 4.8, walletBalance: 120, status: 'active', email: 'marcos@email.com', isVerified: true, password: 'password123' },
  { id: 'u_adv2', name: 'Julia S.', avatar: 'https://picsum.photos/id/1027/100/100', rating: 4.9, walletBalance: 0, status: 'active', email: 'julia@email.com', isVerified: true, password: 'password123' },
  { id: 'u_adr1', name: 'João Santos', avatar: 'https://picsum.photos/id/1012/100/100', rating: 4.9, walletBalance: 500, status: 'active', email: 'joao@email.com', isVerified: true, password: 'password123' },
  { id: 'u_adr2', name: 'Lucas F.', avatar: 'https://picsum.photos/id/1005/100/100', rating: 4.7, walletBalance: 50, status: 'banned', email: 'lucas@email.com', isVerified: true, password: 'password123' },
  { id: 'u_des1', name: 'Maria Silva', avatar: 'https://picsum.photos/id/234/100/100', rating: 4.8, walletBalance: 1500, status: 'active', email: 'maria@email.com', isVerified: true, password: 'password123' },
  { id: 'u_fan1', name: 'Carla Dias', avatar: 'https://picsum.photos/id/338/100/100', rating: 5.0, walletBalance: 300, status: 'active', email: 'carla@email.com', isVerified: true, password: 'password123' },
  { id: 'u_tra1', name: 'Felipe B.', avatar: 'https://picsum.photos/id/442/100/100', rating: 4.6, walletBalance: 100, status: 'active', email: 'felipe@email.com', isVerified: true, password: 'password123' },
  { id: 'u_pod1', name: 'Roberto K.', avatar: 'https://picsum.photos/id/91/100/100', rating: 4.5, walletBalance: 0, status: 'active', email: 'roberto@email.com', isVerified: true, password: 'password123' },
  { id: 'u_men1', name: 'Ana M.', avatar: 'https://picsum.photos/id/65/100/100', rating: 4.8, walletBalance: 200, status: 'active', email: 'ana@email.com', isVerified: true, password: 'password123' },
  
  // Soccer Players (10)
  { id: 'u_cel_soc1', name: 'Ronaldinho (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ronaldinho&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc2', name: 'Neymar (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neymar&mouth=smile&eyes=happy', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc3', name: 'Vini Jr (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vini&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc4', name: 'Marta (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marta&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc5', name: 'Gabigol (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabigol&mouth=smile&eyes=happy', rating: 4.7, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc6', name: 'Hulk (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hulk&mouth=smile&eyes=happy', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc7', name: 'Casemiro (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CasemiroSoc&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc8', name: 'Alisson (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alisson&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc9', name: 'Richarlison (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Richarlison&mouth=smile&eyes=happy', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },
  { id: 'u_cel_soc10', name: 'Endrick (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Endrick&mouth=smile&eyes=happy', rating: 4.7, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'SoccerPlayer', password: 'password123' },

  // Artists (10)
  { id: 'u_cel_art1', name: 'Anitta (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anitta', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art2', name: 'Ivete Sangalo (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivete', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art3', name: 'Whindersson (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whindersson', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art4', name: 'Maisa (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maisa', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art5', name: 'Casimiro (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casimiro', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art6', name: 'Luan Santana (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luan', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art7', name: 'Ludmilla (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ludmilla', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art8', name: 'Alok (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alok', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art9', name: 'Pabllo Vittar (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pabllo', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },
  { id: 'u_cel_art10', name: 'Gusttavo Lima (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gusttavo', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Artist', password: 'password123' },

  // Models (10)
  { id: 'u_cel_mod1', name: 'Gisele Bündchen (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gisele', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod2', name: 'Adriana Lima (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adriana', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod3', name: 'Alessandra Ambrósio (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alessandra', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod4', name: 'Isabeli Fontana (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabeli', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod5', name: 'Lais Ribeiro (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lais', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod6', name: 'Carol Trentini (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod7', name: 'Sasha Meneghel (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod8', name: 'Camila Queiroz (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camila', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod9', name: 'Marina Ruy Barbosa (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marina', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },
  { id: 'u_cel_mod10', name: 'Grazi Massafera (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grazi', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Model', password: 'password123' },

  // Athletes (10)
  { id: 'u_cel_ath1', name: 'Gabriel Medina (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Medina&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath2', name: 'Rayssa Leal (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayssa&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath3', name: 'Rebeca Andrade (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rebeca&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath4', name: 'Ítalo Ferreira (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Italo&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath5', name: 'Anderson Silva (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson&mouth=smile&eyes=happy', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath6', name: 'Charles do Bronx (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charles&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath7', name: 'Beatriz Haddad (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bia&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath8', name: 'Felipe Massa (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Massa&mouth=smile&eyes=happy', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath9', name: 'Marta Volei (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MartaV&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },
  { id: 'u_cel_ath10', name: 'Cesar Cielo (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cielo&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Athlete', password: 'password123' },

  // Other (10)
  { id: 'u_cel_oth1', name: 'Chef Alex Atala (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Atala', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth2', name: 'Erick Jacquin (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jacquin', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth3', name: 'Paola Carosella (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paola', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth4', name: 'Rodrigo Hilbert (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hilbert', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth5', name: 'Ana Maria Braga (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnaMaria', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth6', name: 'Luciano Huck (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huck', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth7', name: 'Faustão (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faustao', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth8', name: 'Silvio Santos (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silvio', rating: 5.0, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth9', name: 'Galvão Bueno (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Galvao', rating: 4.9, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
  { id: 'u_cel_oth10', name: 'Tiago Leifert (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leifert', rating: 4.8, walletBalance: 0, status: 'active', isVerified: true, isCelebrity: true, celebrityCategory: 'Other', password: 'password123' },
];

export const MOCK_REQUESTS: GigRequest[] = [
  {
    id: '1',
    type: 'offer',
    author: { id: 'u_rep1', name: 'Carlos R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', rating: 4.9, walletBalance: 0, isVerified: true },
    title: 'Repórter Itinerante de Pequenos Fatos',
    description: 'Sou reporter itinerante de pequenos fatos( acidentes , crimes , deslizamentos ,brigas , etc..)estou todo dia na rua rodando o rio de janeiro para gravar todos esses fatos , e vendo as reportagens por mim feitas por 700 reais .',
    category: Category.TRABALHOS_INUSITADOS,
    budget: 700,
    location: 'Rio de Janeiro, RJ',
    createdAt: 'Agora',
    tags: ['Jornalismo', 'Rio de Janeiro', 'Exclusivo'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '2',
    type: 'offer',
    author: { id: 'u_off_bz2', name: 'Sra. Lurdes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Granny', rating: 5.0, walletBalance: 0, isVerified: true },
    title: 'Avó de Aluguel (Provisória)',
    description: 'Faço bolinhos de chuva, ouço suas reclamações sobre a vida, digo que você emagreceu (mesmo que não tenha) e tricotar enquanto você chora. Sem julgamentos.',
    category: Category.TRABALHOS_INUSITADOS,
    budget: 80,
    location: 'Belo Horizonte, MG',
    createdAt: '25min atrás',
    tags: ['Conforto', 'Culinária', 'Afeto'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '3',
    type: 'request',
    author: { id: 'u_req_bz3', name: 'Pedro H.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter', rating: 4.7, walletBalance: 0, isVerified: true },
    title: 'Vilão para Perder Luta',
    description: 'É aniversário do meu filho de 5 anos. Preciso de alguém vestido de Darth Vader ou Vilão Genérico para lutar com ele (sabre de espuma) e PERDER de forma humilhante e dramática na frente dos amigos dele.',
    category: Category.PEDIDOS_EVENTOS,
    budget: 250,
    location: 'Rio de Janeiro, RJ',
    createdAt: '40min atrás',
    tags: ['Atuação', 'Crianças', 'Cosplay'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '4',
    type: 'offer',
    author: { id: 'u_off_bz4', name: 'César "O Término"', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cesar', rating: 4.8, walletBalance: 0, isVerified: true },
    title: 'Termino seu Namoro por Você',
    description: 'Sem coragem? Eu resolvo. Termino namoros por WhatsApp, carta, vídeo ou presencialmente. Tenho pacotes: "Suave", "Honesto" e "Terra Arrasada". Devolvo as roupas também.',
    category: Category.PEDIDOS_TERCEIROS,
    budget: 120,
    location: 'Curitiba, PR',
    createdAt: '1h atrás',
    tags: ['Relacionamento', 'Mensageiro', 'Coragem'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '5',
    type: 'request',
    author: { id: 'u_req_bz5', name: 'Juliana Fitness', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juju', rating: 4.6, walletBalance: 0, isVerified: true },
    title: 'Gritador Motivacional para Faxina',
    description: 'Preciso de alguém para ficar na minha sala gritando frases motivacionais tipo "VAI GUERREIRA", "ESFREGA ESSE CHÃO COMO SE FOSSE A CARA DO EX" enquanto eu limpo a casa.',
    category: Category.PEDIDOS_PESSOAIS,
    budget: 90,
    location: 'Porto Alegre, RS',
    createdAt: '2h atrás',
    tags: ['Fitness', 'Limpeza', 'Coach'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '6',
    type: 'offer',
    author: { id: 'u_off_bz6', name: 'Morgan F.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan', rating: 5.0, walletBalance: 0, isVerified: true },
    title: 'Narrador da Vida Real',
    description: 'Caminho 2 metros atrás de você narrando suas ações cotidianas com voz de trailer de cinema. "Ele foi comprar pão, mas mal sabia que o pão estava... quente."',
    category: Category.TRABALHOS_INUSITADOS,
    budget: 200,
    location: 'São Paulo, SP',
    createdAt: '3h atrás',
    tags: ['Voz', 'Cinema', 'Ego'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '7',
    type: 'offer',
    author: { id: 'u_off_bz8', name: 'Sombra Discreta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja', rating: 4.9, walletBalance: 0, isVerified: true },
    title: 'Guarda-Costas de Mentira',
    description: 'Finjo ser seu segurança particular. Uso terno, óculos escuros, falo no rádio imaginário e empurro pessoas para abrir caminho para você na balada ou shopping.',
    category: Category.PEDIDOS_PESSOAIS,
    budget: 180,
    location: 'Salvador, BA',
    createdAt: '5h atrás',
    tags: ['Status', 'Segurança', 'Atuação'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '8',
    type: 'request',
    author: { id: 'u_req_bz10', name: 'Beto Gamer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gamer', rating: 4.7, walletBalance: 0, isVerified: true },
    title: 'Segurador de Fila',
    description: 'Vai lançar o novo console amanhã. Preciso de alguém para ficar na fila da loja das 20h de hoje até as 8h de amanhã. Levo café.',
    category: Category.PEDIDOS_TERCEIROS,
    budget: 350,
    location: 'São Paulo, SP',
    createdAt: '8h atrás',
    tags: ['Paciência', 'Serviço', 'Madrugada'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '9',
    type: 'offer',
    author: { id: 'u_off_bz11', name: 'Lúcia Mística', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Witch', rating: 5.0, walletBalance: 0, isVerified: true },
    title: 'Tradutora de Miados',
    description: 'Vou até sua casa, observo seu gato por 1 hora e entrego um relatório traduzido do que ele pensa sobre sua decoração e suas escolhas de vida.',
    category: Category.TRABALHOS_INUSITADOS,
    budget: 100,
    location: 'Florianópolis, SC',
    createdAt: '10h atrás',
    tags: ['Pets', 'Místico', 'Humor'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '10',
    type: 'request',
    author: { id: 'u_req_bz12', name: 'Ricardo Tímido', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shy', rating: 4.4, walletBalance: 0, isVerified: true },
    title: 'Plateia para Piadas Ruins',
    description: 'Vou num primeiro encontro e estou nervoso. Preciso de alguém na mesa ao lado para rir alto de todas as minhas piadas, para eu parecer engraçado.',
    category: Category.PEDIDOS_PESSOAIS,
    budget: 150,
    location: 'Rio de Janeiro, RJ',
    createdAt: '12h atrás',
    tags: ['Wingman', 'Encontro', 'Riso'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '11',
    type: 'request',
    author: { id: 'u_req_bz13', name: 'Fernanda L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda', rating: 4.8, walletBalance: 0, isVerified: true },
    title: 'Brasileiro(a) nos Alpes Suíços para Vídeo Chamada',
    description: 'Quero uma pessoa brasileira nos Alpes Suíços que esquie e por vídeo chamada me fale exclusivamente o quanto é maravilhoso a sensaçao de esta naquele lugar aproveitando os extremos da natureza em um anbiente gelido e ao mesmo tempo agradavel e fantastico',
    category: Category.PEDIDOS_PESSOAIS,
    budget: 500,
    location: 'Alpes Suíços (Remoto)',
    createdAt: 'Agora',
    tags: ['Viagem', 'Vídeo', 'Suíça'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '12',
    type: 'offer',
    author: { id: 'u_cel1', name: 'Atleta Lendário (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ronaldinho&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Parabéns Especial por Vídeo (com um famoso)',
    description: 'Mando um vídeo personalizado de aniversário com muita energia e um recado motivacional exclusivo para você ou alguém querido!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 2500,
    location: 'Remoto (Digital)',
    createdAt: '1h atrás',
    tags: ['Esporte', 'Vídeo', 'Motivação'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '13',
    type: 'request',
    author: { id: 'u_adr1', name: 'João Santos', avatar: 'https://picsum.photos/id/1012/100/100', rating: 4.9, walletBalance: 500, isVerified: true },
    title: 'Cantor Famoso para Parabéns de 6 Anos (com um famoso)',
    description: 'Procuro um cantor famoso (atual ou do passado) que possa fazer uma videochamada de 5 minutos para cantar "Parabéns pra Você" e uma música autoral para minha filha que faz 6 anos hoje.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 15000,
    location: 'Remoto (Videochamada)',
    createdAt: '2h atrás',
    tags: ['Música', 'Aniversário', 'Criança'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '14',
    type: 'offer',
    author: { id: 'u_cel4', name: 'Craque de Futebol (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neymar&mouth=smile&eyes=happy', rating: 4.8, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Partida de Game Online (com um famoso)',
    description: 'Bora jogar uma partida online comigo! Vamos trocar uma ideia no chat enquanto jogamos seu game favorito.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 15000,
    location: 'Remoto (Online)',
    createdAt: '3h atrás',
    tags: ['Games', 'Diversão', 'Exclusivo'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '15',
    type: 'request',
    author: { id: 'u_adr1', name: 'João Santos', avatar: 'https://picsum.photos/id/1012/100/100', rating: 4.9, walletBalance: 500, isVerified: true },
    title: 'Ator de Novela para Papo de Noveleiro (com um famoso)',
    description: 'Sou viciado em novelas! Quero um ator de novela atual para uma videochamada de 1 minuto apenas para me dar um "oi" e contar um segredo de bastidor.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 3000,
    location: 'Remoto (Videochamada)',
    createdAt: '4h atrás',
    tags: ['Novela', 'Fã', 'Bastidores'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '16',
    type: 'offer',
    author: { id: 'u_cel6', name: 'Comediante (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whindersson', rating: 4.9, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Show de Stand-up Virtual Privado (com um famoso)',
    description: 'Faço um show de 20 minutos exclusivo via videochamada para sua festa ou reunião de amigos. Piadas personalizadas incluídas!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 35000,
    location: 'Remoto (Videochamada)',
    createdAt: '5h atrás',
    tags: ['Humor', 'Show', 'Virtual'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '17',
    type: 'request',
    author: { id: 'u_des1', name: 'Maria Silva', avatar: 'https://picsum.photos/id/234/100/100', rating: 4.8, walletBalance: 1500, isVerified: true },
    title: 'Atleta Maratonista Motivacional (com um famoso)',
    description: 'Preciso de um maratonista famoso para uma videochamada enquanto ele corre! Quero dicas de treino e motivação real enquanto ele está em ação.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 8000,
    location: 'Remoto (Videochamada)',
    createdAt: '6h atrás',
    tags: ['Corrida', 'Motivação', 'Saúde'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '18',
    type: 'offer',
    author: { id: 'u_cel8', name: 'Streamer (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casimiro', rating: 5.0, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'React de Vídeo Pessoal (com um famoso)',
    description: 'Meteu essa? Eu faço um react exclusivo do seu vídeo (casamento, festa, gol) e te mando a gravação com meus comentários.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 10000,
    location: 'Remoto (Digital)',
    createdAt: '7h atrás',
    tags: ['React', 'Humor', 'Entretenimento'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '19',
    type: 'request',
    author: { id: 'u_fan1', name: 'Carla Dias', avatar: 'https://picsum.photos/id/338/100/100', rating: 5.0, walletBalance: 300, isVerified: true },
    title: 'Aula de Culinária Express (com um famoso)',
    description: 'Quero um chef famoso para me ensinar a fazer um prato rápido em 15 minutos via videochamada. Preciso impressionar em um jantar!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 12000,
    location: 'Remoto (Videochamada)',
    createdAt: '8h atrás',
    tags: ['Culinária', 'Chef', 'Prático'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '20',
    type: 'offer',
    author: { id: 'u_cel7', name: 'Apresentadora (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maisa', rating: 4.9, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Mentoria para Redes Sociais (com um famoso)',
    description: 'Vou te dar dicas reais de como crescer seu perfil e engajar seu público. 30 minutos de mentoria direta via vídeo.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 5000,
    location: 'Remoto (Videochamada)',
    createdAt: '9h atrás',
    tags: ['Mentoria', 'Social Media', 'Carreira'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '21',
    type: 'request',
    author: { id: 'u_adr2', name: 'Lucas F.', avatar: 'https://picsum.photos/id/1005/100/100', rating: 4.7, walletBalance: 50, isVerified: true },
    title: 'Dicas de Pose para Fotos (com um famoso)',
    description: 'Quero uma modelo famosa para me dar dicas de como posar melhor para meu ensaio fotográfico via videochamada.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 15000,
    location: 'Remoto (Videochamada)',
    createdAt: '10h atrás',
    tags: ['Moda', 'Fotos', 'Estilo'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '22',
    type: 'offer',
    author: { id: 'u_cel9', name: 'Ator de Novela (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Actor', rating: 4.8, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Mensagem de Bom Dia Estilo Novela (com um famoso)',
    description: 'Mando um vídeo de bom dia interpretando um personagem ou sendo eu mesmo para animar o dia de alguém especial!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 2000,
    location: 'Remoto (Digital)',
    createdAt: '11h atrás',
    tags: ['Atuação', 'Vídeo', 'Carinho'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '23',
    type: 'request',
    author: { id: 'u_adv2', name: 'Julia S.', avatar: 'https://picsum.photos/id/1027/100/100', rating: 4.9, walletBalance: 0, isVerified: true },
    title: 'Pocket Show Virtual de Aniversário (com um famoso)',
    description: 'Quero contratar um cantor famoso para um pocket show de 15 minutos via videochamada na minha festa online.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 80000,
    location: 'Remoto (Videochamada)',
    createdAt: '12h atrás',
    tags: ['Música', 'Festa', 'Virtual'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '24',
    type: 'offer',
    author: { id: 'u_cel5', name: 'Diva da Música (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivete', rating: 5.0, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Convidada VIP Virtual (com um famoso)',
    description: 'Participo da sua live ou festa virtual por 30 min. Posso cantar, bater papo ou mandar beijos para os convidados!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 100000,
    location: 'Remoto (Videochamada)',
    createdAt: 'Agora',
    tags: ['Festa', 'VIP', 'Música'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '25',
    type: 'offer',
    author: { id: 'u_adv1', name: 'Marcos P.', avatar: 'https://picsum.photos/id/1011/100/100', rating: 4.8, walletBalance: 120, isVerified: true },
    title: 'Explorador de Morros e Montanhas',
    description: 'Subo morros e montanhas descrevendo a emoção e desafios exclusivamente para você. Combinamos qual morro local tenho disponível.',
    category: Category.TRABALHOS_INUSITADOS,
    budget: 350,
    location: 'Rio de Janeiro, RJ',
    createdAt: 'Agora',
    tags: ['Aventura', 'Natureza', 'Exclusivo'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '26',
    type: 'offer',
    author: { id: 'u_cel_ath2', name: 'Rayssa Leal (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rayssa&mouth=smile&eyes=happy', rating: 5.0, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Dicas de Skate e Manobras (com um famoso)',
    description: 'Vou te ensinar o básico do skate ou dar dicas para aquela manobra que você não consegue acertar!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 15000,
    location: 'Remoto (Videochamada)',
    createdAt: '2h atrás',
    tags: ['Skate', 'Esporte', 'Dicas'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '27',
    type: 'offer',
    author: { id: 'u_cel_oth2', name: 'Erick Jacquin (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jacquin', rating: 4.9, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Crítica de Prato "Tompero" (com um famoso)',
    description: 'Mande um vídeo cozinhando e eu vou avaliar seu "tompero" e sua técnica com meu estilo único!',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 25000,
    location: 'Remoto (Digital)',
    createdAt: '3h atrás',
    tags: ['Culinária', 'Humor', 'Chef'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '28',
    type: 'offer',
    author: { id: 'u_cel_mod3', name: 'Alessandra Ambrósio (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alessandra', rating: 4.9, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Segredos de Beleza e Skincare (com um famoso)',
    description: 'Vou compartilhar minha rotina de cuidados e segredos para manter a pele sempre radiante.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 45000,
    location: 'Remoto (Videochamada)',
    createdAt: '4h atrás',
    tags: ['Beleza', 'Skincare', 'Moda'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '29',
    type: 'offer',
    author: { id: 'u_cel_art8', name: 'Alok (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alok', rating: 5.0, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Dicas de Produção Musical e DJ (com um famoso)',
    description: 'Vamos falar sobre batidas, mixagem e como começar sua carreira na música eletrônica.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 60000,
    location: 'Remoto (Estúdio)',
    createdAt: '5h atrás',
    tags: ['Música', 'DJ', 'Produção'],
    status: GigStatus.OPEN,
    candidates: []
  },
  {
    id: '30',
    type: 'offer',
    author: { id: 'u_cel_soc3', name: 'Vini Jr (Famoso)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vini&mouth=smile&eyes=happy', rating: 4.9, walletBalance: 0, isVerified: true, isCelebrity: true },
    title: 'Bate-papo sobre Futebol e Resenha (com um famoso)',
    description: 'Vamos trocar uma ideia sobre os bastidores do futebol europeu e da seleção brasileira.',
    category: Category.SERVICOS_CELEBRIDADES,
    budget: 80000,
    location: 'Remoto (Videochamada)',
    createdAt: '6h atrás',
    tags: ['Futebol', 'Resenha', 'Exclusivo'],
    status: GigStatus.OPEN,
    candidates: []
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    participant: { id: 'u_off_bz4', name: 'César "O Término"', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cesar', rating: 4.8, walletBalance: 0, isVerified: true },
    lastMessage: 'Já entreguei a carta de término. Ele chorou um pouco, mas devolvi o moletom.',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'u_off_bz4', content: 'Olá, sou o César. Vi que precisa terminar o namoro.', timestamp: '10:00', isMe: false },
      { id: 'm2', senderId: 'u1', content: 'Oi César! Sim, não tenho coragem. Você pode ir lá hoje?', timestamp: '10:05', isMe: true },
      { id: 'm3', senderId: 'u_off_bz4', content: 'Já entreguei a carta de término. Ele chorou um pouco, mas devolvi o moletom.', timestamp: '14:30', isMe: false }
    ]
  }
];

export const APP_SUMMARY = {
  title: "C.PANDOX: O Marketplace do Inusitado",
  description: "C.PANDOX é uma plataforma revolucionária onde o impossível se torna um serviço. Conectamos pessoas com necessidades únicas a indivíduos dispostos a realizar as tarefas mais inuzitadas, criativas e exclusivas do mundo.",
  features: [
    {
      title: "Trabalhos Inusitados",
      description: "De figurantes de velório a narradores da vida real, encontre talentos que você nem sabia que existiam."
    },
    {
      title: "Serviços de Celebridades (do presente ou do passado)",
      description: "Contrate famosos para vídeos personalizados, videochamadas ou até partidas de games online."
    },
    {
      title: "Cofre Pandox",
      description: "Segurança total em suas transações. O pagamento só é liberado quando o serviço é concluído e aprovado."
    },
    {
      title: "Privacidade & Segurança",
      description: "Chat criptografado e sistema de verificação biométrica para garantir a integridade de todos os usuários."
    }
  ],
  stats: "Milhares de conexões inusitadas realizadas todos os meses em todo o Brasil."
};
