import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView,
  Dimensions, TouchableOpacity, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from "../context/UserContext";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const defaultCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const CARD_BG = "#23272f";
const KNOCKBOLD = "KnockoutBold";

export default function ProfileScreen() {
  const { user, setUser } = useUser();
  const [settingsVisible, setSettingsVisible] = useState(false);

  if (!user) return <Text style={{ color: NEON, fontFamily: KNOCKBOLD, textAlign: "center", marginTop: 32 }}>Kullanıcı verisi bulunamadı.</Text>;

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
    setSettingsVisible(false);
    Alert.alert("Çıkış Yapıldı", "Başarıyla çıkış yaptınız.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: DARK_BG }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cover & Settings */}
        <View>
          <Image source={{ uri: user.cover_image || defaultCover }} style={styles.cover} />
          <TouchableOpacity style={styles.settingsIcon} onPress={() => setSettingsVisible(true)}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          <Image source={{ uri: user.profile_image }} style={styles.avatar} />
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.followText}>0 FOLLOWERS   |   0 FOLLOWING</Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>VIEW FULL PROFILE</Text>
          </TouchableOpacity>
        </View>

        {/* My Plans Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MY PLANS</Text>
          <View style={styles.planCard}>
            <Text style={{ color: "#bbb" }}>[Burada kullanıcının planları listelenecek]</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal Settings */}
      <Modal visible={settingsVisible} animationType="slide" transparent={true}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Ayarlar</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsVisible(false)} style={{ marginTop: 16 }}>
            <Text style={{ color: "#aaa" }}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: { width: screenWidth, height: 180 },
  settingsIcon: { position: 'absolute', top: 12, right: 12 },
  card: {
    alignItems: 'center',
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    marginTop: -64,
    borderRadius: 20,
    paddingVertical: 28,
    shadowColor: NEON,
    shadowOpacity: 0.15,
    elevation: 5
  },
  avatar: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 3, borderColor: NEON,
    marginBottom: 8, backgroundColor: '#23272f',
  },
  name: { fontSize: 24, color: NEON, fontFamily: KNOCKBOLD, marginTop: 6 },
  country: { color: '#ccc', fontSize: 16, fontFamily: KNOCKBOLD },
  followText: { color: '#999', fontSize: 13, marginTop: 8 },
  viewButton: {
    borderColor: "#fff", borderWidth: 1, paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 8, marginTop: 12
  },
  viewButtonText: { color: "#fff", fontFamily: KNOCKBOLD },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { color: NEON, fontSize: 16, fontFamily: KNOCKBOLD, marginBottom: 8 },
  planCard: {
    backgroundColor: CARD_BG, padding: 16, borderRadius: 12, borderWidth: 1,
    borderColor: "#333", marginBottom: 12
  },
  modalView: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    fontFamily: KNOCKBOLD,
    marginBottom: 20
  },
  logoutButton: {
    backgroundColor: NEON,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#23272f",
    fontFamily: KNOCKBOLD,
    fontSize: 16,
    fontWeight: "bold"
  }
});
