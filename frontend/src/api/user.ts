import { getItemAsync } from "expo-secure-store";
import axios from "axios";

export async function getUserMe() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL + "/me";
  const token = await getItemAsync("jwt");

  if (!token) throw new Error("JWT bulunamadı");
  const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });

  return response.data;
}
