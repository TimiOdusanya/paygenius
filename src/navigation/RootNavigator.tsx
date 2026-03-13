import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  LoginScreen,
  SplashScreen,
  Onboarding1Screen,
  Onboarding2Screen,
  Onboarding3Screen,
  Onboarding4Screen,
  RegionSelectorScreen,
} from "@/screens";
import { useTheme } from "@/context/ThemeContext";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  RegionSelector: undefined;
  Home: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding1"
        component={Onboarding1Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding2"
        component={Onboarding2Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding3"
        component={Onboarding3Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding4"
        component={Onboarding4Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegionSelector"
        component={RegionSelectorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "PayGenius" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Sign in" }}
      />
    </Stack.Navigator>
  );
}
