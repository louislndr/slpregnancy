import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface AppHeaderProps {
  showBack?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  rightIcon2?: React.ComponentProps<typeof Ionicons>['name'];
  onRightPress?: () => void;
  onRight2Press?: () => void;
}

export default function AppHeader({
  showBack = false,
  onBackPress,
  rightIcon,
  rightIcon2,
  onRightPress,
  onRight2Press,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity style={styles.iconBtn} onPress={onBackPress ?? (() => router.back())}>
            <Ionicons name="chevron-back" size={26} color={colors.coldViolet} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.right}>
        {rightIcon2 && (
          <TouchableOpacity style={styles.iconBtn} onPress={onRight2Press}>
            <Ionicons name={rightIcon2} size={22} color={colors.coldViolet} />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity style={styles.iconBtn} onPress={onRightPress}>
            <Ionicons name={rightIcon} size={22} color={colors.coldViolet} />
          </TouchableOpacity>
        )}
        {!rightIcon && !rightIcon2 && <View style={styles.iconBtn} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    width: 72,
    alignItems: 'flex-start',
  },
  right: {
    width: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 180,
    height: 52,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
