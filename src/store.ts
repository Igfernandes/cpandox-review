import { create } from 'zustand';
import { 
  GigRequest, 
  ChatSession, 
  User, 
  Transaction, 
  SupportTicket, 
  SystemSettings 
} from '../types';

interface AppState {
  currentUser: User | null;
  requests: GigRequest[];
  chats: ChatSession[];
  transactions: Transaction[];
  allUsers: User[];
  supportTickets: SupportTicket[];
  systemSettings: SystemSettings | null;
  systemLogs: {
    time: string;
    action: string;
    type: "info" | "warning" | "error" | "success";
  }[];
  appRevenue: number;
  isLoading: boolean;
  transferConsoleLogs: string[];

  // Actions
  setCurrentUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  setRequests: (requests: GigRequest[] | ((prev: GigRequest[]) => GigRequest[])) => void;
  setChats: (chats: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => void;
  setTransactions: (transactions: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  setAllUsers: (users: User[] | ((prev: User[]) => User[])) => void;
  setSupportTickets: (tickets: SupportTicket[] | ((prev: SupportTicket[]) => SupportTicket[])) => void;
  setSystemSettings: (settings: SystemSettings | ((prev: SystemSettings | null) => SystemSettings)) => void;
  addLog: (action: string, type: "info" | "warning" | "error" | "success") => void;
  setAppRevenue: (updater: number | ((prev: number) => number)) => void;
  setIsLoading: (loading: boolean) => void;
  setTransferConsoleLogs: (logs: string[] | ((prev: string[]) => string[])) => void;
  setSystemLogs: (logs: {time: string, action: string, type: "info" | "warning" | "error" | "success"}[] | ((prev: {time: string, action: string, type: "info" | "warning" | "error" | "success"}[]) => {time: string, action: string, type: "info" | "warning" | "error" | "success"}[])) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  requests: [],
  chats: [],
  transactions: [],
  allUsers: [],
  supportTickets: [],
  systemSettings: null,
  systemLogs: [],
  appRevenue: 0,
  isLoading: true,
  transferConsoleLogs: [],

  setCurrentUser: (user) => set((state) => ({ 
    currentUser: typeof user === 'function' ? user(state.currentUser) : user 
  })),
  setRequests: (requests) => set((state) => ({ 
    requests: typeof requests === 'function' ? requests(state.requests) : requests 
  })),
  setChats: (chats) => set((state) => ({ 
    chats: typeof chats === 'function' ? chats(state.chats) : chats 
  })),
  setTransactions: (transactions) => set((state) => ({ 
    transactions: typeof transactions === 'function' ? transactions(state.transactions) : transactions 
  })),
  setAllUsers: (users) => set((state) => ({ 
    allUsers: typeof users === 'function' ? users(state.allUsers) : users 
  })),
  setSupportTickets: (tickets) => set((state) => ({ 
    supportTickets: typeof tickets === 'function' ? tickets(state.supportTickets) : tickets 
  })),
  setSystemSettings: (settings) => set((state) => ({ 
    systemSettings: typeof settings === 'function' ? settings(state.systemSettings) : settings 
  })),
  addLog: (action, type) => set((state) => ({
    systemLogs: [{
      time: new Date().toLocaleTimeString(),
      action,
      type
    }, ...state.systemLogs].slice(0, 100)
  })),
  setAppRevenue: (updater) => set((state) => ({
    appRevenue: typeof updater === 'function' ? updater(state.appRevenue) : updater
  })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setTransferConsoleLogs: (logs) => set((state) => ({
    transferConsoleLogs: typeof logs === 'function' ? logs(state.transferConsoleLogs) : logs
  })),
  setSystemLogs: (logs) => set((state) => ({
    systemLogs: typeof logs === 'function' ? logs(state.systemLogs) : logs
  })),
}));
