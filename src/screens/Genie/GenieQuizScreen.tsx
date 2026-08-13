import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { BackButton } from '@/components/BackButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RadioOption } from '@/components/RadioOption';
import { CheckboxOption } from '@/components/CheckboxOption';
import { StepProgressBar } from '@/components/StepProgressBar';
import QuizBlobs from '../../../assets/images/genie/quiz-blobs.svg';
import {
  CHECKIN_OPTIONS,
  GOAL_OPTIONS,
  HELP_OPTIONS,
  INCOME_OPTIONS,
  OCCUPATION_OPTIONS,
  PAY_FREQUENCY_OPTIONS,
  PEEK_OPTIONS,
  SPEND_OPTIONS,
  STEP_META,
  STYLE_OPTIONS,
  TIMELINE_OPTIONS,
  TRACKING_OPTIONS,
} from './genieQuestions';
import type { GenieProfile } from '@/services/genie/genie.type';

type Answers = {
  occupation?: string;
  payFrequency?: string;
  monthlyIncome?: string;
  topSpends: string[];
  trackingHabit?: string;
  spendingStyle?: string;
  goals: string[];
  goalTimeline?: string;
  helpFocus?: string;
  checkInPreference?: string;
  allowPeek?: string;
};

type Props = {
  onBack: () => void;
  onSkip: () => void;
  onComplete: (payload: Partial<GenieProfile>) => void;
};

function toggleLimited(list: string[], value: string, max: number): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (list.length >= max) return list;
  return [...list, value];
}

