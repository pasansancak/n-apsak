import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import { getUserMe } from "../api/user";

export type User = {
  full_name: string;
  email: string;
  profile_image: string;
  cover_image?: string;
  bio?: string;
  instagram?: string;
  linkedin?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (token: string) => {
    try {
      const userData = await getUserMe();
      setUser(userData); // ✅ DOĞRU KULLANIM
    } catch (error) {
      Alert.alert("Hata", "Kullanıcı bilgisi alınamadı.");
    }
  };  

  useEffect(() => {
    const checkJWT = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");
        if (token) {
          const decoded: any = jwtDecode(token);
          if (!decoded.sub) throw new Error("JWT geçersiz");
          await fetchUser(token);
        }
      } catch (err) {
        Alert.alert("Hata", "Oturum kontrolü sırasında hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };
    checkJWT();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
