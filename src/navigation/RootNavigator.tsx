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
import { ProfileScreen } from "@/screens/Profile";
import {
  SavingsHubScreen,
  SaveIntroScreen,
  CreateGoalScreen,
  SetHowYouSaveScreen,
  SaveFromScreen,
  SaveAccountScreen,
  SavePleaseWaitScreen,
  SaveAccountLinkedScreen,
  GoalCreatedScreen,
  GoalDetailScreen,
} from "@/screens/Save";
import {
  LendHubScreen,
  LinkLoanProviderScreen,
  LinkLoanAccountScreen,
  LendPleaseWaitScreen,
  LoanDetailScreen,
} from "@/screens/Lend";
import type { SaveGoalDraft } from "@/services/savings/savings.type";
import type { LinkLoanPayload } from "@/services/loans/loans.type";
import type { BillPayDraft, BillPayment } from "@/services/bills/bills.type";
import {
  PayBillsHubScreen,
  AirtimeScreen,
  DataScreen,
  ElectricityScreen,
  TelevisionScreen,
  BillPinScreen,
  BillReceiptScreen,
} from "@/screens/Bills";
import { MainTabNavigator } from "./MainTabNavigator";
import { useTheme } from "@/context/ThemeContext";
import {
  NotificationInboxScreen,
  NotificationPreferencesScreen,
  SecurityCenterScreen,
  FaceIdSetupScreen,
  ChangePasswordScreen,
  ChangePinScreen,
  CustomerServiceScreen,
  SupportChatScreen,
  RateUsScreen,
  AboutUsScreen,
  ReferralsScreen,
  StatementScreen,
  TransactionLimitsScreen,
  DeleteAccountScreen,
} from "@/screens/Settings";

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
  LoginWithPassword: { phoneNumber?: string } | undefined;
  // Main app
  Main: undefined;
  // Budget flow
  BudgetDashboard: undefined;
  BudgetCreation: undefined;
  BudgetAccountSelection: {
    budgetName: string;
    amount: number;
    period: 'WEEKLY' | 'MONTHLY';
    startDate: string;
    endDate: string;
  };
  PleaseWait: {
    budgetName: string;
    amount: number;
    period: 'WEEKLY' | 'MONTHLY';
    startDate: string;
    endDate: string;
    accountId: string;
  };
  AccountLinked: { budgetName: string };
  // Wallet flow
  AddDebitCard: { saveDraft?: SaveGoalDraft } | undefined;
  // Save flow
  SavingsHub: undefined;
  SaveIntro: undefined;
  CreateGoal: undefined;
  SetHowYouSave: {
    name: string;
    targetAmount: number;
    description?: string;
    targetDate?: string;
  };
  SaveFrom: Omit<SaveGoalDraft, 'sourceType' | 'linkedAccountId'>;
  SaveAccount: SaveGoalDraft;
  SavePleaseWait: SaveGoalDraft;
  SaveAccountLinked: { goalName: string; goalId: string };
  GoalCreated: { goalName: string; goalId: string };
  GoalDetail: { goalId: string };
  // Profile
  Profile: undefined;
  // Lend flow
  LendHub: undefined;
  LinkLoanProvider: undefined;
  LinkLoanAccount: { providerCode: string; providerName: string };
  LendPleaseWait: LinkLoanPayload;
  LoanDetail: { loanId: string };
  // Pay bills
  PayBills: undefined;
  BillAirtime: undefined;
  BillData: undefined;
  BillElectricity: undefined;
  BillTelevision: undefined;
  BillPin: BillPayDraft;
  BillReceipt: { payment: BillPayment };
  // Settings + notifications
  NotificationInbox: undefined;
  NotificationPreferences: undefined;
  SecurityCenter: undefined;
  FaceIdSetup: undefined;
  ChangePassword: undefined;
  ChangePin: undefined;
  CustomerService: undefined;
  SupportChat: undefined;
  RateUs: undefined;
  AboutUs: undefined;
  Referrals: undefined;
  StatementLog: undefined;
  TransactionLimits: undefined;
  DeleteAccount: undefined;
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

      {/* Save flow */}
      <Stack.Screen name="SavingsHub" component={SavingsHubScreen} />
      <Stack.Screen name="SaveIntro" component={SaveIntroScreen} />
      <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
      <Stack.Screen name="SetHowYouSave" component={SetHowYouSaveScreen} />
      <Stack.Screen name="SaveFrom" component={SaveFromScreen} />
      <Stack.Screen name="SaveAccount" component={SaveAccountScreen} />
      <Stack.Screen
        name="SavePleaseWait"
        component={SavePleaseWaitScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen
        name="SaveAccountLinked"
        component={SaveAccountLinkedScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen
        name="GoalCreated"
        component={GoalCreatedScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />

      {/* Profile */}
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* Lend flow */}
      <Stack.Screen name="LendHub" component={LendHubScreen} />
      <Stack.Screen name="LinkLoanProvider" component={LinkLoanProviderScreen} />
      <Stack.Screen name="LinkLoanAccount" component={LinkLoanAccountScreen} />
      <Stack.Screen
        name="LendPleaseWait"
        component={LendPleaseWaitScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />
      <Stack.Screen name="LoanDetail" component={LoanDetailScreen} />

      {/* Pay bills */}
      <Stack.Screen name="PayBills" component={PayBillsHubScreen} />
      <Stack.Screen name="BillAirtime" component={AirtimeScreen} />
      <Stack.Screen name="BillData" component={DataScreen} />
      <Stack.Screen name="BillElectricity" component={ElectricityScreen} />
      <Stack.Screen name="BillTelevision" component={TelevisionScreen} />
      <Stack.Screen name="BillPin" component={BillPinScreen} />
      <Stack.Screen
        name="BillReceipt"
        component={BillReceiptScreen}
        options={{ animation: "fade", gestureEnabled: false }}
      />

      {/* Settings + notifications */}
      <Stack.Screen name="NotificationInbox" component={NotificationInboxScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="SecurityCenter" component={SecurityCenterScreen} />
      <Stack.Screen name="FaceIdSetup" component={FaceIdSetupScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChangePin" component={ChangePinScreen} />
      <Stack.Screen name="CustomerService" component={CustomerServiceScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
      <Stack.Screen name="RateUs" component={RateUsScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="Referrals" component={ReferralsScreen} />
      <Stack.Screen name="StatementLog" component={StatementScreen} />
      <Stack.Screen name="TransactionLimits" component={TransactionLimitsScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    </Stack.Navigator>
  );
}
