import React, { useState, useEffect, useRef } from "react";
import {
  GigRequest,
  ChatSession,
  Category,
  GigStatus,
  ListingType,
  Message,
  User as UserType,
  SupportTicket,
  TicketType,
  Transaction,
  SystemSettings,
} from "./types";
import {
  MOCK_REQUESTS,
  MOCK_CHATS,
  MOCK_USER,
  MOCK_USERS_LIST,
  APP_SUMMARY,
  SUPABASE_URL,
} from "./constants";
import { api } from "./services/dataService";
import { encryptData, decryptData } from "./services/encryption";
import { translations } from "./src/translations";
import Header from "./components/Header";
import GigCard from "./components/GigCard";
import CreateGigForm from "./components/CreateGigForm";
import SignupForm from "./components/SignupForm";
import CelebritySignupForm from "./components/CelebritySignupForm";
import ChatInterface from "./components/ChatInterface";
import BottomNav from "./components/BottomNav";
import ProfileView from "./components/ProfileView";
import LoginForm from "./components/LoginForm";
import {
  Search,
  Sparkles,
  HelpCircle,
  Gem,
  ShieldCheck,
  Lock,
  Wallet,
  X,
  QrCode,
  Copy,
  Loader2,
  Hand,
  Briefcase,
  ArrowRight,
  Building2,
  TrendingUp,
  ArrowUpRight,
  Banknote,
  Grid2X2,
  Check,
  Music2,
  KeyRound,
  Users,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  BarChart3,
  Trash2,
  Ban,
  LogOut,
  Terminal,
  Activity,
  Settings,
  Power,
  Siren,
  FileText,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Target,
  User,
  Calendar,
  MapPin,
  Clock,
  Star,
  MessageSquare,
  Share2,
  RefreshCw,
  Lightbulb,
  Pencil,
  Plus,
  Save,
  Info,
  Link,
  DollarSign,
  ArrowDownLeft,
  Compass,
  Headset,
  Megaphone,
  Inbox,
  Scale,
  Smartphone,
  Send,
  MessageCircle,
  AlertOctagon,
  FileCheck,
  EyeIcon,
  Code2,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  CheckCircle,
  Cpu,
  ShieldAlert,
  Bell,
  Database,
  Zap,
  Percent,
  Unlock,
} from "lucide-react";

// --- DATA: INSPIRATION LIST (Initial Data) ---
const INITIAL_INSPIRATION_IDEAS = [
  "Sou perito em fingir de morto na rua",
  "Sou eclético, realizo várias funções",
  "Quero alguém vestido de rato de rua para o aniversário do meu pai (65 anos) que não gosta de banho",
  "Quero alguém para terminar meu namoro por vídeo chamada por mim",
  "Sou Personal de piadas",
  "Sou Massagista de cachorro",
  "Ensino a reconhecer constelações",
  "Ensino a jogar damas",
  "Alugo meu tempo para jogar xadrez",
  "Ensino a quem quiser andar de bicicleta",
  "Faço caretas pra te divertir",
  "Faço companhia por vídeo chamada ou ao vivo",
  "Leio livro por vídeo chamada para você dormir",
  "Conto piadas por vídeo chamada",
  "Te elogio na rua para levantar sua auto estima (linda, maravilhosa, etc)",
  "Lavo carro a domicílio",
  "Sou perito em fingir de cego para qualquer situação",
  "Sou especialista em ouvir desabafos pessoalmente ou vídeo chamada",
  "Sou psicólogo de cachorro",
  "Faço limpeza de gaiolas a domicílio",
  "Conserto bicicleta a domicílio",
  "Ensino a pular corda",
  "Finjo ser robô humano em qualquer lugar",
  "Pego bola que você joga e trago de volta",
  "Quero uma pessoa brasileira nos Alpes Suíços que esquie e por vídeo chamada me fale exclusivamente o quanto é maravilhoso a sensaçao de esta naquele lugar aproveitando os extremos da natureza em um anbiente gelido e ao mesmo tempo agradavel e fantastico",
  "Explorador de morros, subo morros e montanhas descrevendo a emoção e desafios exclusivamente pra você cobro 350 reais e combinamos qual morro local tenho disponível",
  "Quero uma pessoa no alto do Pão de Açúcar, no Rio de Janeiro, me mostrando a vista da cidade e contando como é subir de bondinho, em uma videochamada exclusiva e interativa.",
  "Quero alguém fazendo trilha nas cachoeiras da Chapada Diamantina (BA), me mostrando cada piscina natural e a paisagem, como se fosse um tour guiado ao vivo, só para mim.",
  "Quero uma pessoa no São João de Campina Grande ou Caruaru, me mostrando a decoração, as quadrilhas e a comida típica, em uma videochamada que me faça sentir a emoção da festa junina.",
  "Quero alguém em Ouro Preto (MG) caminhando pelas ruas de pedra e me mostrando igrejas e casarões históricos, como se eu estivesse fazendo um passeio exclusivo com um guia local.",
  "Quero uma pessoa no Cristo Redentor, no Rio, me explicando a vista, a história do monumento e a sensação de estar ali, interagindo comigo para escolher para onde olhar.",
  "Quero alguém nos Lençóis Maranhenses me mostrando as dunas e lagoas, caminhando comigo em tempo real, como se fosse um passeio exclusivo em um cenário único do Brasil.",
  "Quero uma pessoa me levando pelas ruas de um bairro cultural brasileiro, como o Beco do Batman em São Paulo ou o Pelourinho em Salvador, mostrando murais, sons e histórias, em uma videochamada exclusiva e interativa.",
  "Quero alguém me ajudando a escolher o que vestir para um encontro, me mostrando combinações em frente ao espelho em uma videochamada rápida.",
  "Quero uma pessoa fazendo compras no supermercado por mim, me mostrando os preços e produtos e me ajudando a decidir o que levar.",
  "Quero alguém cozinhando um prato simples na minha casa (por videochamada) e me explicando passo a passo, como se fosse um mini aula de cozinha.",
  "Quero alguém me ajudando a organizar meu quarto em uma videochamada, sugerindo o que guardar, jogar fora ou doar.",
  "Quero alguém me ensinando a fazer uma boa selfie, mostrando enquadramento, luz e ângulo, em uma chamada rápida.",
  "Quero alguém me ajudando a estudar para uma prova, fazendo um resumo rápido e me explicando os pontos mais difíceis em uma videochamada exclusiva.",
  "Quero alguém me dando dicas de como se comportar em uma entrevista de emprego, me orientando sobre linguagem corporal e como responder perguntas.",
  "Quero alguém me ajudando a escolher um presente de aniversário para alguém, me mostrando ideias e me ajudando a decidir o que comprar.",
  "Quero alguém me acompanhando por videochamada enquanto faço uma caminhada rápida, para me motivar e conversar um pouco.",
  "Quero alguém me ajudando a escrever uma mensagem importante, como um pedido de desculpas ou um recado sério, e me orientando sobre o tom ideal.",
];

