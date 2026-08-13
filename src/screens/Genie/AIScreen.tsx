import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/context/ThemeContext';
import { useGetGenieProfileQuery, useSaveGenieProfileMutation } from '@/services/genie/genie.query';
import type { GenieProfile } from '@/services/genie/genie.type';
import type { MainTabParamList } from '@/navigation/MainTabNavigator';
import { GenieIntroScreen } from './GenieIntroScreen';
import { GenieQuizScreen } from './GenieQuizScreen';
import { GenieChatScreen } from './GenieChatScreen';

type Stage = 'intro' | 'quiz' | 'chat';
type Props = BottomTabScreenProps<MainTabParamList, 'AITab'>;

export function AIScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const { data, isLoading } = useGetGenieProfileQuery();
  const saveMutation = useSaveGenieProfileMutation();
  const completed = data?.data?.onboardingCompleted ?? false;
  const [stage, setStage] = React.useState<Stage | null>(null);

  React.useEffect(() => {
    if (isLoading) return;
    setStage(completed ? 'chat' : 'intro');
  }, [completed, isLoading]);

  const goHome = () => navigation.navigate('HomeTab');

  const finishOnboarding = async (payload?: Partial<GenieProfile>) => {
    await saveMutation.mutateAsync({
      ...(payload || {}),
      onboardingCompleted: true,
    });
    setStage('chat');
  };

  if (isLoading || !stage) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#1A1A1A' : '#FAFAFC',
        }}
      >
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  if (stage === 'intro') {
    return (
      <GenieIntroScreen
        onBack={goHome}
        onContinue={() => setStage('quiz')}
      />
    );
  }

  if (stage === 'quiz') {
    return (
      <GenieQuizScreen
        onBack={() => setStage('intro')}
        onSkip={() => finishOnboarding()}
        onComplete={finishOnboarding}
      />
    );
  }

  return <GenieChatScreen onBack={goHome} />;
}
