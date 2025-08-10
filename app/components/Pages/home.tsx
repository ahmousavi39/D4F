import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hook';
import { loadData, selectData } from '../../../features/item/itemSlice';
import { loadLanguage } from '../../../features/settings/settingsSlice';
import { useTheme } from '../../theme';

export function Home() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const [modalVisibleRepeat, setModalVisibleRepeat] = useState(false);
  const [modalVisibleRetry, setModalVisibleRetry] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    dispatch(loadData());
    dispatch(loadLanguage());
  }, []);

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={modalVisibleRepeat || modalVisibleRetry ? styles.containerDisabled : styles.container}>
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


          <Modal
            animationType="slide"
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
            animationType="slide"
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
      paddingTop: 55,
      paddingBottom: 55,
      width: '100%',
      height: 150,
      borderRadius: 10
    },
    akkusativ: {
      backgroundColor: theme.akkusativ,
      alignItems: 'center',
      paddingTop: 55,
      paddingBottom: 55,
      width: '100%',
      height: 150,
      borderRadius: 10
    },
    nominativ: {
      backgroundColor: theme.nominativ,
      alignItems: 'center',
      paddingTop: 55,
      paddingBottom: 55,
      width: '100%',
      height: 150,
      borderRadius: 10
    },
    genitiv: {
      backgroundColor: theme.genitiv,
      alignItems: 'center',
      paddingTop: 55,
      paddingBottom: 55,
      width: '100%',
      height: 150,
      borderRadius: 10
    },
    random: {
      backgroundColor: theme.random,
      alignItems: 'center',
      padding: 10,
      width: "100%",
      borderRadius: 10,
      opacity: 0.9
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
  });
}
