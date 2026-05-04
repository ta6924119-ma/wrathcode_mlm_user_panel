const appUrl = 'http://10.81.210.155:3031'


export const ApiConfig = {

  baseUrl: appUrl,


  register: "/api/auth/register",
  login: "/api/auth/login",


  //enhanced wallet
  walletDashboard: "/api/dashboard/wallet",
  walletTransfer: "/api/wallet/transfer",

  // Profile endpoints
  profileGet: "/api/profile/getprofile",
  profileUpdate: "/api/profile/edit/profile",
  // profileImageUpload: "",

  // KYC endpoints
  kycSubmit: "/api/kyc/kyc",
  // kycGetStatus: "",

  // Support Tickets endpoints
  supportTicketsGet: "/api/ticket/my-ticket",
  supportTicketCreate: "/api/ticket/create",
  supportTicketReply: "/api/ticket/reply",

  // Report endpoints
  fundTransfersGet: "/api/report/fund-transfer",
  joiningReportGet: "/api/report/joining",
  memberIncomeGet: "/api/report/income",
  getWithdrawalReport: "/api/report/withdrawal",
  taxReportGet: "/api/report/tax",


  // Dashboard endpoints
  dashboardGet: "/api/dashboard/dashboard",

  //  genology list endpoints
  getList: "/api/plans/network/list",

  // Referrals
  referralsGet: "/api/dashboard/referral",


  //deposit
  depositwallet: "/api/deposit/wallet ",

  // Investment 
  investmentGet: "/api/investment/history/investment",
  investmentCreate: "/api/investment/buy",

  // Payout/Withdrawal 
  // payoutDashboard: "/api/withdrawal/history",
  getWithdrawalHistory: "/api/withdrawal/history",
  payoutWithdraw: "/api/withdrawal/amount",


  //commission income 
  getCommission: "/api/dashboard/commission",

  // Downline unilevel
  downlineUnilevel: "api/dashboard/downlinenetwork",
  //Binary tree 
  binaryTreeGet: "/api/plans/binary/tree",
};