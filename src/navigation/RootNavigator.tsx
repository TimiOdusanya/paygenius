import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SplashScreen,
  Onboarding1Screen,
  Onboarding2Screen,
  Onboarding3Screen,
  Onboarding4Screen,
  RegionSelectorScreen,
} from "@/screens";
import {
  CreateAccountScreen,
  OTPVerificationScreen,
  CreatePasswordScreen,
  LoginWithPasswordScreen,
} from "@/screens/Auth";
import {
  ProfileIntroductionScreen,
  ProfileSetupScreen,
  AddressVerificationScreen,
  IdentityVerificationScreen,
  VerificationCompletedScreen,
  SelfieIntroductionScreen,
  TakeSelfieScreen,
} from "@/screens/KYC";
import {
  SecuritySetupScreen,
  BiometricSetupScreen,
  AccountCreatedScreen,
} from "@/screens/Security";
import { LoginScreen } from "@/screens/Login";
import {
  BudgetDashboardScreen,
  BudgetCreationScreen,
  BudgetAccountSelectionScreen,
  PleaseWaitScreen,
  AccountLinkedScreen,
} from "@/screens/Budget";
import { AddDebitCardScreen } from "@/screens/Wallet";
import { MainTabNavigator } from "./MainTabNavigator";
import { useTheme } from "@/context/ThemeContext";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  RegionSelector: undefined;
  // Auth – Registration
  CreateAccount: undefined;
  OTPVerification: { phoneNumber: string };
  CreatePassword: { phoneNumber: string };
  ProfileIntroduction: undefined;
  ProfileSetup: undefined;
  AddressVerification: undefined;
  IdentityVerification: undefined;
  VerificationCompleted: undefined;
  SelfieIntroduction: undefined;
  TakeSelfie: undefined;
  SecuritySetup: undefined;
  BiometricSetup: undefined;
  AccountCreated: undefined;
  // Auth – Login
  Login: undefined;
  LoginWithPassword: undefined;
  // Main app
  Main: undefined;
  // Budget flow
  BudgetDashboard: undefined;
  BudgetCreation: undefined;
  BudgetAccountSelection: {
    budgetName: string;
    amount: number;
    period: 'WEEKLY' | 'MONTHLY';
    selectedDate: string;
  };
  PleaseWait: {
    budgetName: string;
    amount: number;
    period: 'WEEKLY' | 'MONTHLY';
    selectedDate: string;
    accountId: string;
  };
  AccountLinked: { budgetName: string };
  // Wallet flow
  AddDebitCard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {/* Splash + Onboarding */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
      <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
      <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
      <Stack.Screen name="Onboarding4" component={Onboarding4Screen} />
      <Stack.Screen name="RegionSelector" component={RegionSelectorScreen} />

      {/* Registration flow */}
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
      <Stack.Screen name="ProfileIntroduction" component={ProfileIntroductionScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="AddressVerification" component={AddressVerificationScreen} />
      <Stack.Screen name="IdentityVerification" component={IdentityVerificationScreen} />
      <Stack.Screen name="VerificationCompleted" component={VerificationCompletedScreen} />
      <Stack.Screen name="SelfieIntroduction" component={SelfieIntroductionScreen} />
      <Stack.Screen name="TakeSelfie" component={TakeSelfieScreen} />
      <Stack.Screen name="SecuritySetup" component={SecuritySetupScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
      <Stack.Screen name="AccountCreated" component={AccountCreatedScreen} />

      {/* Login flow */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="LoginWithPassword" component={LoginWithPasswordScreen} />

      {/* Main App */}
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ animation: "fade" }}
      />

      {/* Budget flow */}
      <Stack.Screen name="BudgetDashboard" component={BudgetDashboardScreen} />
      <Stack.Screen name="BudgetCreation" component={BudgetCreationScreen} />
      <Stack.Screen name="BudgetAccountSelection" component={BudgetAccountSelectionScreen} />
      <Stack.Screen
        name="PleaseWait"
        component={PleaseWaitScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen
        name="AccountLinked"
        component={AccountLinkedScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />

      {/* Wallet flow */}
      <Stack.Screen name="AddDebitCard" component={AddDebitCardScreen} />
    </Stack.Navigator>
  );
}
