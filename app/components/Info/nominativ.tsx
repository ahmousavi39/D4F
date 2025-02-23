import React from 'react';
import { Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function NominativInfo() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📖 Was ist der Nominativ?</Text>
        <Text style={styles.text}>Der Nominativ ist <Text style={styles.bold}>die Grundform</Text> eines Wortes. Er zeigt, <Text style={styles.bold}>wer</Text> oder <Text style={styles.bold}>was</Text> etwas tut.</Text>
        <Text style={styles.example}>Beispiele:</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>Der</Text> Hund rennt. (<Text style={styles.bold}>Wer</Text> rennt? → <Text style={styles.bold}>Der Hund</Text>)</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>Die</Text> Frau lacht. (<Text style={styles.bold}>Wer</Text> lacht? → <Text style={styles.bold}>Die Frau</Text>)</Text>

        <Text style={styles.example}>Wichtige Verben:</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>sein</Text> → Er <Text style={styles.bold}>ist</Text> ein Lehrer.</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>werden</Text> → Sie <Text style={styles.bold}>wird</Text> Ärztin.</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>bleiben</Text> → Er <Text style={styles.bold}>bleibt</Text> mein Freund.</Text>

        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>Artikel</Text>
            <Text style={styles.cellHeader}>Maskulin</Text>
            <Text style={styles.cellHeader}>Feminin</Text>
            <Text style={styles.cellHeader}>Neutrum</Text>
            <Text style={styles.cellHeader}>Plural</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Bestimmt</Text>
            <Text style={styles.cell}>der</Text>
            <Text style={styles.cell}>die</Text>
            <Text style={styles.cell}>das</Text>
            <Text style={styles.cell}>die</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Unbestimmt</Text>
            <Text style={styles.cell}>ein</Text>
            <Text style={styles.cell}>eine</Text>
            <Text style={styles.cell}>ein</Text>
            <Text style={styles.cell}>---</Text>
          </View>
        </View>

         <View style={styles.table}>
                  <View style={styles.rowHeader}>
                    <Text style={styles.cellHeader}>Nominativ</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>ich</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>du</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>er</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>sie</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>es</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>wir</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>ihr</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>sie (pl.)</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.cell}>Sie (Höflichkeitsform)</Text>
                  </View>
                </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
  },
  example: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#48e15ee0",
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#48e15ee0",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cellHeader: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
  },
});