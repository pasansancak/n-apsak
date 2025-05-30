import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { GoogleSignin, statusCodes, GoogleSigninButton, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { loginWithGoogleBackend } from "../api/auth";
import { Platform } from "react-native";
import axios from "axios";

export default function GoogleLoginButton({ onSuccess }) {
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
      forceCodeForRefreshToken: true, // Refresh token almak için
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsInProgress(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        const clientType = Platform.OS; // "ios" veya "android"
        try {
          const backendRes = await loginWithGoogleBackend(idToken, clientType);
    
          // JWT'yi güvenli sakla (JWT' yi alıp saklamak için burayı düzenle)
          // await SecureStore.setItemAsync("jwt", backendRes.access_token);
          // Kullanıcı verisiyle devam et
          // örn: onSuccess(backendRes.user, backendRes.access_token);

        } catch (e) {
          Alert.alert("Backend Hatası", "Sunucu ile iletişim başarısız.");
        }
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