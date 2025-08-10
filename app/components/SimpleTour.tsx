import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { getItem, putItem } from '../services/AsyncStorage';

const { width, height } = Dimensions.get('window');

interface TourStep {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'center';
  hasSpotlight?: boolean;
  spotlightPosition?: 'center';
  action?: string;
  autoNext?: boolean;
  delay?: number;
}

interface SimpleTourProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onNavigate?: (screen: string) => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '🎯 Willkommen!',
    description: 'Willkommen bei Die vier Fälle! Lass uns beginnen.',
    position: 'center'
  },
  {
    id: 'dativ',
    title: '📚 Dativ',
    description: 'Gehen wir zu den Dativ-Übungen.',
    position: 'center',
    action: 'dativ',
    autoNext: true,
    delay: 2000
  },
  {
    id: 'translation',
    title: '✨ Translation',
    description: 'Tippe auf Wörter, um sie zu übersetzen!',
    position: 'center',
    hasSpotlight: true,
    spotlightPosition: 'center'
  }
];

export const SimpleTour: React.FC<SimpleTourProps> = ({ visible, onComplete, onSkip, onNavigate }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [spotlightAnim] = useState(new Animated.Value(0));

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Animate spotlight
      Animated.loop(
        Animated.sequence([
          Animated.timing(spotlightAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(spotlightAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, fadeAnim, spotlightAnim]);

  // Handle navigation actions and auto-progression
  useEffect(() => {
    if (!visible || !currentTourStep) return;

    // Perform navigation action if specified
    if (currentTourStep.action && onNavigate) {
      const timer = setTimeout(() => {
        if (currentTourStep.action) {
          onNavigate(currentTourStep.action);
        }
      }, 500);

      return () => clearTimeout(timer);
    }

    // Auto-proceed to next step if specified
    if (currentTourStep.autoNext) {
      const timer = setTimeout(() => {
        handleNext();
      }, currentTourStep.delay || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, visible, currentTourStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    await putItem('tour_completed', 'true');
    onComplete();
  };

  const handleSkip = async () => {
    await putItem('tour_completed', 'true');
    onSkip();
  };

  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const getModalStyle = () => {
    // Simple center positioning for all steps
    return [styles.modal, styles.modalCenter];
  };

  const renderSpotlightOverlay = () => {
    if (!currentTourStep.hasSpotlight) {
      return null; // No overlay for non-spotlight steps
    }

    return (
      <Animated.View 
        style={[
          styles.spotlight,
          {
            top: height * 0.35,
            left: width * 0.1,
            width: width * 0.8,
            height: 80,
            opacity: spotlightAnim,
            transform: [{
              scale: spotlightAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.1]
              })
            }]
          }
        ]}
      >
        <View style={styles.spotlightBorder} />
        <View style={[styles.cloudBubble, { backgroundColor: theme.sectionBackground, top: -70, left: width * 0.1 }]}>
          <Text style={[styles.cloudText, { color: theme.text }]}>
            👆 Wörter antippen!
          </Text>
          <View style={[styles.cloudArrow, { borderTopColor: theme.sectionBackground, bottom: -10, left: width * 0.15 }]} />
        </View>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.6)" />
      <View style={styles.overlay}>
        {renderSpotlightOverlay()}
        
        <Animated.View 
          style={[
            getModalStyle(),
            { 
              backgroundColor: theme.sectionBackground,
              borderColor: theme.border,
              opacity: fadeAnim,
              shadowColor: theme.shadow,
              zIndex: 10
            }
          ]}
        >
          {/* Progress Bar */}
          <View style={[styles.progressContainer, { backgroundColor: theme.progressWrapper }]}>
            <View style={[styles.progressBar, { backgroundColor: theme.primary, width: `${progress}%` }]} />
          </View>

          {/* Step Counter */}
          <Text style={[styles.stepCounter, { color: theme.secondary }]}>
            {currentStep + 1} von {tourSteps.length}
          </Text>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>
              {currentTourStep.title}
            </Text>
            <Text style={[styles.description, { color: theme.inputText }]}>
              {currentTourStep.description}
            </Text>
            
            {currentTourStep.autoNext && (
              <Text style={[styles.autoProgressText, { color: theme.secondary }]}>
                ⏱️ Automatisch weiter in {Math.ceil((currentTourStep.delay || 3000) / 1000)}s...
              </Text>
            )}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={[styles.skipButtonText, { color: theme.secondary }]}>Überspringen</Text>
            </TouchableOpacity>

            <View style={styles.navigationButtons}>
              {currentStep > 0 && (
                <TouchableOpacity onPress={handlePrevious} style={[styles.navButton, styles.previousButton, { borderColor: theme.primary }]}>
                  <MaterialIcons name="arrow-back" size={24} color={theme.primary} />
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={handleNext} style={[styles.navButton, styles.nextButton, { backgroundColor: theme.primary }]}>
                {currentStep < tourSteps.length - 1 ? (
                  <MaterialIcons name="arrow-forward" size={24} color={theme.background} />
                ) : (
                  <MaterialIcons name="check" size={24} color={theme.background} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Hook to check if tour should be shown
export const useSimpleTourCheck = (): boolean => {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    const checkTourStatus = async () => {
      try {
        const tourCompleted = await getItem('tour_completed');
        setShouldShowTour(!tourCompleted || tourCompleted === '');
      } catch (error) {
        setShouldShowTour(true);
      }
    };

    checkTourStatus();
  }, []);

  return shouldShowTour;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modal: {
    width: width * 0.9,
    maxWidth: 420,
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 1,
  },
  modalCenter: {
    // Default center positioning
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  stepCounter: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '600',
  },
  content: {
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  autoProgressText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousButton: {
    borderWidth: 2,
  },
  nextButton: {
    // backgroundColor set dynamically
  },
  spotlight: {
    position: 'absolute',
    borderRadius: 12,
    zIndex: 5,
  },
  spotlightBorder: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  cloudBubble: {
    position: 'absolute',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
  },
  cloudArrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  cloudText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
