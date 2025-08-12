import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hook';
import { loadData, selectData } from '../../../features/item/itemSlice';
import { loadLanguage, selectLanguage } from '../../../features/settings/settingsSlice';
import { MaterialIcons, Ionicons, FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { SelectList } from 'react-native-dropdown-select-list';
import { setLanguage } from '../../../features/settings/settingsSlice';
import { getItem, putItem } from '../../services/AsyncStorage';

const BG_SIZE = 2000; // fixed big background size
const ICON_COUNT = 500;
const MIN_DISTANCE = 50;

const iconList = [
  { Component: MaterialIcons, name: 'school', size: 40 },
  { Component: MaterialIcons, name: 'translate', size: 32 },
  { Component: MaterialIcons, name: 'star', size: 28 },
  { Component: MaterialIcons, name: 'lightbulb', size: 36 },
  { Component: Ionicons, name: 'book', size: 38 },
  { Component: FontAwesome5, name: 'brain', size: 34 },
  { Component: Entypo, name: 'globe', size: 36 },
  { Component: MaterialIcons, name: 'edit', size: 30 },
  { Component: Ionicons, name: 'checkmark-circle', size: 32 },
  { Component: FontAwesome5, name: 'question', size: 28 },
];

// Generate consistent harmonic points using a seeded approach
function generateHarmonicPoints() {
  const points = [];
  const gridSize = 80; // Distance between grid points
  const cols = Math.floor(BG_SIZE / gridSize);
  const rows = Math.floor(BG_SIZE / gridSize);
  
  // Create a grid-based pattern with controlled randomness
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (points.length >= ICON_COUNT) break;
      
      // Base grid position
      const baseX = col * gridSize + gridSize / 2;
      const baseY = row * gridSize + gridSize / 2;
      
      // Add consistent but varied offset using deterministic "random"
      const seedX = (row * 7 + col * 13) % 100; // Deterministic seed
      const seedY = (row * 11 + col * 17) % 100; // Deterministic seed
      
      // Convert to -1 to 1 range and apply offset
      const offsetX = (seedX / 50 - 1) * (gridSize * 0.3);
      const offsetY = (seedY / 50 - 1) * (gridSize * 0.3);
      
      const x = Math.max(20, Math.min(BG_SIZE - 20, baseX + offsetX));
      const y = Math.max(20, Math.min(BG_SIZE - 20, baseY + offsetY));
      
      // Skip some points for natural variation (deterministic)
      if ((row + col) % 3 !== 0) {
        points.push({ x, y });
      }
    }
    if (points.length >= ICON_COUNT) break;
  }
  
  return points.slice(0, ICON_COUNT);
}

// Memoize the points so they don't regenerate
const HARMONIC_POINTS = generateHarmonicPoints();

export default function BackgroundIcons({ theme, styles }) {
  return (
    <View
      style={[
        styles.backgroundIconsContainer,
        {
          width: BG_SIZE,
          height: BG_SIZE,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      ]}
      pointerEvents="none"
    >
      {HARMONIC_POINTS.map(({ x, y }, i) => {
        const icon = iconList[i % iconList.length];
        const { Component, name, size } = icon;
        
        // Deterministic opacity and rotation based on index
        const opacitySeed = (i * 7) % 100;
        const opacity = 0.04 + (opacitySeed / 100) * 0.06; // Range: 0.04 to 0.10
        const rotationSeed = (i * 13) % 360;
        
        return (
          <Component
            key={i}
            name={name}
            size={size * 0.7}
            color={theme.iconBg}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              opacity: opacity,
              transform: [{ rotate: `${rotationSeed}deg` }],
            }}
          />
        );
      })}
    </View>
  );
}

