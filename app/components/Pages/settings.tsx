import React, { useEffect, useState, useRef } from 'react';
import { Pressable, View, StyleSheet, Alert, Modal, Animated, PanResponder, Easing, TouchableOpacity } from 'react-native';
import { Text, TouchableHighlight } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { setLanguage } from '../../../features/settings/settingsSlice';
import { loadData, resetData } from '../../../features/item/itemSlice';
import { useAppDispatch, useAppSelector } from '../../hook';
import { selectLanguage } from '../../../features/settings/settingsSlice';
import { SelectList } from 'react-native-dropdown-select-list';
import { useTheme } from '../../theme';
import { FontAwesome } from '@expo/vector-icons';
import { putItem } from '../../services/AsyncStorage';

export function Settings() {
  const dispatch = useAppDispatch();
  const language = useAppSelector(selectLanguage);
  const [modalVisible, setModalVisible] = useState(false);
  const { mode, setMode, theme } = useTheme();
  const styles = getStyles(theme);

  // Theme toggle animation setup
  const knobStartValue = useRef(0);
  const knobX = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;
  const knobWidth = 30;
  const containerWidth = 150;
  const maxTranslateX = containerWidth - knobWidth - 10;

  const toggleTheme = (toDark: boolean) => {
    const newMode = toDark ? 'dark' : 'light';
    setMode(newMode);

    Animated.timing(knobX, {
      toValue: toDark ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.circle),
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        knobX.stopAnimation((value) => {
          knobStartValue.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const newVal = knobStartValue.current + gesture.dx / maxTranslateX;
        knobX.setValue(Math.max(0, Math.min(1, newVal)));
      },
      onPanResponderRelease: () => {
        knobX.stopAnimation((currentValue) => {
          const toDark = currentValue > 0.5;
          toggleTheme(toDark);
        });
      },
    })
  ).current;

  const data = [
    { "key": "af", "value": "Afrikaans" },
    { "key": "sq", "value": "Albanian" },
    { "key": "am", "value": "Amharic" },
    { "key": "ar", "value": "Arabic" },
    { "key": "hy", "value": "Armenian" },
    { "key": "az", "value": "Azerbaijani" },
    { "key": "eu", "value": "Basque" },
    { "key": "be", "value": "Belarusian" },
    { "key": "bn", "value": "Bengali" },
    { "key": "bs", "value": "Bosnian" },
    { "key": "bg", "value": "Bulgarian" },
    { "key": "ca", "value": "Catalan" },
    { "key": "ceb", "value": "Cebuano" },
    { "key": "ny", "value": "Chichewa" },
    { "key": "zh", "value": "Chinese (Simplified)" },
    { "key": "zh-TW", "value": "Chinese (Traditional)" },
    { "key": "co", "value": "Corsican" },
    { "key": "hr", "value": "Croatian" },
    { "key": "cs", "value": "Czech" },
    { "key": "da", "value": "Danish" },
    { "key": "nl", "value": "Dutch" },
    { "key": "en", "value": "English" },
    { "key": "eo", "value": "Esperanto" },
    { "key": "et", "value": "Estonian" },
    { "key": "tl", "value": "Filipino" },
    { "key": "fi", "value": "Finnish" },
    { "key": "fr", "value": "French" },
    { "key": "fy", "value": "Frisian" },
    { "key": "gl", "value": "Galician" },
    { "key": "ka", "value": "Georgian" },
    { "key": "de", "value": "German" },
    { "key": "el", "value": "Greek" },
    { "key": "gu", "value": "Gujarati" },
    { "key": "ht", "value": "Haitian Creole" },
    { "key": "ha", "value": "Hausa" },
    { "key": "haw", "value": "Hawaiian" },
    { "key": "iw", "value": "Hebrew" },
    { "key": "hi", "value": "Hindi" },
    { "key": "hmn", "value": "Hmong" },
    { "key": "hu", "value": "Hungarian" },
    { "key": "is", "value": "Icelandic" },
    { "key": "ig", "value": "Igbo" },
    { "key": "id", "value": "Indonesian" },
    { "key": "ga", "value": "Irish" },
    { "key": "it", "value": "Italian" },
    { "key": "ja", "value": "Japanese" },
    { "key": "jw", "value": "Javanese" },
    { "key": "kn", "value": "Kannada" },
    { "key": "kk", "value": "Kazakh" },
    { "key": "km", "value": "Khmer" },
    { "key": "ko", "value": "Korean" },
    { "key": "ku", "value": "Kurdish (Kurmanji)" },
    { "key": "ky", "value": "Kyrgyz" },
    { "key": "lo", "value": "Lao" },
    { "key": "la", "value": "Latin" },
    { "key": "lv", "value": "Latvian" },
    { "key": "lt", "value": "Lithuanian" },
    { "key": "lb", "value": "Luxembourgish" },
    { "key": "mk", "value": "Macedonian" },
    { "key": "mg", "value": "Malagasy" },
    { "key": "ms", "value": "Malay" },
    { "key": "ml", "value": "Malayalam" },
    { "key": "mt", "value": "Maltese" },
    { "key": "mi", "value": "Maori" },
    { "key": "mr", "value": "Marathi" },
    { "key": "mn", "value": "Mongolian" },
    { "key": "my", "value": "Myanmar (Burmese)" },
    { "key": "ne", "value": "Nepali" },
    { "key": "no", "value": "Norwegian" },
    { "key": "or", "value": "Odia" },
    { "key": "ps", "value": "Pashto" },
    { "key": "fa", "value": "Persian" },
    { "key": "pl", "value": "Polish" },
    { "key": "pt", "value": "Portuguese" },
    { "key": "pa", "value": "Punjabi" },
    { "key": "ro", "value": "Romanian" },
    { "key": "ru", "value": "Russian" },
    { "key": "sm", "value": "Samoan" },
    { "key": "gd", "value": "Scots Gaelic" },
    { "key": "sr", "value": "Serbian" },
    { "key": "st", "value": "Sesotho" },
    { "key": "sn", "value": "Shona" },
    { "key": "sd", "value": "Sindhi" },
    { "key": "si", "value": "Sinhala" },
    { "key": "sk", "value": "Slovak" },
    { "key": "sl", "value": "Slovenian" },
    { "key": "so", "value": "Somali" },
    { "key": "es", "value": "Spanish" },
    { "key": "su", "value": "Sundanese" },
    { "key": "sw", "value": "Swahili" },
    { "key": "sv", "value": "Swedish" },
    { "key": "tg", "value": "Tajik" },
    { "key": "ta", "value": "Tamil" },
    { "key": "te", "value": "Telugu" },
    { "key": "th", "value": "Thai" },
    { "key": "tr", "value": "Turkish" },
    { "key": "uk", "value": "Ukrainian" },
    { "key": "ur", "value": "Urdu" },
    { "key": "uz", "value": "Uzbek" },
    { "key": "vi", "value": "Vietnamese" },
    { "key": "cy", "value": "Welsh" },
    { "key": "xh", "value": "Xhosa" },
    { "key": "yi", "value": "Yiddish" },
    { "key": "yo", "value": "Yoruba" },
    { "key": "zu", "value": "Zulu" }
  ]

  const toResetData = () => {
      dispatch(resetData());
      dispatch(loadData());
      setModalVisible(false);
  }

  const toRestartTour = async () => {
          await putItem('hasSeenTabIcon', false);  
        }

  const toSelectLanguage = async (lang) => {
    dispatch(setLanguage({key: lang}));
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={modalVisible ? styles.containerDisabled : styles.container}>
          
          <View style={styles.topRow}>
            <View style={styles.inputContainer}>
              <SelectList
                setSelected={(lang) => toSelectLanguage(lang)}
                data={data}
                defaultOption={data.find(lang => (lang.key == language.key))}
                boxStyles={styles.input}
                dropdownStyles={styles.dropdown}
                inputStyles={styles.selectionText}
                dropdownTextStyles={styles.selectionText}
                searchicon={<View style={styles.searchIconContainer}><FontAwesome name="search" size={16} color={theme.inputText} /></View>}
                arrowicon={<FontAwesome name="chevron-down" size={14} color={theme.text} />}
                closeicon={<FontAwesome name="chevron-up" size={14} color={theme.text} />}
                search={true}
                searchPlaceholder=""
                placeholder="Select language"
                save="value"
              />
            </View>
            
            <View style={styles.modeSwitchContainer}>
              <TouchableOpacity 
                onPress={() => toggleTheme(mode === 'light')}
                style={styles.toggleContainer}
              >
                <Animated.View
                  {...panResponder.panHandlers}
                  style={[
                    styles.toggleKnob,
                    {
                      transform: [
                        {
                          translateX: knobX.interpolate({
                            inputRange: [0, 1],
                            outputRange: [5, maxTranslateX],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <FontAwesome
                    name={mode === 'light' ? 'sun-o' : 'moon-o'}
                    size={16}
                    color={theme.background}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity onPress={toRestartTour}>
            <View style={styles.tourRestart}>
              <Text style={styles.text}>App-Tour wiederholen</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.reset}>
              <Text style={styles.text}>Daten zurücksetzen</Text>
            </View>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Möchten Sie alle Daten löschen, einschließlich dessen, was Sie bereits richtig und falsch gemacht haben?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={toResetData}>
                    <View style={styles.resetData}>
                      <Text style={styles.text}>Daten zurücksetzen</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <View style={styles.cancle}>
                      <Text style={styles.cancleText}>Abbrechen</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Modal>

        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

function getStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingTop: 50,
      backgroundColor: theme.background,
    },
    containerDisabled: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingTop: 50,
      backgroundColor: theme.disBackground,
      filter: "brightness(50%)"
    },
    button: {
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    text: {
      color: theme.cardText,
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
    reset: {
      backgroundColor: theme.error,
      alignItems: 'center',
      padding: 10,
      margin: 5,
      marginVertical: 15,
      borderRadius: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 15,
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 15,
      shadowColor: theme.shadow,
      width: "90%",
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'left',
      color: theme.text,
    },
    buttonContainer: {
      flexDirection: "row",
      marginLeft: "auto",
      marginTop: 10
    },
    cancle: {
      padding: 10,
      width: "100%",
    },
    cancleText: {
      color: theme.secondary,
      opacity: 0.7
    },
    resetData: {
      padding: 10,
      backgroundColor: theme.error,
      width: "100%",
      borderRadius: 5,
    },
    input: {
      height: 43,
      borderColor: theme.inputBorder,
      borderWidth: 0.5,
      paddingHorizontal: 8,
      width: '100%',
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      color: theme.text,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
    },
    inputContainer: {
      flex: 1,
      marginRight: 15,
    },
    selectionText: {
      color: theme.text,
      fontSize: 14,
    },
    searchIconContainer: {
      marginRight: 8,
    },
    searchInput: {
      color: theme.text,
      fontSize: 14,
    },
    dropdown: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      borderWidth: 0.5,
      borderRadius: 10,
    },
    modeSwitchContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    tourRestart: {
      padding: 10,
      backgroundColor: theme.secondary,
      margin: 5,
      borderRadius: 5,
      alignItems: 'center',
    },
    toggleContainer: {
      width: 146,
      height: 40,
      borderRadius: 25,
      padding: 5,
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: theme.inputBackground
    },
    toggleKnob: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 20,
      backgroundColor: theme.text,
      justifyContent: 'center',
      alignItems: 'center',
      top: 5,
      left: 0,
      zIndex: 2,
    },
  });
}