import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { useUser } from '../context/UserContext';
import { View, ActivityIndicator } from "react-native";

export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, isLoading } = useUser();

  if (isLoading || (user && typeof user.onboarded === "undefined")) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  let initialRouteName: keyof RootStackParamList = "Login";
  if (user) {
    initialRouteName = user.onboarded ? "MainTabs" : "Onboarding";
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        {!user && (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        {user && !user.onboarded && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        {user && user.onboarded && (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
