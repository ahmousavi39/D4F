import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TappableQuestion } from './TappableQuestion';
import { useTheme } from '../theme';

interface QuestionRenderFirstProps {
  onComplete: () => void;
}

const QuestionRenderFirst: React.FC<QuestionRenderFirstProps> = ({ onComplete }) => {
  const { theme } = useTheme();
  
  // Get styles once at the top level
  const styles = useMemo(() => getStyles(theme), [theme]);
  
  // Demo question for translation demonstration
  const demoQuestion = "Der Hund läuft schnell durch den Park.";

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenFirstTime', 'true');
    onComplete();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.container}>
          
          {/* Tutorial overlay */}
          <View style={styles.overlay}>
            <View style={styles.tutorialCard}>
              <Text style={styles.tutorialTitle}>Welcome to German Learning!</Text>
              <Text style={styles.tutorialText}>
                Tap any German word below to see its English translation. Try tapping on "Hund" (dog).
              </Text>
              <TouchableOpacity style={styles.gotItButton} onPress={handleComplete}>
                <Text style={styles.gotItText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Question Section - matches real app */}
          <View style={styles.questionWrapper}>
            <TappableQuestion 
              question={demoQuestion} 
              targetLanguage="en"
              style={styles.title}
            />
          </View>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tutorialCard: {
    backgroundColor: theme.surface,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    maxWidth: 300,
    alignItems: 'center',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.onSurface,
    textAlign: 'center',
    marginBottom: 10,
  },
  tutorialText: {
    fontSize: 16,
    color: theme.onSurface,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  gotItButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  gotItText: {
    color: theme.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  questionWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.onSurface,
    textAlign: 'center',
    lineHeight: 36,
  },
});

export { QuestionRenderFirst };
