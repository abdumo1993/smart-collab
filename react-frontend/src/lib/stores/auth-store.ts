import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authRepository } from "../repositories/auth-repository";
import { getProfile } from "../repositories/repository";

import { User } from "../types/users.types";
// import { redirect } from "next/navigation";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // True while checking session
  isAuthDelay: boolean; // True while auth delay
  setTokens: (access: string, refresh: string) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: (navigate?: (path: string) => void) => Promise<void>; // Make logout async and accept navigate
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAuthDelay: (isAuthDelay: boolean) => void;
  getProfile: () => void;
  clearTokens: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAuthDelay: false,
      user: null,
      isLoading: true,

      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh });
      },
      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },
      setIsAuthDelay: (isAuthDelay) => {
        set({ isAuthDelay });
      },
      login: async (email, password) => {
        const { success, accessToken, refreshToken, error } =
          await authRepository.login(email, password);

        if (success) {
          set({
            accessToken: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          document.cookie = `accessToken=${accessToken}; path=/; SameSite=Strict;`;
        } else {
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
        return { success, error };
      },
      register: async (email, password) => {
        const { success, accessToken, refreshToken, error } =
          await authRepository.register(email, password);
        if (success) {
          set({
            accessToken: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          document.cookie = `accessToken=${accessToken}; path=/; SameSite=Strict;`;
        } else {
          set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
        return { success, error };
      },

      getProfile: async () => {
        set({ isLoading: true });
        const access = get().accessToken;
        if (access) {
          const response = await getProfile(access);
          if (response.success && response.data) {
            const { data } = response;
            set({ user: data });
          }
        }
        set({ isLoading: false });
      },
      logout: async () => {
        const token = get().accessToken;
        if (token) await authRepository.logout(token);

        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        document.cookie = "accessToken=";
        // redirect("/");
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ user }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
