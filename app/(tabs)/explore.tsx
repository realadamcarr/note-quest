import { Character } from '@/components/Character';
import { CosmeticsShowcase } from '@/components/CosmeticsShowcase';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isCompleted: boolean;
  xpReward: number;
}

interface UserProgress {
  level: number;
  xp: number;
  totalXp: number;
}

export default function StatsScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress>({ level: 1, xp: 0, totalXp: 0 });
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'cosmetics'>('stats');
  const [stats, setStats] = useState({
    totalNotes: 0,
    completedNotes: 0,
    pendingNotes: 0,
    totalXpEarned: 0,
    averageXpPerNote: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [notes, userProgress]);

  const loadData = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      const savedProgress = await AsyncStorage.getItem('userProgress');
      
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateStats = () => {
    const totalNotes = notes.length;
    const completedNotes = notes.filter(note => note.isCompleted).length;
    const pendingNotes = totalNotes - completedNotes;
    const totalXpEarned = userProgress.totalXp;
    const averageXpPerNote = completedNotes > 0 ? Math.round(totalXpEarned / completedNotes) : 0;

    setStats({
      totalNotes,
      completedNotes,
      pendingNotes,
      totalXpEarned,
      averageXpPerNote,
    });
  };

  const StatCard = ({ title, value, subtitle, icon }: { 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    icon: any; 
  }) => (
    <ThemedView style={styles.statCard}>
      <View style={styles.statHeader}>
        <IconSymbol name={icon} size={24} color="#007AFF" />
        <ThemedText style={styles.statTitle}>{title}</ThemedText>
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      {subtitle && <ThemedText style={styles.statSubtitle}>{subtitle}</ThemedText>}
    </ThemedView>
  );

  const calculateXpForNextLevel = (level: number) => level * 100;
  const xpForNextLevel = calculateXpForNextLevel(userProgress.level);
  const xpProgress = (userProgress.xp / xpForNextLevel) * 100;

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Progress</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Track your note-taking journey</ThemedText>
        
        {/* Character Display */}
        <View style={styles.characterSection}>
          <Character level={userProgress.level} size="large" />
        </View>
        
        {/* Tab Buttons */}
        <View style={styles.tabButtons}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'stats' && styles.activeTab]}
            onPress={() => setActiveTab('stats')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
              📊 Stats
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'cosmetics' && styles.activeTab]}
            onPress={() => setActiveTab('cosmetics')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'cosmetics' && styles.activeTabText]}>
              👕 Cosmetics
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {activeTab === 'stats' ? (
        <ScrollView style={styles.tabContent}>
          {/* Level Progress */}
          <ThemedView style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <IconSymbol name="star.fill" size={32} color="#FFD700" />
              <View style={styles.levelInfo}>
                <ThemedText style={styles.levelText}>Level {userProgress.level}</ThemedText>
                <ThemedText style={styles.xpText}>{userProgress.xp}/{xpForNextLevel} XP</ThemedText>
              </View>
            </View>
            <View style={styles.xpBarContainer}>
              <View style={styles.xpBar}>
                <View style={[styles.xpProgress, { width: `${xpProgress}%` }]} />
              </View>
            </View>
            <ThemedText style={styles.totalXpText}>Total XP Earned: {userProgress.totalXp}</ThemedText>
          </ThemedView>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Notes"
              value={stats.totalNotes}
              icon="doc.text"
            />
            <StatCard
              title="Completed"
              value={stats.completedNotes}
              icon="checkmark.circle.fill"
            />
            <StatCard
              title="Pending"
              value={stats.pendingNotes}
              icon="clock"
            />
            <StatCard
              title="Avg XP/Note"
              value={stats.averageXpPerNote}
              icon="chart.bar"
            />
          </View>

          {/* Achievement Levels */}
          <ThemedView style={styles.achievementSection}>
            <ThemedText style={styles.sectionTitle}>Level Milestones</ThemedText>
            {[1, 2, 3, 4, 5, 10, 15, 20].map(level => {
              const isUnlocked = userProgress.level >= level;
              const isCurrent = userProgress.level === level;
              return (
                <View key={level} style={[
                  styles.achievementItem,
                  isUnlocked && styles.unlockedAchievement,
                  isCurrent && styles.currentLevel
                ]}>
                  <IconSymbol 
                    name={isUnlocked ? "star.fill" : "star"} 
                    size={20} 
                    color={isUnlocked ? "#FFD700" : "#CCC"} 
                  />
                  <ThemedText style={[
                    styles.achievementText,
                    isUnlocked && styles.unlockedText,
                    isCurrent && styles.currentLevelText
                  ]}>
                    Level {level} {isCurrent && "(Current)"}
                  </ThemedText>
                  {isUnlocked && !isCurrent && (
                    <IconSymbol name="checkmark" size={16} color="#4CAF50" />
                  )}
                </View>
              );
            })}
          </ThemedView>
        </ScrollView>
      ) : (
        <CosmeticsShowcase level={userProgress.level} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  levelCard: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelInfo: {
    marginLeft: 12,
  },
  levelText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 16,
    opacity: 0.8,
  },
  xpBarContainer: {
    marginBottom: 12,
  },
  xpBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  totalXpText: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  achievementSection: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  unlockedAchievement: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  currentLevel: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  achievementText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
  },
  unlockedText: {
    fontWeight: '600',
  },
  currentLevelText: {
    fontWeight: 'bold',
    color: '#B8860B',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  characterSection: {
    marginBottom: 20,
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
});
