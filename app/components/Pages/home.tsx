import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hook';
import { loadData, selectData } from '../../../features/item/itemSlice';
import { loadLanguage } from '../../../features/settings/settingsSlice';

export function Home() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const [modalVisibleRepeat, setModalVisibleRepeat] = useState(false);
  const [modalVisibleRetry, setModalVisibleRetry] = useState(false);

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
            <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlightLarge} onPress={() => setModalVisibleRetry(true)}>
              <View style={styles.random}><Text style={styles.text}>Korrigieren</Text></View>
            </TouchableHighlight>
          </View>
          <View style={styles.row}>
            <TouchableHighlight underlayColor={'transparent'} style={styles.touchableHighlightLarge} onPress={() => setModalVisibleRepeat(true)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  containerDisabled: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: 'white',
    textAlign: 'center',
  },
  dativ: {
    backgroundColor: '#fc4848e0',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 55,
    width: '100%',
    height: 150,
    borderRadius: 10
  },
  akkusativ: {
    backgroundColor: '#b948fce0',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 55,
    width: '100%',
    height: 150,
    borderRadius: 10

  },
  nominativ: {
    backgroundColor: '#48e15ee0',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 55,
    width: '100%',
    height: 150,
    borderRadius: 10

  },
  genitiv: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 55,
    width: '100%',
    height: 150,
    borderRadius: 10

  },
  random: {
    backgroundColor: '#5D6D7E',
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
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
    color: "black",
    opacity: 0.7
  },
});