const DashboardMetric = ({ label, value, change, icon }: any) => (
  <div className="bg-[#09090b] border border-white/5 p-5 rounded-sm relative overflow-hidden group hover:border-pandora-primary/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/5 rounded-md text-gray-400 group-hover:text-pandora-primary group-hover:bg-pandora-primary/10 transition-colors">
        {icon}
      </div>
      {change && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${change.startsWith("+") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          {change}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-mono font-bold text-white tracking-tight">
      {value}
    </h3>
    <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-bold">
      {label}
    </p>
    <div className="absolute bottom-0 left-0 h-0.5 bg-pandora-primary w-0 group-hover:w-full transition-all duration-700"></div>
  </div>
);

const RenderRevenueChart = () => {
  const points = [10, 25, 18, 40, 35, 60, 50, 85, 70, 95];
  const max = 100;
  const width = 100;
  const height = 50;

  const polylinePoints = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (p / max) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full h-full min-h-[150px] relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,${height} ${polylinePoints} L ${width},${height} Z`}
          fill="url(#chartGradient)"
        />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-[0_0_5px_rgba(139,92,246,0.5)]"
        />
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * width;
          const y = height - (p / max) * height;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill="white"
              className="animate-pulse"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 border-t border-b border-white/5 flex flex-col justify-between pointer-events-none">
        <div className="border-b border-white/5 border-dashed h-1/4 w-full"></div>
        <div className="border-b border-white/5 border-dashed h-1/4 w-full"></div>
        <div className="border-b border-white/5 border-dashed h-1/4 w-full"></div>
      </div>
    </div>
  );
};

const AdminNavLink = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-bold uppercase tracking-wider ${
      active
        ? "bg-pandora-primary text-white shadow-lg shadow-purple-900/20"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    <span className="hidden md:inline">{label}</span>
  </button>
);

interface Inspiration {
  id: string;
  text: string;
}

import { useStore } from "./src/store";

const App = () => {
  const {
    currentUser,
    setCurrentUser,
    requests,
    setRequests,
    chats,
    setChats,
    transactions,
    setTransactions,
    allUsers,
    setAllUsers,
    supportTickets,
    setSupportTickets,
    systemSettings,
    setSystemSettings,
    systemLogs,
    setSystemLogs,
    addLog,
    appRevenue,
    setAppRevenue,
    isLoading,
    setIsLoading,
    transferConsoleLogs,
    setTransferConsoleLogs
  } = useStore();

  const [view, setView] = useState("home");
  const [draftDescription, setDraftDescription] = useState("");
  const [createFormInitialType, setCreateFormInitialType] =
    useState<ListingType>("request");
  const [language, setLanguage] = useState(
    () => localStorage.getItem("pandora_lang") || "pt",
  );

  const T = translations[language] || translations["pt"];

  useEffect(() => {
    localStorage.setItem("pandora_lang", language);
  }, [language]);

  // PERSISTENCE LOGIC
  const [inspirationList, setInspirationList] = useState<Inspiration[]>(() => {
    try {
      const saved = localStorage.getItem("pandora_inspirations");
      let currentList: Inspiration[] = [];

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && typeof parsed[0] === "string") {
          currentList = parsed.map((text: string) => ({
            id: Math.random().toString(36).substr(2, 9),
            text,
          }));
        } else {
          currentList = parsed;
        }
      } else {
        currentList = INITIAL_INSPIRATION_IDEAS.map((text) => ({
          id: Math.random().toString(36).substr(2, 9),
          text,
        }));
      }

      // SMART MERGE: Ensure all items from INITIAL_INSPIRATION_IDEAS are included
      const existingTexts = new Set(currentList.map(item => item.text));
      const missingDefaults = INITIAL_INSPIRATION_IDEAS.filter(text => !existingTexts.has(text));

      if (missingDefaults.length > 0) {
        const mergedList = [
          ...currentList,
          ...missingDefaults.map(text => ({
            id: Math.random().toString(36).substr(2, 9),
            text
          }))
        ];
        return mergedList;
      }

      return currentList;
    } catch (e) {
      return INITIAL_INSPIRATION_IDEAS.map((text) => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
      }));
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "pandora_inspirations",
      JSON.stringify(inspirationList),
    );
  }, [inspirationList]);

  // Support Ticket state
  const [supportTicketsLocal, setSupportTicketsLocal] = useState<SupportTicket[]>([]);

  // LOAD INITIAL DATA VIA SERVICE
  useEffect(() => {
    const loadData = async () => {
      // Initialize User from Storage
      if (!currentUser) {
        const saved = localStorage.getItem("pandora_current_user");
        if (saved) {
           const user = decryptData(saved);
           if (user) setCurrentUser(user);
        } else {
           setCurrentUser(MOCK_USER);
        }
      }

      try {
        const [loadedGigs, loadedChats, loadedTrans, loadedUsers, loadedSettings] =
          await Promise.all([
            api.gigs.list(),
            api.chats.list(currentUser?.id || 'guest'),
            api.system.getTransactions(),
            api.users.list(),
            api.system.getSettings(),
          ]);

        if (loadedSettings) {
          setSystemSettings(loadedSettings);
        }

        let finalUsers =
          loadedUsers.length > 0 ? loadedUsers : [...MOCK_USERS_LIST];

        // Garantir que o usuário solicitado pelo cliente tenha as permissões corretas no sistema local
        const targetCpf = "03531702750";
        let hasTarget = false;
        
        finalUsers = finalUsers.map((u) => {
          const decCPF = decryptData(u.cpf) || u.cpf;
          if (decCPF === targetCpf) {
            hasTarget = true;
            return { ...u, isAdmin: true, isMaster: true };
          }
          return u;
        });

        if (!hasTarget) {
          const newUser: UserType = {
            id: "u_user_alex",
            name: "Alex Pinto",
            cpf: targetCpf,
            password: "2020",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            rating: 5.0,
            walletBalance: 1000,
            isVerified: true,
            status: "active",
            email: "AlexPinto926@gmail.com",
            role: "both",
            isAdmin: true,
            isMaster: true,
          };
          finalUsers = [newUser, ...finalUsers];
        }

        // Sincroniza sessão do usuário atual se for o Alex para garantir que o ícone apareça imediatamente
        const currentDecStatusCPF = currentUser && currentUser.cpf ? (decryptData(currentUser.cpf) || currentUser.cpf) : '';
        if (currentDecStatusCPF === targetCpf && (!currentUser?.isAdmin || !currentUser?.isMaster)) {
          const updatedMe = finalUsers.find(u => {
            const decU = decryptData(u.cpf) || u.cpf;
            return decU === targetCpf;
          });
          if (updatedMe) {
            setCurrentUser(updatedMe);
            localStorage.setItem("pandora_current_user", encryptData(updatedMe));
          }
        }

        if (!SUPABASE_URL && !hasTarget) {
          localStorage.setItem("pandora_users", encryptData(finalUsers));
        }

        setRequests(loadedGigs);
        setChats(loadedChats);
        setTransactions(loadedTrans);
        setAllUsers(finalUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentUser?.id, setRequests, setChats, setTransactions, setAllUsers, setSystemSettings, setIsLoading, setCurrentUser]);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("pandora_theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark"; // Default to dark
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("pandora_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempInspirationText, setTempInspirationText] = useState("");

  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "Todos">(
    "Todos",
  );
  const [listingTypeFilter, setListingTypeFilter] =
    useState<ListingType>("request");
  const [gigToEdit, setGigToEdit] = useState<GigRequest | null>(null);
  const [inspirationToUse, setInspirationToUse] = useState<GigRequest | null>(null);

  // UI State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showInspirationModal, setShowInspirationModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [pendingSafetyAgreement, setPendingSafetyAgreement] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState(false);

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAppSummaryModal, setShowAppSummaryModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [releasedAmount, setReleasedAmount] = useState(0);
  const [selectedGigDetail, setSelectedGigDetail] = useState<GigRequest | null>(
    null,
  );

  // Manage Candidates Modal
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);
  const [selectedGigForCandidates, setSelectedGigForCandidates] =
    useState<GigRequest | null>(null);

  // Support Form State
  const [supportType, setSupportType] = useState<TicketType>("opinion");
  const [supportMessage, setSupportMessage] = useState("");

  // Wallet State
  const [userBalance, setUserBalance] = useState(currentUser?.walletBalance || 0);

  const [tempSystemSettings, setTempSystemSettings] = useState<SystemSettings | null>(systemSettings);

  useEffect(() => {
    setTempSystemSettings(systemSettings);
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem(
      "pandora_system_settings",
      encryptData(systemSettings),
    );
  }, [systemSettings]);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);

  // Payment Modal State (Hire)
  const [selectedGigForHire, setSelectedGigForHire] =
    useState<GigRequest | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentPixKey, setPaymentPixKey] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // New Request Payment State
  const [pendingRequestToSave, setPendingRequestToSave] = useState<GigRequest | null>(null);
  const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false);
  const [requestPaymentAmount, setRequestPaymentAmount] = useState(0);

  // Top Up Modal State (Pix)
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpStep, setTopUpStep] = useState<
    "amount" | "payment" | "processing"
  >("amount");
  const [depositAmount, setDepositAmount] = useState("");
  const [identifiedDepositAmount, setIdentifiedDepositAmount] =
    useState<number>(0);
  const [pendingGigIdForDeposit, setPendingGigIdForDeposit] = useState<
    string | null
  >(null);
  const [pendingWorkerIdForDeposit, setPendingWorkerIdForDeposit] = useState<
    string | null
  >(null);
  const [generatedPixCode, setGeneratedPixCode] = useState("");

  // Card Payment States for Deposits
  const [depositCardName, setDepositCardName] = useState("");
  const [depositCardNumber, setDepositCardNumber] = useState("");
  const [depositCardExpiry, setDepositCardExpiry] = useState("");
  const [depositCardCVV, setDepositCardCVV] = useState("");
  const [depositCardType, setDepositCardType] = useState<"credit" | "debit" | "pix">("pix");

  // --- ADMIN / SINGLE OWNER STATE ---
  const [isAdminSetup, setIsAdminSetup] = useState(true);
  const [showAdminSetupModal, setShowAdminSetupModal] = useState(false);

  const [adminConfig, setAdminConfig] = useState({
    name: "alex",
    password: "212171",
    isMaster: true,
  });
  const [adminUsersList, setAdminUsersList] = useState(() => {
    const saved = localStorage.getItem("pandora_admin_users");
    if (saved) {
      const parsed = decryptData(saved);
      if (parsed) {
        // Ensure unique IDs exist for all
        return parsed.map((adm: any) => ({
          ...adm,
          id: adm.id || Math.random().toString(36).substr(2, 9)
        }));
      }
    }
    return [
      { id: 'master-alex-1', name: "alex", password: "212171", isMaster: true, isBlocked: false },
      { id: 'master-alex-2', name: "alex", password: "2020", isMaster: true, isBlocked: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem("pandora_admin_users", encryptData(adminUsersList));
    // Sincroniza o adminConfig master se ele mudar na lista
    const master = adminUsersList.find((a: any) => a.isMaster);
    if (master) setAdminConfig(master);
  }, [adminUsersList]);

  // Admin Login State
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [adminLoginName, setAdminLoginName] = useState("");
  const [adminLoginPass, setAdminLoginPass] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminTab, setAdminTab] = useState<
    | "dashboard"
    | "users"
    | "gigs"
    | "finance"
    | "logs"
    | "settings"
    | "support"
    | "optimization"
    | "master_panel"
  >("dashboard");

  const [adminMessageUserId, setAdminMessageUserId] = useState<string | null>(
    null,
  );
  const [adminMessageInput, setAdminMessageInput] = useState("");
  const [selectedUserForAdmin, setSelectedUserForAdmin] =
    useState<UserType | null>(null);
  const [openUserMenuId, setOpenUserMenuId] = useState<string | null>(null);
  const [showPasswordInAdmin, setShowPasswordInAdmin] = useState(false);
  const [showAdminPasswords, setShowAdminPasswords] = useState<string[]>([]);
  const [editingAdminName, setEditingAdminName] = useState<string | null>(null);
  const [editingAdminPass, setEditingAdminPass] = useState("");
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserData, setEditingUserData] = useState<UserType | null>(null);

  const [showAdminWithdrawModal, setShowAdminWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPixKey, setWithdrawPixKey] = useState("");

  // Master Panel States
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [editMasterName, setEditMasterName] = useState(adminConfig.name);
  const [editMasterPass, setEditMasterPass] = useState(adminConfig.password);
  const [masterMsg, setMasterMsg] = useState({ text: "", type: "" });
  const [adminStep, setAdminStep] = useState<"auth" | "processing">("auth");
  const [adminWithdrawPass, setAdminWithdrawPass] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleUpdateSystemSettings = async (newSettings: SystemSettings) => {
    setSystemSettings(newSettings);
    try {
      await api.system.updateSettings(newSettings);
    } catch (error) {
      console.error("Erro ao atualizar configurações", error);
    }
  };

  // Subscription Logic
  const checkSubscriptionStatus = (user: UserType) => {
    if (!user || user.id === "u1") return { isExpired: false };

    // Admins e Master Admins não expiram (acesso ilimitado)
    if (
      user.isAdmin ||
      user.isMaster ||
      user.cpf === "03531702750" ||
      user.id === "u_user_alex"
    ) {
      return { isExpired: false, daysRemaining: 9999, isAdmin: true };
    }

    if (!user.subscriptionEndDate) return { isExpired: false };

    const endDate = new Date(user.subscriptionEndDate);
    const now = new Date();

    return {
      isExpired: now > endDate,
      endDate: endDate.toLocaleDateString("pt-BR"),
    };
  };

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [gigToReview, setGigToReview] = useState<GigRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewRecommend, setReviewRecommend] = useState(true);
  const [reviewComment, setReviewComment] = useState("");

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // BLOQUEIO GLOBAL: Redireciona para inscrição ou renovação se não estiver verificado ou se assinatura expirou
  useEffect(() => {
    const handleGlobalInteraction = (
      e: MouseEvent | KeyboardEvent | TouchEvent,
    ) => {
      if (!currentUser) return;

      // Se for admin ou admin master, nunca bloqueia
      const decCpf = currentUser.cpf ? (decryptData(currentUser.cpf) || currentUser.cpf) : '';
      if (
        currentUser.isAdmin ||
        currentUser.isMaster ||
        decCpf === "03531702750" ||
        currentUser.id === "u_user_alex"
      )
        return;

      const { isExpired } = checkSubscriptionStatus(currentUser);

      // Se o usuário já está verificado E não expirou, não faz nada
      if (currentUser.isVerified && !isExpired) return;

      // Se já estiver nas telas de cadastro ou login, permite a interação
      const allowedViews = [
        "signup",
        "login",
        "celebrity_signup",
        "admin_login",
        "admin_dashboard",
        "wallet",
      ];
      if (allowedViews.includes(view)) return;

      // EXCEÇÃO: Permite interações em elementos marcados explicitamente ou com IDs específicos de escape
      if (e.target instanceof HTMLElement || e.target instanceof SVGElement) {
        const target = e.target as HTMLElement;

        // Verifica se o elemento ou algum pai tem o atributo de escape ou é um dos botões críticos
        const targetText = target.innerText?.toLowerCase() || "";
        const isAllowedAction =
          target.closest('[data-allow-interaction="true"]') ||
          target.closest("#header-famosos-trigger") ||
          target.closest("#header-mobile-celebrity-signup") ||
          target.closest("#nav-celebrity-signup") ||
          target.closest("#btn-register-celebrity-dropdown") ||
          target.closest("#profile-celebrity-signup-btn") ||
          targetText.includes("famosos") ||
          targetText.includes("celebrity");

        if (isAllowedAction) return;

        // Fallback para botões de login legados por texto
        const isLoginAction =
          target
            .closest("button")
            ?.innerText.toLowerCase()
            .includes("entrar") ||
          target.innerText.toLowerCase().includes("entrar");
        if (isLoginAction) return;
      }

      // Se expirou, manda para a carteira para renovar
      if (isExpired) {
        setView("wallet");
        return;
      }

      // Se não for verificado, manda para o cadastro
      if (!currentUser.isVerified) {
        setView("signup");
      }
    };

    // Usando capture phase para interceptar antes de outros componentes
    window.addEventListener("keydown", handleGlobalInteraction, true);
    window.addEventListener("click", handleGlobalInteraction, true);
    window.addEventListener("touchstart", handleGlobalInteraction, true);

    return () => {
      window.removeEventListener("keydown", handleGlobalInteraction, true);
      window.removeEventListener("click", handleGlobalInteraction, true);
      window.removeEventListener("touchstart", handleGlobalInteraction, true);
    };
  }, [currentUser?.isVerified, currentUser?.subscriptionEndDate, view]);

  const handleStartCreate = (type: ListingType) => {
    if (!currentUser || !currentUser.isVerified) {
      // Se não for verificado, direciona para o cadastro
      setView("signup");
      return;
    }

    // Check for role upgrade requirement
    if (currentUser.role === 'requester' && type === 'offer') {
      setIsUpgradeMode(true);
      setView("signup");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentUser.role === 'worker' && type === 'request') {
      setIsUpgradeMode(true);
      setView("signup");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setCreateFormInitialType(type);
    setGigToEdit(null); // Limpa edição
    setView("create");
  };

  // Funcao unificada para Criar e Atualizar
  const handleUseInspiration = (gig: GigRequest) => {
    setInspirationToUse(gig);
    setGigToEdit(null);
    setDraftDescription("");
    setView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
    addLog(`Usuário selecionou inspiração: ${gig.title}`, "info");
  };

  const handleSaveGig = async (gigData: GigRequest) => {
    if (!currentUser) return;
    const gigWithAuthor = { ...gigData, author: currentUser };

    // Check if updating existing gig
    const existingIndex = requests.findIndex((r) => r.id === gigWithAuthor.id);

    if (existingIndex > -1) {
      // Update
      await api.gigs.update(gigWithAuthor);
      const updatedRequests = [...requests];
      updatedRequests[existingIndex] = gigWithAuthor;
      setRequests(updatedRequests);
      addLog(
        `Pedido atualizado: ${gigWithAuthor.title} por ${currentUser.name}`,
        "info",
      );
    } else {
      // Create

      // NOVO: Se for um PEDIDO (request), trata garantia de 35%
      if (gigWithAuthor.type === "request") {
        const guaranteeAmount = gigWithAuthor.budget * 0.35;
        
        if (currentUser.walletBalance >= guaranteeAmount) {
          // Desconta automaticamente da carteira
          const newBalance = currentUser.walletBalance - guaranteeAmount;
          const updatedUser = { ...currentUser, walletBalance: newBalance };
          setCurrentUser(updatedUser);
          await api.users.update(updatedUser);

          // Registra transação de reserva (escrow)
          const transaction: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUser.id,
            userName: currentUser.name,
            amount: -(guaranteeAmount * 10), // R$
            coins: -guaranteeAmount,
            type: "escrow",
            status: "approved",
            timestamp: new Date().toLocaleString(),
            description: `Garantia 35% reservada para pedido: ${gigWithAuthor.title}`,
          };
          await api.system.addTransaction(transaction);
          setTransactions((prev) => [transaction, ...prev]);

          addLog(`Garantia de ${guaranteeAmount} PND descontada automaticamente da carteira para o pedido: ${gigWithAuthor.title}`, "success");
          
          // Continua salvamento normal
        } else {
          // Direciona para pagamento externo (PIX/Cartão)
          setPendingRequestToSave(gigWithAuthor);
          setRequestPaymentAmount(guaranteeAmount);
          setShowRequestPaymentModal(true);
          addLog(`Iniciando pagamento de garantia (35%): ${guaranteeAmount} PND para o pedido ${gigWithAuthor.title}`, "info");
          return; // Aguarda pagamento externo
        }
      }

      await api.gigs.create(gigWithAuthor);
      setRequests([gigWithAuthor, ...requests]);
      addLog(
        `Novo ${gigWithAuthor.type} criado: ${gigWithAuthor.title} por ${currentUser.name}`,
        "success",
      );
      setListingTypeFilter(gigWithAuthor.type);
      setSelectedCategory("Todos");
      setFilterTerm("");
    }

    setDraftDescription("");
    setGigToEdit(null);
    setInspirationToUse(null);
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignup = async (newUser: UserType) => {
    // Adiciona datas de assinatura (vigência de 1 ano)
    const now = new Date();
    const endDate = new Date();
    endDate.setFullYear(now.getFullYear() + 1);

    const userWithSub = {
      ...newUser,
      subscriptionDate: now.toISOString(),
      subscriptionEndDate: endDate.toISOString(),
    };

    // Save via Service
    const userExists = allUsers.some((u) => u.id === userWithSub.id);
    if (userExists) {
      await api.users.update(userWithSub);
    } else {
      await api.users.create(userWithSub);
    }

    setAllUsers((prev) => {
      if (userExists) {
        return prev.map((u) => (u.id === userWithSub.id ? userWithSub : u));
      }
      return [userWithSub, ...prev];
    });

    if (currentUser?.id === userWithSub.id) {
      setCurrentUser(userWithSub);
    }

    // Novas regras de cobrança
    const isPromotional =
      allUsers.length < (systemSettings.promotionalUserLimit || 1000);
    let fee = 0;

    if (userWithSub.isCelebrity) {
      fee = systemSettings.celebrityFee || 50;
    } else {
      if (userWithSub.role === "both") {
        fee = isPromotional
          ? systemSettings.bothPromotionalFee || 3.99
          : systemSettings.bothFee || 9.99;
      } else if (!isPromotional) {
        if (userWithSub.role === "requester")
          fee = systemSettings.requesterFee || 4.99;
        else if (userWithSub.role === "worker")
          fee = systemSettings.workerFee || 4.99;
      }
    }

    setAppRevenue((prev) => prev + fee);
    setCurrentUser(userWithSub);
    sessionStorage.removeItem("pandora_explicit_logout");
    addLog(
      `Novo usuário cadastrado: ${userWithSub.name} (${userWithSub.role}). Taxa paga: R$ ${fee}`,
      "success",
    );

    // NEW FLOW: Redirect to Safety Terms with Agreement Button
    setSafetyChecked(false);
    setPendingSafetyAgreement(true);
    setShowSafetyModal(true);
  };

  const handleAgreementConfirm = () => {
    setPendingSafetyAgreement(false);
    setShowSafetyModal(false);
    setSafetyChecked(false);
    setView("home");
    alert(
      `Cadastro realizado com sucesso! Bem-vindo(a), ${currentUser.name}. Agora você tem acesso total.`,
    );
  };

  const handleLogout = () => {
    const unverifiedUser = { ...MOCK_USER, isVerified: false };
    setCurrentUser(unverifiedUser);
    localStorage.removeItem("pandora_current_user");
    sessionStorage.setItem("pandora_explicit_logout", "true");
    setView("home");
    addLog(`Usuário saiu da conta.`, "info");
  };

  const handleSubmitSupport = () => {
    if (!currentUser || !supportMessage.trim()) return;
    const newTicket: SupportTicket = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      type: supportType,
      content: supportMessage,
      status: "pending",
      timestamp: new Date().toLocaleString(),
    };
    setSupportTickets([newTicket, ...supportTickets]);
    addLog(
      `Novo chamado de suporte (${supportType}) de ${currentUser.name}`,
      "info",
    );
    setSupportMessage("");
    setShowSupportModal(false);
    alert(T.notifications.infoSent);
  };

  // --- MASTER PANEL FUNCTIONS ---
  const handleAddAdmin = () => {
    if (!newAdminName.trim() || !newAdminPass.trim()) return;
    if (adminUsersList.some((a: any) => a.name === newAdminName.trim())) {
      setMasterMsg({ text: "Usuário já existe!", type: "error" });
      return;
    }
    const newList = [
      ...adminUsersList,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newAdminName.trim(),
        password: newAdminPass.trim(),
        isMaster: false,
        isBlocked: false,
      },
    ];
    setAdminUsersList(newList);
    setNewAdminName("");
    setNewAdminPass("");
    setMasterMsg({ text: "Administrador adicionado!", type: "success" });
  };

  const handleDeleteAdmin = (id: string) => {
    const adminToDelete = adminUsersList.find((a: any) => (a.id === id || a.name === id));
    
    // Safety check: Prevent deleting the last master
    const masters = adminUsersList.filter((a: any) => a.isMaster);
    if (adminToDelete?.isMaster && masters.length <= 1) {
      setMasterMsg({ text: "Não é possível remover o único Master!", type: "error" });
      return;
    }

    const newList = adminUsersList.filter((a: any) => (a.id !== id && a.name !== id));
    setAdminUsersList(newList);
    setMasterMsg({ text: "Acesso removido!", type: "success" });
  };

  const handleToggleAdminBlock = (name: string) => {
    const newList = adminUsersList.map((a: any) => 
      a.name === name ? { ...a, isBlocked: !a.isBlocked } : a
    );
    setAdminUsersList(newList);
    const admin = newList.find((a: any) => a.name === name);
    setMasterMsg({ 
      text: admin.isBlocked ? "Operador bloqueado!" : "Operador desbloqueado!", 
      type: "success" 
    });
  };

  const handleUpdateAdminPassword = (name: string, newPass: string) => {
    if (!newPass.trim()) return;
    const newList = adminUsersList.map((a: any) => 
      a.name === name ? { ...a, password: newPass.trim() } : a
    );
    setAdminUsersList(newList);
    setMasterMsg({ text: "Senha atualizada!", type: "success" });
  };

  const handleUpdateMaster = () => {
    if (!editMasterName.trim() || !editMasterPass.trim()) return;
    const newMasterData = {
      ...adminUser,
      name: editMasterName.trim(),
      password: editMasterPass.trim(),
    };
    const newList = adminUsersList.map((a: any) =>
      a.isMaster ? newMasterData : a,
    );
    setAdminUsersList(newList);
    setAdminUser(newMasterData);
    setMasterMsg({ text: "Credenciais Master atualizadas!", type: "success" });
  };

  const handleAdminDeleteTicket = (ticketId: string) => {
    setSupportTickets(supportTickets.filter((t) => t.id !== ticketId));
  };

  const handleAddNewInspiration = () => {
    if (!adminUser) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const newIdea = {
      id: newId,
      text: "Nova ideia (clique no lápis para editar)",
    };
    setInspirationList([newIdea, ...inspirationList]);
    setEditingId(newId);
    setTempInspirationText(newIdea.text);
  };

  const handleStartEditInspiration = (id: string, text: string) => {
    if (!adminUser) return;
    setEditingId(id);
    setTempInspirationText(text);
  };

  const handleSaveInspiration = () => {
    if (!adminUser) return;
    if (editingId && tempInspirationText.trim()) {
      setInspirationList(
        inspirationList.map((item) =>
          item.id === editingId ? { ...item, text: tempInspirationText } : item,
        ),
      );
      setEditingId(null);
      setTempInspirationText("");
    }
  };

  const handleDeleteInspiration = (id: string) => {
    if (!adminUser) return;
    setInspirationList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenChat = (session: ChatSession) => {
    if (!currentUser) return;
    if (session.gigId) {
      const gigIndex = requests.findIndex((r) => r.id === session.gigId);
      if (gigIndex > -1) {
        const gig = requests[gigIndex];
        if (gig.author.id !== currentUser.id) {
          const isAlreadyCandidate = gig.candidates.some(
            (c) => c.id === currentUser.id,
          );
          if (!isAlreadyCandidate) {
            const updatedGig = {
              ...gig,
              status:
                gig.status === GigStatus.OPEN
                  ? GigStatus.NEGOTIATING
                  : gig.status,
              candidates: [...gig.candidates, currentUser],
            };

            // Update Service
            api.gigs.update(updatedGig);

            const updatedRequests = [...requests];
            updatedRequests[gigIndex] = updatedGig;
            setRequests(updatedRequests);
            addLog(
              `Usuário ${currentUser.name} entrou em negociação no pedido ${gig.id}`,
              "info",
            );
          }
        }
      }
    }
    setActiveSession(session);
    setView("chat_detail");
  };

  const handleSendMessage = async (
    sessionId: string,
    text: string,
    attachment?: { type: "image" | "video"; url: string },
  ) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      attachment: attachment,
    };

    // 1. Update Local State Optimistically
    const updateChat = (chat: ChatSession): ChatSession => ({
      ...chat,
      lastMessage: attachment
        ? attachment.type === "image"
          ? "📷 Imagem"
          : "🎥 Vídeo"
        : text,
      messages: [...chat.messages, newMessage],
    });

    setChats((prev) =>
      prev.map((c) => (c.id === sessionId ? updateChat(c) : c)),
    );

    if (activeSession && activeSession.id === sessionId) {
      setActiveSession((prev) => (prev ? updateChat(prev) : null));
    }

    // 2. Save to Service (Background)
    try {
      await api.chats.sendMessage(sessionId, newMessage);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Opcional: Adicionar lógica de re-tentativa ou aviso ao usuário
    }
  };

  const handleGigClick = (request: GigRequest) => {
    setSelectedGigDetail(request);
  };

  const handleHireClick = (gigId: string) => {
    if (!currentUser || !currentUser.isVerified) {
      setSelectedGigDetail(null);
      setView("signup");
      return;
    }
    const gig = requests.find((r) => r.id === gigId);
    if (gig) {
      if (gig.author.id === currentUser.id) {
        // Owner cannot "hire" from card, they use View Candidates
        return;
      }

      // Check if chat already exists
      const existingChat = chats.find(
        (c) => c.gigId === gig.id && c.participant.id === gig.author.id,
      );
      if (existingChat) {
        handleOpenChat(existingChat);
        return;
      }

      // Create new chat negotiation
      const newChatSession: ChatSession = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        gigId: gig.id,
        participant: gig.author,
        lastMessage: "Iniciou interesse no pedido.",
        unreadCount: 0,
        messages: [],
      };

      handleOpenChat(newChatSession);
      // Logic inside handleOpenChat adds user to candidates
    }
  };

  // OWNER: Open Modal to Select Candidate
  const handleViewCandidates = (gig: GigRequest) => {
    setSelectedGigForCandidates(gig);
    setShowCandidatesModal(true);
  };

  // OWNER: Select a candidate to start chat specifically with them
  const handleSelectCandidate = async (candidate: UserType) => {
    if (!currentUser || !selectedGigForCandidates) return;

    // Check if chat already exists for this candidate on this gig
    const existingChat = chats.find(
      (c) =>
        c.gigId === selectedGigForCandidates.id &&
        c.participant.id === candidate.id,
    );

    if (existingChat) {
      setShowCandidatesModal(false);
      setActiveSession(existingChat);
      setView("chat_detail");
      return;
    }

    // Create new chat
    const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newChatSession: ChatSession = {
      id: newChatId,
      gigId: selectedGigForCandidates.id,
      participant: candidate,
      lastMessage: "Olá! Vi seu interesse no meu pedido. Vamos conversar?",
      unreadCount: 0,
      messages: [
        {
          id: "init_owner",
          senderId: currentUser.id,
          content: "Olá! Vi seu interesse no meu pedido. Vamos conversar?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: true,
        },
      ],
    };

    await api.chats.create(newChatSession);
    setChats((prev) => [newChatSession, ...prev]);

    setShowCandidatesModal(false);
    setActiveSession(newChatSession);
    setView("chat_detail");
  };

  const confirmHire = async () => {
    if (!selectedGigForHire) return;
    if (!paymentPixKey) {
      alert(T.notifications.pixRequired);
      return;
    }
    if (userBalance >= selectedGigForHire.budget) {
      setIsProcessingPayment(true);
      setTimeout(async () => {
        setUserBalance((prev) => prev - selectedGigForHire.budget);

        const commissionFee = Math.floor(
          selectedGigForHire.budget * (systemSettings.commissionRate / 100),
        );
        setAppRevenue((prev) => prev + commissionFee);

        addLog(
          `Depósito de 35% ativado para o pedido ${selectedGigForHire.id}. Taxa de plataforma retida. Chat liberado.`,
          "info",
        );

        const updatedGig = {
          ...selectedGigForHire,
          status: GigStatus.IN_PROGRESS,
        };
        await api.gigs.update(updatedGig);

        const updatedRequests = requests.map((req) =>
          req.id === selectedGigForHire.id ? updatedGig : req,
        );
        setRequests(updatedRequests);

        const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        if (activeSession && activeSession.gigId === selectedGigForHire.id) {
          const systemMsg: Message = {
            id: "sys_safe",
            senderId: "system",
            content: `Depósito de 35% confirmado! Chat liberado para negociação segura.`,
            timestamp: new Date().toLocaleTimeString(),
            isMe: false,
          };
          await api.chats.sendMessage(activeSession.id, systemMsg);
        }

        setShowPaymentModal(false);
        setSelectedGigForHire(null);
        setPaymentPixKey("");
        setIsProcessingPayment(false);
        alert(T.notifications.paymentConfirmed);
      }, 2500);
    } else {
      alert(T.notifications.insufficientBalance);
      setIsProcessingPayment(false);
    }
  };

  const handleUpdateGigStatus = async (gigId: string, status: GigStatus) => {
    const gig = requests.find((r) => r.id === gigId);
    if (!gig) return;

    const updatedGig = { ...gig, status };
    setRequests((prev) => prev.map((r) => (r.id === gigId ? updatedGig : r)));
    await api.gigs.update(updatedGig);

    addLog(
      `STATUS ATUALIZADO: ${gig.title} -> ${status.toUpperCase()}`,
      "info",
    );
    alert(T.notifications.userUpdated);
  };

  const handleReleaseFunds = async (gigId: string) => {
    const gig = requests.find((r) => r.id === gigId);
    if (!gig) return;
    const commissionFee = Math.floor(
      gig.budget * (systemSettings.commissionRate / 100),
    );
    const providerAmount = gig.budget - commissionFee;

    // Credit the Worker (Contracted)
    if (gig.hiredUserId) {
      const worker = allUsers.find((u) => u.id === gig.hiredUserId);
      if (worker) {
        const updatedWorker = {
          ...worker,
          walletBalance: worker.walletBalance + providerAmount,
        };
        setAllUsers((prev) =>
          prev.map((u) => (u.id === worker.id ? updatedWorker : u)),
        );
        await api.users.update(updatedWorker);

        // Add transaction record for the worker
        const workerTrans: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          userId: worker.id,
          userName: worker.name,
          amount: providerAmount * 10,
          coins: providerAmount,
          type: "payment",
          status: "approved",
          timestamp: new Date().toLocaleString(),
          description: `Recebimento pelo serviço: ${gig.title}`,
        };
        await api.system.addTransaction(workerTrans);
        setTransactions((prev) => [workerTrans, ...prev]);

        addLog(
          `Pagamento de ${providerAmount} PND creditado para ${worker.name}`,
          "success",
        );
      }
    }

    addLog(
      `Pagamento liberado (ID: ${gigId}). Comissão App: ${commissionFee} PND`,
      "success",
    );

    const updatedGig = { ...gig, status: GigStatus.COMPLETED };
    await api.gigs.update(updatedGig);

    // Trigger Success Modal with value
    setReleasedAmount(gig.budget);
    setShowPaymentSuccessModal(true);

    const updatedRequests = requests.map((req) =>
      req.id === gigId ? updatedGig : req,
    );
    setRequests(updatedRequests);

    // Also update current sessions if applicable
    if (activeSession && activeSession.gigId === gigId) {
      setActiveSession({ ...activeSession, status: GigStatus.COMPLETED });
    }

    // Delay Review Modal slightly
    setTimeout(() => {
      setGigToReview(updatedGig);
      setShowReviewModal(true);
    }, 4000);
  };

  const handleSaveReview = async () => {
    if (!gigToReview) return;

    const review = {
      id: Math.random().toString(36).substr(2, 9),
      rating: reviewRating,
      recommend: reviewRecommend,
      comment: reviewComment,
      timestamp: new Date().toLocaleString(),
    };

    const updatedGig = { ...gigToReview, review };
    await api.gigs.update(updatedGig);

    setRequests(
      requests.map((req) => (req.id === updatedGig.id ? updatedGig : req)),
    );

    setShowReviewModal(false);
    setGigToReview(null);
    setReviewRating(5);
    setReviewRecommend(true);
    setReviewComment("");

    alert(T.notifications.reviewThanks);
  };

  const handleGeneratePixDeposit = async () => {
    if (!currentUser || !depositAmount || Number(depositAmount) <= 0) return;
    
    setTopUpStep("processing");
    
    setTimeout(async () => {
      const amount = Number(depositAmount);
      const amountToAdd = amount / 10;
      
      const newTrans: Transaction = {
        id: `topup_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        amount: amount,
        coins: amountToAdd,
        type: "deposit",
        status: "pending",
        description: pendingGigIdForDeposit 
          ? `DEPÓSITO PIX 35%: ${pendingGigIdForDeposit}`
          : "Recarga de Saldo via PIX",
        timestamp: new Date().toISOString()
      };

      setTransactions([newTrans, ...transactions]);
      addLog(
        `Solicitação de depósito ${pendingGigIdForDeposit ? "de 35% " : ""}via PIX de R$ ${amount.toFixed(2)} por ${currentUser.name}. Aguardando validação na chave alexpinto926@gmail.com.`,
        "info",
      );
      
      setTopUpStep("amount");
      setDepositAmount("");
      setPendingGigIdForDeposit(null);
      setPendingWorkerIdForDeposit(null);
      setShowTopUpModal(false);
      
      alert(
        pendingGigIdForDeposit
          ? "Sua solicitação de depósito de 35% via PIX foi registrada! O chat será liberado assim que o pagamento for confirmado na chave alexpinto926@gmail.com."
          : "Sua solicitação de recarga via PIX foi registrada! O saldo será creditado após a confirmação do pagamento na chave alexpinto926@gmail.com."
      );
    }, 1500);
  };

  const handleGenerateCardDeposit = () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;
    if (!depositCardNumber || !depositCardName || !depositCardExpiry || !depositCardCVV) {
      alert("Por favor, preencha todos os dados do cartão.");
      return;
    }
    setTopUpStep("processing");
    handleConfirmCardPayment();
  };

  const handleConfirmCardPayment = () => {
    if (!currentUser) return;
    setTopUpStep("processing");
    setTimeout(async () => {
      const amount = Number(depositAmount);
      const amountToAdd = amount / 10;
      const newTrans: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        userName: currentUser.name,
        amount: amount,
        coins: amountToAdd,
        type: pendingGigIdForDeposit ? "escrow" : "deposit",
        status: "approved", // Card is instant in this demo
        gigId: pendingGigIdForDeposit || undefined,
        description: pendingGigIdForDeposit
          ? `Depósito via Cartão no cofre para o serviço ${pendingGigIdForDeposit}`
          : `Depósito via Cartão (${depositCardType})`,
        timestamp: new Date().toLocaleString(),
      };

      await api.system.addTransaction(newTrans);
      
      // Credit wallet
      const updatedUser = { ...currentUser, walletBalance: currentUser.walletBalance + amountToAdd };
      setCurrentUser(updatedUser);
      await api.users.update(updatedUser);

      setTransactions([newTrans, ...transactions]);
      addLog(
        `Novo depósito ${pendingGigIdForDeposit ? "no cofre " : ""}realizado via Cartão de R$ ${amount.toFixed(2)} por ${currentUser.name}`,
        "success",
      );
      setTopUpStep("amount");
      setDepositAmount("");
      setDepositCardName("");
      setDepositCardNumber("");
      setDepositCardExpiry("");
      setDepositCardCVV("");
      setPendingGigIdForDeposit(null);
      setPendingWorkerIdForDeposit(null);
      setShowTopUpModal(false);
      alert(
        pendingGigIdForDeposit
          ? "Depósito no cofre realizado com sucesso via Cartão!"
          : "Saldo creditado com sucesso via Cartão!"
      );
    }, 2000);
  };

  const handleConfirmRequestPayment = async () => {
    if (!pendingRequestToSave || !currentUser) return;
    
    setIsProcessingPayment(true);
    
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const gigWithAuthor = pendingRequestToSave;
    
    // Finaliza criação
    await api.gigs.create(gigWithAuthor);
    setRequests([gigWithAuthor, ...requests]);
    
    // Registra transação da garantia paga
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      amount: requestPaymentAmount * 10, // Convertido para R$ (1 PND = R$ 10)
      coins: requestPaymentAmount,
      type: "deposit",
      status: "approved",
      timestamp: new Date().toLocaleString(),
      description: `Garantia 35% paga para pedido: ${gigWithAuthor.title}`,
    };
    await api.system.addTransaction(transaction);
    setTransactions((prev) => [transaction, ...prev]);
    
    setAppRevenue(prev => prev + (requestPaymentAmount * 10));

    addLog(
      `Garantia de ${requestPaymentAmount} PND paga para o pedido: ${gigWithAuthor.title}`,
      "success",
    );
    
    setIsProcessingPayment(false);
    setShowRequestPaymentModal(false);
    setPendingRequestToSave(null);
    setDraftDescription("");
    setGigToEdit(null);
    setInspirationToUse(null);
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    alert("Pagamento de garantia confirmado! Seu pedido foi publicado com sucesso.");
  };

  const handleChatDeposit = (
    gigId: string,
    amount: number,
    workerId: string,
  ) => {
    if (!currentUser) return;
    if (userBalance < amount) {
      setPendingGigIdForDeposit(gigId);
      setPendingWorkerIdForDeposit(workerId);
      // R$ 10 = 1 PND conversion
      setDepositAmount((amount * 10).toString());
      setShowTopUpModal(true);
      return;
    }

    const newTransaction: Transaction = {
      id: `trans_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: amount * 10,
      coins: amount,
      type: "escrow",
      status: "pending",
      gigId: gigId,
      description: T.notifications.escrowDescription.replace('{id}', gigId),
      timestamp: new Date().toISOString(),
    };

    // Store worker ID in the transaction description or a temporary way to retrieve it
    // For this app, we'll update the gig directly with the hiredUserId when approved
    // We'll use the description to store metadata for the admin
    newTransaction.description = `WORKER_ID:${workerId}|${newTransaction.description}`;

    // Deduct from balance immediately for internal escrow
    setUserBalance((prev) => prev - amount);
    setTransactions((prev) => [newTransaction, ...prev]);
    addLog(
      T.notifications.escrowLog.replace('{id}', gigId).replace('{amount}', amount.toString()),
      "info",
    );
    alert(T.notifications.escrowReserved);
  };

  const handleAdminApproveTransaction = (transId: string) => {
    const trans = transactions.find((t) => t.id === transId);
    if (!trans) return;

    if (trans.type === "escrow" && trans.gigId) {
      // Extract worker ID from description if present
      let workerId = "";
      if (trans.description?.startsWith("WORKER_ID:")) {
        workerId = trans.description.split("|")[0].split(":")[1];
      }

      const gig = requests.find((r) => r.id === trans.gigId);
      if (gig) {
        const commissionFee = Math.floor(
          gig.budget * (systemSettings.commissionRate / 100),
        );
        // Platform takes its cut immediately upon hiring/escrow approval
        setAppRevenue((prev) => prev + commissionFee);

        // Update gig status to IN_PROGRESS and set hired user
        const updatedGig = {
          ...gig,
          status: GigStatus.IN_PROGRESS,
          hiredUserId: workerId || gig.hiredUserId,
        };
        api.gigs.update(updatedGig); // Non-blocking sync

        setRequests((prev) =>
          prev.map((req) => (req.id === trans.gigId ? updatedGig : req)),
        );

        // Send system message to chat if it exists
        const chatToUnlock = chats.find(
          (c) =>
            c.gigId === trans.gigId &&
            (c.participant.id === workerId ||
              c.participant.id === trans.userId),
        );
        if (chatToUnlock) {
          const systemMsg: Message = {
            id: `sys_unlocked_${Date.now()}`,
            senderId: "system",
            content:
              "O ADMINISTRADOR aprovou o pagamento! O depósito de 35% está ativado e o chat foi liberado para negociação livre. O restante (65%) deve ser pago após a conclusão em acordo direto.",
            timestamp: new Date().toLocaleTimeString("pt-BR"),
            isMe: false,
          };
          api.chats.sendMessage(chatToUnlock.id, systemMsg);

          setChats((prevChats) =>
            prevChats.map((c) =>
              c.id === chatToUnlock.id
                ? {
                    ...c,
                    messages: [...c.messages, systemMsg],
                    lastMessage: systemMsg.content,
                  }
                : c,
            ),
          );
        }

        addLog(
          `Depósito liberado para o pedido ${trans.gigId}. Taxa de plataforma (${commissionFee} PND) retida. Chat desbloqueado.`,
          "success",
        );
      }
    } else {
      // Standard deposit
      setAllUsers((users) =>
        users.map((u) => {
          if (u.id === trans.userId) {
            return { ...u, walletBalance: u.walletBalance + trans.coins };
          }
          return u;
        }),
      );
      if (trans.userId === currentUser.id) {
        setUserBalance((prev) => prev + trans.coins);
      }
    }

    setTransactions(
      transactions.map((t) =>
        t.id === transId
          ? {
              ...t,
              status: "approved",
              timestamp: new Date().toLocaleString("pt-BR"),
            }
          : t,
      ),
    );
    setAppRevenue((prev) => prev + trans.coins);
    addLog(
      `Transação de R$ ${trans.amount} aprovada para ${trans.userName}`,
      "success",
    );
  };

  const handleAdminRejectTransaction = (transId: string) => {
    if (confirm("Rejeitar este pagamento?")) {
      setTransactions(
        transactions.map((t) =>
          t.id === transId ? { ...t, status: "rejected" } : t,
        ),
      );
      addLog(`Depósito rejeitado (ID: ${transId})`, "warning");
    }
  };

  const handleAdminToggleUserStatus = async (userId: string) => {
    const userToUpdate = allUsers.find((u) => u.id === userId);
    if (!userToUpdate) return;
    if (
      userToUpdate.cpf === "03531702750" ||
      decryptData(userToUpdate.cpf) === "03531702750" ||
      userToUpdate.id === "03531702750"
    ) {
      addLog("Administrador Master não pode ser bloqueado.", "error");
      return;
    }

    const newStatus = userToUpdate.status === "active" ? "banned" : "active";
    const updatedUser = { ...userToUpdate, status: newStatus };

    // Update in allUsers list
    setAllUsers(allUsers.map((u) => (u.id === userId ? updatedUser : u)));

    // Update selected user if currently viewing
    if (selectedUserForAdmin?.id === userId) {
      setSelectedUserForAdmin(updatedUser);
    }

    // Update in Service/Database
    await api.users.update(updatedUser);

    // Log action
    addLog(
      `Status do usuário ${userToUpdate.name} alterado para ${newStatus.toUpperCase()}`,
      newStatus === "active" ? "success" : "error",
    );
  };

  const handleAdminDeleteUser = async (userId: string) => {
    const userToDelete = allUsers.find((u) => u.id === userId);
    if (!userToDelete) return;
    if (
      userToDelete.cpf === "03531702750" ||
      decryptData(userToDelete.cpf) === "03531702750" ||
      userToDelete.id === "03531702750"
    ) {
      addLog("Administrador Master não pode ser excluído.", "error");
      return;
    }

    if (
      !confirm(
        `Tem certeza que deseja EXCLUIR permanentemente o usuário ${userToDelete.name}? Esta ação é irreversível.`,
      )
    )
      return;

    // Remove from allUsers list
    setAllUsers(allUsers.filter((u) => u.id !== userId));

    // Clear selected user if currently viewing the deleted one
    if (selectedUserForAdmin?.id === userId) {
      setSelectedUserForAdmin(null);
    }

    // Update in Service/Database
    await api.users.delete(userId);

    addLog(`Usuário ${userToDelete.name} foi removido do sistema.`, "error");
  };

  const handleAdminToggleAdminStatus = (userId: string) => {
    if (!adminUser?.isMaster) {
      addLog("Apenas o Administrador Master pode promover usuários.", "error");
      return;
    }
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;

    const isAlex =
      user.cpf === "03531702750" ||
      (user.cpf && decryptData(user.cpf) === "03531702750") ||
      user.id === "u_user_alex";
    if (isAlex) {
      addLog(
        "Não é possível alterar o status administrativo do Master Admin.",
        "error",
      );
      return;
    }

    const updatedUser = { ...user, isAdmin: !user.isAdmin };
    setAllUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    addLog(
      `Usuário ${user.name} agora é ${updatedUser.isAdmin ? "Administrador" : "Usuário Comum"}.`,
      "success",
    );
  };

  const handleAdminWarnUser = async (userId: string) => {
    const userToUpdate = allUsers.find((u) => u.id === userId);
    if (!userToUpdate) return;

    const newWarnings = (userToUpdate.warnings || 0) + 1;
    const updatedUser = { ...userToUpdate, warnings: newWarnings };

    setAllUsers(allUsers.map((u) => (u.id === userId ? updatedUser : u)));
    if (selectedUserForAdmin?.id === userId) {
      setSelectedUserForAdmin(updatedUser);
    }

    await api.users.update(updatedUser);
    addLog(
      `Advertência aplicada a ${userToUpdate.name}. Total: ${newWarnings}`,
      "warning",
    );
    alert(`Advertência enviada para ${userToUpdate.name}.`);
    setOpenUserMenuId(null);
  };

  const handleAdminSendMessageToUser = async (userId: string) => {
    setAdminMessageUserId(userId);
    setAdminMessageInput("");
    setOpenUserMenuId(null);
  };

  const handleAdminConfirmSendMessage = async () => {
    if (!adminMessageUserId || !adminMessageInput.trim()) {
      setAdminMessageUserId(null);
      return;
    }

    const userToUpdate = allUsers.find((u) => u.id === adminMessageUserId);
    if (!userToUpdate) return;

    // Simula envio de mensagem
    addLog(
      `MENSAGEM ADMIN para ${userToUpdate.name}: ${adminMessageInput}`,
      "info",
    );
    alert(`Mensagem enviada com sucesso para ${userToUpdate.name}!`);

    setAdminMessageUserId(null);
    setAdminMessageInput("");
  };

  const handleAdminSaveUser = async () => {
    if (!editingUserData) return;

    try {
      const encryptedUser = {
        ...editingUserData,
        cpf: encryptData(editingUserData.cpf),
        phone: encryptData(editingUserData.phone),
        pixKey: encryptData(editingUserData.pixKey),
        address: encryptData(editingUserData.address),
        password: encryptData(editingUserData.password),
      };

      const updatedUsers = allUsers.map((u) =>
        u.id === encryptedUser.id ? encryptedUser : u,
      );
      setAllUsers(updatedUsers);

      // Update the user in the "database"
      await api.users.update(encryptedUser);

      // If we are editing the CURRENT logged in user (unlikely but possible), sync state
      if (currentUser.id === encryptedUser.id) {
        setCurrentUser(encryptedUser);
      }

      setSelectedUserForAdmin(encryptedUser);
      setIsEditingUser(false);
      addLog(
        `Dados do usuário ${encryptedUser.name} (${encryptedUser.id}) atualizados pelo administrador.`,
        "success",
      );
      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar alterações.");
    }
  };

  const handleSetupAdmin = () => {
    if (!adminConfig.name || !adminConfig.password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    setIsAdminSetup(true);
    addLog("Administrador configurado com sucesso.", "warning");
    setShowAdminSetupModal(false);
    alert("Acesso administrativo configurado!");
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError("");
    if (!isAdminSetup) {
      setAdminLoginError(
        "Administrador ainda não configurado. Configure na Carteira primeiro.",
      );
      return;
    }
    const name = adminLoginName.trim();
    const pass = adminLoginPass.trim();

    const foundAdmin = adminUsersList.find(
      (a: any) => a.name === name && a.password === pass,
    );

    if (foundAdmin) {
      if (foundAdmin.isBlocked) {
        setAdminLoginError("Acesso bloqueado pelo Administrador Master.");
        addLog(`Tentativa de acesso de admin bloqueado: ${name}`, "error");
        return;
      }
      setAdminUser(foundAdmin);
      addLog(`Admin ${foundAdmin.name} acessou o SATI.`, "warning");
      setView("admin_dashboard");
    } else {
      setAdminLoginError("Credenciais inválidas.");
      addLog(`Tentativa de acesso falha ao SATI: ${name}`, "error");
    }
  };

  const handleUserDeleteGig = async (gigId: string) => {
    if (confirm("Deseja realmente remover este item?")) {
      await api.gigs.delete(gigId);
      setRequests(requests.filter((r) => r.id !== gigId));
      addLog(`Usuário removeu seu próprio pedido ${gigId}`, "info");
    }
  };

  const handleChatDelete = async (chatId: string) => {
    if (confirm("Deseja realmente excluir esta conversa?")) {
      // In a real app, we would call an API. For now, we update local state.
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      addLog(`Conversa ${chatId} excluída pelo usuário.`, "info");
    }
  };

  const handleResetApp = () => {
    if (
      confirm(
        "ATENÇÃO: Isso apagará todas as suas conversas, pedidos e inspirações salvas localmente para reiniciar os testes. Deseja continuar?",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // ATUALIZADO PARA COMPARTILHAR O LINK DO APLICATIVO (COM FOCO EM WHATSAPP)
  const handleShareApp = () => {
    const url = window.location.href;
    const shareText = `Confira a plataforma C.Pandox! Acesse agora: ${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    if (navigator.share) {
      navigator
        .share({
          title: "C.Pandox",
          text: shareText,
          url: url,
        })
        .catch((err) => {
          console.error("Erro ao compartilhar:", err);
          window.open(waUrl, "_blank");
        });
    } else {
      // Abre WhatsApp diretamente sem confirm() para melhor UX em iframe
      window.open(waUrl, "_blank");
    }
  };

  const runTransferSequence = () => {
    let currentStep = 0;
    setTransferConsoleLogs([]);
    const interval = setInterval(() => {
      if (currentStep >= 7) {
        clearInterval(interval);
        const amountNum = parseFloat(withdrawAmount);
        const finalAmount = !isNaN(amountNum) ? amountNum : appRevenue * 10;

        addLog(
          `Saque Corporativo Realizado. Valor: R$ ${finalAmount.toFixed(2)}. Chave PIX: ${withdrawPixKey}`,
          "warning",
        );

        if (!isNaN(amountNum)) {
          setAppRevenue((prev) => Math.max(0, prev - amountNum / 10));
        } else {
          setAppRevenue(0);
        }

        setShowAdminWithdrawModal(false);
        setAdminWithdrawPass("");
        setWithdrawAmount("");
        setWithdrawPixKey("");
        setAdminStep("auth");
        alert(
          "Autenticação Confirmada. Valor transferido com sucesso para a chave PIX informada.",
        );
      } else {
        const steps = [
          "Iniciando...",
          "Conectando ao Gateway...",
          "Validando Chave PIX...",
          "Autenticando Master...",
          "Debitando Saldo...",
          "Confirmando Transferência...",
          "SUCESSO",
        ];
        setTransferConsoleLogs((prev) => [
          ...prev,
          steps[currentStep] || "...",
        ]);
        currentStep++;
      }
    }, 800);
  };

  const handleAdminAuthSubmit = () => {
    setAdminError("");

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAdminError("Informe um valor de saque válido.");
      return;
    }

    if (amountNum > appRevenue * 10 + 0.01) {
      // margem de erro
      setAdminError("Valor solicitado excede o saldo disponível.");
      return;
    }

    if (!withdrawPixKey.trim()) {
      setAdminError("Informe a chave PIX para recebimento.");
      return;
    }

    if (adminStep === "auth") {
      if (adminWithdrawPass === adminConfig.password) {
        setAdminStep("processing");
        runTransferSequence();
      } else {
        setAdminError(`Senha incorreta.`);
      }
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesTerm =
      req.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(filterTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || req.category === selectedCategory;
    const matchesType =
      currentUser && currentUser.isCelebrity
        ? true
        : req.type === listingTypeFilter;
    return matchesTerm && matchesCategory && matchesType;
  });

  if (maintenanceMode && view !== "admin_login" && view !== "admin_dashboard") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
        <Siren className="w-24 h-24 text-red-500 animate-pulse mb-8" />
        <h1 className="text-4xl font-black text-white mb-4 tracking-wider">
          SISTEMA EM MANUTENÇÃO
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          O C.Pandox está passando por atualizações críticas de segurança. Por
          favor, retorne em breve.
        </p>
        {((currentUser?.cpf && (decryptData(currentUser.cpf) === "03531702750" || currentUser.cpf === "03531702750")) || 
           currentUser?.id === "u_user_alex" || 
           (currentUser?.name === "alex" && (currentUser?.password === "212171" || decryptData(currentUser?.password) === "212171"))) &&
          (currentUser?.password === "2020" || currentUser?.password === "212171" || (currentUser?.password && (decryptData(currentUser.password) === "2020" || decryptData(currentUser.password) === "212171"))) && (
            <button
              onClick={() => setView("admin_login")}
              className="mt-12 text-gray-700 hover:text-white text-xs uppercase tracking-widest"
            >
              Acesso Técnico
            </button>
          )}
      </div>
    );
  }

  // --- VIEW RENDERING HELPERS ---
  const renderMainContent = () => {
    // Auth-required views redirect
    const privateViews = [
      "wallet",
      "messages",
      "chat_detail",
      "profile",
      "create",
      "rating",
    ];
    if (
      privateViews.includes(view) &&
      (!currentUser || !currentUser.id || currentUser.id === "u1")
    ) {
      return (
        <LoginForm
          onLogin={(user) => {
            // Injeção forçada de permissões para Admin Master (03531702750) no login
            let userToSet = user;
            const decCPF = user.cpf ? (decryptData(user.cpf) || user.cpf) : '';
            const isMasterUser = decCPF === "03531702750" || 
                               user.id === 'u_user_alex' || 
                               user.email === 'AlexPinto926@gmail.com' ||
                               (user.name === 'alex' && (user.password === '212171' || decryptData(user.password) === '212171'));
                               
            if (isMasterUser) {
              userToSet = { ...user, isAdmin: true, isMaster: true, isVerified: true, status: 'active' };
            }
            setCurrentUser(userToSet);
            localStorage.setItem("pandora_current_user", encryptData(userToSet));
            sessionStorage.removeItem("pandora_explicit_logout");
            setView(view); // Return to intended view
          }}
          onCancel={() => setView("home")}
          onSwitchToSignup={() => setView("signup")}
          language={language}
        />
      );
    }

    if (view === "login") {
      return (
        <LoginForm
          onLogin={(user) => {
            // Injeção forçada de permissões para Admin Master (03531702750) no login
            let userToSet = user;
            const decCPF = user.cpf ? (decryptData(user.cpf) || user.cpf) : '';
            const isMasterUser = decCPF === "03531702750" || 
                               user.id === 'u_user_alex' || 
                               user.email === 'AlexPinto926@gmail.com';

            if (isMasterUser) {
              userToSet = { ...user, isAdmin: true, isMaster: true, isVerified: true, status: 'active' };
            }
            setCurrentUser(userToSet);
            localStorage.setItem("pandora_current_user", encryptData(userToSet));
            sessionStorage.removeItem("pandora_explicit_logout");
            setView("home");
          }}
          onCancel={() => setView("home")}
          onSwitchToSignup={() => setView("signup")}
          language={language}
        />
      );
    }

    if (view === "signup")
      return (
        <SignupForm
          onSignup={(updatedUser) => {
            handleSignup(updatedUser);
            setIsUpgradeMode(false);
          }}
          initialUser={isUpgradeMode ? currentUser : undefined}
          onCancel={() => {
            setIsUpgradeMode(false);
            setView("home");
          }}
          onSwitchToLogin={() => {
            setIsUpgradeMode(false);
            setView("login");
          }}
          adminPixKey={systemSettings?.platformPixKey || "21992607732"}
          userCount={allUsers.length}
          systemSettings={
            systemSettings || {
              commissionRate: 35,
              requesterFee: 4.99,
              workerFee: 2.99,
              bothFee: 6.99,
              bothPromotionalFee: 3.99,
              celebrityFee: 50,
              promotionalUserLimit: 1000,
              platformPixKey: "21992607732",
            }
          }
          language={language}
        />
      );

    if (view === "celebrity_signup")
      return (
        <CelebritySignupForm
          onSignup={handleSignup}
          onCancel={() => setView("home")}
          onSwitchToLogin={() => setView("login")}
          adminPixKey={systemSettings?.platformPixKey || "21992607732"}
          systemSettings={
            systemSettings || {
              commissionRate: 35,
              requesterFee: 4.99,
              workerFee: 2.99,
              bothFee: 6.99,
              bothPromotionalFee: 3.99,
              celebrityFee: 50,
              promotionalUserLimit: 1000,
              platformPixKey: "21992607732",
            }
          }
          language={language}
        />
      );

    if (view === "wallet") {
      const subStatus = checkSubscriptionStatus(currentUser);
      return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Status da Assinatura */}
          {currentUser.id !== "u1" && (
            <div
              className={`mb-6 p-4 rounded-2xl border flex items-center justify-between transition-all ${subStatus.isExpired ? "bg-red-500/10 border-red-500/30" : "bg-green-500/10 border-green-500/30"}`}
            >
              <div className="flex items-center gap-3">
                {subStatus.isExpired ? (
                  <div className="bg-red-500/20 p-2 rounded-lg text-red-500 animate-pulse">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {T.wallet.subscriptionValidity}
                  </p>
                  <h4
                    className={`text-sm font-bold ${subStatus.isExpired ? "text-red-500" : "text-green-500"}`}
                  >
                    {subStatus.isAdmin ||
                    currentUser.isAdmin ||
                    currentUser.isMaster
                      ? T.wallet.adminAccount
                      : subStatus.isExpired
                        ? T.wallet.expired
                        : `${T.wallet.activeUntil} ${subStatus.endDate}`}
                  </h4>
                </div>
              </div>
              {subStatus.isExpired &&
                !currentUser.isAdmin &&
                !currentUser.isMaster && (
                  <button
                    onClick={() => {
                      const feeAmount = currentUser.isCelebrity
                        ? 50
                        : currentUser.role === "both"
                          ? 6.99
                          : currentUser.role === "worker"
                            ? 2.99
                            : 4.99;
                      setDepositAmount(feeAmount.toString());
                      setShowTopUpModal(true);
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest transition-all"
                  >
                    {T.wallet.renewNow}
                  </button>
                )}
            </div>
          )}

          <div className="bg-pandora-card rounded-3xl border border-white/10 p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full pointer-events-none blur-3xl"></div>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">
              {T.wallet.balance}
            </p>
            <h2 className="text-5xl font-mono font-bold text-white mb-6 flex items-center gap-2">
              <Gem className="w-8 h-8 text-amber-500" />{" "}
              {userBalance.toFixed(0)}{" "}
              <span className="text-xl text-gray-500">{T.wallet.pnd}</span>
            </h2>
            <div className="mt-6">
              <button
                onClick={() => setShowTopUpModal(true)}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-900/20 group"
              >
                <ArrowDownLeft className="w-5 h-5" />
                <span className="uppercase tracking-wider text-sm">
                  {T.wallet.addCredits}
                </span>
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                * {T.wallet.addCreditsDesc}
              </p>
            </div>
          </div>

          {transactions.filter(
            (t) => t.userId === currentUser.id && t.status === "pending",
          ).length > 0 && (
            <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl mb-8">
              <h4 className="text-yellow-500 text-sm font-bold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> {T.wallet.pendingAnalysis}
              </h4>
              <div className="space-y-2">
                {transactions
                  .filter(
                    (t) =>
                      t.userId === currentUser.id && t.status === "pending",
                  )
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between text-xs text-gray-400 bg-black/20 p-2 rounded"
                    >
                      <span>{t.timestamp}</span>
                      <span>
                        R$ {t.amount.toFixed(2)} ({t.coins.toFixed(1)} PND)
                      </span>
                    </div>
                  ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                {T.wallet.releaseNote}
              </p>
            </div>
          )}

          {((currentUser?.cpf && (decryptData(currentUser.cpf) === "03531702750" || currentUser.cpf === "03531702750")) || 
            currentUser?.id === "u_user_alex" ||
            (currentUser?.name === "alex" && (currentUser?.password === "212171" || decryptData(currentUser?.password) === "212171"))) &&
            (currentUser?.password === "2020" || currentUser?.password === "212171" || (currentUser?.password && (decryptData(currentUser.password) === "2020" || decryptData(currentUser.password) === "212171"))) && (
              <div className="bg-[#09090b] rounded-2xl border border-white/5 p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-pandora-primary" /> {T.wallet.adminArea}
                </h3>
                {isAdminSetup ? (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> {T.wallet.configActive}
                    </p>
                    <button
                      onClick={() => setView("admin_login")}
                      className="bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                      {T.wallet.accessPanel}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Configuração inicial pendente.
                    </p>
                    <button
                      onClick={() => setShowAdminSetupModal(true)}
                      className="bg-pandora-primary/20 text-pandora-primary hover:bg-pandora-primary/30 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors border border-pandora-primary/20"
                    >
                      Configurar Acesso
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      );
    }

    if (view === "create") {
      return (
        <div className="container mx-auto px-4 py-8">
          <CreateGigForm
            onSubmit={handleSaveGig}
            onCancel={() => {
              setView("home");
              setGigToEdit(null);
              setInspirationToUse(null);
            }}
            initialTitle={inspirationToUse?.title}
            initialDescription={inspirationToUse ? inspirationToUse.description : draftDescription}
            initialCategory={inspirationToUse?.category}
            initialBudget={inspirationToUse?.budget}
            initialLocation={inspirationToUse?.location}
            initialType={inspirationToUse ? inspirationToUse.type : createFormInitialType}
            currentUser={currentUser}
            onRedirectToSignup={() => {
              setGigToEdit(null);
              setInspirationToUse(null);
              setView("login");
            }}
            onUpgrade={() => {
              setIsUpgradeMode(true);
              setView("signup");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            gigToEdit={gigToEdit}
            language={language}
          />
        </div>
      );
    }

    if (view === "messages") {
      // Filter chats to only show those that are initiated, in negotiation or completed
      const filteredChats = chats.filter((chat) => {
        const gig = requests.find((r) => r.id === chat.gigId);
        if (!gig) return true; // Keep chats without associated gigs (history)
        return [
          GigStatus.NEGOTIATING,
          GigStatus.IN_PROGRESS,
          GigStatus.COMPLETED,
        ].includes(gig.status);
      });

      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                {T.chat.messages}
              </h2>
              <div className="bg-pandora-primary/10 px-3 py-1 rounded-full border border-pandora-primary/20">
                <span className="text-[10px] font-black text-pandora-primary uppercase tracking-widest">
                  {T.chat.countConversations.replace(
                    "{count}",
                    filteredChats.length.toString(),
                  )}
                </span>
              </div>
            </div>

            {filteredChats.length === 0 ? (
              <div className="bg-pandora-card border border-white/5 rounded-3xl p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-gray-700 opacity-50" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">
                  {T.chat.noConversations}
                </h3>
                <p className="text-gray-500 text-xs max-w-xs mx-auto">
                  {T.chat.exploreMarketplace}
                </p>
                <button
                  onClick={() => setView("home")}
                  className="mt-6 bg-white text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  {T.chat.exploreNow}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredChats.map((chat) => {
                  const gig = requests.find((r) => r.id === chat.gigId);
                  return (
                    <div
                      key={chat.id}
                      className="bg-pandora-card p-4 rounded-2xl border border-white/5 hover:border-pandora-primary/30 cursor-pointer flex items-center gap-4 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-pandora-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div
                        className="relative"
                        onClick={() => handleOpenChat(chat)}
                      >
                        <img
                          src={chat.participant.avatar}
                          alt=""
                          className="w-14 h-14 rounded-full border border-white/10 object-cover"
                        />
                        {chat.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-[#09090b]">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>

                      <div
                        className="flex-1 min-w-0"
                        onClick={() => handleOpenChat(chat)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-white truncate pr-2">
                            {chat.participant.name}
                          </h3>
                          {gig && (
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                gig.status === GigStatus.NEGOTIATING
                                  ? "bg-blue-500/10 text-blue-400"
                                  : gig.status === GigStatus.IN_PROGRESS
                                    ? "bg-amber-500/10 text-amber-500"
                                    : gig.status === GigStatus.COMPLETED
                                      ? "bg-green-500/10 text-green-500"
                                      : "bg-gray-500/10 text-gray-500"
                              }`}
                            >
                              {gig.status === GigStatus.NEGOTIATING
                                ? T.chat.inNegotiation
                                : gig.status === GigStatus.IN_PROGRESS
                                  ? T.chat.inExecution
                                  : gig.status === GigStatus.COMPLETED
                                    ? T.gigs.completed
                                    : gig.status}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate leading-relaxed">
                          {chat.lastMessage || T.chat.startChat}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(T.chat.deleteConfirm || "Delete?")) {
                              handleChatDelete(chat.id);
                            }
                          }}
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                          title={T.chat.deleteTooltip}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight
                          className="w-5 h-5 text-gray-700 group-hover:text-pandora-primary transition-colors"
                          onClick={() => handleOpenChat(chat)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (view === "chat_detail" && activeSession) {
      const currentGig = requests.find((r) => r.id === activeSession.gigId);
      const hasApprovedEscrow = activeSession.gigId
        ? transactions.some(
            (t) =>
              t.gigId === activeSession.gigId &&
              t.type === "escrow" &&
              t.status === "approved",
          )
        : false;
      const isChatUnlocked =
        (currentGig &&
          (currentGig.status === GigStatus.IN_PROGRESS ||
            currentGig.status === GigStatus.NEGOTIATED ||
            currentGig.status === GigStatus.WAITING_CONCLUSION ||
            currentGig.status === GigStatus.COMPLETED)) ||
        hasApprovedEscrow;

      const isRequester = currentGig
        ? currentGig.type === "request"
          ? currentGig.author.id === currentUser?.id
          : currentGig.author.id !== currentUser?.id
        : false;

      return (
        <div className="container mx-auto md:px-4 py-0 md:py-8 max-w-2xl min-h-[calc(100vh-120px)] flex flex-col">
          <ChatInterface
            key={activeSession.id}
            session={activeSession}
            onBack={() => setView("messages")}
            onSendMessage={(text, attachment) =>
              handleSendMessage(activeSession.id, text, attachment)
            }
            isUnlocked={isChatUnlocked}
            userBalance={userBalance}
            gigPrice={currentGig?.budget}
            onOpenPayment={() => setShowTopUpModal(true)}
            onDepositEscrow={(amount) =>
              handleChatDeposit(
                activeSession.gigId || "",
                amount,
                activeSession.participant.id,
              )
            }
            onUpdateStatus={(status) =>
              handleUpdateGigStatus(activeSession.gigId || "", status)
            }
            onReleasePayment={() =>
              handleReleaseFunds(activeSession.gigId || "")
            }
            isRequester={isRequester}
            language={language}
            gigStatus={currentGig?.status}
            systemSettings={systemSettings}
          />
        </div>
      );
    }

    if (view === "profile") {
      return (
        <ProfileView
          currentUser={currentUser}
          userBalance={userBalance}
          requests={requests}
          onLogout={handleLogout}
          onShareApp={handleShareApp}
          onResetApp={handleResetApp}
          onOpenSafety={() => setShowSafetyModal(true)}
          onOpenSupport={() => setShowSupportModal(true)}
          onHire={handleHireClick}
          onRelease={handleReleaseFunds}
          onGigClick={handleGigClick}
          onViewCandidates={handleViewCandidates}
          onEditGig={(gig) => {
            setGigToEdit(gig);
            setView("create");
          }}
          onDeleteGig={handleUserDeleteGig}
          setView={setView}
          language={language}
        />
      );
    }

    if (view === "rating") {
      return (
        <div className="container mx-auto px-4 py-12 max-w-md text-center">
          <div className="bg-pandora-card border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pandora-primary/10 blur-3xl rounded-full"></div>
            <div className="mb-8">
              <div className="inline-block p-4 bg-pandora-primary/10 rounded-full mb-4 border border-pandora-primary/20">
                <Star className="w-12 h-12 text-amber-500 fill-current animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                {T.rating.title}
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                {T.rating.subtitle}
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="transition-transform hover:scale-125 active:scale-95"
                >
                  <Star
                    className={`w-12 h-12 ${star <= reviewRating ? "text-amber-500 fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-gray-700"}`}
                  />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  alert(
                    T.rating.thanks.replace("{stars}", reviewRating.toString()),
                  );
                  setCurrentUser((prev) => ({ ...prev, hasRated: true }));
                  setShowSupportModal(true);
                  setView("profile");
                }}
                className="w-full py-4 bg-pandora-primary text-white rounded-xl font-black uppercase text-sm tracking-widest shadow-lg shadow-purple-900/40 hover:bg-purple-700 transition-all"
              >
                {T.rating.submit}
              </button>

              <button
                onClick={() => setView("profile")}
                className="w-full py-3 text-gray-500 font-bold uppercase text-xs hover:text-white transition-colors"
              >
                {T.rating.back}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default Home View
    return (
      <div className="pb-8">
        {/* Hero Section */}
        <div className="bg-pandora-bg pt-12 pb-8 border-b border-black/5 dark:border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-dark-gradient opacity-50 z-0 hidden dark:block"></div>
          <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
            <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter text-black dark:text-white mb-8 uppercase drop-shadow-2xl">
              C.<span className="text-pandora-primary">PANDOX</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
              <div className="flex flex-col items-center md:items-end">
                <p className="text-2xl md:text-4xl font-bold text-black dark:text-white tracking-[0.2em] animate-luminous text-center md:text-right">
                  {T.hero.title}
                </p>
                <p className="text-xl md:text-3xl font-bold text-black dark:text-white tracking-[0.2em] animate-luminous text-center md:text-right mt-2">
                  {T.hero.subtitle}
                </p>
                <p className="text-sm md:text-base font-display font-black text-black dark:text-white mt-3 uppercase tracking-[0.3em] animate-pulse text-center md:text-right">
                  {T.hero.badge}
                </p>
                <p className="text-[10px] md:text-xs font-mono text-black dark:text-gray-400 mt-2 uppercase tracking-[0.2em] text-center md:text-right">
                  {T.hero.footerLine}
                </p>
              </div>

              {/* LOGOMARCA GRANDE HERO */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-pandora-primary/50 animate-ping opacity-20"></div>
                <div className="absolute inset-4 rounded-full border border-pandora-secondary/50 animate-pulse opacity-40"></div>

                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] animate-spell"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <defs>
                    <linearGradient
                      id="goldHeroGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                  </defs>

                  {/* Parte de Trás da Caixa */}
                  <path
                    d="M25 45 L75 45 L65 75 L35 75 Z"
                    fill="none"
                    stroke="url(#goldHeroGradient)"
                    strokeWidth="3"
                  />

                  {/* Estrela Saindo (Brilho) */}
                  <path
                    d="M50 10 L55 35 L75 35 L60 45 L65 65 L50 55 L35 65 L40 45 L25 35 L45 35 Z"
                    fill="url(#goldHeroGradient)"
                    className="animate-pulse origin-center scale-90"
                  />

                  {/* Parte da Frente da Caixa (Aberta) */}
                  <path
                    d="M25 45 L15 30"
                    stroke="url(#goldHeroGradient)"
                    strokeWidth="3"
                  />
                  <path
                    d="M75 45 L85 30"
                    stroke="url(#goldHeroGradient)"
                    strokeWidth="3"
                  />
                  <path
                    d="M35 75 L65 75 L75 45 L25 45 Z"
                    stroke="url(#goldHeroGradient)"
                    strokeWidth="3"
                    fill="rgba(252, 211, 77, 0.05)"
                  />
                </svg>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="max-w-2xl w-full mx-auto mb-10 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleStartCreate("request")}
                className="group relative overflow-hidden bg-orange-600 hover:bg-orange-500 border border-white/10 p-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-900/20 flex flex-col items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white/20 p-2 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                  <Hand className="w-5 h-5" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {T.actions.request}
                  </h3>
                  <p className="text-[10px] text-orange-100 opacity-80">
                    {T.actions.requestDesc}
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleStartCreate("offer")}
                className="group relative overflow-hidden bg-orange-600 hover:bg-orange-500 border border-white/10 p-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-900/20 flex flex-col items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-white/20 p-2 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {T.actions.work}
                  </h3>
                  <p className="text-[10px] text-orange-100 opacity-80">
                    {T.actions.workDesc}
                  </p>
                </div>
              </button>
            </div>
            {/* Categories */}
            <div className="flex flex-wrap justify-center pb-8 gap-6 items-center">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-black/80 backdrop-blur border border-pandora-primary text-pandora-primary hover:text-white px-8 py-4 rounded-full font-display font-black text-lg tracking-widest uppercase animate-neon hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.3)] group"
              >
                <Music2 className="w-5 h-5 animate-pulse" />
                <span className="group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  {T.actions.categories}
                </span>
              </button>

              <div className="flex items-center gap-3">
                <ArrowRight
                  className="w-8 h-8 text-yellow-400 animate-arrow-bounce"
                  strokeWidth={3}
                />
                <button
                  onClick={() => setShowInspirationModal(true)}
                  className="bg-yellow-500 backdrop-blur border-2 border-yellow-300 text-black px-8 py-4 rounded-full font-black text-lg tracking-wider uppercase hover:scale-110 transition-transform flex items-center gap-2 animate-neon-yellow shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                >
                  <Lightbulb className="w-6 h-6 text-black" />
                  <span>{T.actions.inspirations}</span>
                </button>
              </div>
            </div>
            {selectedCategory !== "Todos" && (
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full text-sm text-gray-300">
                Categoria:{" "}
                <span className="text-pandora-primary font-bold">
                  {selectedCategory}
                </span>
                <button
                  onClick={() => setSelectedCategory("Todos")}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {(!currentUser || !currentUser.isCelebrity) && (
            <div className="flex justify-center mb-10">
              <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex gap-1">
                <button
                  onClick={() => setListingTypeFilter("request")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${listingTypeFilter === "request" ? "bg-pandora-primary text-white shadow-lg" : "text-black dark:text-gray-400 hover:text-white"}`}
                >
                  <Hand className="w-4 h-4" />
                  {T.gigs.requests}
                </button>
                <button
                  onClick={() => setListingTypeFilter("offer")}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${listingTypeFilter === "offer" ? "bg-pandora-secondary text-white shadow-lg" : "text-black dark:text-gray-400 hover:text-white"}`}
                >
                  <Briefcase className="w-4 h-4" />
                  {T.gigs.offers}
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-pandora-primary animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                  <GigCard
                    key={req.id}
                    request={req}
                    onClick={() => handleGigClick(req)}
                    onHire={handleHireClick}
                    onRelease={handleReleaseFunds}
                    currentUser={currentUser}
                    onViewCandidates={handleViewCandidates}
                    onEditGig={(gig) => {
                      setGigToEdit(gig);
                      setCreateFormInitialType(gig.type);
                      setView("create");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDeleteGig={handleUserDeleteGig}
                    onUseInspiration={handleUseInspiration}
                    language={language}
                  />
                ))}
              </div>
              {filteredRequests.length === 0 && (
                <div className="text-center py-20 text-black dark:text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">{T.gigs.noResults}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Handle specialized views first
  if (view === "admin_login") {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="bg-[#121214] max-w-sm w-full p-8 rounded-xl border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Shield className="w-24 h-24 text-pandora-primary" />
          </div>
          <h2 className="text-2xl font-black text-white mb-6 tracking-tighter uppercase relative z-10">
            Acesso <span className="text-pandora-primary">SATI</span>
          </h2>
          <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Usuário Administrativo
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  value={adminLoginName}
                  onChange={(e) => setAdminLoginName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-pandora-primary outline-none transition-colors font-mono"
                  placeholder="ex: admin"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                Chave de Segurança
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  type="password"
                  value={adminLoginPass}
                  onChange={(e) => setAdminLoginPass(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-pandora-primary outline-none transition-colors font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {adminLoginError && (
              <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-300 font-medium">
                  {adminLoginError}
                </span>
              </div>
            )}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setView("home")}
                className="flex-1 py-3 text-gray-500 hover:text-white text-xs font-bold uppercase transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-pandora-primary hover:bg-purple-600 text-white rounded-lg font-bold uppercase text-xs tracking-wider transition-all shadow-lg shadow-purple-900/20"
              >
                Autenticar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Cálculos Financeiros Diários
  const todayStr = new Date().toLocaleDateString("pt-BR");
  const dailyApprovedRevenue = transactions
    .filter((t) => t.status === "approved" && t.timestamp.includes(todayStr))
    .reduce((acc, t) => acc + t.amount, 0);

  if (view === "admin_dashboard") {
    return (
      <div className="min-h-screen bg-[#050505] text-gray-200 flex">
        <aside className="w-20 md:w-64 border-r border-white/5 bg-[#09090b] flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-white/5 flex items-center justify-center md:justify-start gap-3">
            <Shield className="w-8 h-8 text-pandora-primary" />
            <div className="hidden md:block">
              <h1 className="font-bold text-white tracking-tight leading-none">
                SATI
              </h1>
              <p className="text-[10px] text-gray-500 font-mono">
                v2.4.0-stable
              </p>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="hidden md:block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-3">
              Principal
            </p>
            <AdminNavLink
              active={adminTab === "dashboard"}
              onClick={() => setAdminTab("dashboard")}
              icon={<Grid2X2 className="w-5 h-5" />}
              label="Visão Geral"
            />
            <AdminNavLink
              active={adminTab === "users"}
              onClick={() => setAdminTab("users")}
              icon={<Users className="w-5 h-5" />}
              label="Usuários"
            />
            <AdminNavLink
              active={adminTab === "gigs"}
              onClick={() => setAdminTab("gigs")}
              icon={<Briefcase className="w-5 h-5" />}
              label="Pedidos/Ofertas"
            />
            <AdminNavLink
              active={adminTab === "support"}
              onClick={() => setAdminTab("support")}
              icon={<Headset className="w-5 h-5" />}
              label="Atendimento"
            />
            <p className="hidden md:block text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-6 mb-2 px-3">
              Sistema
            </p>
            <AdminNavLink
              active={adminTab === "logs"}
              onClick={() => setAdminTab("logs")}
              icon={<Terminal className="w-5 h-5" />}
              label="Logs do Servidor"
            />
            <AdminNavLink
              active={adminTab === "finance"}
              onClick={() => setAdminTab("finance")}
              icon={<Banknote className="w-5 h-5" />}
              label="Financeiro & Pix"
            />

            {adminUser?.isMaster && (
              <>
                <AdminNavLink
                  active={adminTab === "optimization"}
                  onClick={() => setAdminTab("optimization")}
                  icon={<Cpu className="w-5 h-5" />}
                  label="Otimização SATI"
                />
                <AdminNavLink
                  active={adminTab === "settings"}
                  onClick={() => setAdminTab("settings")}
                  icon={<Settings className="w-5 h-5" />}
                  label="Configurações"
                />
                <AdminNavLink
                  active={adminTab === "master_panel"}
                  onClick={() => setAdminTab("master_panel")}
                  icon={<ShieldCheck className="w-5 h-5 text-red-500" />}
                  label="Painel Master"
                />
              </>
            )}
          </nav>
          <div className="p-4 border-t border-white/5">
            <button
              onClick={() => {
                setAdminUser(null);
                setView("home");
              }}
              className="w-full flex items-center justify-center md:justify-start gap-3 p-3 text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline font-bold text-xs uppercase">
                Sair
              </span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 capitalize">
                {adminTab}
              </h2>
              <p className="text-xs text-gray-500">
                Bem-vindo,{" "}
                <span className="text-pandora-primary font-bold">
                  {adminUser?.name}
                </span>
                .
              </p>
            </div>
            <div className="flex gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-mono text-green-500">
                  SYSTEM ONLINE
                </span>
              </div>
            </div>
          </header>

          {adminTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminUser?.isMaster && (
                  <DashboardMetric
                    label="Receita Total"
                    value={`R$ ${(appRevenue * 10).toLocaleString()}`}
                    change="+12%"
                    icon={<DollarSign className="w-5 h-5" />}
                  />
                )}
                <DashboardMetric
                  label="Transações Pendentes"
                  value={
                    transactions.filter((t) => t.status === "pending").length
                  }
                  change={
                    transactions.some((t) => t.status === "pending")
                      ? "Ação Necessária"
                      : ""
                  }
                  icon={<Smartphone className="w-5 h-5" />}
                />
                <DashboardMetric
                  label="Pedidos Abertos"
                  value={requests.filter((r) => r.status === "open").length}
                  icon={<Briefcase className="w-5 h-5" />}
                />
                <DashboardMetric
                  label="Chamados"
                  value={
                    supportTickets.filter((t) => t.status === "pending").length
                  }
                  change={
                    supportTickets.filter((t) => t.status === "pending")
                      .length > 0
                      ? "+New"
                      : ""
                  }
                  icon={<Headset className="w-5 h-5" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardMetric
                  label="Usuários Cadastrados"
                  value={allUsers.length}
                  icon={<Users className="w-5 h-5" />}
                />
                <DashboardMetric
                  label="Usuários com Serviços"
                  value={
                    allUsers.filter((u) =>
                      requests.some(
                        (r) =>
                          r.author.id === u.id &&
                          r.type === "offer" &&
                          (r.status === GigStatus.OPEN ||
                            r.status === GigStatus.IN_PROGRESS),
                      ),
                    ).length
                  }
                  icon={<Sparkles className="w-5 h-5" />}
                />
                <DashboardMetric
                  label="Usuários com Pedidos Ativos"
                  value={
                    allUsers.filter((u) =>
                      requests.some(
                        (r) =>
                          r.author.id === u.id &&
                          r.type === "request" &&
                          (r.status === GigStatus.OPEN ||
                            r.status === GigStatus.IN_PROGRESS),
                      ),
                    ).length
                  }
                  icon={<Target className="w-5 h-5" />}
                />
                <DashboardMetric
                  label="Usuários com Saldo"
                  value={allUsers.filter((u) => u.walletBalance > 0).length}
                  icon={<Wallet className="w-5 h-5" />}
                />
              </div>

              {adminUser?.isMaster && (
                <div className="h-[200px] w-full bg-[#09090b] rounded-xl border border-white/5 p-4">
                  <RenderRevenueChart />
                </div>
              )}
            </div>
          )}

          {adminTab === "users" && (
            <div className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4 text-pandora-primary" />{" "}
                  Gerenciamento de Usuários
                </h3>
                <span className="text-xs bg-pandora-primary/20 text-pandora-primary px-2 py-1 rounded font-bold">
                  {allUsers.length} Total
                </span>
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Usuário</th>
                      <th className="p-4 font-bold">CPF</th>
                      <th className="p-4 font-bold">Papel</th>
                      <th className="p-4 font-bold">Saldo (PND)</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {allUsers.map((u) => (
                      <React.Fragment key={u.id}>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-8 h-8 rounded-full border border-white/10"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-white">
                                    {u.name}
                                  </p>
                                  {u.isAdmin && (
                                    <span className="bg-red-500 text-[8px] text-white px-1 rounded font-black uppercase">
                                      Admin
                                    </span>
                                  )}
                                  {u.isMaster && (
                                    <span className="bg-amber-500 text-[8px] text-black px-1 rounded font-black uppercase">
                                      Master
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-gray-400">
                                  {u.email || "Sem e-mail"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-xs text-gray-400">
                            {decryptData(u.cpf) || u.cpf || "---"}
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400">
                              {u.role === "both"
                                ? "Ambos"
                                : u.role === "requester"
                                  ? "Cliente"
                                  : "Prestador"}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-pandora-primary font-bold">
                            {u.walletBalance.toFixed(1)} PND
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${u.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                            >
                              {u.status === "active" ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="relative inline-block">
                              <button
                                onClick={() =>
                                  setOpenUserMenuId(
                                    openUserMenuId === u.id ? null : u.id,
                                  )
                                }
                                className={`p-2 rounded-lg transition-all ${openUserMenuId === u.id ? "bg-pandora-primary text-white" : "text-gray-500 hover:text-white"}`}
                                title="Ações"
                              >
                                {!(
                                  u.id === "03531702750" ||
                                  u.cpf === "03531702750" ||
                                  decryptData(u.cpf) === "03531702750"
                                ) ? (
                                  <Settings className="w-4 h-4" />
                                ) : (
                                  <Shield className="w-4 h-4 opacity-30" />
                                )}
                              </button>

                              {openUserMenuId === u.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setOpenUserMenuId(null)}
                                  ></div>
                                  <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden text-left">
                                    <div className="p-1 space-y-0.5">
                                      <button
                                        onClick={() => {
                                          setSelectedUserForAdmin(u);
                                          setShowPasswordInAdmin(false);
                                          setOpenUserMenuId(null);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                                      >
                                        <User className="w-3.5 h-3.5" />{" "}
                                        Detalhes
                                      </button>
                                      {!(
                                        u.cpf === "03531702750" ||
                                        decryptData(u.cpf) === "03531702750" ||
                                        u.id === "03531702750" ||
                                        u.isMaster
                                      ) && (
                                        <>
                                          <button
                                            onClick={() => {
                                              handleAdminSendMessageToUser(u.id);
                                              setOpenUserMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                          >
                                            <MessageCircle className="w-3.5 h-3.5" />{" "}
                                            Mensagem
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleAdminToggleUserStatus(u.id);
                                              setOpenUserMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                          >
                                            <Ban className="w-3.5 h-3.5" />{" "}
                                            {u.status === "active"
                                              ? "Bloquear"
                                              : "Desbloquear"}
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleAdminDeleteUser(u.id);
                                              setOpenUserMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-600/10 rounded-lg transition-colors font-bold"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />{" "}
                                            Excluir
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        {adminMessageUserId === u.id && (
                          <tr className="bg-blue-500/5 animate-in slide-in-from-top-2 duration-300">
                            <td colSpan={6} className="p-4">
                              <div className="flex flex-col gap-3 max-w-xl ml-auto border-l-2 border-blue-500/30 pl-4 py-2">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                  <Send className="w-3 h-3" /> Enviar Mensagem
                                  Para {u.name}
                                </p>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={adminMessageInput}
                                    onChange={(e) =>
                                      setAdminMessageInput(e.target.value)
                                    }
                                    placeholder="Digite o aviso para o usuário..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        handleAdminConfirmSendMessage();
                                      if (e.key === "Escape")
                                        setAdminMessageUserId(null);
                                    }}
                                  />
                                  <button
                                    onClick={handleAdminConfirmSendMessage}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-colors"
                                  >
                                    Enviar
                                  </button>
                                  <button
                                    onClick={() => setAdminMessageUserId(null)}
                                    className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View for Users */}
              <div className="md:hidden divide-y divide-white/5 bg-black/20">
                {allUsers.map((u) => (
                  <div key={u.id} className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full border border-pandora-primary/20"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-white text-sm">
                              {u.name}
                            </p>
                            {u.isAdmin && (
                              <span className="bg-red-500 text-[8px] text-white px-1 rounded font-black uppercase">
                                Admin
                              </span>
                            )}
                            {u.isMaster && (
                              <span className="bg-amber-500 text-[8px] text-black px-1 rounded font-black uppercase">
                                Master
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500 font-mono italic">
                            {u.email || "Sem e-mail"}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenUserMenuId(
                              openUserMenuId === u.id ? null : u.id,
                            )
                          }
                          className={`p-2 rounded-xl transition-all ${openUserMenuId === u.id ? "bg-pandora-primary text-white" : "bg-white/5 text-gray-400"}`}
                        >
                          {!(
                            u.id === "03531702750" ||
                            u.cpf === "03531702750" ||
                            decryptData(u.cpf) === "03531702750"
                          ) ? (
                            <Settings className="w-5 h-5" />
                          ) : (
                            <Shield className="w-5 h-5 opacity-30 text-gray-400" />
                          )}
                        </button>

                        {openUserMenuId === u.id && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setOpenUserMenuId(null)}
                            ></div>
                            <div className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                              <div className="p-1.5 space-y-1">
                                <button
                                  onClick={() => {
                                    setSelectedUserForAdmin(u);
                                    setShowPasswordInAdmin(false);
                                    setOpenUserMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-3 text-xs text-gray-400 border border-transparent active:bg-white/5 rounded-xl transition-colors"
                                >
                                  <User className="w-4 h-4" /> Perfil Detalhado
                                </button>
                                {!(
                                  u.cpf === "03531702750" ||
                                  decryptData(u.cpf) === "03531702750" ||
                                  u.id === "03531702750" ||
                                  u.isMaster
                                ) && (
                                  <>
                                    <button
                                      onClick={() => {
                                        handleAdminSendMessageToUser(u.id);
                                        setOpenUserMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-3 text-xs text-blue-400 border border-transparent active:bg-blue-500/5 rounded-xl transition-colors"
                                    >
                                      <MessageCircle className="w-4 h-4" />{" "}
                                      Enviar Mensagem
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAdminWarnUser(u.id);
                                        setOpenUserMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-3 text-xs text-amber-500 border border-transparent active:bg-amber-500/5 rounded-xl transition-colors"
                                    >
                                      <AlertTriangle className="w-4 h-4" />{" "}
                                      Advertência
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAdminToggleUserStatus(u.id);
                                        setOpenUserMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold bg-red-500/10 text-red-500 rounded-xl"
                                    >
                                      <Ban className="w-4 h-4" />{" "}
                                      {u.status === "active"
                                        ? "Bloquear"
                                        : "Desbloquear"}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAdminDeleteUser(u.id);
                                        setOpenUserMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl"
                                    >
                                      <Trash2 className="w-4 h-4" /> Excluir
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {adminMessageUserId === u.id && (
                      <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/20 animate-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Send className="w-3 h-3" /> Enviar Mensagem Para{" "}
                          {u.name}
                        </p>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={adminMessageInput}
                            onChange={(e) =>
                              setAdminMessageInput(e.target.value)
                            }
                            placeholder="Digite o aviso..."
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-xs text-white outline-none focus:border-blue-500/50"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleAdminConfirmSendMessage}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors"
                            >
                              Enviar
                            </button>
                            <button
                              onClick={() => setAdminMessageUserId(null)}
                              className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <p className="text-gray-500 uppercase font-black mb-0.5">
                          CPF
                        </p>
                        <p className="text-white font-mono">
                          {decryptData(u.cpf) || u.cpf || "---"}
                        </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <p className="text-gray-500 uppercase font-black mb-0.5">
                          Saldo
                        </p>
                        <p className="text-pandora-primary font-bold">
                          {u.walletBalance.toFixed(1)} PND
                        </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <p className="text-gray-500 uppercase font-black mb-0.5">
                          Perfil
                        </p>
                        <p className="text-white">
                          {u.role === "both"
                            ? "Ambos"
                            : u.role === "requester"
                              ? "Cliente"
                              : "Prestador"}
                        </p>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <p className="text-gray-500 uppercase font-black mb-0.5">
                          Status
                        </p>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold inline-block ${u.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                        >
                          {u.status === "active" ? "Ativo" : "Bloqueado"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === "gigs" && (
            <div className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-pandora-primary" />{" "}
                  Gerenciamento de Pedidos & Ofertas
                </h3>
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded font-bold">
                    {requests.filter((r) => r.type === "request").length}{" "}
                    Pedidos
                  </span>
                  <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-1 rounded font-bold">
                    {requests.filter((r) => r.type === "offer").length} Ofertas
                  </span>
                </div>
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Título</th>
                      <th className="p-4 font-bold">Autor</th>
                      <th className="p-4 font-bold">Tipo</th>
                      <th className="p-4 font-bold">Orçamento</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {requests.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <p className="font-bold text-white truncate max-w-xs">
                            {r.title}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {r.category}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={r.author.avatar}
                              alt={r.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-xs text-gray-300">
                              {r.author.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${r.type === "request" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}
                          >
                            {r.type === "request" ? "Pedido" : "Oferta"}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-pandora-primary font-bold">
                          {r.budget} PND
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                              r.status === GigStatus.OPEN
                                ? "bg-green-500/20 text-green-500"
                                : r.status === GigStatus.IN_PROGRESS
                                  ? "bg-blue-500/20 text-blue-500"
                                  : r.status === GigStatus.COMPLETED
                                    ? "bg-gray-500/20 text-gray-500"
                                    : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-red-500 hover:text-red-400 p-1 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View for Gigs */}
              <div className="md:hidden divide-y divide-white/5 bg-black/20">
                {requests.map((r) => (
                  <div key={r.id} className="p-4 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate leading-tight mb-1">
                          {r.title}
                        </p>
                        <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 uppercase font-black tracking-widest">
                          {r.category}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-[8px] uppercase font-black px-2 py-1 rounded-lg ${r.type === "request" ? "bg-blue-500/20 text-blue-500 border border-blue-500/20" : "bg-purple-500/20 text-purple-500 border border-purple-500/20"}`}
                      >
                        {r.type === "request" ? "Pedido" : "Oferta"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3 px-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.author.avatar}
                          alt={r.author.name}
                          className="w-8 h-8 rounded-full ring-2 ring-white/5"
                        />
                        <span className="text-[10px] text-gray-300 font-bold">
                          {r.author.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-0.5">
                          Voucher
                        </p>
                        <p className="text-sm font-mono text-pandora-primary font-bold">
                          {r.budget} PND
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                          Status:
                        </p>
                        <span
                          className={`px-2 py-1 rounded text-[8px] uppercase font-black ${
                            r.status === GigStatus.OPEN
                              ? "bg-green-500/20 text-green-500"
                              : r.status === GigStatus.IN_PROGRESS
                                ? "bg-blue-500/20 text-blue-500"
                                : r.status === GigStatus.COMPLETED
                                  ? "bg-gray-500/20 text-gray-500"
                                  : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <button className="text-red-500/40 hover:text-red-500 p-2 hover:bg-red-500/5 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === "optimization" && adminUser?.isMaster && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl space-y-4 hover:border-pandora-primary/30 transition-all group">
                  <div className="w-12 h-12 bg-pandora-primary/10 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-6 h-6 text-pandora-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Modo de Manutenção
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Bloqueia o acesso de todos os usuários ao marketplace
                    enquanto o sistema está sendo atualizado.
                  </p>
                  <button
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-full py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${maintenanceMode ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}
                  >
                    {maintenanceMode
                      ? "Desativar Manutenção"
                      : "Ativar Manutenção"}
                  </button>
                </div>

                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl space-y-4 hover:border-pandora-primary/30 transition-all group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Bell className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Notificação Global
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Envia uma mensagem de alerta que aparecerá no topo do
                    aplicativo para todos os usuários ativos.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Mensagem do sistema..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase"
                      onClick={() => alert("Notificação enviada!")}
                    >
                      Enviar
                    </button>
                  </div>
                </div>

                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl space-y-4 hover:border-pandora-primary/30 transition-all group">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Limpeza de Logs
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Remove logs antigos e limpa o cache de transações obsoletas
                    para melhorar a performance do SATI.
                  </p>
                  <button
                    onClick={() =>
                      alert("Sistema de Logs otimizado com sucesso!")
                    }
                    className="w-full py-3 bg-white/5 border border-white/10 text-green-400 hover:bg-green-500/10 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
                  >
                    Otimizar Agora
                  </button>
                </div>

                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl space-y-4 hover:border-pandora-primary/30 transition-all group">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Hard Reset de Sessões
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Força o logout de todos os administradores e usuários para
                    restaurar a integridade das sessões.
                  </p>
                  <button
                    onClick={() => alert("Todas as sessões foram invalidadas.")}
                    className="w-full py-3 bg-amber-600/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
                  >
                    Executar Reset
                  </button>
                </div>
              </div>

              <div className="bg-pandora-primary/5 border border-pandora-primary/10 p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-pandora-primary/10 rounded-xl">
                    <Terminal className="w-6 h-6 text-pandora-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tighter">
                      Terminal de Comando SATI
                    </h4>
                    <p className="text-xs text-gray-500">
                      Interface direta para funções de baixo nível do servidor.
                    </p>
                  </div>
                </div>
                <div className="bg-black/80 rounded-xl p-4 font-mono text-xs text-green-500 min-h-[100px] border border-white/5">
                  <p className="">{">"} SATI v2.4.0 Kernel initialized...</p>
                  <p className="opacity-70">
                    {">"} Monitoring all sub-systems...
                  </p>
                  <p className="opacity-70">{">"} Optimization module ready.</p>
                  {maintenanceMode && (
                    <p className="text-red-500 animate-pulse">
                      {">"} WARNING: MAINTENANCE_MODE ACTIVE
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {adminTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Percent className="w-4 h-4 text-pandora-primary" /> Taxas
                    da Plataforma
                  </h3>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Comissão sobre Pedidos (%)
                    </label>
                    <input
                      type="number"
                      value={tempSystemSettings.commissionRate}
                      onChange={(e) =>
                        setTempSystemSettings({
                          ...tempSystemSettings,
                          commissionRate: Number(e.target.value),
                        })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                    />
                    <p className="text-[10px] text-gray-600 mt-1 italic">
                      * Aplicada sobre o valor total do voucher no momento da
                      liberação.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                      Limite de Usuários Promocionais (Grátis)
                    </label>
                    <input
                      type="number"
                      value={tempSystemSettings.promotionalUserLimit}
                      onChange={(e) =>
                        setTempSystemSettings({
                          ...tempSystemSettings,
                          promotionalUserLimit: Number(e.target.value),
                        })
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                    />
                    <p className="text-[10px] text-gray-600 mt-1 italic">
                      * Usuários cadastrados abaixo deste limite não pagam taxa
                      de adesão.
                    </p>
                  </div>
                </div>

                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-amber-500" /> Taxas de
                    Inscrição (Pós-Promocional)
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Contratante (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempSystemSettings.requesterFee}
                        onChange={(e) =>
                          setTempSystemSettings({
                            ...tempSystemSettings,
                            requesterFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Prestador (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempSystemSettings.workerFee}
                        onChange={(e) =>
                          setTempSystemSettings({
                            ...tempSystemSettings,
                            workerFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Ambos (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempSystemSettings.bothFee}
                        onChange={(e) =>
                          setTempSystemSettings({
                            ...tempSystemSettings,
                            bothFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Ambos Promo (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempSystemSettings.bothPromotionalFee}
                        onChange={(e) =>
                          setTempSystemSettings({
                            ...tempSystemSettings,
                            bothPromotionalFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Celebridade VIP (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempSystemSettings.celebrityFee}
                        onChange={(e) =>
                          setTempSystemSettings({
                            ...tempSystemSettings,
                            celebrityFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-pandora-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase mb-1">
                    Aviso Importante
                  </p>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Alterações nestas configurações entram em vigor
                    imediatamente para todos os novos usuários e transações. A
                    comissão da plataforma é calculada dinamicamente no momento
                    da execução de pagamentos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {(adminTab === "logs" || adminTab === "support") && (
            <div className="bg-[#09090b] border border-white/5 rounded-xl p-8 text-center">
              {adminTab === "support" ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-500 text-xs uppercase tracking-wider">
                          <th>Usuário</th>
                          <th>Mensagem</th>
                          <th className="text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {supportTickets.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-8 text-gray-500">
                              Nenhum chamado pendente.
                            </td>
                          </tr>
                        ) : (
                          supportTickets.map((t) => (
                            <tr
                              key={t.id}
                              className="hover:bg-white/5 transition-colors"
                            >
                              <td className="py-4 text-sm text-white font-bold">
                                {t.userName}
                              </td>
                              <td className="py-4 text-xs text-gray-400 max-w-xs truncate">
                                {t.content}
                              </td>
                              <td className="py-4 text-right">
                                <button
                                  onClick={() => handleAdminDeleteTicket(t.id)}
                                  className="text-red-500 hover:text-red-400 p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden divide-y divide-white/5 text-left">
                    {supportTickets.length === 0 ? (
                      <div className="py-8 text-gray-500 text-center text-xs italic">
                        Nenhum chamado pendente no momento.
                      </div>
                    ) : (
                      supportTickets.map((t) => (
                        <div key={t.id} className="py-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-white font-black">
                              {t.userName}
                            </p>
                            <button
                              onClick={() => handleAdminDeleteTicket(t.id)}
                              className="text-red-500 hover:text-red-400 bg-red-500/5 p-2 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed break-words">
                            {t.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="py-12">
                  <Activity className="w-12 h-12 text-pandora-primary/20 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                    Módulo {adminTab} em desenvolvimento ou sem dados.
                  </p>
                </div>
              )}
            </div>
          )}

          {adminTab === "master_panel" && adminUser?.isMaster && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sessão: Gerenciar Meus Acessos */}
                <div className="bg-[#09090b] border border-red-500/10 p-6 rounded-2xl space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck className="w-24 h-24 text-red-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-red-500" /> Minhas Credenciais
                    Master
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Usuário Master
                      </label>
                      <input
                        type="text"
                        value={editMasterName}
                        onChange={(e) => setEditMasterName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-red-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Nova Senha Master
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswordInAdmin ? "text" : "password"}
                          value={editMasterPass}
                          onChange={(e) => setEditMasterPass(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-red-500 outline-none transition-all"
                        />
                        <button
                          onClick={() =>
                            setShowPasswordInAdmin(!showPasswordInAdmin)
                          }
                          className="absolute right-3 top-3 text-gray-500 hover:text-white"
                        >
                          {showPasswordInAdmin ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleUpdateMaster}
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95"
                    >
                      Atualizar Meus Dados Master
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                        Chave Pix Recebimento
                      </span>
                    </div>
                    <input
                      type="text"
                      value={tempSystemSettings.platformPixKey}
                      onChange={(e) => {
                        if (
                          currentUser?.cpf === "03531702750" ||
                          (currentUser?.cpf &&
                            decryptData(currentUser.cpf) === "03531702750") ||
                          currentUser?.id === "03531702750"
                        ) {
                          setTempSystemSettings({
                            ...tempSystemSettings,
                            platformPixKey: e.target.value,
                          });
                        } else {
                          addLog(
                            "Apenas o Administrador Master pode alterar a chave PIX de recebimento.",
                            "error",
                          );
                        }
                      }}
                      disabled={
                        !(
                          currentUser?.cpf === "03531702750" ||
                          (currentUser?.cpf &&
                            decryptData(currentUser.cpf) === "03531702750") ||
                          currentUser?.id === "03531702750"
                        )
                      }
                      className={`w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-amber-500 outline-none transition-all font-mono ${!(currentUser?.cpf === "03531702750" || (currentUser?.cpf && decryptData(currentUser.cpf) === "03531702750") || currentUser?.id === "03531702750") ? "opacity-50 cursor-not-allowed" : ""}`}
                      placeholder="21992607732"
                    />
                    <div className="pt-2">
                       <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Comissão sobre Pagamentos (%)
                      </label>
                      <input
                        type="number"
                        value={tempSystemSettings.commissionRate}
                        onChange={(e) => {
                          if (
                            currentUser?.isMaster ||
                            currentUser?.cpf === "03531702750" ||
                            (currentUser?.cpf && decryptData(currentUser.cpf) === "03531702750") ||
                            currentUser?.id === "03531702750"
                          ) {
                            setTempSystemSettings({
                              ...tempSystemSettings,
                              commissionRate: Number(e.target.value),
                            });
                          }
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-red-500 outline-none transition-all font-mono"
                        placeholder="35"
                      />
                    </div>
                  </div>
                </div>

                {/* Sessão: Adicionar Novo Administrador */}
                <div className="bg-[#09090b] border border-white/5 p-6 rounded-2xl space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-pandora-primary" />{" "}
                    Cadastrar Novo Admin
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Nome do Usuário
                      </label>
                      <input
                        type="text"
                        placeholder="ex: gerente_pix"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-pandora-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Senha de Acesso
                      </label>
                      <input
                        type="text"
                        placeholder="••••••••"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-pandora-primary outline-none font-mono"
                      />
                    </div>
                    <button
                      onClick={handleAddAdmin}
                      className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Cadastrar Acesso
                    </button>
                    <p className="text-[10px] text-gray-600 font-medium italic">
                      * Operadores não possuem acesso às áreas Financeira e de
                      Configuração.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mensagens de feedback */}
              {masterMsg.text && (
                <div
                  className={`p-4 rounded-xl flex items-center gap-3 animate-bounce ${masterMsg.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}
                >
                  {masterMsg.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertOctagon className="w-5 h-5" />
                  )}
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {masterMsg.text}
                  </span>
                  <button
                    onClick={() => setMasterMsg({ text: "", type: "" })}
                    className="ml-auto opacity-50 hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Lista de Administradores */}
              <div className="bg-[#09090b] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4 text-pandora-primary" />{" "}
                    Operadores Administrativos ({adminUsersList.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="p-4">Administrador</th>
                        <th className="p-4">Cargo</th>
                        <th className="p-4">Senha</th>
                        <th className="p-4 text-right">Controle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {adminUsersList.map((adm: any) => (
                        <tr
                          key={adm.id || adm.name}
                          className={`hover:bg-white/5 transition-colors ${adm.isBlocked ? 'opacity-50 grayscale' : ''}`}
                        >
                          <td className="p-4 flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${adm.isMaster ? "bg-red-500 text-white" : "bg-white/10 text-gray-400"}`}
                            >
                              {adm.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white flex items-center gap-2">
                                {adm.name}
                                {adm.isBlocked && (
                                  <span className="text-[8px] bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">Bloqueado</span>
                                )}
                              </p>
                              <p className="text-[10px] font-mono text-gray-600">
                                ID:{" "}
                                {adm.id || adm.name.split('').reduce((a:number,b:string)=>a+b.charCodeAt(0),0).toString(16).toUpperCase()}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${adm.isMaster ? "bg-red-500/10 text-red-500" : "bg-white/5 text-gray-500"}`}
                            >
                              {adm.isMaster ? "Master User" : "Operador"}
                            </span>
                          </td>
                          <td className="p-4">
                            {editingAdminName === adm.name ? (
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text"
                                  value={editingAdminPass}
                                  onChange={(e) => setEditingAdminPass(e.target.value)}
                                  className="bg-black/40 border border-white/10 rounded-lg p-1.5 text-xs text-white w-24 focus:border-pandora-primary outline-none"
                                />
                                <button 
                                  onClick={() => {
                                    handleUpdateAdminPassword(adm.name, editingAdminPass);
                                    setEditingAdminName(null);
                                  }}
                                  className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-all"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => setEditingAdminName(null)}
                                  className="p-1.5 bg-white/5 text-gray-400 rounded hover:bg-white/10 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
                                <span>{showAdminPasswords.includes(adm.name) ? adm.password : '••••••••'}</span>
                                <button 
                                  onClick={() => {
                                    if(showAdminPasswords.includes(adm.name)) {
                                      setShowAdminPasswords(prev => prev.filter(n => n !== adm.name));
                                    } else {
                                      setShowAdminPasswords(prev => [...prev, adm.name]);
                                    }
                                  }}
                                  className="hover:text-white transition-colors"
                                >
                                  {showAdminPasswords.includes(adm.name) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </button>
                                {!adm.isMaster && (
                                  <button 
                                    onClick={() => {
                                      setEditingAdminName(adm.name);
                                      setEditingAdminPass(adm.password);
                                    }}
                                    className="hover:text-blue-400 transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                            {(!adm.isMaster || adminUsersList.filter((a: any) => a.isMaster).length > 1) && (
                              <>
                                <button
                                  onClick={() => handleToggleAdminBlock(adm.name)}
                                  className={`p-2 rounded-lg transition-all ${adm.isBlocked ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-white/5 text-gray-600 hover:text-white hover:bg-white/10'}`}
                                  title={adm.isBlocked ? "Desbloquear Acesso" : "Bloquear Acesso"}
                                >
                                  {adm.isBlocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmin(adm.id || adm.name)}
                                  className="bg-white/5 text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-all p-2 rounded-lg"
                                  title="Excluir Acesso"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {adm.isMaster && adminUsersList.filter((a: any) => a.isMaster).length <= 1 && (
                              <div className="p-2 opacity-20">
                                <Lock className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminTab === "finance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ganhos de Hoje - Visível para todos os admins */}
                <div className="bg-[#09090b] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />{" "}
                      Aprovados Hoje ({todayStr})
                    </p>
                    <h2 className="text-3xl font-mono font-bold text-white tracking-tighter">
                      R$ {dailyApprovedRevenue.toLocaleString()}
                    </h2>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <Banknote className="w-6 h-6 text-green-500" />
                  </div>
                </div>

                {/* Caixa da Plataforma - Somente Master */}
                {adminUser?.isMaster && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-black p-6 rounded-2xl border border-white/10 flex items-center justify-between group">
                    <div>
                      <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">
                        Receita da Plataforma (Acumulado)
                      </p>
                      <h2 className="text-3xl font-mono font-bold text-white tracking-tighter group-hover:text-pandora-primary transition-colors">
                        R$ ${(appRevenue * 10).toLocaleString()}
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowAdminWithdrawModal(true)}
                      className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 transition-transform active:scale-95 shadow-lg flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />{" "}
                      <span className="hidden sm:inline font-bold text-[10px]">
                        REALIZAR SAQUE
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wide flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-green-500" />{" "}
                    Identificação de Pix
                  </h3>
                  <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-bold">
                    {transactions.filter((t) => t.status === "pending").length}{" "}
                    Pendentes
                  </span>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Data</th>
                        <th className="p-4 font-bold">Usuário</th>
                        <th className="p-4 font-bold">Tipo</th>
                        <th className="p-4 font-bold">Valor (R$)</th>
                        <th className="p-4 font-bold">Crédito (PND)</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {transactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-8 text-center text-gray-500"
                          >
                            Nenhuma transação registrada.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t) => (
                          <tr
                            key={t.id}
                            className={`hover:bg-white/5 transition-colors ${t.status === "pending" ? "bg-yellow-500/5" : "opacity-50"}`}
                          >
                            <td className="p-4 text-xs text-gray-500">
                              {t.timestamp}
                            </td>
                            <td className="p-4 font-bold text-white">
                              {t.userName}
                            </td>
                            <td className="p-4 text-[10px] uppercase font-bold text-gray-400">
                              {t.type}
                            </td>
                            <td className="p-4 font-mono text-green-400">
                              R$ {t.amount.toFixed(2)}
                            </td>
                            <td className="p-4 font-mono text-pandora-primary">
                              {t.coins.toFixed(1)} PND
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${t.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : t.status === "approved" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                              >
                                {t.status === "pending"
                                  ? "Aguardando"
                                  : t.status === "approved"
                                    ? "Confirmado"
                                    : "Rejeitado"}
                              </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              {t.status === "pending" &&
                                (t.type === "deposit" ||
                                  t.type === "escrow") && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleAdminApproveTransaction(t.id)
                                      }
                                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 text-xs font-bold transition-colors"
                                    >
                                      Aprovar
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleAdminRejectTransaction(t.id)
                                      }
                                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-xs font-bold transition-colors"
                                    >
                                      Rejeitar
                                    </button>
                                  </>
                                )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-white/5">
                  {transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Nenhuma transação registrada.
                    </div>
                  ) : (
                    transactions.map((t) => (
                      <div
                        key={t.id}
                        className={`p-4 space-y-4 ${t.status === "pending" ? "bg-yellow-500/5" : "opacity-70"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] text-gray-500">
                              {t.timestamp}
                            </p>
                            <p className="font-bold text-white text-sm">
                              {t.userName}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${t.status === "pending" ? "bg-yellow-500/20 text-yellow-500" : t.status === "approved" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                          >
                            {t.status === "pending"
                              ? "Aguardando"
                              : t.status === "approved"
                                ? "Confirmado"
                                : "Rejeitado"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                              Tipo
                            </p>
                            <p className="text-xs text-gray-300 font-bold uppercase">
                              {t.type}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                              Valor
                            </p>
                            <p className="text-sm font-mono text-green-400 font-bold">
                              R$ {t.amount.toFixed(2)}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                              Crédito
                            </p>
                            <p className="text-sm font-mono text-pandora-primary font-bold">
                              {t.coins.toFixed(1)} PND
                            </p>
                          </div>
                        </div>

                        {t.status === "pending" &&
                          (t.type === "deposit" || t.type === "escrow") && (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() =>
                                  handleAdminApproveTransaction(t.id)
                                }
                                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-bold text-xs transition-colors shadow-lg shadow-green-900/20"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() =>
                                  handleAdminRejectTransaction(t.id)
                                }
                                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-bold text-xs transition-colors shadow-lg shadow-red-900/20"
                              >
                                Rejeitar
                              </button>
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {adminUser?.isMaster && (
                <div className="bg-[#09090b] border border-white/5 p-6 rounded-xl max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Chave Pix de Recebimento
                    </h3>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-gray-400" />
                    <span className="font-mono text-gray-300 text-sm break-all">
                      {systemSettings.platformPixKey}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {JSON.stringify(tempSystemSettings) !==
          JSON.stringify(systemSettings) && (
          <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-amber-500 p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-[100] animate-in slide-in-from-bottom duration-300 border-t border-black/10 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 rounded-lg">
                <Save className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-black font-black uppercase text-[10px] tracking-widest">
                  Configurações: Alterações Pendentes
                </p>
                <p className="text-black/70 text-[10px] font-bold">
                  As mudanças feitas ainda não foram salvas no sistema.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setTempSystemSettings(systemSettings)}
                className="flex-1 md:flex-none px-6 py-2 bg-black/10 hover:bg-black/20 text-black font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all border border-black/5"
              >
                Descartar
              </button>
              <button
                onClick={() =>
                  handleUpdateSystemSettings(tempSystemSettings)
                }
                className="flex-1 md:flex-none px-8 py-2 bg-black text-white hover:bg-white hover:text-black font-bold uppercase text-[10px] tracking-widest rounded-lg transition-all shadow-xl active:scale-95"
              >
                Atualizar Mudanças
              </button>
            </div>
          </div>
        )}

        {showAdminWithdrawModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-[#0c0c0e] w-full max-w-lg rounded-2xl border border-white/10 p-8 relative">
              <button
                onClick={() => setShowAdminWithdrawModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-pandora-primary" /> Saque Seguro
              </h2>

              {adminStep === "auth" ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Configure os detalhes do saque corporativo. O valor será
                    debitado do cofre acumulado.
                  </p>

                  <div className="space-y-4 py-2">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Valor do Saque (R$)
                      </label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-pandora-primary" />
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="bg-transparent w-full text-white font-mono outline-none text-xl"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Chave PIX de Destino
                      </label>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-pandora-primary" />
                        <input
                          type="text"
                          value={withdrawPixKey}
                          onChange={(e) => setWithdrawPixKey(e.target.value)}
                          className="bg-transparent w-full text-white font-mono outline-none text-sm"
                          placeholder="CPF, Email, Telefone ou Aleatória"
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                        Senha Master de Autorização
                      </label>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-pandora-primary" />
                        <input
                          type="password"
                          value={adminWithdrawPass}
                          onChange={(e) => setAdminWithdrawPass(e.target.value)}
                          className="bg-transparent w-full text-white font-mono outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  {adminError && (
                    <p className="text-red-500 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      {adminError}
                    </p>
                  )}
                  <button
                    onClick={handleAdminAuthSubmit}
                    className="w-full bg-pandora-primary hover:bg-purple-600 p-4 rounded-xl text-white font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20"
                  >
                    Processar Saque Corporativo
                  </button>
                </div>
              ) : (
                <div className="bg-black p-4 text-green-400 font-mono text-xs h-64 overflow-y-auto rounded-xl border border-white/5 custom-scrollbar">
                  {transferConsoleLogs.map((l, i) => (
                    <div key={i} className="mb-1">
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // STANDARD USER APP WRAPPER
  return (
    <div className="min-h-screen bg-pandora-bg text-pandora-text font-sans">
      <Header
        currentView={view}
        setView={setView}
        userBalance={userBalance}
        onOpenSafety={() => setShowSafetyModal(true)}
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
        onOpenSummary={() => {
          setView("home");
          setShowAppSummaryModal(true);
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onCelebrityJoin={() => {
          setView("celebrity_signup");
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShareApp={handleShareApp}
        onCreate={() => handleStartCreate("request")}
        theme={theme}
        toggleTheme={toggleTheme}
        chats={chats}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="pb-24">{renderMainContent()}</main>

      <BottomNav
        currentView={view}
        setView={setView}
        currentUser={currentUser}
        userBalance={userBalance}
        onOpenSafety={() => setShowSafetyModal(true)}
        onOpenSupport={() => setShowSupportModal(true)}
        onOpenSummary={() => {
          setView("home");
          setShowAppSummaryModal(true);
        }}
        onShareApp={handleShareApp}
        onCreate={() => handleStartCreate("request")}
        onCelebrityJoin={() => setView("celebrity_signup")}
        chats={chats}
        language={language}
      />

      {/* GLOBAL MODALS */}

      {/* MANAGE CANDIDATES MODAL */}
      {showCandidatesModal && selectedGigForCandidates && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-pandora-card max-w-md w-full rounded-2xl border border-white/10 p-6 relative animate-in zoom-in-95 shadow-2xl">
            <button
              onClick={() => setShowCandidatesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" /> Candidatos
            </h2>
            <p className="text-xs text-black dark:text-gray-400 mb-6 border-b border-white/10 pb-4">
              Escolha com quem você deseja iniciar a negociação para: <br />
              <span className="text-white font-bold">
                {selectedGigForCandidates.title}
              </span>
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {selectedGigForCandidates.candidates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum interessado ainda.
                </p>
              ) : (
                selectedGigForCandidates.candidates.map((candidate, i) => (
                  <div
                    key={i}
                    className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-white/20 transition-colors"
                  >
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-full border border-white/10"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm flex items-center gap-1">
                        {candidate.name}
                        {candidate.isVerified && (
                          <ShieldCheck className="w-3 h-3 text-blue-400" />
                        )}
                      </h4>
                      <div className="flex items-center text-amber-500 text-xs gap-1 mt-1">
                        <Star className="w-3 h-3 fill-current" />{" "}
                        {candidate.rating}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectCandidate(candidate)}
                      className="bg-pandora-primary hover:bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" /> Conversar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pandora-card max-w-md w-full rounded-2xl border border-white/10 p-6 relative shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Headset className="w-5 h-5 text-pandora-secondary" /> Fale
              Conosco
            </h2>
            <p className="text-xs text-black dark:text-gray-500 mb-6">
              Envie sugestões, denúncias ou dúvidas diretamente para a
              administração.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Tipo de Contato
                </label>
                <div className="flex bg-white/5 p-1 rounded-lg">
                  <button
                    onClick={() => setSupportType("opinion")}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${supportType === "opinion" ? "bg-pandora-secondary text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    Opinião
                  </button>
                  <button
                    onClick={() => setSupportType("idea")}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${supportType === "idea" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    Ideia
                  </button>
                  <button
                    onClick={() => setSupportType("complaint")}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${supportType === "complaint" ? "bg-red-600 text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    Problema
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Sua Mensagem
                </label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-pandora-secondary outline-none resize-none"
                  placeholder="Escreva aqui..."
                />
              </div>
              <button
                onClick={handleSubmitSupport}
                disabled={!supportMessage.trim()}
                className="w-full bg-white text-black font-bold py-3 rounded-xl uppercase text-xs tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY MODAL - UPDATED */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-pandora-card max-w-4xl w-full max-h-[85vh] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0c0c0e]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Termos de Uso & Segurança
                  </h2>
                  <p className="text-xs text-black dark:text-gray-500">
                    Diretrizes Legais da Comunidade C.Pandox
                  </p>
                </div>
              </div>
              {/* Only show Close button if not in mandatory agreement mode */}
              {!pendingSafetyAgreement && (
                <button
                  onClick={() => setShowSafetyModal(false)}
                  className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#09090b] text-gray-300">
              <div className="space-y-8">
                {/* Intro */}
                <p className="text-sm">
                  Bem-vindo ao <strong>C.Pandox</strong>. Para garantir uma
                  experiència segura, transparente e respeitosa, exigimos a
                  leitura e concordância integral com as diretrizes abaixo.
                </p>

                {/* 1. Natureza do Serviço */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-pandora-primary" /> 1. Isenção
                    de Responsabilidade (Intermediação)
                  </h3>
                  <ul className="list-disc ml-5 space-y-2 text-xs text-gray-400">
                    <li>
                      O <strong>C.Pandox</strong> é uma plataforma tecnológica
                      de intermediação. Não somos empregadores, agência de
                      talentos nem fornecedores de serviços.
                    </li>
                    <li>
                      Não nos responsabilizamos pela qualidade, segurança ou
                      legalidade dos serviços oferecidos, nem pela veracidade ou
                      precisão dos anúncios dos usuários.
                    </li>
                    <li>
                      Qualquer contrato ou acordo é firmado exclusivamente entre
                      o Contratante e o Prestador (P2P).
                    </li>
                  </ul>
                </div>

                {/* 2. Segurança Física (NOVO) */}
                <div className="bg-blue-900/10 p-5 rounded-2xl border border-blue-500/20">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" /> 2. Protocolo de
                    Encontro Seguro
                  </h3>
                  <p className="text-xs mb-3 font-bold text-blue-200">
                    Para sua proteção em serviços presenciais, siga
                    RIGOROSAMENTE:
                  </p>
                  <ul className="list-disc ml-5 space-y-2 text-xs text-gray-400">
                    <li>
                      <strong className="text-white">Locais Públicos:</strong>{" "}
                      Marque o primeiro encontro sempre em locais públicos,
                      movimentados e iluminados (Shoppings, Cafés, Praças).
                    </li>
                    <li>
                      <strong className="text-white">
                        Compartilhe Localização:
                      </strong>{" "}
                      Avise um amigo ou familiar de confiança sobre onde vai,
                      com quem e horário previsto de retorno.
                    </li>
                    <li>
                      <strong className="text-white">
                        Verifique a Identidade:
                      </strong>{" "}
                      Se o perfil não for verificado, solicite uma videochamada
                      prévia pelo chat seguro.
                    </li>
                    <li>
                      <strong className="text-white">Instinto:</strong> Se
                      sentir desconforto, cancele imediatamente. Nenhuma
                      penalidade vale a sua segurança.
                    </li>
                  </ul>
                </div>

                {/* 3. Conteúdo Proibido (EXPANDIDO) */}
                <div className="bg-red-900/10 p-5 rounded-2xl border border-red-500/20">
                  <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Ban className="w-4 h-4" /> 3. Conteúdo Proibido &
                    Tolerância Zero
                  </h3>
                  <p className="text-xs text-red-300 mb-2">
                    É terminantemente proibido solicitar, ofertar ou insinuar
                    qualquer ato ilícito. Não haverá tolerância com menores:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-400">
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                      Conteúdo Sexual / Prostituição / "Massagem com Final
                      Feliz"
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                      Armas, Drogas ou Substâncias Ilícitas
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                      Discurso de Ódio, Racismo, Homofobia
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                      Crimes, Fraudes ou Atos Ilícitos
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                      Assédio, Stalking ou Ameaças
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                      Exploração de Menores (Tolerância Zero)
                    </div>
                  </div>
                </div>

                {/* 4. Segurança Financeira */}
                <div className="bg-amber-900/10 p-5 rounded-2xl border border-amber-500/20">
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> 4. Segurança Financeira (Depósito 35%)
                  </h3>
                  <ul className="list-disc ml-5 space-y-2 text-xs text-gray-400">
                    <li>
                      <strong className="text-white">Depósito de Garantia:</strong> Um depósito de 35% é necessário para liberar o chat e serve como taxa de manutenção da plataforma.
                    </li>
                    <li>
                      <strong className="text-white">Pagamento Direto:</strong> O restante do valor (65%) deve ser negociado e pago diretamente ao prestador após a conclusão do serviço.
                    </li>
                    <li>
                      <strong className="text-white">Conclusão:</strong> Utilize o botão "Serviço Concluído" no chat para registrar a finalização e liberar a avaliação.
                    </li>
                  </ul>
                </div>

                {/* 5. Privacidade */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <EyeIcon className="w-4 h-4 text-pandora-primary" /> 5.
                    Privacidade e Dados (LGPD)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Respeitamos sua privacidade. Seus dados de cadastro (CPF,
                    Endereço) são usados apenas para verificação de identidade e
                    segurança. Não vendemos dados a terceiros. Ao deletar sua
                    conta, seus dados sensíveis são anonimizados.
                  </p>
                </div>

                {/* 6. Sanções */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-pandora-primary" /> 6.
                    Sanções Legais
                  </h3>
                  <p className="text-xs text-gray-400">
                    A violação destes termos resultará no banimento imediato e
                    permanente da conta, sem reembolso de créditos. O C.Pandox
                    reserva-se o direito de cooperar com autoridades policiais
                    em casos de crimes.
                  </p>
                </div>

                {/* 7. Idade Mínima */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-pandora-primary" /> 7.
                    Elegibilidade
                  </h3>
                  <p className="text-xs text-gray-400">
                    Você declara ter 18 anos ou mais para utilizar esta
                    plataforma. O uso por menores é estritamente proibido e não
                    haverá qualquer tolerância em caso de descumprimento.
                  </p>
                </div>

                {/* 8. Reembolso e Arrependimento */}
                <div className="bg-green-900/10 p-5 rounded-2xl border border-green-500/20">
                  <h3 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> 8. Direito de Arrependimento
                    (CDC)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Em consonância com o{" "}
                    <strong>
                      Artigo 49 do Código de Defesa do Consumidor (CDC)
                    </strong>
                    , o usuário tem o direito de reaver o valor depositado
                    (créditos não utilizados) em até{" "}
                    <strong>7 dias corridos</strong> após a compra, sem
                    necessidade de justificativa. Para solicitar o estorno,
                    entre em contato com o suporte técnico.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer / Action */}
            <div className="p-6 border-t border-white/10 bg-[#0c0c0e]">
              {pendingSafetyAgreement ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                    <input
                      type="checkbox"
                      id="safetyTerms"
                      className="mt-1 w-4 h-4 accent-pandora-primary cursor-pointer"
                      checked={safetyChecked}
                      onChange={(e) => setSafetyChecked(e.target.checked)}
                    />
                    <label
                      htmlFor="safetyTerms"
                      className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none"
                    >
                      declaro e li atentamente e concordo integralmente com os
                      termos .....
                    </label>
                  </div>
                  <button
                    onClick={handleAgreementConfirm}
                    disabled={!safetyChecked}
                    className={`w-full font-bold py-4 rounded-xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                      safetyChecked
                        ? "bg-pandora-primary hover:bg-purple-600 text-white shadow-purple-900/20"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <FileCheck className="w-5 h-5" /> Concordar e Acessar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSafetyModal(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition-colors"
                >
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pandora-card max-w-lg w-full rounded-2xl border border-white/10 p-6 relative animate-in zoom-in-95 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pandora-primary/10 blur-3xl rounded-full pointer-events-none"></div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-black dark:text-white mb-1 flex items-center gap-2 tracking-tighter">
              <HelpCircle className="w-6 h-6 text-pandora-primary animate-pulse drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />{" "}
              COMO FUNCIONA
            </h2>
            <p className="text-xs text-black dark:text-gray-400 mb-6 uppercase tracking-widest font-bold">
              O Manual do Inusitado
            </p>

            <div className="space-y-5">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-pandora-primary/20 flex items-center justify-center shrink-0 text-pandora-primary font-black border border-pandora-primary/20 group-hover:scale-110 transition-transform">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-black dark:text-white text-sm uppercase">
                    Imagine o "Impossível"
                  </h4>
                  <p className="text-xs text-black dark:text-gray-400 leading-relaxed mt-1">
                    Esqueça o normal. Aqui você pede um{" "}
                    <strong>mágico para enterro</strong>, um{" "}
                    <strong>terminador de namoros</strong> ou{" "}
                    <strong>alguém para segurar fila</strong>. Se é criativo ou
                    único, o lugar é aqui.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-pandora-secondary/20 flex items-center justify-center shrink-0 text-pandora-secondary font-black border border-pandora-secondary/20 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-black dark:text-white text-sm uppercase">
                    Conecte-se com o Raro
                  </h4>
                  <p className="text-xs text-black dark:text-gray-400 leading-relaxed mt-1">
                    Encontre pessoas dispostas a embarcar na sua imaginação.
                    Negocie os detalhes mais excêntricos no chat.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0 text-green-500 font-black border border-green-500/20 group-hover:scale-110 transition-transform">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-black dark:text-white text-sm uppercase">
                    Realize com Segurança
                  </h4>
                  <p className="text-xs text-black dark:text-gray-400 leading-relaxed mt-1">
                    Use o <strong>Cofre Pandox</strong>. O dinheiro fica
                    guardado com a gente e só é liberado quando o show (ou o
                    serviço) terminar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white/5 p-3 rounded-xl border border-white/5 text-center">
              <p className="text-[10px] text-black dark:text-gray-400 italic">
                "A lógica leva você de A a B. A imaginação leva você a qualquer
                lugar."
              </p>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full mt-6 bg-gradient-to-r from-pandora-primary to-purple-800 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-purple-900/20"
            >
              Liberar Minha Imaginação
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-pandora-card w-full max-w-2xl rounded-3xl border border-white/10 p-8 relative animate-in zoom-in-95">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-6 right-6 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-display font-black text-pandora-primary mb-2">
              Categorias
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Navegue pelas dimensões de desejos.
            </p>

            <div className="relative">
              <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryModal(false);
                    }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-pandora-primary/20 hover:border-pandora-primary hover:scale-[1.02] transition-all text-left group"
                  >
                    <h3 className="text-lg font-bold text-pandora-primary transition-colors">
                      {cat}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Explorar esta dimensão
                    </p>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedCategory("Todos");
                    setShowCategoryModal(false);
                  }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all text-left sm:col-span-2"
                >
                  <h3 className="text-lg font-bold text-pandora-primary">
                    Ver Tudo
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Todas as possibilidades
                  </p>
                </button>
              </div>

              <div className="flex justify-center items-center gap-2 text-gray-500 animate-bounce py-2">
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Rolar para ver mais
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPIRATION MODAL */}
      {showInspirationModal && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-pandora-card w-full max-w-4xl h-[80vh] rounded-3xl border border-white/10 flex flex-col relative shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-yellow-400" /> Inspirações
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ideias do que você pode pedir ou oferecer.
                </p>
              </div>
              <button
                onClick={() => setShowInspirationModal(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-black dark:text-white" />
              </button>
            </div>

            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
              {adminUser ? (
                <button
                  onClick={handleAddNewInspiration}
                  className="text-xs font-bold bg-pandora-primary text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Adicionar Ideia
                </button>
              ) : (
                <div />
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400 italic">
                {inspirationList.length} ideias cadastradas
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
              {inspirationList.map((item) => (
                <div
                  key={item.id}
                  className="bg-black/40 border border-white/10 p-4 rounded-xl hover:border-pandora-primary/30 transition-all group relative"
                >
                  {editingId === item.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempInspirationText}
                        onChange={(e) => setTempInspirationText(e.target.value)}
                        className="flex-1 bg-black border border-pandora-primary rounded px-2 py-1 text-sm text-black dark:text-white outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveInspiration}
                        className="bg-green-600 p-1.5 rounded hover:bg-green-500"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-black dark:text-white text-sm leading-relaxed pr-6">
                        "{item.text}"
                      </p>
                      {adminUser && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={() =>
                              handleStartEditInspiration(item.id, item.text)
                            }
                            className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteInspiration(item.id)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setDraftDescription(item.text);
                            setShowInspirationModal(false);
                            handleStartCreate("request");
                          }}
                          className="flex-1 bg-white/5 hover:bg-white/10 py-1.5 rounded text-[10px] uppercase font-bold text-black dark:text-white hover:text-black dark:hover:text-white transition-colors"
                        >
                          Usar como Pedido
                        </button>
                        <button
                          onClick={() => {
                            setDraftDescription(item.text);
                            setShowInspirationModal(false);
                            handleStartCreate("offer");
                          }}
                          className="flex-1 bg-white/5 hover:bg-white/10 py-1.5 rounded text-[10px] uppercase font-bold text-black dark:text-white hover:text-black dark:hover:text-white transition-colors"
                        >
                          Usar como Oferta
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT / HIRE MODAL */}
      {/* ADMIN USER DETAIL MODAL */}
      {selectedUserForAdmin && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-pandora-card max-w-lg w-full rounded-3xl border border-white/10 p-8 shadow-2xl relative animate-in zoom-in-95 my-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pandora-primary/5 blur-3xl rounded-full pointer-events-none"></div>

            <button
              onClick={() => {
                setSelectedUserForAdmin(null);
                setIsEditingUser(false);
              }}
              className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 p-2 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="relative">
                <img
                  src={selectedUserForAdmin.avatar}
                  className="w-20 h-20 rounded-full border-2 border-pandora-primary/50 p-1 bg-black"
                  alt=""
                />
                <div
                  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-pandora-card ${selectedUserForAdmin.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editingUserData?.name}
                    onChange={(e) =>
                      setEditingUserData((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                    className="w-full bg-black border border-pandora-primary rounded px-2 py-1 text-xl font-black text-white outline-none mb-1"
                  />
                ) : (
                  <h2 className="text-2xl font-black text-white tracking-tight truncate">
                    {selectedUserForAdmin.name}
                  </h2>
                )}
                <p className="text-xs text-gray-500 font-mono">
                  ID: {selectedUserForAdmin.id}
                </p>
                <div className="mt-1 flex gap-2">
                  {selectedUserForAdmin.isCelebrity && (
                    <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                      Famoso
                    </span>
                  )}
                  <span className="bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded italic">
                    {selectedUserForAdmin.role === "both"
                      ? "Plano Completo"
                      : selectedUserForAdmin.role === "worker"
                        ? "Prestador"
                        : "Cliente"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Saldo (PND)
                </p>
                {isEditingUser ? (
                  <input
                    type="number"
                    value={editingUserData?.walletBalance}
                    onChange={(e) =>
                      setEditingUserData((prev) =>
                        prev
                          ? { ...prev, walletBalance: Number(e.target.value) }
                          : null,
                      )
                    }
                    className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-pandora-primary font-bold outline-none"
                  />
                ) : (
                  <p className="text-sm text-pandora-primary font-bold">
                    {selectedUserForAdmin.walletBalance.toFixed(1)} PND
                  </p>
                )}
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  CPF
                </p>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editingUserData?.cpf}
                    onChange={(e) =>
                      setEditingUserData((prev) =>
                        prev ? { ...prev, cpf: e.target.value } : null,
                      )
                    }
                    className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-white font-mono outline-none"
                  />
                ) : (
                  <p className="text-xs text-white font-mono">
                    {decryptData(selectedUserForAdmin.cpf) ||
                      selectedUserForAdmin.cpf ||
                      "---"}
                  </p>
                )}
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Telefone
                </p>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editingUserData?.phone}
                    onChange={(e) =>
                      setEditingUserData((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null,
                      )
                    }
                    className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-white outline-none"
                  />
                ) : (
                  <p className="text-xs text-white">
                    {decryptData(selectedUserForAdmin.phone) ||
                      selectedUserForAdmin.phone ||
                      "---"}
                  </p>
                )}
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Chave Pix
                </p>
                {isEditingUser ? (
                  <input
                    type="text"
                    value={editingUserData?.pixKey}
                    onChange={(e) =>
                      setEditingUserData((prev) =>
                        prev ? { ...prev, pixKey: e.target.value } : null,
                      )
                    }
                    className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-amber-500 font-mono outline-none"
                  />
                ) : (
                  <p className="text-xs text-amber-500 font-mono truncate">
                    {decryptData(selectedUserForAdmin.pixKey) ||
                      selectedUserForAdmin.pixKey ||
                      "---"}
                  </p>
                )}
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl col-span-2">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Endereço Completo
                </p>
                {isEditingUser ? (
                  <textarea
                    value={editingUserData?.address}
                    onChange={(e) =>
                      setEditingUserData((prev) =>
                        prev ? { ...prev, address: e.target.value } : null,
                      )
                    }
                    rows={2}
                    className="w-full bg-black border border-white/20 rounded px-2 py-1 text-[10px] text-gray-300 outline-none resize-none"
                  />
                ) : (
                  <p className="text-[10px] text-gray-300 leading-relaxed">
                    {decryptData(selectedUserForAdmin.address) ||
                      selectedUserForAdmin.address ||
                      "Não cadastrado"}
                  </p>
                )}
              </div>
              <div className="bg-white/5 border border-white/5 p-3 rounded-2xl col-span-2 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    Senha de Acesso
                  </p>
                  {isEditingUser ? (
                    <input
                      type={showPasswordInAdmin ? "text" : "password"}
                      value={editingUserData?.password}
                      onChange={(e) =>
                        setEditingUserData((prev) =>
                          prev ? { ...prev, password: e.target.value } : null,
                        )
                      }
                      className="w-full bg-black border border-white/20 rounded px-2 py-1 text-sm text-white font-mono outline-none"
                    />
                  ) : (
                    <p className="text-sm text-white font-mono tracking-widest">
                      {showPasswordInAdmin
                        ? decryptData(selectedUserForAdmin.password) ||
                          selectedUserForAdmin.password
                        : "••••••••"}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowPasswordInAdmin(!showPasswordInAdmin)}
                  className="text-pandora-primary hover:text-white p-2 transition-colors ml-2"
                >
                  {showPasswordInAdmin ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Roles & Status specific for edit */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl col-span-2 space-y-3 mb-4 relative z-10">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Ações Rápidas de Moderação
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() =>
                      handleAdminSendMessageToUser(selectedUserForAdmin.id)
                    }
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all border border-blue-500/10"
                  >
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      Mensagem
                    </span>
                  </button>
                  <button
                    onClick={() => handleAdminWarnUser(selectedUserForAdmin.id)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-all border border-amber-500/10"
                  >
                    <AlertTriangle className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      Advertir
                    </span>
                  </button>
                  {!(
                    selectedUserForAdmin.cpf === "03531702750" ||
                    decryptData(selectedUserForAdmin.cpf) === "03531702750" ||
                    selectedUserForAdmin.id === "03531702750"
                  ) && (
                    <button
                      onClick={() =>
                        handleAdminToggleUserStatus(selectedUserForAdmin.id)
                      }
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${selectedUserForAdmin.status === "active" ? "bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/10" : "bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/10"}`}
                    >
                      <Ban className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        {selectedUserForAdmin.status === "active"
                          ? "Bloquear"
                          : "Ativar"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
              {isEditingUser && (
                <>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                      Função/Plano
                    </p>
                    <select
                      value={editingUserData?.role}
                      onChange={(e) =>
                        setEditingUserData((prev) =>
                          prev
                            ? { ...prev, role: e.target.value as any }
                            : null,
                        )
                      }
                      className="w-full bg-black border border-white/20 rounded px-1 py-1 text-[10px] text-white outline-none"
                    >
                      <option value="requester">Cliente</option>
                      <option value="worker">Prestador</option>
                      <option value="both">Ambos (Completo)</option>
                    </select>
                  </div>
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                      Verificação
                    </p>
                    <select
                      value={editingUserData?.isVerified ? "yes" : "no"}
                      onChange={(e) =>
                        setEditingUserData((prev) =>
                          prev
                            ? { ...prev, isVerified: e.target.value === "yes" }
                            : null,
                        )
                      }
                      className="w-full bg-black border border-white/20 rounded px-1 py-1 text-[10px] text-white outline-none"
                    >
                      <option value="yes">Verificado</option>
                      <option value="no">Não Verificado</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              {isEditingUser ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleAdminSaveUser}
                    className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Salvar Alterações
                  </button>
                  <button
                    onClick={() => setIsEditingUser(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all text-center"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const decUser = {
                          ...selectedUserForAdmin,
                          cpf:
                            decryptData(selectedUserForAdmin.cpf) ||
                            selectedUserForAdmin.cpf,
                          phone:
                            decryptData(selectedUserForAdmin.phone) ||
                            selectedUserForAdmin.phone,
                          pixKey:
                            decryptData(selectedUserForAdmin.pixKey) ||
                            selectedUserForAdmin.pixKey,
                          address:
                            decryptData(selectedUserForAdmin.address) ||
                            selectedUserForAdmin.address,
                          password:
                            decryptData(selectedUserForAdmin.password) ||
                            selectedUserForAdmin.password,
                        };
                        setEditingUserData(decUser);
                        setIsEditingUser(true);
                      }}
                      className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-4 h-4" /> Editar Dados
                    </button>
                    {!(
                      selectedUserForAdmin.cpf === "03531702750" ||
                      decryptData(selectedUserForAdmin.cpf) === "03531702750" ||
                      selectedUserForAdmin.id === "03531702750"
                    ) && (
                      <button
                        onClick={() =>
                          handleAdminToggleUserStatus(selectedUserForAdmin.id)
                        }
                        className={`flex-1 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
                          selectedUserForAdmin.status === "active"
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20"
                            : "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20"
                        }`}
                      >
                        {selectedUserForAdmin.status === "active" ? (
                          <>
                            <Ban className="w-4 h-4" /> Bloquear
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Reativar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedUserForAdmin(null)}
                    className="w-full py-3 text-gray-500 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors"
                  >
                    Voltar ao Painel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedGigDetail && !showPaymentModal && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-pandora-card w-full max-w-2xl sm:rounded-3xl border-t sm:border border-white/10 p-6 sm:p-8 relative h-[90vh] sm:h-auto flex flex-col animate-in slide-in-from-bottom-10">
            <button
              onClick={() => setSelectedGigDetail(null)}
              className="absolute top-4 right-4 text-black dark:text-gray-400 hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5 p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span
                className={`px-3 py-1 rounded text-xs font-bold uppercase ${selectedGigDetail.type === "offer" ? "bg-pandora-secondary text-white" : "bg-pandora-primary text-white"}`}
              >
                {selectedGigDetail.type === "offer" ? "Oferta" : "Pedido"}
              </span>
              <span className="text-black dark:text-gray-400 text-sm">
                {selectedGigDetail.createdAt}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4 leading-tight">
              {selectedGigDetail.title}
            </h2>

            <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar">
              <p className="text-black dark:text-gray-300 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                {selectedGigDetail.description}
              </p>

              {selectedGigDetail.review && (
                <div className="mt-6 bg-pandora-primary/10 border border-pandora-primary/20 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-black dark:text-white font-bold flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />{" "}
                      Avaliação do Cliente
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${s <= selectedGigDetail.review!.rating ? "text-amber-500 fill-current" : "text-gray-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {selectedGigDetail.review.comment && (
                    <p className="text-black dark:text-gray-300 text-sm italic mb-4">
                      "{selectedGigDetail.review.comment}"
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-black dark:text-gray-500">
                      Indicaria o App:
                    </span>
                    {selectedGigDetail.review.recommend ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" /> Sim
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3" /> Não
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedGigDetail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-lg text-xs text-black dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 bg-black/5 dark:bg-black/40 rounded-xl p-4 flex items-center justify-between border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedGigDetail.author.avatar}
                    className="w-12 h-12 rounded-full border border-white/10"
                    alt=""
                  />
                  <div>
                    <p className="text-black dark:text-white font-bold">
                      {selectedGigDetail.author.name}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />{" "}
                      {selectedGigDetail.author.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-black dark:text-gray-500 uppercase font-bold">
                    Valor
                  </p>
                  <p className="text-2xl font-mono font-bold text-pandora-secondary">
                    {selectedGigDetail.budget} PND
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex gap-4">
              {selectedGigDetail.author.id === currentUser.id ? (
                <button
                  onClick={() => {
                    setSelectedGigDetail(null);
                    setGigToEdit(selectedGigDetail);
                    setView("create");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-colors shadow-lg"
                >
                  Editar Anúncio
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleHireClick(selectedGigDetail.id);
                    setSelectedGigDetail(null);
                  }}
                  className={`w-full font-bold py-4 rounded-xl uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 ${selectedGigDetail.type === "offer" ? "bg-pandora-secondary hover:bg-orange-600 text-white" : "bg-pandora-primary hover:bg-purple-600 text-white"}`}
                >
                  {selectedGigDetail.type === "offer" ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Hand className="w-5 h-5" />
                  )}
                  {selectedGigDetail.type === "offer"
                    ? "Contratar Serviço"
                    : "Atender Pedido"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SETUP MODAL */}
      {showAdminSetupModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-pandora-card max-w-sm w-full rounded-2xl border border-white/10 p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAdminSetupModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              X
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-pandora-primary" /> Configurar
              Admin
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  value={adminConfig.name}
                  onChange={(e) =>
                    setAdminConfig({ ...adminConfig, name: e.target.value })
                  }
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  value={adminConfig.password}
                  onChange={(e) =>
                    setAdminConfig({ ...adminConfig, password: e.target.value })
                  }
                  className="w-full bg-black border border-white/10 rounded-lg p-3 text-white"
                />
              </div>
              <button
                onClick={handleSetupAdmin}
                className="w-full bg-pandora-primary hover:bg-purple-600 text-white font-bold py-3 rounded-xl mt-2"
              >
                Salvar Acesso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP UP MODAL (PIX & CARD) */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pandora-card max-w-md w-full rounded-2xl border border-white/10 p-8 relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowTopUpModal(false);
                setTopUpStep("amount");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {pendingGigIdForDeposit ? (
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              ) : (
                <ArrowDownLeft className="w-6 h-6 text-green-500" />
              )}
              {pendingGigIdForDeposit ? "Liberação de Chat (35%)" : "Adicionar Créditos"}
            </h2>

            {topUpStep === "amount" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    {pendingGigIdForDeposit ? "Valor da Garantia (R$)" : "Valor do Depósito (R$)"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-2xl font-bold outline-none focus:border-purple-500"
                      placeholder="0,00"
                      disabled={!!pendingGigIdForDeposit}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Conversão: R$ {depositAmount || "0"} ={" "}
                    <span className="text-pandora-primary font-bold">
                      {(Number(depositAmount) / 10).toFixed(1)} PND
                    </span>
                  </p>
                  {pendingGigIdForDeposit && (
                    <div className="mt-4 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                      <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest text-center leading-tight">
                        Depósito de 35% para liberação do chat. <br />
                        O restante será pago após a conclusão direto com o prestador.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDepositCardType("pix")}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                        depositCardType === "pix"
                          ? "bg-green-600 border-green-500 text-white"
                          : "bg-black/20 border-white/10 text-gray-400"
                      }`}
                    >
                      PIX
                    </button>
                    <button
                      onClick={() => setDepositCardType("credit")}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                        depositCardType === "credit"
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-black/20 border-white/10 text-gray-400"
                      }`}
                    >
                      Cartão
                    </button>
                  </div>

                  {depositCardType === "pix" ? (
                    <div className="bg-black/20 border border-white/10 rounded-xl p-6 text-center space-y-4">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <QrCode className="w-8 h-8 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Chave PIX (E-mail)</p>
                        <div className="bg-black/40 border border-green-500/30 rounded-lg p-3 flex items-center justify-between group">
                          <span className="text-sm font-mono text-white">alexpinto926@gmail.com</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText("alexpinto926@gmail.com");
                              alert("Chave PIX copiada!");
                            }}
                            className="text-green-500 hover:text-green-400 p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        Realize o pagamento e clique no botão abaixo para confirmar. O chat será liberado após a validação manual.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Número do Cartão"
                        value={depositCardNumber}
                        onChange={(e) => setDepositCardNumber(e.target.value)}
                        className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="Nome no Cartão"
                        value={depositCardName}
                        onChange={(e) => setDepositCardName(e.target.value)}
                        className="w-full bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-purple-500"
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={depositCardExpiry}
                          onChange={(e) => setDepositCardExpiry(e.target.value)}
                          className="w-1/2 bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={depositCardCVV}
                          onChange={(e) => setDepositCardCVV(e.target.value)}
                          className="w-1/2 bg-black/5 border border-black/10 rounded-xl p-3 text-black text-sm outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={depositCardType === "pix" ? handleGeneratePixDeposit : handleGenerateCardDeposit}
                  className={`w-full font-bold py-4 rounded-xl uppercase tracking-wider transition-all shadow-lg ${
                    depositCardType === "pix"
                      ? "bg-green-600 hover:bg-green-500 shadow-green-900/20"
                      : "bg-purple-600 hover:bg-purple-500 shadow-purple-900/20"
                  } text-white`}
                >
                  {depositCardType === "pix" ? "Confirmei o Pagamento PIX" : "Confirmar Pagamento"}
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Pagamento 100% Seguro
                </div>
              </div>
            )}

            {topUpStep === "processing" && (
              <div className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg">Processando Solicitação...</h3>
                <p className="text-sm text-gray-500">
                  {depositCardType === "pix" 
                    ? "Registrando sua transferência PIX..."
                    : `Validando seu cartão para o valor de R$ ${Number(depositAmount).toFixed(2)}`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APP SUMMARY MODAL */}
      {showAppSummaryModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-black/10 relative animate-in zoom-in-95 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] my-auto">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pandora-primary/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pandora-secondary/5 blur-3xl rounded-full pointer-events-none"></div>

            <button
              onClick={() => setShowAppSummaryModal(false)}
              className="absolute top-6 right-6 text-black/40 hover:text-black bg-black/5 p-2 rounded-full z-20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10 p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-black/10 rounded-2xl flex items-center justify-center">
                  <Compass className="w-7 h-7 text-black animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-black text-black tracking-tighter">
                    {APP_SUMMARY.title}
                  </h2>
                  <p className="text-[10px] text-pandora-primary font-black uppercase tracking-[0.2em]">
                    Exploração Completa
                  </p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-pandora-primary/50 to-transparent w-full my-6"></div>

              <p className="text-black text-sm leading-relaxed mb-8 font-semibold">
                {APP_SUMMARY.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {APP_SUMMARY.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-black/5 border border-black/5 p-4 rounded-2xl hover:bg-black/10 transition-colors group"
                  >
                    <h4 className="text-black font-bold text-sm mb-1 flex items-center gap-2 group-hover:text-black transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                      {feature.title}
                    </h4>
                    <p className="text-[11px] text-black font-medium leading-normal">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-black/5 border border-black/10 p-4 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-black/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-black" />
                </div>
                <p className="text-xs text-black font-black italic leading-tight">
                  {APP_SUMMARY.stats}
                </p>
              </div>

              <button
                onClick={() => setShowAppSummaryModal(false)}
                className="w-full mt-8 bg-black text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform shadow-lg shadow-black/20"
              >
                Entendido, vamos explorar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT RELEASED SUCCESS MODAL */}
      {showPaymentSuccessModal && (
        <div className="fixed inset-0 z-[110] bg-black/98 flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-gradient-to-br from-pandora-card to-black w-full max-w-sm rounded-[40px] border border-green-500/30 p-10 relative overflow-hidden text-center shadow-2xl shadow-green-500/10">
              {/* Decorative particles/glow */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/10 blur-[80px] rounded-full"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-green-500/10 blur-[80px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                   <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-20"></div>
                   <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                
                <h2 className="text-2xl font-display font-black text-white mb-4 tracking-tight">
                  {T.gigs.paymentReleasedTitle}
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {T.gigs.paymentReleasedSuccess.replace('{amount}', `R$ ${(releasedAmount * 10).toLocaleString('pt-BR')}`)}
                </p>

                <div className="bg-green-600/10 border border-green-500/20 py-4 px-6 rounded-3xl mb-10 flex flex-col items-center justify-center">
                   <span className="text-[10px] font-black text-green-500/60 uppercase tracking-[0.2em] mb-1">Valor Transferido</span>
                   <div className="text-3xl font-black text-white flex items-center gap-2">
                      <span className="text-green-500 text-sm">R$</span>
                      {(releasedAmount * 10).toLocaleString('pt-BR')}
                   </div>
                </div>

                <button
                  onClick={() => setShowPaymentSuccessModal(false)}
                  className="w-full bg-white text-black font-black py-5 rounded-3xl uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform shadow-xl"
                >
                  Continuar
                </button>
              </div>
           </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && gigToReview && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-pandora-card w-full max-w-md rounded-3xl border border-white/10 p-8 relative animate-in zoom-in-95">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-pandora-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-pandora-primary fill-current" />
              </div>
              <h2 className="text-2xl font-display font-black text-white mb-2">
                Avalie o Serviço
              </h2>
              <p className="text-gray-500 text-sm">
                Sua opinião ajuda a manter a qualidade da nossa comunidade.
              </p>
            </div>

            <div className="space-y-8">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Nível de Satisfação
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${star <= reviewRating ? "text-amber-500 fill-current" : "text-gray-700"}`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-amber-500 font-bold mt-2">
                  {reviewRating === 1 && "Muito Insatisfeito"}
                  {reviewRating === 2 && "Insatisfeito"}
                  {reviewRating === 3 && "Regular"}
                  {reviewRating === 4 && "Satisfeito"}
                  {reviewRating === 5 && "Excelente!"}
                </p>
              </div>

              {/* Recommendation */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
                  Indicaria o App para amigos?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setReviewRecommend(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${reviewRecommend ? "bg-green-600 text-white shadow-lg shadow-green-900/20" : "bg-white/5 text-gray-500"}`}
                  >
                    <ThumbsUp className="w-5 h-5" /> Sim
                  </button>
                  <button
                    onClick={() => setReviewRecommend(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${!reviewRecommend ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "bg-white/5 text-gray-500"}`}
                  >
                    <ThumbsDown className="w-5 h-5" /> Não
                  </button>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                  Comentário (Opcional)
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Conte-nos mais sobre sua experiência..."
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-pandora-primary outline-none min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={handleSaveReview}
                className="w-full bg-pandora-primary hover:bg-purple-600 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20"
              >
                Enviar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST PAYMENT MODAL (35% Guarantee) */}
      {showRequestPaymentModal && pendingRequestToSave && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-pandora-card max-auto w-full max-w-md rounded-3xl border border-white/10 p-8 relative animate-in zoom-in-95 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <button
              onClick={() => {
                setShowRequestPaymentModal(false);
                setPendingRequestToSave(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pandora-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-pandora-primary" />
              </div>
              <h2 className="text-2xl font-display font-black text-white mb-2 uppercase tracking-tight">
                Pagamento de Garantia
              </h2>
              <p className="text-gray-400 text-sm">
                Para publicar seu pedido, é necessário o depósito de 35% do valor total para o aplicativo.
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 mb-6 text-center">
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Valor a pagar agora (35%)</p>
               <p className="text-4xl font-mono font-black text-pandora-primary">
                  {requestPaymentAmount.toFixed(2)} <span className="text-lg">PND</span>
               </p>
               <p className="text-sm text-gray-500 font-bold mt-1">R$ {(requestPaymentAmount * 10).toFixed(2)}</p>
            </div>

            <div className="space-y-4">
               {/* Payment Type Selection */}
               <div className="flex gap-2">
                 {['pix', 'credit', 'debit'].map((m) => (
                   <button
                     key={m}
                     onClick={() => setDepositCardType(m as any)}
                     className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                       depositCardType === m
                         ? "bg-pandora-primary border-pandora-primary text-white"
                         : "bg-white/5 border-white/10 text-gray-500"
                     }`}
                   >
                     {m === 'pix' ? 'PIX' : m === 'credit' ? 'Crédito' : 'Débito'}
                   </button>
                 ))}
               </div>

               {depositCardType === 'pix' ? (
                 <div className="bg-black/20 border border-white/10 rounded-xl p-4 text-center animate-in fade-in duration-300">
                    <QrCode className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Chave PIX (E-mail)</p>
                    <div className="bg-black/50 border border-green-500/20 p-2 rounded-lg text-xs font-mono text-white mb-2 select-all">
                       alexpinto926@gmail.com
                    </div>
                    <p className="text-[9px] text-gray-500 italic leading-tight">
                       Pague agora e clique em confirmar para publicar seu pedido no ecossistema.
                    </p>
                 </div>
               ) : (
                 <div className="space-y-3 animate-in fade-in duration-300">
                    <input
                      type="text"
                      placeholder="Número do Cartão"
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pandora-primary"
                    />
                    <div className="flex gap-3">
                       <input type="text" placeholder="MM/AA" className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pandora-primary" />
                       <input type="text" placeholder="CVV" className="w-1/2 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-pandora-primary" />
                    </div>
                 </div>
               )}

               <button
                 onClick={handleConfirmRequestPayment}
                 disabled={isProcessingPayment}
                 className="w-full bg-pandora-primary hover:bg-purple-600 text-white font-black py-4 rounded-xl uppercase text-xs tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"
               >
                 {isProcessingPayment ? (
                   <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                   <ArrowRight className="w-4 h-4" />
                 )}
                 {isProcessingPayment ? "Processando..." : "Confirmar e Publicar"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
