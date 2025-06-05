import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Button } from "react-native";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useUser } from "../context/UserContext";

export default function LoginScreen({ navigation }) {
  const { setUser } = useUser();

  const test_user = {
    full_name: "Ahmet Yılmaz",
    email: "ahmet@mail.com",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    cover_image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    bio: "Mobil geliştirici, açık hava tutkunu ve AI meraklısı.",
    instagram: "ahmetyilmaz",
    linkedin: "ahmetyilmaz",
  };

  const handleLoginSuccess = (user: any, jwt: string) => {
    setUser(user);
    console.log("user:", user);
    navigation.replace("MainTabs"); // tab navigator’a yönlendir
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>N'apsak?</Text>
      <Text style={styles.subtitle}>Plan ve sosyal paylaşım uygulaması</Text>
      <View style={{ marginTop: 32 }}>
        <GoogleLoginButton onSuccess={handleLoginSuccess} />
      </View>
      <View style={{ marginTop: 24 }}>
        <Button
          onPress={() => {
            setUser(test_user);
            navigation.replace("MainTabs");
          }}
          title="Misafir Giriş"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "bold", color: "#334155" },
  subtitle: { fontSize: 16, color: "#64748b" }
});
