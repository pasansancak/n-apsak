import { getItemAsync } from "expo-secure-store";
import axios from "axios";

export async function getUserMe() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL + "/me";
  const token = await getItemAsync("jwt");

  if (!token) throw new Error("JWT bulunamadı");
  const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });

  return response.data;
}

import * as SecureStore from 'expo-secure-store';

export async function postOnboarding(data: any) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL + "/me/onboarding";
  const token = await SecureStore.getItemAsync("jwt");
  if (!token) throw new Error("Oturum geçersiz");

  const res = await axios.post(
    apiUrl,
    data,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
}
