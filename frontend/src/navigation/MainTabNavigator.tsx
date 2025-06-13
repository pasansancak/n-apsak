import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import FeedScreen from '../screens/FeedScreen';
import AdviceScreen from '../screens/AdviceScreen';
import PlanScreen from '../screens/PlanScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const BORDER_TOP = "#23272f";
const KNOCKBOLD = "KnockoutBold";

function PlanTabIcon() {
  return (
    <View style={styles.planTabIconWrapper}>
      {/* Border-top efekti */}
      <View style={styles.fakeBorderTop} />
      {/* Yuvarlak ikon */}
      <View style={styles.planTabIconContainer}>
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={38}
          color={NEON}
        />
      </View>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: DARK_BG,
          borderTopColor: BORDER_TOP,
          borderTopWidth: 2,
          height: 70,
        },
        tabBarActiveTintColor: NEON,
        tabBarInactiveTintColor: "#aaa",
        tabBarLabelStyle: {
          fontFamily: KNOCKBOLD,
          fontSize: 13,
          marginBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'] = 'menu';
          if (route.name === 'Feed') iconName = 'menu';
          else if (route.name === 'Advice') iconName = 'lightbulb-outline';
          else if (route.name === 'Plan') return <PlanTabIcon />;
          else if (route.name === 'Community') iconName = 'account-group-outline';
          else if (route.name === 'Profile') iconName = 'account-circle-outline';

          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Advice" component={AdviceScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  planTabIconWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 72,
    width: 72,
  },
  planTabIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: DARK_BG,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: NEON,
    marginBottom: 10, // Yükseltmek için
    zIndex: 3,
  },
});