export function GenieQuizScreen({ onBack, onSkip, onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { hs, vs, fs } = useResponsive();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({
    topSpends: [],
    goals: [],
  });

  const bg = isDark ? '#1A1A1A' : '#FAFAFC';
  const title = isDark ? '#FFFFFF' : '#191970';
  const sub = isDark ? '#AAAAAA' : '#858585';
  const question = isDark ? '#FFFFFF' : '#000000';
  const meta = STEP_META[step];

  const canContinue = [
    Boolean(answers.occupation && answers.payFrequency && answers.monthlyIncome),
    answers.topSpends.length === 3 && Boolean(answers.trackingHabit && answers.spendingStyle),
    answers.goals.length > 0 && answers.goals.length <= 2 && Boolean(answers.goalTimeline),
    Boolean(answers.helpFocus && answers.checkInPreference && answers.allowPeek),
  ][step];

  const handleBack = () => {
    if (step === 0) onBack();
    else setStep((s) => s - 1);
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep((s) => s + 1);
      return;
    }
    onComplete({
      ...answers,
      onboardingCompleted: true,
    });
  };

  const skipControl = (
    <Pressable onPress={onSkip} hitSlop={8}>
      <Text style={{ color: title, fontSize: fs(14), lineHeight: fs(18) }}>Skip</Text>
    </Pressable>
  );

  return (
    <View style={[styles.root, { backgroundColor: bg, paddingTop: insets.top }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ marginLeft: hs(-35), marginTop: vs(210) }}>
          <QuizBlobs width={hs(471)} height={vs(455)} />
        </View>
      </View>

      <View
        style={[
          styles.topBar,
          { paddingHorizontal: hs(23), paddingTop: vs(10) },
        ]}
      >
        <BackButton onPress={handleBack} />
        {step === 0 ? skipControl : <View style={{ width: 32 }} />}
      </View>

      <View
        style={{
          paddingHorizontal: hs(21),
          marginTop: vs(8),
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text
            style={{
              color: title,
              fontSize: fs(16),
              fontWeight: '600',
              letterSpacing: -0.32,
              lineHeight: fs(20),
            }}
          >
            {meta.title}
          </Text>
          <Text style={{ color: sub, fontSize: fs(12), marginTop: 4, lineHeight: fs(16) }}>
            {meta.subtitle}
          </Text>
        </View>
        {step > 0 ? skipControl : null}
      </View>

      <View style={{ marginTop: vs(12) }}>
        <StepProgressBar total={4} current={step + 1} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: hs(21),
          paddingTop: vs(20),
          paddingBottom: vs(20),
          gap: 25,
        }}
        showsVerticalScrollIndicator={false}
      >
        {step === 0 ? (
          <>
            <QuestionGroup title="What best describes you right now?" color={question} fs={fs}>
              {OCCUPATION_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.occupation === opt}
                  onPress={() => setAnswers((a) => ({ ...a, occupation: opt }))}
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="How often do you get paid?" color={question} fs={fs}>
              {PAY_FREQUENCY_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.payFrequency === opt}
                  onPress={() => setAnswers((a) => ({ ...a, payFrequency: opt }))}
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="Roughly how much comes in monthly?" color={question} fs={fs}>
              {INCOME_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.monthlyIncome === opt}
                  onPress={() => setAnswers((a) => ({ ...a, monthlyIncome: opt }))}
                />
              ))}
            </QuestionGroup>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <QuestionGroup
              title="What’s your biggest monthly spend? "
              accent="(Pick 3)"
              color={question}
              fs={fs}
            >
              {SPEND_OPTIONS.map((opt) => (
                <CheckboxOption
                  key={opt}
                  label={opt}
                  selected={answers.topSpends.includes(opt)}
                  onPress={() =>
                    setAnswers((a) => ({
                      ...a,
                      topSpends: toggleLimited(a.topSpends, opt, 3),
                    }))
                  }
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="Do you keep track of what you spend?" color={question} fs={fs}>
              {TRACKING_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.trackingHabit === opt}
                  onPress={() => setAnswers((a) => ({ ...a, trackingHabit: opt }))}
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="Be honest — which one sounds like you?" color={question} fs={fs}>
              {STYLE_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.spendingStyle === opt}
                  onPress={() => setAnswers((a) => ({ ...a, spendingStyle: opt }))}
                />
              ))}
            </QuestionGroup>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <QuestionGroup
              title="What are your top goals right now? "
              accent="(Pick up to 2)"
              color={question}
              fs={fs}
            >
              {GOAL_OPTIONS.map((opt) => (
                <CheckboxOption
                  key={opt}
                  label={opt}
                  selected={answers.goals.includes(opt)}
                  onPress={() =>
                    setAnswers((a) => ({
                      ...a,
                      goals: toggleLimited(a.goals, opt, 2),
                    }))
                  }
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="How soon do you want to hit your next goal?" color={question} fs={fs}>
              {TIMELINE_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.goalTimeline === opt}
                  onPress={() => setAnswers((a) => ({ ...a, goalTimeline: opt }))}
                />
              ))}
            </QuestionGroup>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <QuestionGroup title="What would you like Genie to help with most?" color={question} fs={fs}>
              {HELP_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.helpFocus === opt}
                  onPress={() => setAnswers((a) => ({ ...a, helpFocus: opt }))}
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="How do you want me to check in with you?" color={question} fs={fs}>
              {CHECKIN_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.checkInPreference === opt}
                  onPress={() => setAnswers((a) => ({ ...a, checkInPreference: opt }))}
                />
              ))}
            </QuestionGroup>
            <QuestionGroup title="Can Genie peek at your money moves" color={question} fs={fs}>
              {PEEK_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt}
                  label={opt}
                  selected={answers.allowPeek === opt}
                  onPress={() => setAnswers((a) => ({ ...a, allowPeek: opt }))}
                />
              ))}
            </QuestionGroup>
          </>
        ) : null}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: hs(22),
          paddingBottom: insets.bottom + vs(16),
          paddingTop: vs(8),
        }}
      >
        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          style={!canContinue ? { opacity: 0.45 } : undefined}
        />
      </View>
    </View>
  );
}

function QuestionGroup({
  title,
  accent,
  color,
  fs,
  children,
}: {
  title: string;
  accent?: string;
  color: string;
  fs: (n: number) => number;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text
        style={{
          color,
          fontSize: fs(14),
          fontWeight: '600',
          letterSpacing: -0.28,
          lineHeight: fs(20),
          marginBottom: 12,
        }}
      >
        {title}
        {accent ? <Text style={{ color: '#7C3AED' }}>{accent}</Text> : null}
      </Text>
      <View style={{ gap: 5 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
