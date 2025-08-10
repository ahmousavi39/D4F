import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';

export function RightHeader() {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Info" as never)}>
        <FontAwesomeIcon size={19} icon={faInfo} color={theme.headerTitle} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
  },
  button: {
    padding: 0,
    margin: 0,
  }
});