import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {
    useNavigation,
} from '@react-navigation/native'; 

export function Home() {
    const navigation = useNavigation();
    return (
        <>
            <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TouchableHighlight underlayColor={'transparent'}  onPress={()=> navigation.navigate("Dativ")}>
          <View style={styles.dativ}>
            <Text style={styles.text}>Dativ (Wem?)</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'transparent'} onPress={()=> navigation.navigate("Akkusativ")}>
          <View style={styles.akkusativ}>
            <Text style={styles.text}>Akkusativ (Wen oder was?)</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'transparent'} onPress={()=> navigation.navigate("Nominativ")}>
          <View style={styles.nominativ}>
            <Text style={styles.text}>Nominativ (Wer oder was?)</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'transparent'} onPress={()=> navigation.navigate("Genitiv")}>
          <View style={styles.genitiv}>
            <Text style={styles.text}>Genitiv (Wessen?)</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'transparent'} onPress={()=> navigation.navigate("Random")}>
          <View style={styles.random}>
            <Text style={styles.text}>Random Mix</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'transparent'} onPress={()=> navigation.navigate("Retry")}>
          <View style={styles.random}>
            <Text style={styles.text}>Korrigieren</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'transparent'} onPress={()=> navigation.navigate("Repeat")}>
          <View style={styles.random}>
            <Text style={styles.text}>Wiederholen</Text>
          </View>
        </TouchableHighlight>
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
    button: {
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    text:{
        color:"white"
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
    dativ:{
      backgroundColor: '#fc4848e0',     
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    akkusativ:{
      backgroundColor: '#b948fce0',     
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    nominativ:{
      backgroundColor: '#48e15ee0',     
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    genitiv:{
      backgroundColor: '#48dfe0e0',     
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    random:{
      backgroundColor: '#ffc900e0',     
      alignItems: 'center',
      padding: 10,
      margin: 5,
    },
    
  });
  