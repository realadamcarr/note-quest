import React, { useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Character } from './Character';
import { ThemedText } from './ThemedText';

interface LevelUpNotificationProps {
  visible: boolean;
  newLevel: number;
  xpGained: number;
  nextUnlockName?: string;
  nextUnlockLevel?: number;
  onClose: () => void;
}

export const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  visible,
  newLevel,
  xpGained,
  nextUnlockName,
  nextUnlockLevel,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Scale in animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Bounce effect for character
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      bounceAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [visible, scaleAnim, bounceAnim, glowAnim]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(onClose);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
              shadowOpacity: glowAnim,
            }
          ]}
        >
          <View style={styles.header}>
            <ThemedText style={styles.celebration}>🎉</ThemedText>
            <ThemedText style={styles.title}>LEVEL UP!</ThemedText>
            <ThemedText style={styles.celebration}>🎉</ThemedText>
          </View>

          <Animated.View
            style={[
              styles.characterContainer,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            <Character level={newLevel} size="large" />
          </Animated.View>

          <View style={styles.content}>
            <ThemedText style={styles.levelText}>
              Level {newLevel} Reached!
            </ThemedText>
            <ThemedText style={styles.xpText}>
              +{xpGained} XP Earned
            </ThemedText>

            {nextUnlockName && nextUnlockLevel && (
              <View style={styles.unlockContainer}>
                <ThemedText style={styles.unlockTitle}>Next Unlock:</ThemedText>
                <ThemedText style={styles.unlockText}>
                  {nextUnlockName} at Level {nextUnlockLevel}
                </ThemedText>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <ThemedText style={styles.closeButtonText}>Awesome! 🚀</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  celebration: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#007AFF',
    textAlign: 'center',
  },
  characterContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginVertical: 16,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 16,
    textAlign: 'center',
  },
  unlockContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignItems: 'center',
  },
  unlockTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF8C00',
    marginBottom: 4,
    textAlign: 'center',
  },
  unlockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
