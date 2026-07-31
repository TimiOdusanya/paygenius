import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import {
  FormInput,
  Header,
  PrimaryButton,
  SelectInput,
} from '@/components';
import LocationPin from '../../../assets/images/kyc/location-pin.svg';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { useTrackOnboardingRoute } from '@/hooks/useTrackOnboardingRoute';
import {
  NIGERIA_STATES,
  getLgasForState,
} from '@/constants/nigeriaLocations';
import { useVerifyAddressMutation } from '@/services/profile/profile.query';
import { getApiErrorMessage } from '@/utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressVerification'>;

export function AddressVerificationScreen({ navigation }: Props) {
  useTrackOnboardingRoute('AddressVerification');
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, ms } = useResponsive();

  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const avatarBg = isDark ? '#2E4A4A' : '#AFE9D6';
  const avatarBorder = isDark ? '#8855DD' : '#D8C4FA';
  const ringColor = isDark ? '#6633CC' : '#D8C4FA';

  const lgaOptions = useMemo(() => getLgasForState(state), [state]);
  const verifyAddressMutation = useVerifyAddressMutation();

  const isReady =
    Boolean(houseNumber.trim() && streetName.trim() && state.trim() && lga.trim());

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + vs(24),
            paddingBottom: Math.max(insets.bottom, vs(24)),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, { paddingHorizontal: hs(21) }]}>
          <Header
            onBack={() => navigation.goBack()}
            title="Verify Address"
            description="Help us confirm your address"
          />

          <View style={[styles.illustrationWrap, { marginTop: vs(20) }]}>
            <View
              style={[
                styles.outerRing,
                {
                  width: vs(165),
                  height: vs(165),
                  borderRadius: vs(82),
                  borderColor: ringColor,
                  borderStyle: 'dashed',
                },
              ]}
            >
              <View
                style={[
                  styles.midRing,
                  {
                    width: vs(146),
                    height: vs(146),
                    borderRadius: vs(73),
                    borderColor: ringColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    {
                      width: vs(109),
                      height: vs(109),
                      borderRadius: vs(55),
                      backgroundColor: avatarBg,
                      borderColor: avatarBorder,
                    },
                  ]}
                >
                  <LocationPin width={vs(60)} height={vs(60)} />
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.form, { marginTop: vs(16), gap: vs(4) }]}>
            <FormInput
              label="House Number"
              value={houseNumber}
              onChangeText={setHouseNumber}
              placeholder="14"
              keyboardType="number-pad"
            />
            <FormInput
              label="Street Name"
              value={streetName}
              onChangeText={setStreetName}
              placeholder="Broad street"
              autoCapitalize="words"
            />

            <SelectInput
              label="State"
              value={state}
              placeholder="Lagos State"
              options={NIGERIA_STATES}
              onSelect={(next) => {
                setState(next);
                setLga('');
              }}
            />

            <SelectInput
              label="Local Government Area"
              value={lga}
              placeholder="Lagos Island East"
              options={lgaOptions}
              onSelect={setLga}
              disabled={!state}
              placeholderFontSize={10}
            />
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title="Continue"
              onPress={() => {
                if (!isReady) return;
                verifyAddressMutation.mutate(
                  {
                    houseNumber: houseNumber.trim(),
                    streetName: streetName.trim(),
                    city: state.trim(),
                    state: state.trim(),
                    localGovernmentArea: lga.trim(),
                  },
                  {
                    onSuccess: () => navigation.navigate('IdentityVerification'),
                    onError: (err: unknown) => {
                      Alert.alert(
                        'Error',
                        getApiErrorMessage(
                          err,
                          'Address verification failed. Please try again.'
                        )
                      );
                    },
                  }
                );
              }}
              disabled={!isReady || verifyAddressMutation.isPending}
              style={!isReady ? styles.btnDisabled : undefined}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  inner: { flex: 1 },
  illustrationWrap: { alignItems: 'center' },
  outerRing: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  midRing: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  form: {},
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
  btnDisabled: { opacity: 0.6 },
});
