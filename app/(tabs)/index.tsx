import { Character, getNextUnlock } from '@/components/Character';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({ level: 1, xp: 0, totalXp: 0 });
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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

  const saveData = async (newNotes: Note[], newProgress: UserProgress) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      await AsyncStorage.setItem('userProgress', JSON.stringify(newProgress));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const calculateXpForNextLevel = (level: number) => level * 100;

  const addNote = () => {
    if (!newNoteTitle.trim()) {
      Alert.alert('Error', 'Please enter a note title');
      return;
    }

    // Improved XP calculation based on title and content
    const titleXp = Math.floor(newNoteTitle.trim().length / 2);
    const contentXp = Math.floor(newNoteContent.trim().length / 5);
    const baseXp = 15; // Base XP for creating any note
    const totalXp = baseXp + titleXp + contentXp;

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      createdAt: new Date(),
      isCompleted: false,
      xpReward: Math.max(15, totalXp) // Minimum 15 XP
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveData(updatedNotes, userProgress);
    
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddForm(false);
    
    // Show confirmation
    Alert.alert('Note Created!', `"${newNote.title}" is ready to complete for ${newNote.xpReward} XP!`);
  };

  const completeTask = (noteId: string) => {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1 || notes[noteIndex].isCompleted) return;

    const note = notes[noteIndex];
    const updatedNotes = [...notes];
    updatedNotes[noteIndex] = { ...note, isCompleted: true };

    const gainedXp = note.xpReward;
    const newTotalXp = userProgress.totalXp + gainedXp;
    let newXp = userProgress.xp + gainedXp;
    let newLevel = userProgress.level;
    let leveledUp = false;

    const xpForNextLevel = calculateXpForNextLevel(newLevel);
    
    if (newXp >= xpForNextLevel) {
      newLevel += 1;
      newXp = newXp - xpForNextLevel;
      leveledUp = true;
    }

    const newProgress = { level: newLevel, xp: newXp, totalXp: newTotalXp };
    
    setNotes(updatedNotes);
    setUserProgress(newProgress);
    saveData(updatedNotes, newProgress);

    // Enhanced feedback
    if (leveledUp) {
      const nextUnlock = getNextUnlock(newLevel);
      const unlockMessage = nextUnlock 
        ? `\n\nNext unlock: ${nextUnlock.name} at Level ${nextUnlock.unlockLevel}!`
        : '\n\nYou\'ve unlocked all cosmetics! 🎉';
        
      Alert.alert(
        '🎉 LEVEL UP! 🎉', 
        `Congratulations! You reached Level ${newLevel}!${unlockMessage}\n\n+${gainedXp} XP from completing "${note.title}"`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    } else {
      Alert.alert(
        '✅ Task Completed!', 
        `Great job! You earned ${gainedXp} XP!\n\nProgress: ${newXp}/${calculateXpForNextLevel(newLevel)} XP to Level ${newLevel + 1}`,
        [{ text: 'Nice!', style: 'default' }]
      );
    }
  };

  const deleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            saveData(updatedNotes, userProgress);
          }
        }
      ]
    );
  };

  const renderNote = ({ item }: { item: Note }) => (
    <ThemedView style={[styles.noteCard, item.isCompleted && styles.completedNote]}>
      <ThemedText style={styles.noteTitle}>{item.title}</ThemedText>
      {item.content ? <ThemedText style={styles.noteContent}>{item.content}</ThemedText> : null}
      <View style={styles.noteFooter}>
        <ThemedText style={styles.xpReward}>+{item.xpReward} XP</ThemedText>
        <View style={styles.noteActions}>
          {!item.isCompleted && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => completeTask(item.id)}
            >
              <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNote(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );

  const xpForNextLevel = calculateXpForNextLevel(userProgress.level);
  const xpProgress = (userProgress.xp / xpForNextLevel) * 100;

  return (
    <ThemedView style={styles.container}>
      {/* Progress Header with Character */}
      <ThemedView style={styles.progressHeader}>
        <View style={styles.headerContent}>
          <Character level={userProgress.level} size="medium" />
          <View style={styles.progressInfo}>
            <ThemedText style={styles.levelText}>Level {userProgress.level}</ThemedText>
            <View style={styles.xpBarContainer}>
              <View style={styles.xpBar}>
                <View style={[styles.xpProgress, { width: `${xpProgress}%` }]} />
              </View>
              <ThemedText style={styles.xpText}>{userProgress.xp}/{xpForNextLevel} XP</ThemedText>
            </View>
            <ThemedText style={styles.totalXpText}>Total XP: {userProgress.totalXp}</ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Add Note Section */}
      {showAddForm ? (
        <ThemedView style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Note title..."
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Note content..."
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
            placeholderTextColor="#666"
          />
          <View style={styles.formButtons}>
            <TouchableOpacity style={styles.addButton} onPress={addNote}>
              <Text style={styles.buttonText}>Add Note</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      ) : (
        <TouchableOpacity 
          style={styles.showFormButton} 
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.buttonText}>+ Add New Note</Text>
        </TouchableOpacity>
      )}

      {/* Notes List */}
      <FlatList
        data={notes.sort((a, b) => {
          // Sort by completion status (incomplete first), then by creation date (newest first)
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        style={styles.notesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyStateTitle}>Ready to start your quest? 🎯</ThemedText>
            <ThemedText style={styles.emptyStateSubtitle}>
              Create your first note to begin earning XP and leveling up!
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  progressHeader: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    flex: 1,
    marginLeft: 16,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  xpBarContainer: {
    marginBottom: 8,
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  xpText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalXpText: {
    fontSize: 12,
    textAlign: 'left',
    opacity: 0.7,
  },
  showFormButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addForm: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  contentInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  completedNote: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  noteActions: {
    flexDirection: 'row',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
  },
});
