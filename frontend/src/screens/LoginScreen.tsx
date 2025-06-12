import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import * as SecureStore from "expo-secure-store";

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useUser();

  const test_user = {
    full_name: "Ahmet Remzi Yazıcı",
    email: "remzi@mail.com",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    cover_image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    bio: "Araba tutkunu, gıdacı",
    instagram: "remzi_yazici",
    linkedin: "remzi-yazici",
  };

  const handleLoginSuccess = async (user: any, jwt: string) => {
    await SecureStore.setItemAsync("jwt", jwt);
    setUser(user);
    console.log("user:", user);
  };
  
  return (
    <SafeAreaView style={styles.safe}>
      <ImageBackground
        source={require("../../assets/galata_bg_dark.png")}
        style={styles.bg}
        imageStyle={{ opacity: 0.15 }}
      >
        <View style={styles.container}>
          <Text style={styles.logo}>NAPSAK?</Text>
          <Text style={styles.title}>Giriş Yap</Text>
          <Text style={styles.subtitle}>
            Aramıza katılmak için giriş yapın veya üye olun
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E-posta"
            placeholderTextColor="#bbb"
            keyboardType="email-address"
          />

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Şifre"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#bbb" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setUser(test_user);
            }}
          >
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 0, alignContent: "center"}}>
          <GoogleLoginButton onSuccess={handleLoginSuccess} />
          </View>

          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Hesabın yok mu? </Text>
            <TouchableOpacity>
              <Text style={styles.signupLink}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const INPUT_BG = "rgba(38,38,38,0.9)";
const KNOCKBOLD = "KnockoutBold"; // Font yüklediğin isim

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DARK_BG },
  bg: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 },
  logo: { fontSize: 70, color: NEON, fontFamily: KNOCKBOLD, marginBottom: 10, letterSpacing: 2 },
  title: { fontSize: 22, color: "#fff", fontFamily: KNOCKBOLD, marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#ccc", fontFamily: KNOCKBOLD, marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    backgroundColor: INPUT_BG,
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    fontFamily: KNOCKBOLD,
  },
  inputRow: { width: "100%", flexDirection: "row", alignItems: "center" },
  eyeIcon: { position: "absolute", right: 14 },
  forgot: { alignSelf: "flex-end", marginBottom: 18 },
  forgotText: { color: NEON, fontSize: 13, fontFamily: KNOCKBOLD },
  button: {
    backgroundColor: NEON,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 2,
    marginBottom: 10,
  },
  buttonText: { color: "#222", fontSize: 16, fontFamily: KNOCKBOLD },
  signupRow: { flexDirection: "row", marginTop: 20 },
  signupText: { color: "#bbb", fontFamily: KNOCKBOLD },
  signupLink: { color: NEON, fontFamily: KNOCKBOLD, fontWeight: "bold" },
});
