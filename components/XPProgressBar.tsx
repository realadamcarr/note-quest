import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface XPProgressBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  animated?: boolean;
  showTooltip?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  maxXP,
  level,
  animated = true,
  showTooltip = true,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const progressPercentage = Math.min((currentXP / maxXP) * 100, 100);
  const xpToNext = maxXP - currentXP;

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Glow animation for active progress
      if (progressPercentage > 0) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.3,
              duration: 1500,
              useNativeDriver: false,
            }),
          ])
        ).start();
      }
    } else {
      progressAnim.setValue(progressPercentage);
    }
  }, [progressPercentage, animated, progressAnim, glowAnim]);

  return (
    <View style={styles.container}>
      {showTooltip && xpToNext > 0 && (
        <View style={styles.tooltip}>
          <ThemedText style={styles.tooltipText}>
            {xpToNext} XP to Lv. {level + 1}! 🚀
          </ThemedText>
        </View>
      )}
      
      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBackground}>
          <Animated.View 
            style={[
              styles.xpBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                shadowOpacity: glowAnim,
              }
            ]} 
          />
        </View>
        
        <View style={styles.xpTextContainer}>
          <ThemedText style={styles.xpText}>
            {currentXP}/{maxXP} XP
          </ThemedText>
          <View style={styles.levelBadge}>
            <ThemedText style={styles.levelBadgeText}>
              Lv. {level}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  tooltip: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 8,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  xpBarContainer: {
    position: 'relative',
  },
  xpBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 6,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 2,
  },
  xpTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  levelBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
