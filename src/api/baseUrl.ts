const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : "https://backend.resume-marketplace.com";

export default baseUrl; 