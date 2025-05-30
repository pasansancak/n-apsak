import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { GoogleSignin, statusCodes, GoogleSigninButton, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { loginWithGoogleBackend } from "../api/auth";

export default function GoogleLoginButton({ onSuccess }) {
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsInProgress(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { name, email, photo } = user;
        console.log("Google Giriş Başarılı:", user);
      } else {
        Alert.alert("Giriş Hatası", "Google kimlik doğrulama başarısız oldu.");
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Kullanıcı iptal etti, uyarı gösterme
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Giriş işlemi zaten devam ediyor.");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google Play Servisleri mevcut değil.");
      } else {
        Alert.alert("Giriş Hatası", error.message || "Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsInProgress(false);
    }
  };

  return (
    <GoogleSigninButton
      style={{ width: 240, height: 48 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
      disabled={isInProgress}
    />
  );
}