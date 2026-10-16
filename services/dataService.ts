
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, MOCK_REQUESTS, MOCK_CHATS, MOCK_USERS_LIST, MOCK_USER } from '../constants';
import { GigRequest, User, ChatSession, Message, SupportTicket, Transaction, ListingType, SystemSettings } from '../types';
import { encryptData, decryptData } from './encryption';

// --- SUPABASE CLIENT SETUP ---
// Only initialize if keys are present and URL is valid
const isValidUrl = (url: string) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  } catch (e) {
    return false;
  }
};

const supabase = (isValidUrl(SUPABASE_URL) && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

const isProduction = !!supabase;

// Helper to handle localStorage with encryption
const storage = {
   get: (key: string) => {
      const val = localStorage.getItem(key);
      if (!val) return null;
      return decryptData(val);
   },
   set: (key: string, data: any) => {
      localStorage.setItem(key, encryptData(data));
   }
};

// --- DATA SERVICE (FACADE PATTERN) ---
// This service abstracts the data source. 
// If Supabase is configured, it uses it. Otherwise, it uses LocalStorage.

const MOCK_REQUESTS_ENHANCED = MOCK_REQUESTS.map(r => ({
  ...r,
  author: { ...r.author, isSample: true }
}));

const MOCK_USERS_LIST_ENHANCED = MOCK_USERS_LIST.map(u => ({
  ...u,
  isSample: u.id !== 'u_user_alex'
}));

const DEFAULT_SETTINGS: SystemSettings = {
  commissionRate: 35,
  requesterFee: 5.0,
  workerFee: 2.0,
  bothFee: 19.99,
  bothPromotionalFee: 3.99,
  celebrityFee: 50.0,
  promotionalUserLimit: 1000,
  platformPixKey: '21992607732'
};

export const api = {
  
  // --- AUTH (SUPABASE) ---
  auth: {
    signUp: async (email: string, password: string, userData: Partial<User>) => {
      if (!isProduction) {
        // Mock signup
        const newUser: User = {
          id: `u_${Date.now()}`,
          email,
          name: userData.name || 'New User',
          password: encryptData(password),
          walletBalance: 0,
          rating: 0,
          isVerified: false,
          status: 'active',
          ...userData
        } as User;
        const users = storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
        users.push(newUser);
        storage.set('pandora_users', users);
        storage.set('pandora_current_user', newUser);
        return { user: newUser, error: null };
      }
      
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (data.user) {
        // Sync user to our 'users' table
        const newUser: User = {
          id: data.user.id,
          email: data.user.email!,
          name: userData.name || 'User',
          walletBalance: 0,
          rating: 0,
          isVerified: false,
          status: 'active',
          ...userData
        } as User;
        await supabase!.from('users').upsert(newUser);
        return { user: newUser, error: null };
      }
      
      return { user: null, error };
    },

    signIn: async (emailOrCpf: string, password: string) => {
      if (!isProduction) {
        // Mock signin
        const users = storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
        const user = users.find((u: User) => {
          const decCPF = decryptData(u.cpf) || u.cpf;
          const decPass = decryptData(u.password) || u.password;
          return (u.email === emailOrCpf || decCPF === emailOrCpf || u.name.toLowerCase() === emailOrCpf.toLowerCase()) && 
                 (u.password === password || decPass === password || (!u.password && password === '123456'));
        });
        
        if (user) {
          storage.set('pandora_current_user', user);
          return { user, error: null };
        }
        return { user: null, error: { message: 'Credenciais inválidas' } };
      }

      let email = emailOrCpf;
      
      // If it looks like a CPF (numbers and dots/dashes) or not like an email
      if (!emailOrCpf.includes('@')) {
        // Try to find user by CPF
        const { data: users } = await supabase!.from('users').select('email, id').or(`cpf.eq.${emailOrCpf},name.ilike.${emailOrCpf}`);
        if (users && users.length > 0) {
          email = users[0].email;
        } else {
          // Maybe it's encrypted in the DB? That's harder to query.
          // For now, let's assume it matches if they used it in signup
          // If we can't find it, we just try the emailOrCpf as email and it will fail anyway.
        }
      }

      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password
      });

      if (data.user) {
        const { data: userData } = await supabase!.from('users').select('*').eq('id', data.user.id).single();
        return { user: userData, error: null };
      }

      return { user: null, error };
    },

    signOut: async () => {
      if (isProduction) {
        await supabase!.auth.signOut();
      }
      localStorage.removeItem('pandora_current_user');
    }
  },

  // --- USERS ---
  users: {
    get: async (id: string): Promise<User | null> => {
       if (isProduction) {
          const { data } = await supabase!.from('users').select('*').eq('id', id).single();
          return data;
       } else {
          // LocalStorage fallback
          const users = storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
          return users.find((u: User) => u.id === id) || MOCK_USER; // Default to guest if not found
       }
    },
    
    create: async (user: User): Promise<void> => {
       if (isProduction) {
          await supabase!.from('users').insert(user);
       } else {
          const users = storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
          users.push(user);
          storage.set('pandora_users', users);
          // Update current user session locally
          storage.set('pandora_current_user', user);
       }
    },

    list: async (): Promise<User[]> => {
       if (isProduction) {
          const { data } = await supabase!.from('users').select('*');
          return data || [];
       } else {
          return storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
       }
    },

    update: async (user: User): Promise<void> => {
       if (isProduction) {
          await supabase!.from('users').update(user).eq('id', user.id);
       } else {
          const users = storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
          const index = users.findIndex((u: User) => u.id === user.id);
          if (index !== -1) {
             users[index] = user;
             storage.set('pandora_users', users);
             // Se for o usuário logado, atualiza a sessão local
             const current = storage.get('pandora_current_user') || {};
             if (current.id === user.id) {
                storage.set('pandora_current_user', user);
             }
          }
       }
    },
    
    delete: async (id: string): Promise<void> => {
       if (isProduction) {
          await supabase!.from('users').delete().eq('id', id);
       } else {
          const users = storage.get('pandora_users') || MOCK_USERS_LIST_ENHANCED;
          const filtered = users.filter((u: User) => u.id !== id);
          storage.set('pandora_users', filtered);
       }
    }
  },

  // --- GIGS (REQUESTS/OFFERS) ---
  gigs: {
    list: async (): Promise<GigRequest[]> => {
       if (isProduction) {
          const { data } = await supabase!.from('gigs').select('*').order('created_at', { ascending: false });
          return data || [];
       } else {
          return storage.get('pandora_requests') || MOCK_REQUESTS_ENHANCED;
       }
    },

    create: async (gig: GigRequest): Promise<void> => {
       if (isProduction) {
          await supabase!.from('gigs').insert({
             ...gig,
             candidates: [], // JSONB in Supabase
             tags: gig.tags, // Array in Supabase
             created_at: new Date().toISOString()
          });
       } else {
          const gigs = storage.get('pandora_requests') || MOCK_REQUESTS_ENHANCED;
          gigs.unshift(gig);
          storage.set('pandora_requests', gigs);
       }
    },

    update: async (gig: GigRequest): Promise<void> => {
        if (isProduction) {
            await supabase!.from('gigs').update(gig).eq('id', gig.id);
        } else {
            const gigs = storage.get('pandora_requests') || [];
            const index = gigs.findIndex((g: GigRequest) => g.id === gig.id);
            if (index !== -1) {
                gigs[index] = gig;
                storage.set('pandora_requests', gigs);
            }
        }
    },

    delete: async (id: string): Promise<void> => {
        if (isProduction) {
            await supabase!.from('gigs').delete().eq('id', id);
        } else {
            const gigs = storage.get('pandora_requests') || [];
            const filtered = gigs.filter((g: GigRequest) => g.id !== id);
            storage.set('pandora_requests', filtered);
        }
    }
  },

  // --- CHATS ---
  chats: {
    list: async (userId: string): Promise<ChatSession[]> => {
        if (isProduction) {
            // Note: This is a simplified fetch. In real SQL you might join tables.
            const { data } = await supabase!.from('chats').select('*'); 
            return (data || []).filter((c: ChatSession) => c.participant.id !== userId);
        } else {
            return storage.get('pandora_chats') || MOCK_CHATS;
        }
    },

    create: async (chat: ChatSession): Promise<void> => {
        if (isProduction) {
            await supabase!.from('chats').insert(chat);
        } else {
            const chats = storage.get('pandora_chats') || MOCK_CHATS;
            chats.unshift(chat);
            storage.set('pandora_chats', chats);
        }
    },

    sendMessage: async (chatId: string, message: Message): Promise<void> => {
        if (isProduction) {
            const { data: chat } = await supabase!.from('chats').select('messages').eq('id', chatId).single();
            const newMessages = [...(chat?.messages || []), message];
            await supabase!.from('chats').update({ 
                messages: newMessages,
                last_message: message.content,
                updated_at: new Date().toISOString()
            }).eq('id', chatId);
        } else {
            const chats = storage.get('pandora_chats') || [];
            const chatIndex = chats.findIndex((c: ChatSession) => c.id === chatId);
            if (chatIndex !== -1) {
                chats[chatIndex].messages.push(message);
                chats[chatIndex].lastMessage = message.attachment ? (message.attachment.type === 'image' ? '📷 Imagem' : '🎥 Vídeo') : message.content;
                storage.set('pandora_chats', chats);
            }
        }
    }
  },

  // --- SYSTEM (Transactions/Tickets) ---
  system: {
     getTransactions: async (): Promise<Transaction[]> => {
        if (isProduction) {
             const { data } = await supabase!.from('transactions').select('*');
             return data || [];
        } else {
             return storage.get('pandora_transactions') || [];
        }
     },
     addTransaction: async (t: Transaction): Promise<void> => {
        if(isProduction) {
            await supabase!.from('transactions').insert(t);
        } else {
            const ts = storage.get('pandora_transactions') || [];
            ts.unshift(t);
            storage.set('pandora_transactions', ts);
        }
     },
     getSettings: async (): Promise<SystemSettings> => {
        if (isProduction) {
           const { data } = await supabase!.from('settings').select('*').single();
           return data || DEFAULT_SETTINGS;
        } else {
           return storage.get('pandora_settings') || DEFAULT_SETTINGS;
        }
     },
     updateSettings: async (settings: SystemSettings): Promise<void> => {
        if (isProduction) {
           await supabase!.from('settings').upsert({ id: 1, ...settings });
        } else {
           storage.set('pandora_settings', settings);
        }
     }
  }
};

