import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const EnhancedStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#007AFF',
  trend = 'neutral',
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '';
    }
  };

  return (
    <ThemedView style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <ThemedText style={styles.iconEmoji}>{icon}</ThemedText>
        </View>
        <View style={styles.statContent}>
          <ThemedText style={styles.statTitle}>{title}</ThemedText>
          <View style={styles.valueRow}>
            <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
            {trend !== 'neutral' && (
              <ThemedText style={styles.trendIcon}>{getTrendIcon()}</ThemedText>
            )}
          </View>
          {subtitle && (
            <ThemedText style={styles.statSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 20,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#86868B',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginRight: 8,
  },
  trendIcon: {
    fontSize: 16,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#86868B',
    marginTop: 4,
  },
});
