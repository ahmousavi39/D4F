import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfo, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import {
  useNavigation,
} from '@react-navigation/native';
import { useTheme } from '../theme';

export function LeftHeader() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <>
      {/* <View style={styles.icon1Container}>
        <Pressable style={styles.button} onPress={() => {
          navigation.navigate("Home")
        }}>
          <FontAwesomeIcon size={19} icon={faChevronLeft} />
        </Pressable>
      </View> */}
      <View style={styles.icon2Container}>
        <Pressable style={styles.button} onPress={() => {
          navigation.navigate("Info")
        }}>
          <FontAwesomeIcon size={19} icon={faInfo} color={theme.headerTitle} />
        </Pressable>
      </View>
    </>
  );
}

let styles = StyleSheet.create({
  icon1Container: {
    paddingRight: 10,
    padding:0,
    margin: 0
  },
  icon2Container: {
    paddingLeft: 10,
    paddingRight: 0
  },
  button: {
    padding: 0,
    margin: 0,
  }
});