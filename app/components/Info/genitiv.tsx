import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function GenitivInfo() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📖 Was ist der Dativ?</Text>
        <Text style={styles.text}>Der Genitiv wird hauptsächlich verwendet, um <Text style={styles.bold}>Besitz oder Zugehörigkeit</Text> eines Satzes auszudrücken. Er beantwortet die Fragen <Text style={styles.bold}>„Wessen?“</Text> oder <Text style={styles.bold}>„Von wem?“</Text>.</Text>
        <Text style={styles.example}>Beispiele:</Text>
       <Text style={styles.text}>{`\u2022`} Das ist das Buch <Text style={styles.bold}>des Lehrers</Text>. (<Text style={styles.bold}>Wessen</Text> Buch? → <Text style={styles.bold}>des Lehrers</Text>)</Text>
        <Text style={styles.text}>{`\u2022`} Die Tasche <Text style={styles.bold}>meiner Schwester</Text> ist rot. (<Text style={styles.bold}>Wessen</Text> Tasche? → <Text style={styles.bold}>meiner Schwester</Text>)</Text>

        <Text style={styles.example}>Wichtige Verben:</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>gedenken</Text> → Wir gedenken <Text style={styles.bold}>der Verstorbenen</Text>.</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>sich erinnern</Text> → Ich erinnere mich <Text style={styles.bold}>des Vorfalls</Text>.</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>bedürfen</Text> → Er bedarf <Text style={styles.bold}>deiner Hilfe</Text>.</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>anklagen</Text> → Sie wurde <Text style={styles.bold}>des Diebstahls</Text> angeklagt.</Text>

        <Text style={styles.example}>Präpositionen:</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} anstatt</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} trotz</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} während</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} wegen</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} innerhalb</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} außerhalb</Text>

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
            <Text style={styles.cell}>des Mannes</Text>
            <Text style={styles.cell}>der Frau</Text>
            <Text style={styles.cell}>des Kindes</Text>
            <Text style={styles.cell}>der Kinder</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Unbestimmt</Text>
            <Text style={styles.cell}>eines Mannes</Text>
            <Text style={styles.cell}>einer Frau</Text>
            <Text style={styles.cell}>eines Kindes</Text>
            <Text style={styles.cell}>---</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>Nominativ</Text>
            <Text style={styles.cellHeader}>Genitiv</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>ich</Text>
            <Text style={styles.cell}>meiner</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>du</Text>
            <Text style={styles.cell}>deiner</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>er</Text>
            <Text style={styles.cell}>seiner</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>sie</Text>
            <Text style={styles.cell}>ihrer</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>es</Text>
            <Text style={styles.cell}>seiner</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>wir</Text>
            <Text style={styles.cell}>unser</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>ihr</Text>
            <Text style={styles.cell}>euer</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>sie (pl.)</Text>
            <Text style={styles.cell}>ihrer</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Sie (Höflichkeitsform)</Text>
            <Text style={styles.cell}>Ihrer</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>);
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
    color: "#007AFF",
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
    backgroundColor: "#007AFF",
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