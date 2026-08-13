import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';

const FAIRMONEY = require('../../assets/images/lend/fairmoney.png');

type LoanAccountCardProps = {
  providerName: string;
  paid: string;
  owing: string;
  dueDate: string;
  onPress?: () => void;
};

export function LoanAccountCard({
  providerName,
  paid,
  owing,
  dueDate,
  onPress,
}: LoanAccountCardProps) {
  const { isDark } = useTheme();
  const { hs, fs, ms } = useResponsive();
  const border = isDark ? '#3B3B3B' : '#858585';
  const nameColor = isDark ? '#FFFFFF' : '#1A1D23';
  const dueColor = isDark ? 'rgba(224,224,224,0.7)' : '#7A7A7A';
  const muted = isDark ? 'rgba(133,133,133,0.7)' : '#858585';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          height: ms(98),
          borderRadius: ms(10),
          borderColor: border,
          paddingHorizontal: hs(21),
          paddingVertical: ms(8),
        },
      ]}
    >
      <Text style={[styles.due, { color: dueColor, fontSize: fs(8) }]}>
        Due Date :{dueDate}
      </Text>
      <View style={styles.row}>
        <View style={styles.left}>
          <Image
            source={FAIRMONEY}
            style={{
              width: ms(45),
              height: ms(45),
              borderRadius: ms(23),
              borderWidth: 1,
              borderColor: '#37A477',
            }}
          />
          <Text
            numberOfLines={1}
            style={[styles.name, { color: nameColor, fontSize: fs(14), marginLeft: hs(6) }]}
          >
            {providerName}
          </Text>
        </View>
        <View style={styles.amounts}>
          <Text style={{ fontSize: fs(10) }}>
            <Text style={{ color: muted }}>Paid:</Text>
            <Text style={{ color: '#00C292' }}>{` ${paid}`}</Text>
          </Text>
          <Text style={{ fontSize: fs(10), marginTop: 2 }}>
            <Text style={{ color: muted }}>Owing: </Text>
            <Text style={{ color: '#FF4D4F' }}>{owing}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', borderWidth: 0.4, overflow: 'hidden' },
  due: { textAlign: 'right', fontWeight: '400' },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  name: { fontWeight: '400', flexShrink: 1 },
  amounts: { alignItems: 'flex-end' },
});
