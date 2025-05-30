import React from "react";
import { View } from "react-native";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function LoginScreen() {
  const handleLoginSuccess = (user: any, jwt: string) => {
    // JWT'yi sakla (SecureStore, context vs.)
    // Kullanıcıyı profil ekranına yönlendir
    console.log("Giriş başarılı:", user, jwt);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <GoogleLoginButton onSuccess={handleLoginSuccess} />
    </View>
  );
}
// Bu ekran, Google ile giriş yapmayı sağlar. Başarılı giriş sonrası kullanıcı bilgilerini ve JWT'yi alır.