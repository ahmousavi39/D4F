import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export function AkkusativInfo() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📖 Was ist der Akkusativ?</Text>
        <Text style={styles.text}>Der Akkusativ wird hauptsächlich für <Text style={styles.bold}>das direkte Objekt</Text> eines Satzes verwendet. Er beantwortet die Fragen <Text style={styles.bold}>„Wen?“</Text> oder <Text style={styles.bold}>„Was?“</Text>.</Text>
        <Text style={styles.example}>Beispiele:</Text>
       <Text style={styles.text}>{`\u2022`} Ich sehe <Text style={styles.bold}>den Hund.</Text> (<Text style={styles.bold}>Wen</Text> sehe ich? → <Text style={styles.bold}>den Hund</Text>)</Text>
        <Text style={styles.text}>{`\u2022`} Sie kauft <Text style={styles.bold}>eine Blume.</Text> (<Text style={styles.bold}>Was</Text> kauft sie? → <Text style={styles.bold}>eine Blume</Text>)</Text>

        <Text style={styles.example}>Wichtige Verben:</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>haben</Text> → Ich habe <Text style={styles.bold}>einen Bruder.</Text></Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>sehen</Text> → Sie sieht <Text style={styles.bold}>den Film.</Text></Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>kaufen</Text> → Wir kaufen <Text style={styles.bold}>ein Auto.</Text></Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>mögen</Text> → Er mag <Text style={styles.bold}>die Musik.</Text></Text>

        <Text style={styles.example}>Präpositionen:</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} durch</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} für</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} gegen</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} ohne</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} um</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} bis</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} entlang</Text>

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
            <Text style={styles.cell}>den</Text>
            <Text style={styles.cell}>die</Text>
            <Text style={styles.cell}>das</Text>
            <Text style={styles.cell}>die</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Unbestimmt</Text>
            <Text style={styles.cell}>einen</Text>
            <Text style={styles.cell}>eine</Text>
            <Text style={styles.cell}>ein</Text>
            <Text style={styles.cell}>---</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>Nominativ</Text>
            <Text style={styles.cellHeader}>Akkusativ</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>ich</Text>
            <Text style={styles.cell}>mich</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>du</Text>
            <Text style={styles.cell}>dich</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>er</Text>
            <Text style={styles.cell}>ihn</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>sie</Text>
            <Text style={styles.cell}>sie</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>es</Text>
            <Text style={styles.cell}>es</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>wir</Text>
            <Text style={styles.cell}>uns</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>ihr</Text>
            <Text style={styles.cell}>euch</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>sie (pl.)</Text>
            <Text style={styles.cell}>sie</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Sie (Höflichkeitsform)</Text>
            <Text style={styles.cell}>Sie</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>);
};

function getStyles(theme) {
  return StyleSheet.create({
    container: {
      paddingRight: 20,
      paddingLeft: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 20,
      color: theme.text,
    },
    text: {
      fontSize: 16,
      marginTop: 5,
      color: theme.text,
    },
    bold: {
      fontWeight: "bold",
    },
    example: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      color: theme.akkusativ,
    },
    table: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      overflow: "hidden",
    },
    rowHeader: {
      flexDirection: "row",
      backgroundColor: theme.akkusativ,
      padding: 10,
    },
    row: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      padding: 10,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    cellHeader: {
      flex: 1,
      fontWeight: "bold",
      color: theme.onPrimary,
      textAlign: "center",
    },
    cell: {
      flex: 1,
      textAlign: "center",
      color: theme.text,
    },
  });
}