import React, { useState, useRef, useEffect } from 'react';
import Svg, { Rect, Mask, Circle } from 'react-native-svg';
// ...existing code...
import { findNodeHandle } from 'react-native';
import { Animated } from 'react-native';
import { Text, Modal, TouchableOpacity, StyleSheet, Dimensions, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TranslationService } from '../services/TranslationService';
import { getItem, putItem } from '../services/AsyncStorage';

interface TappableQuestionProps {
  question: string;
  targetLanguage: string;
  style?: any;
}

export const TappableQuestion: React.FC<TappableQuestionProps> = ({ 
  question, 
  targetLanguage, 
  style
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalPos, setModalPos] = useState<{left: number, top: number, triangleLeft: number}>({left: 0, top: 0, triangleLeft: 0});
  const [showTabIcon, setShowTabIcon] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showTabIcon) {
      const pulse = Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 350, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0.5, duration: 350, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]),
      ]);
      const fadeOut = Animated.timing(opacityAnim, { toValue: 0, duration: 400, useNativeDriver: true });
      const wait = Animated.delay(900);
      const fullSequence = Animated.loop(
        Animated.sequence([
          pulse,
          pulse,
          fadeOut,
          wait,
          Animated.timing(opacityAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
        ])
      );
      fullSequence.start();
    }
  }, [showTabIcon]);
  const wordRefs = useRef<{[key: number]: View | null}>({});
  const [lastWordLayout, setLastWordLayout] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  
  const screenDimensions = Dimensions.get('window');
  const modalWidth = 160;
  const modalHeight = 100;
  const padding = 16;

  // Check if this is the first time ever
  useEffect(() => {
    (async () => {
      const seen = await getItem('hasSeenTabIcon');
      if (!seen) setShowTabIcon(true);
    })();
  }, []);

  // Calculate optimal modal position based on word position and screen size
  const calculateModalPosition = (wordX: number, wordY: number, wordWidth: number, wordHeight: number) => {
    let left = wordX;
    let top = wordY + wordHeight + 10; // Position below the word with some spacing

    // Calculate word center for triangle positioning
    const wordCenterX = wordX + (wordWidth / 2);
    
    // Adjust horizontal position to stay within screen bounds
    if (left + modalWidth > screenDimensions.width - padding) {
      left = screenDimensions.width - modalWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    // If modal would go below screen, show it above the word
    if (top + modalHeight > screenDimensions.height - 100) { // Leave more room at bottom
      top = wordY - modalHeight - 10;
    }

    // If still too high, clamp to safe area
    if (top < 100) { // Leave room at top for status bar and navigation
      top = 100;
    }

    // Calculate triangle position relative to modal left edge
    const triangleLeft = wordCenterX - left - 8; // 8 is half of triangle width (16px)
    
    // Clamp triangle position to stay within modal bounds
    const clampedTriangleLeft = Math.max(8, Math.min(triangleLeft, modalWidth - 16));

    const position = { left, top, triangleLeft: clampedTriangleLeft };
    console.log('Calculated position:', position, 'for word at:', { wordX, wordY, wordWidth, wordHeight }); // Debug log
    return position;
  };

  // Split the question into words while preserving spaces and punctuation
  const parts = question.split(/(\s+|[.,!?;:()]+)/);

  const handleWordPress = async (word: string, idx: number) => {
    if (targetLanguage === 'de') return;
    // Hide tab icon forever after first tap
    if (showTabIcon) {
      setShowTabIcon(false);
      await putItem('hasSeenTabIcon', true);
    }
    setSelectedWord(word);
    setIsLoading(true);
    // Get the word element and measure its position
    const wordElement = wordRefs.current[idx];
    if (wordElement) {
      wordElement.measureInWindow((x: number, y: number, width: number, height: number) => {
        const position = calculateModalPosition(x, y, width, height);
        setModalPos(position);
        setModalVisible(true);
      });
    } else {
      setModalPos({ left: 100, top: 200, triangleLeft: 100 });
      setModalVisible(true);
    }
    try {
      const translated = await TranslationService.translateWord(word, targetLanguage);
      setTranslation(translated);
    } catch {
      setTranslation('Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedWord('');
    setTranslation('');
  };

  // Find the last word index
  const lastWordIdx = (() => {
    let last = -1;
    parts.forEach((p, i) => { if (/^[a-zA-ZäöüßÄÖÜ]+$/.test(p) && p !== '___') last = i; });
    return last;
  })();

  // Measure last word position after layout
  useEffect(() => {
    if (showTabIcon && lastWordIdx !== -1 && wordRefs.current[lastWordIdx]) {
      setTimeout(() => {
        wordRefs.current[lastWordIdx]?.measureInWindow((x, y, width, height) => {
          // Use the exact position for the spotlight
          setLastWordLayout({ x, y, width, height });
        });
      }, 100); // Wait for layout
    }
  }, [showTabIcon, lastWordIdx, question]);

  return (
    <>
      {/* Spotlight overlay for first time only */}
      {showTabIcon && lastWordLayout && (
        (() => {
          const { width: screenW, height: screenH } = Dimensions.get('window');
          console.log('DEBUG lastWordLayout:', lastWordLayout, 'screen:', screenW, screenH);
          return (
            <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: screenW, height: screenH, zIndex: 100, backgroundColor: 'transparent' }}>
              <Svg width={screenW} height={screenH} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Mask id="mask" maskUnits="userSpaceOnUse" mask-type="luminance">
                  {/* White = visible (not darkened), black = darkened */}
                  <Rect x="0" y="0" width={screenW} height={screenH} fill="white" />
                  <Circle
                    cx={lastWordLayout.x + lastWordLayout.width / 2}
                    cy={lastWordLayout.y + 44 + 16}
                    r={16}
                    fill="black"
                  />
                </Mask>
                <Rect
                  x="0"
                  y="0"
                  width={screenW}
                  height={screenH}
                  fill="rgba(0,0,0,0.85)"
                  mask="url(#mask)"
                />
              </Svg>
            </View>
          );
        })()
      )}
      <View style={styles.questionContainer}>
        {parts.map((part, idx) => {
          const isWord = /^[a-zA-ZäöüßÄÖÜ]+$/.test(part);
          if (isWord && part !== '___') {
            return (
              <View
                key={idx}
                ref={el => wordRefs.current[idx] = el}
                style={styles.wordContainer}
              >
                {/* Show finger icon absolutely under the last word only the first time ever */}
                {showTabIcon && idx === lastWordIdx && (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 44,
                      left: '50%',
                      transform: [
                        { translateX: -16 },
                        { scale: pulseAnim },
                      ],
                      opacity: opacityAnim,
                      zIndex: 110,
                    }}
                    pointerEvents="none"
                  >
                    <MaterialIcons name="touch-app" size={32} color="#7c3aed" />
                  </Animated.View>
                )}
                <TouchableOpacity onPress={() => handleWordPress(part, idx)}>
                  <Text style={[style, styles.tappableWord]}>
                    {part}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          } else {
            return (
              <View key={idx} style={styles.wordContainer}>
                <Text style={style}>{part}</Text>
              </View>
            );
          }
        })}
      </View>
      
      {/* Translation dialog positioned absolutely at the root level to avoid container interference */}
      {modalVisible && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="none"
          onRequestClose={handleModalClose}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={handleModalClose}
          >
            <View 
              style={{
                position: 'absolute',
                top: modalPos.top,
                left: modalPos.left,
                width: modalWidth,
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 8,
                alignItems: 'center',
              }}
            >
              <View style={[styles.speechBubbleTriangle, { left: modalPos.triangleLeft }]} />
              <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
              <Text style={styles.originalWord}>{selectedWord}</Text>
              <MaterialIcons name="arrow-downward" size={14} color="#666" style={styles.arrowIcon} />
              <Text style={styles.translatedWord}>{isLoading ? 'Translating...' : translation}</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'center',
    textAlign: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
  },
  tappableWord: {
    // Remove underline styling for cleaner appearance
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  positionedModalContent: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    minWidth: 140,
    maxWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    marginTop: 8, // Add space for the triangle
  },
  speechBubbleTriangle: {
    position: 'absolute',
    top: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
    zIndex: 2,
  },
  originalWord: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 2,
  },
  arrowIcon: {
    marginBottom: 4,
  },
  translatedWord: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  spotlightContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  darkArea: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullDarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  hintBubble: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    minWidth: 200,
    maxWidth: 260,
    minHeight: 80,
  },
  hintText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
    lineHeight: 24,
  },
});