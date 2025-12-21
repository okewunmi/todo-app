import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface FABProps {
  onPress: () => void;
  icon: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  testID?: string;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  style,
  backgroundColor,
  testID,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.fab,
        { backgroundColor: backgroundColor || theme.fabBackground },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});