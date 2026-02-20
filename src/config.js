// API Configuration
const API_CONFIG = {
  // Change this to switch between local and remote backend
  // USE_LOCAL: true for local Node.js backend
  // USE_LOCAL: false for remote Cockpit CMS
  USE_LOCAL: true,
  
  LOCAL_URL: "http://localhost:3001",
  REMOTE_URL: "http://5.189.163.66/cert-verification",
  
  get BASE_URL() {
    return this.USE_LOCAL ? this.LOCAL_URL : this.REMOTE_URL;
  },
  
  // API Tokens (only needed for remote)
  TOKENS: {
    upload: "API-d9823105104e4a61de49056e3539b02c7a3519fa",
    read: "API-eb29778119234696f32e226d2554f88b73ca8ff5"
  },
  
  // API Endpoints
  ENDPOINTS: {
    uploadCertificate: "/api/content/item/certificates",
    listCertificates: "/api/content/items/certificates",
    saveCertificate: "/api/collections/save/certificates",
    login: "/cockpit/api/authentication/login"
  }
};

export default API_CONFIG;
