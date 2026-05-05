import { ApiConfig } from '../ApiConfig/ApiEndpoints';
import { ApiCallPost, ApiCallGet, ApiCallPut, ApiCallPatch } from '../ApiConfig/ApiCall';

const AuthService = {

  register: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.register;
    return await ApiCallPost(url, data);

  }
  ,

  login: async (data) => {

    const url = ApiConfig.baseUrl + ApiConfig.login;
    return await ApiCallPost(url, data);
  },

  // Wallet APIs — backend me 2 hi APIs hain
  getWalletDashboard: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.walletDashboard;
    return await ApiCallGet(url);
  },

  walletTransfer: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.walletTransfer;
    return await ApiCallPost(url, data);
  },

  // Profile APIs
  getProfile: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.profileGet;
    return await ApiCallGet(url);
  },

  updateProfile: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.profileUpdate;
    return await ApiCallPatch(url, data);
  },

  // KYC APIs
  // submitKYC: async (data) => {
  //     const url = ApiConfig.baseUrl + ApiConfig.kycSubmit;
  //     return await ApiCallPost(url, data);
  // },


 submitKYC: async (data) => {
  try {
    const formData = new FormData();

    // =========================
    // TEXT FIELDS
    // =========================

    formData.append("fullName", data.fullName || "");
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("address", data.address || "");
    formData.append("city", data.city || "");
    formData.append("state", data.state || "");
    formData.append("pincode", data.zipCode || "");
    formData.append("country", data.country || "");
    formData.append("phoneNumber", data.phoneNumber || "");
    formData.append("idType", data.idType || "");
    formData.append("idNumber", data.idNumber || "");

    // =========================
    // FILE VALIDATION
    // =========================

    if (!(data.idFrontImage instanceof File)) {
      throw new Error("Front image required");
    }

    if (!(data.idBackImage instanceof File)) {
      throw new Error("Back image required");
    }

    if (!(data.selfieImage instanceof File)) {
      throw new Error("Selfie image required");
    }

    if (!(data.proofOfAddress instanceof File)) {
      throw new Error("Address proof required");
    }

    // =========================
    // BINARY FILES
    // =========================

    formData.append(
      "frontImage",
      data.idFrontImage,
      data.idFrontImage.name
    );

    formData.append(
      "backImage",
      data.idBackImage,
      data.idBackImage.name
    );

    formData.append(
      "selfiewithidnumber",
      data.selfieImage,
      data.selfieImage.name
    );

    formData.append(
      "addressImage",
      data.proofOfAddress,
      data.proofOfAddress.name
    );

    // =========================
    // DEBUG
    // =========================

    console.log("========= FORM DATA =========");

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // =========================
    // API CALL
    // =========================

    return await ApiCallPost("/api/kyc/kyc", formData);

  } catch (error) {
    console.log("KYC SUBMIT ERROR =>", error);
    throw error;
  }
},


  getKYCStatus: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.kycGetStatus;
    return await ApiCallGet(url);
  },

  // Support Tickets APIs
  getSupportTickets: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.supportTicketsGet;
    return await ApiCallGet(url);
  },

  createSupportTicket: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.supportTicketCreate;
    return await ApiCallPost(url, data);
  },

  replySupportTicket: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.supportTicketReply;
    return await ApiCallPost(url, data);
  },



  // Report APIs
  getFundTransfers: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.fundTransfersGet;
    return await ApiCallGet(url);
  },

  getTaxReport: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.taxReportGet;
    return await ApiCallGet(url);
  },


  getWithdrawalReport: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.getWithdrawalReport
    return await ApiCallGet(url, data)
  },

  getJoiningReport: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.joiningReportGet;
    return await ApiCallGet(url);
  },



  getMemberIncome: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.memberIncomeGet;
    return await ApiCallGet(url);
  },

  getList: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.getList
    console.log("Final URL 👉", url);

    return await ApiCallGet(url);
  },
  //deposit........

  DepositWallet: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.depositwallet;
    return await ApiCallPost(url, data);
  },

  getDepositHistory: async () => {
    try {
      const response = await ApiCallGet("/api/deposit/wallet/history");

      return response;
    } catch (error) {
      console.error("History Error:", error);
      throw error;
    }
  },


  submitWithdrawal: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.payoutWithdraw;
    return await ApiCallPost(url, data);
  },

  getWithdrawalHistory: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.getWithdrawalHistory;
    return await ApiCallGet(url);
  },

  // Dashboard APIs
  getDashboardData: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.dashboardGet;
    console.log(url, "dashboard url");
    return await ApiCallGet(url);
  },

  //Binary Tree API

  getBinaryTree: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.binaryTreeGet;
    return await ApiCallGet(url);
  },

  getSponsorTree: async () => {
    try {
      const res = await ApiCallGet("/api/plans/matrix/sponsor");
      return res;
    } catch (error) {
      throw error;
    }
  },

  //commissiion
  getCommission: async (data) => {

    const url = ApiConfig.baseUrl + ApiConfig.getCommission;

    return await ApiCallGet(url, data)
  },

  // Investment APIs
  getInvestmentDashboard: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.investmentGet;
    return await ApiCallGet(url);
  },

  createInvestment: async (data) => {
    const url = ApiConfig.baseUrl + ApiConfig.investmentCreate;
    return await ApiCallPost(url, data);
  },

  // Payout/Withdrawal APIs
  getPayoutDashboard: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.payoutDashboard;
    return await ApiCallGet(url);
  },



  // Downline APIs
  getDownlineUnilevel: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.downlineUnilevel;
    return await ApiCallGet(url);
  },

  // Referrals
  getReferrals: async () => {
    const url = ApiConfig.baseUrl + ApiConfig.referralsGet;
    return await ApiCallGet(url);
  },

}
export default AuthService;


