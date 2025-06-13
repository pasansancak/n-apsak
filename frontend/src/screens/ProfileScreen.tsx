import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from "../context/UserContext";
import * as SecureStore from "expo-secure-store";

const screenWidth = Dimensions.get('window').width;
const defaultCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const CARD_BG = "#23272f";
const KNOCKBOLD = "KnockoutBold";

export default function ProfileScreen() {
  const { user, setUser } = useUser();

  if (!user) return <Text style={{ color: NEON, fontFamily: KNOCKBOLD, textAlign: "center", marginTop: 32 }}>Kullanıcı verisi bulunamadı.</Text>;

  // LOGOUT fonksiyonu
  const handleLogout = async () => {
    // JWT'yi cihazdan sil
    await SecureStore.deleteItemAsync("jwt");
    // User context'i sıfırla
    setUser(null);
    // (İsteğe bağlı: Uyarı veya navigasyon ekleyebilirsin)
    Alert.alert("Çıkış Yapıldı", "Başarıyla çıkış yaptınız.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DARK_BG }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image source={{ uri: user.cover_image || defaultCover }} style={styles.cover} resizeMode="cover" />
        <View style={styles.card}>
          <Image source={{ uri: user.profile_image }} style={styles.avatar} />
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {/* LOGOUT BUTTON */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: { width: screenWidth, height: 180, opacity: 0.93, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  card: {
    backgroundColor: CARD_BG,
    marginTop: -64,
    marginHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    padding: 28,
    shadowColor: NEON,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
  },
  avatar: {
    width: 112, height: 112, borderRadius: 56,
    borderWidth: 3, borderColor: NEON,
    marginTop: -64, marginBottom: 8, backgroundColor: '#23272f',
  },
  name: { 
    fontSize: 26, 
    color: NEON, 
    marginTop: 4, 
    fontFamily: KNOCKBOLD,
    letterSpacing: 1.2,
  },
  email: { 
    fontSize: 16, 
    color: "#ccc", 
    marginTop: 4, 
    fontFamily: KNOCKBOLD,
    opacity: 0.9
  },
  bio: { 
    marginTop: 12, 
    fontSize: 15, 
    color: "#fff", 
    textAlign: 'center', 
    fontFamily: KNOCKBOLD,
    opacity: 0.85
  },
  logoutButton: {
    backgroundColor: NEON,
    borderRadius: 10,
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#23272f",
    fontFamily: KNOCKBOLD,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});
