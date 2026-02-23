/**
 * @fileoverview API service layer.
 * Centralizes all HTTP calls to the backend using Axios.
 * Every function returns a promise that resolves to the server response data.
 */

import axios from "axios";

/** Base Axios instance configured for our backend. */
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true, // Send session cookies with every request
});

/* ==============================================
   Auth API
   ============================================== */

/**
 * Fetches the currently authenticated user from the server session.
 * Returns `null` if no user is logged in.
 */
export const getCurrentUser = async () => {
    const { data } = await api.get("/auth/current-user");
    return data;
};

/** Logs the user out by calling the server logout endpoint. */
export const logoutUser = async () => {
    const { data } = await api.get("/auth/logout");
    return data;
};

/* ==============================================
   Confessions API
   ============================================== */

/** Fetches all confessions (newest first). */
export const getAllConfessions = async () => {
    const { data } = await api.get("/api/confessions");
    return data;
};

/** Fetches confessions belonging to the logged-in user. */
export const getMyConfessions = async () => {
    const { data } = await api.get("/api/confessions/mine");
    return data;
};

/**
 * Creates a new anonymous confession.
 * @param {{ text: string, secretCode: string, category: string }} confessionData
 */
export const createConfession = async (confessionData) => {
    const { data } = await api.post("/api/confessions", confessionData);
    return data;
};

/**
 * Updates a confession's text (requires correct secret code).
 * @param {string} id - The confession's MongoDB ObjectId
 * @param {{ secretCode: string, text: string, category?: string }} updateData
 */
export const updateConfession = async (id, updateData) => {
    const { data } = await api.put(`/api/confessions/${id}`, updateData);
    return data;
};

/**
 * Deletes a confession (requires correct secret code).
 * @param {string} id         - The confession's MongoDB ObjectId
 * @param {string} secretCode - The secret code to authorize deletion
 */
export const deleteConfession = async (id, secretCode) => {
    const { data } = await api.delete(`/api/confessions/${id}`, {
        data: { secretCode },
    });
    return data;
};

/**
 * Adds a reaction to a confession.
 * @param {string} id   - The confession's MongoDB ObjectId
 * @param {string} type - One of: "like", "love", "laugh"
 */
export const addReaction = async (id, type) => {
    const { data } = await api.post(`/api/confessions/${id}/react`, { type });
    return data;
};

/**
 * Adds an anonymous comment to a confession.
 * @param {string} id   - The confession's MongoDB ObjectId
 * @param {string} text - The comment text
 */
export const addComment = async (id, text) => {
    const { data } = await api.post(`/api/confessions/${id}/comment`, { text });
    return data;
};

export default api;
