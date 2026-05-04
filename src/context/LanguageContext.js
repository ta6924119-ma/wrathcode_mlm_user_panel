import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    referrals: 'Referrals',
    downline: 'Downline',
    investments: 'Investments',
    commissions: 'Commissions',
    wallet: 'Wallet',
    profile: 'Profile',
    notifications: 'Notifications',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    total: 'Total',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
    actions: 'Actions',
    
    // Dashboard
    totalEarnings: 'Total Earnings',
    activeReferrals: 'Active Referrals',
    teamSize: 'Team Size',
    monthlyVolume: 'Monthly Volume',
    
    // Wallet
    balance: 'Balance',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    transactionHistory: 'Transaction History',
    
    // KYC
    kycVerification: 'KYC Verification',
    personalInfo: 'Personal Information',
    idDocuments: 'ID Documents',
    additionalProof: 'Additional Proof',
    
    // Reports
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    reports: 'Reports',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    referrals: 'रेफरल',
    downline: 'डाउनलाइन',
    investments: 'निवेश',
    commissions: 'कमीशन',
    wallet: 'वॉलेट',
    profile: 'प्रोफ़ाइल',
    notifications: 'सूचनाएं',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    
    // Common
    welcome: 'स्वागत है',
    loading: 'लोड हो रहा है...',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    submit: 'सबमिट करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    total: 'कुल',
    amount: 'राशि',
    date: 'तारीख',
    status: 'स्थिति',
    actions: 'कार्रवाई',
    
    // Dashboard
    totalEarnings: 'कुल कमाई',
    activeReferrals: 'सक्रिय रेफरल',
    teamSize: 'टीम का आकार',
    monthlyVolume: 'मासिक वॉल्यूम',
    
    // Wallet
    balance: 'बैलेंस',
    deposit: 'जमा करें',
    withdraw: 'निकालें',
    transactionHistory: 'लेनदेन इतिहास',
    
    // KYC
    kycVerification: 'KYC सत्यापन',
    personalInfo: 'व्यक्तिगत जानकारी',
    idDocuments: 'पहचान दस्तावेज',
    additionalProof: 'अतिरिक्त प्रमाण',
    
    // Reports
    daily: 'दैनिक',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    reports: 'रिपोर्ट्स',
  },
  es: {
    // Navigation
    dashboard: 'Panel',
    referrals: 'Referidos',
    downline: 'Línea Descendente',
    investments: 'Inversiones',
    commissions: 'Comisiones',
    wallet: 'Billetera',
    profile: 'Perfil',
    notifications: 'Notificaciones',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    
    // Common
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    submit: 'Enviar',
    edit: 'Editar',
    delete: 'Eliminar',
    search: 'Buscar',
    filter: 'Filtrar',
    total: 'Total',
    amount: 'Cantidad',
    date: 'Fecha',
    status: 'Estado',
    actions: 'Acciones',
    
    // Dashboard
    totalEarnings: 'Ganancias Totales',
    activeReferrals: 'Referidos Activos',
    teamSize: 'Tamaño del Equipo',
    monthlyVolume: 'Volumen Mensual',
    
    // Wallet
    balance: 'Saldo',
    deposit: 'Depositar',
    withdraw: 'Retirar',
    transactionHistory: 'Historial de Transacciones',
    
    // KYC
    kycVerification: 'Verificación KYC',
    personalInfo: 'Información Personal',
    idDocuments: 'Documentos de Identidad',
    additionalProof: 'Prueba Adicional',
    
    // Reports
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensual',
    reports: 'Informes',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('mlm_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('mlm_language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
