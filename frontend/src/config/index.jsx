import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://proconnectlinkedinclone-lldr.onrender.com";

export const clientServer = axios.create({
    baseURL: BASE_URL,
});