import React from 'react';
import { Button } from 'react-native-paper';

interface CustomButtonProps {
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export default function CustomButton({
  mode = 'contained',
  onPress,
  children,
  disabled,
  loading,
  style
}: CustomButtonProps) {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      style={style}
    >
      {children}
    </Button>
  );
}