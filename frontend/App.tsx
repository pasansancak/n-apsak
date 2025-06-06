import React from "react";
import * as Font from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProvider } from "./src/context/UserContext";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    KnockoutBold: require("./src/utils/fonts/knockbold.regular.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
