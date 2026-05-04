import axios from "axios";

const API_BASE_URL = "http://10.81.210.155:3031";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
  timeout: 15000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("API REQUEST =>", {
      url: config.url,
      method: config.method,
      token,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("REQUEST ERROR =>", error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE =>", response);

    return response;
  },
  (error) => {
    console.log("API ERROR =>", error);

    // FULL DEBUG
    if (error.response) {
      console.log("ERROR RESPONSE =>", error.response.data);
      console.log("ERROR STATUS =>", error.response.status);
    }

    if (error.request) {
      console.log("NO RESPONSE RECEIVED =>", error.request);
    }

    // UNAUTHORIZED
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);





const handleError = (error) => {
  console.log("HANDLE ERROR =>", error);

  if (error.response) {
    return {
      success: false,
      error:
        error.response.data?.message ||
        error.response.data ||
        `Error ${error.response.staus}`,
    };
  } else if (error.request) {

    return {
      success: false,
      error:
        "No response from server. Possible CORS issue or backend not responding.",
    };

  } else {
    return {
      success: false,
      error: error.message || "Unexpected error",
    };
  }
};




export const ApiCallPost = async (url, data, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.post(url, data, {
      ...config,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...config.headers,
      },
    });

    return {
      success: true,
      ...(response.data || {}),
    };
  } catch (error) {
    return handleError(error);
  }
};



export const ApiCallGet = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);

    return {
      success: true,
      ...(response.data || {}),
    };
  } catch (error) {
    return handleError(error);
  }
};



export const ApiCallPut = async (url, data, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.put(url, data, {
      ...config,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...config.headers,
      },
    });

    return {
      success: true,
      ...(response.data || {}),
    };
  } catch (error) {
    return handleError(error);
  }
};



export const ApiCallPatch = async (url, data, config = {}) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await api.patch(url, data, {
      ...config,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...config.headers,
      },
    });

    return {
      success: true,
      ...(response.data || {}),
    };
  } catch (error) {
    return handleError(error);
  }
};



export const ApiCallDelete = async (
  url,
  data = {},
  config = {}
) => {
  try {
    const response = await api.delete(url, {
      data,
      ...config,
    });

    return {
      success: true,
      ...(response.data || {}),
    };
  } catch (error) {
    return handleError(error);
  }
};

export { api };





// import axios from "axios";

// const API_BASE_URL = "https://unorbed-reva-cuddlesome.ngrok-free.dev";
// const api = axios.create({
//   baseURL: API_BASE_URL,
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// const handleError = (error) => {
//   if (error.response) {
//     return {
//       success: false,
//       error:
//         error.response.data?.message ||
//         error.response.data ||
//         `Error ${error.response.status}`,
//     };
//   } else if (error.request) {
//     return {
//       success: false,
//       error: "No response from server",
//     };
//   } else {
//     return {
//       success: false,
//       error: error.message || "Unexpected error",
//     };
//   }
// };


// export const ApiCallPost = async (url, data, config = {}) => {
//   try {
//     const isFormData = data instanceof FormData;

//     const response = await api.post(url, data, {
//       ...config,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...config.headers,
//       },
//     });

//     return { success: true, ...(response.data || {}) };
//   } catch (error) {
//     return handleError(error);
//   }
// };



// export const ApiCallGet = async (url, config = {}) => {
//   try {
//     const response = await api.get(url, config);

//     return { success: true, ...(response.data || {}) };
//   } catch (error) {
//     return handleError(error);
//   }
// };



// export const ApiCallPut = async (url, data, config = {}) => {
//   try {
//     const isFormData = data instanceof FormData;

//     const response = await api.put(url, data, {
//       ...config,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...config.headers,
//       },
//     });

//     return { success: true, ...(response.data || {}) };
//   } catch (error) {
//     return handleError(error);
//   }
// };



// export const ApiCallPatch = async (url, data, config = {}) => {
//   try {
//     const isFormData = data instanceof FormData;

//     const response = await api.patch(url, data, {
//       ...config,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...config.headers,
//       },
//     });

//     return { success: true, ...(response.data || {}) };
//   } catch (error) {
//     return handleError(error);
//   }
// };


// export const ApiCallDelete = async (url, data = {}, config = {}) => {
//   try {
//     const response = await api.delete(url, {
//       data,
//       ...config,
//     });

//     return { success: true, ...(response.data || {}) };
//   } catch (error) {
//     return handleError(error);
//   }
// };




// export { api };

// import axios from "axios";


// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "http://192.168.1.15:3031";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
// });


// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Debug URL (optional)
//     console.log("🌐 API Request:", config.baseURL + config.url);

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// /** =========================
//  * RESPONSE INTERCEPTOR
//  ========================== */

// api.interceptors.response.use(
//   (response) => {
//     console.log("✅ API Response:", response);
//     return response;
//   },
//   (error) => {
//     console.error("❌ API Error:", error);

//     if (error.response?.status === 401) {
//       localStorage.clear();
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );


// const handleError = (error) => {
//   if (error.response) {
//     return {
//       success: false,
//       error:
//         error.response.data?.message ||
//         error.response.data?.error ||
//         `Error ${error.response.status}`,
//     };
//   }

//   if (error.request) {
//     return {
//       success: false,
//       error: "No response from server",
//     };
//   }

//   return {
//     success: false,
//     error: error.message || "Unexpected error",
//   };
// };



// export const ApiCallPost = async (url, data, config = {}) => {
//   try {
//     const isFormData = data instanceof FormData;

//     const response = await api.post(url, data, {
//       ...config,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...config.headers,
//       },
//     });

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export const ApiCallGet = async (url, config = {}) => {
//   try {
//     const response = await api.get(url, config);

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export const ApiCallPut = async (url, data, config = {}) => {
//   try {
//     const response = await api.put(url, data, config);

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export const ApiCallDelete = async (url, data = {}, config = {}) => {
//   try {
//     const response = await api.delete(url, { data, ...config });

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export const ApiCallPatch = async (url, data = {}, config = {}) => {
//   try {
//     const response = await api.patch(url, data, config);

//     return {
//       success: true,
//       data: response.data,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export { api };