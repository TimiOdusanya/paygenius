import React from 'react';
import type { ComponentProps } from 'react';
import { FormInput } from './FormInput';
import { formatAmountInput } from '@/utils/amount';

type Props = ComponentProps<typeof FormInput>;

/** Labeled amount field that inserts thousand separators as the user types. */
export function AmountInput({
  value,
  onChangeText,
  keyboardType = 'decimal-pad',
  ...props
}: Props) {
  return (
    <FormInput
      {...props}
      keyboardType={keyboardType}
      value={formatAmountInput(String(value ?? ''))}
      onChangeText={(text) => onChangeText?.(formatAmountInput(text))}
    />
  );
}
