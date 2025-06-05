import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from "../context/UserContext";

const screenWidth = Dimensions.get('window').width;
const defaultCover = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

export default function ProfileScreen() {
  const { user } = useUser();

  if (!user) return <Text>Kullanıcı verisi bulunamadı.</Text>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image source={{ uri: user.cover_image || defaultCover }} style={styles.cover} resizeMode="cover" />
        <View style={styles.card}>
          <Image source={{ uri: user.profile_image }} style={styles.avatar} />
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: { width: screenWidth, height: 180 },
  card: { backgroundColor: '#fff', marginTop: -64, marginHorizontal: 24, borderRadius: 20, alignItems: 'center', padding: 28, shadowColor: '#334155', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  avatar: { width: 112, height: 112, borderRadius: 56, borderWidth: 4, borderColor: '#f1f5f9', marginTop: -64, marginBottom: 8, backgroundColor: '#e2e8f0' },
  name: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', marginTop: 4 },
  email: { fontSize: 16, color: '#64748b', marginTop: 4 },
  bio: { marginTop: 12, fontSize: 15, color: '#334155', textAlign: 'center' }
});
