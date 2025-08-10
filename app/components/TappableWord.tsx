import React, { useState, useRef, forwardRef } from 'react';
import { Text, TouchableOpacity, Modal, View, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TranslationService } from '../services/TranslationService';

interface TappableWordProps {
  word: string;
  targetLanguage: string;
  style?: any;
  isModalOpen?: boolean;
  onModalOpen?: () => void;
  onModalClose?: () => void;
  onLayout?: () => void;
}

export const TappableWord = forwardRef<View, TappableWordProps>(({ 
  word, 
  targetLanguage, 
  style, 
  isModalOpen = false,
  onModalOpen,
  onModalClose,
  onLayout
}, ref) => {
  const [translation, setTranslation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWordPress = async () => {
    if (targetLanguage === 'de') {
      return; // Don't translate if target language is German
    }
    setIsLoading(true);
    onModalOpen?.();
    try {
      const translatedWord = await TranslationService.translateWord(word, targetLanguage);
      setTranslation(translatedWord);
    } catch (error) {
      setTranslation('Translation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    onModalClose?.();
    setTranslation('');
  };

  return (
    <>
      <Text
        style={[style, styles.tappableWord]}
        onPress={handleWordPress}
        onLayout={onLayout}
      >
        {word}
      </Text>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <View style={styles.centeredModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Translation</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <MaterialIcons name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.translationContent}>
              <Text style={styles.originalWord}>{word}</Text>
              <MaterialIcons name="arrow-downward" size={16} color="#666" style={styles.arrowIcon} />
              <Text style={styles.translatedWord}>
                {isLoading ? 'Translating...' : translation}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  tappableWord: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    minWidth: 250,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  translationContent: {
    alignItems: 'center',
  },
  originalWord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  arrowIcon: {
    marginBottom: 10,
  },
  translatedWord: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});