export function Home() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const [modalVisibleRepeat, setModalVisibleRepeat] = useState(false);
  const [modalVisibleRetry, setModalVisibleRetry] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const language = useAppSelector(selectLanguage);
  const [modalVisible, setModalVisible] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [hasSeenTabIcon, setHasSeenTabIcon] = useState<boolean | null>(null);
  
  const lanData = useMemo(
    () => require('../../../assets/languages.json'), // better to keep language list separate
    []
  );

  useEffect(() => {
    dispatch(loadData());
    dispatch(loadLanguage());
    (async () => {
      const seen = await getItem('hasSeenLanguage');
      if (!seen) setModalVisible(true);
    })();
  }, []);

  const toSelectLanguage = async (lang) => {
    dispatch(setLanguage({ key: lang }));
    await putItem('hasSeenLanguage', true);
  }

  const handleFinishLanguageSelection = () => {
    setModalVisible(false);
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={modalVisibleRepeat || modalVisibleRetry ? styles.containerDisabled : styles.container}>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.modalText}>
                  <SelectList
                    setSelected={(lang) => toSelectLanguage(lang)}
                    data={lanData}
                    boxStyles={styles.input}
                    dropdownStyles={styles.dropdown}
                    inputStyles={styles.selectionText}
                    dropdownTextStyles={styles.selectionText}
                    searchicon={<View style={styles.searchIconContainer}><FontAwesome name="search" size={16} color={theme.inputText} /></View>}
                    arrowicon={<FontAwesome name="chevron-down" size={14} color={theme.text} />}
                    closeicon={<FontAwesome name="chevron-up" size={14} color={theme.text} />}
                    search={true}
                    searchPlaceholder=""
                    placeholder="Sprache auswählen"
                    save="key"
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleFinishLanguageSelection}>
                    <View style={styles.cancle}>
                      <Text style={styles.cancleText}>Fertig</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Modal>


          {/* Background icons */}
          <BackgroundIcons theme={theme} styles={styles} />

          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.row}>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlight} onPress={() => navigation.navigate("Dativ")}>
                <View style={styles.dativ}><Text style={styles.text}>Dativ</Text><Text style={styles.text}>(Wem?)</Text></View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlight} onPress={() => navigation.navigate("Akkusativ")}>
                <View style={styles.akkusativ}><Text style={styles.text}>Akkusativ</Text><Text style={styles.text}>(Wen oder was?)</Text></View>
              </TouchableHighlight>
            </View>
            <View style={styles.row}>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlight} onPress={() => navigation.navigate("Nominativ")}>
                <View style={styles.nominativ}><Text style={styles.text}>Nominativ</Text><Text style={styles.text}>(Wer oder was?)</Text></View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlight} onPress={() => navigation.navigate("Genitiv")}>
                <View style={styles.genitiv}><Text style={styles.text}>Genitiv</Text><Text style={styles.text}>(Wessen?)</Text></View>
              </TouchableHighlight>
            </View>
            <View style={styles.row}>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlightLarge} onPress={() => navigation.navigate("Random")}>
                <View style={styles.random}><Text style={styles.text}>Random Mix</Text></View>
              </TouchableHighlight>
            </View>
            <View style={styles.row}>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlightLarge} onPress={() => {
                if ([].concat(data["dativ"], data["akkusativ"], data["nominativ"], data["genitiv"]).filter((item) => (item.isFalse)).length > 0) {
                  navigation.navigate("Retry");
                } else {
                  setModalVisibleRetry(true);
                }
              }}>
                <View style={styles.random}><Text style={styles.text}>Korrigieren</Text></View>
              </TouchableHighlight>
            </View>
            <View style={styles.row}>
              <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlightLarge} onPress={() => {
                if ([].concat(data["dativ"], data["akkusativ"], data["nominativ"], data["genitiv"]).filter((item) => (item.isTried)).length > 0) {
                  navigation.navigate("Repeat")
                } else {
                  setModalVisibleRepeat(true);
                }
              }}>
                <View style={styles.random}><Text style={styles.text}>Wiederholen</Text></View>
              </TouchableHighlight>
            </View>
          </ScrollView>

          {/* Modals */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisibleRepeat}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisibleRepeat(!modalVisibleRepeat);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Nichts zu wiederholen!</Text>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => setModalVisibleRepeat(false)}>
                    <View style={styles.cancle}>
                      <Text style={styles.cancleText}>Abbrechen</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisibleRetry}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisibleRetry(!modalVisibleRetry);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Nichts zu korrigieren!</Text>
                <View style={styles.buttonContainer}>
                  <TouchableHighlight underlayColor={'transparent'} onPress={() => setModalVisibleRetry(false)}>
                    <View style={styles.cancle}>
                      <Text style={styles.cancleText}>Abbrechen</Text>
                    </View>
                  </TouchableHighlight>
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
      backgroundColor: theme.background,
    },
    backgroundIconsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      // no right/bottom to avoid shrinking,
      // just use width and height fixed large
      zIndex: 0,
    },
    containerDisabled: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10,
      backgroundColor: theme.disBackground,
      filter: 'brightness(50%)',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    touchableHighlight: {
      alignItems: 'center',
      padding: 10,
      margin: 5,
      width: '50%',
      maxWidth: 250,
      aspectRatio: 1
    },
    touchableHighlightLarge: {
      alignItems: 'center',
      padding: 10,
      width: '100%',
      height: '100%',
    },
    text: {
      color: theme.cardText,
      textAlign: 'center',
    },
    dativ: {
      backgroundColor: theme.dativ,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    akkusativ: {
      backgroundColor: theme.akkusativ,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    nominativ: {
      backgroundColor: theme.nominativ,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    genitiv: {
      backgroundColor: theme.genitiv,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    random: {
      backgroundColor: theme.random,
      alignItems: 'center',
      padding: 10,
      width: "100%",
      borderRadius: 10,
      opacity: 0.9,
      maxWidth: 500
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    }
  });
}