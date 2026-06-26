import React, { useRef, useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; icon: IoniconsName; iconFocused: IoniconsName }[] = [
  { name: 'index',    icon: 'home-outline',    iconFocused: 'home' },
  { name: 'library',  icon: 'library-outline', iconFocused: 'library' },
  { name: 'programs', icon: 'layers-outline',  iconFocused: 'layers' },
  { name: 'support',  icon: 'heart-outline',   iconFocused: 'heart' },
  { name: 'profile',  icon: 'person-outline',  iconFocused: 'person' },
];

const BUBBLE_W = 52;
const BAR_H_PAD = 10; // paddingHorizontal on bar

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const slideX = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (barWidth === 0) return;
    const tabWidth = (barWidth - BAR_H_PAD * 2) / TABS.length;
    const toX = BAR_H_PAD + state.index * tabWidth + tabWidth / 2 - BUBBLE_W / 2;
    Animated.spring(slideX, {
      toValue: toX,
      useNativeDriver: true,
      tension: 70,
      friction: 12,
    }).start();
  }, [state.index, barWidth]);

  return (
    <View style={styles.zero}>
      <View
        style={[styles.pill, { bottom: insets.bottom - 6 }]}
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      >
        {/* Sliding bubble indicator */}
        <Animated.View
          style={[styles.slider, { transform: [{ translateX: slideX }] }]}
        />

        {state.routes.map((route: any, index: number) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.7}>
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={27}
                color={focused ? colors.white : colors.textMuted}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Home' }} />
      <Tabs.Screen name="library"  options={{ title: 'Library' }} />
      <Tabs.Screen name="programs" options={{ title: 'Programs' }} />
      <Tabs.Screen name="support"  options={{ title: 'Support' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  zero: {
    height: 0,
    overflow: 'visible',
  },
  pill: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 36,
    paddingHorizontal: BAR_H_PAD,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  slider: {
    position: 'absolute',
    top: 12,
    left: 0,
    width: BUBBLE_W,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    zIndex: 1,
  },
});
