import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screens/FeedScreen';
import AdviceScreen from '../screens/AdviceScreen';
import PlanScreen from '../screens/PlanScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const KNOCKBOLD = "KnockoutBold";

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
    id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: DARK_BG,
          borderTopColor: "#23272f",
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
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home-outline';
          if (route.name === 'Feed') iconName = 'menu-outline';
          else if (route.name === 'Advice') iconName = 'bulb-outline';
          else if (route.name === 'Plan') iconName = 'calendar-outline';
          else if (route.name === 'Community') iconName = 'people-outline';
          else if (route.name === 'Profile') iconName = 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
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
