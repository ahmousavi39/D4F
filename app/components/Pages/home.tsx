import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useNavigation,
} from '@react-navigation/native';
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
  }, [])

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={modalVisibleRepeat || modalVisibleRetry ? styles.containerDisabled : styles.container}>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => navigation.navigate("Dativ")}>
            <View style={styles.dativ}>
              <Text style={styles.text}>Dativ (Wem?)</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => navigation.navigate("Akkusativ")}>
            <View style={styles.akkusativ}>
              <Text style={styles.text}>Akkusativ (Wen oder was?)</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => navigation.navigate("Nominativ")}>
            <View style={styles.nominativ}>
              <Text style={styles.text}>Nominativ (Wer oder was?)</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => navigation.navigate("Genitiv")}>
            <View style={styles.genitiv}>
              <Text style={styles.text}>Genitiv (Wessen?)</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => navigation.navigate("Random")}>
            <View style={styles.random}>
              <Text style={styles.text}>Random Mix</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => {
            if(data){
            if ([].concat(data["dativ"], data["akkusativ"], data["nominativ"], data["genitiv"]).filter((item) => (item.isFalse)).length > 0) {
              navigation.navigate("Retry");
            } else {
              setModalVisibleRetry(true);
            }}
          }}>
            <View style={styles.random}>
              <Text style={styles.text}>Korrigieren</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'transparent'} onPress={() => {
            if(data){
            if ([].concat(data["dativ"], data["akkusativ"], data["nominativ"], data["genitiv"]).filter((item) => (item.isTried)).length > 0) {
              navigation.navigate("Repeat")
            } else {
              setModalVisibleRepeat(true);
            }
          }
          }}>
            <View style={styles.random}>
              <Text style={styles.text}>Wiederholen</Text>
            </View>
          </TouchableHighlight>

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
      </SafeAreaProvider >
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    filter: "brightness(50%)"
  },
  button: {
    alignItems: 'center',
    padding: 10,
    margin: 5,
  },
  text: {
    color: "white"
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },
  dativ: {
    backgroundColor: '#fc4848e0',
    alignItems: 'center',
    padding: 10,
    margin: 5,
  },
  akkusativ: {
    backgroundColor: '#b948fce0',
    alignItems: 'center',
    padding: 10,
    margin: 5,
  },
  nominativ: {
    backgroundColor: '#48e15ee0',
    alignItems: 'center',
    padding: 10,
    margin: 5,
  },
  genitiv: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    padding: 10,
    margin: 5,
  },
  random: {
    backgroundColor: '#ffc900e0',
    alignItems: 'center',
    padding: 10,
    margin: 5,
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
