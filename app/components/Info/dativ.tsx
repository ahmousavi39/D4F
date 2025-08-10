import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

export function DativInfo() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>📖 Was ist der Dativ?</Text>
        <Text style={styles.text}>Der Dativ wird hauptsächlich für <Text style={styles.bold}>indirekte Objekt </Text> eines Satzes verwendet. Er beantwortet die Fragen <Text style={styles.bold}>„Wem?“</Text> oder <Text style={styles.bold}>„Was?“</Text>.</Text>
        <Text style={styles.example}>Beispiele:</Text>
       <Text style={styles.text}>{`\u2022`} Ich gebe <Text style={styles.bold}>dem Mann</Text> das Buch. (<Text style={styles.bold}>Wem</Text> gebe ich das Buch? → <Text style={styles.bold}>dem Mann</Text>)</Text>
        <Text style={styles.text}>{`\u2022`} Sie schenkt <Text style={styles.bold}>ihrer Freundin</Text> einen Ring. (<Text style={styles.bold}>Wem</Text> schenkt sie einen Ring? → <Text style={styles.bold}>ihrer Freundin</Text>)</Text>

        <Text style={styles.example}>Wichtige Verben:</Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>helfen</Text> → Ich helfe <Text style={styles.bold}>meinem Freund.</Text></Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>danken</Text> → Sie dankt <Text style={styles.bold}>ihrer Mutter.</Text></Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>gefallen</Text> → Das Buch gefällt <Text style={styles.bold}>mir.</Text></Text>
        <Text style={styles.text}>{`\u2022`} <Text style={styles.bold}>gehören</Text> → Das Auto gehört <Text style={styles.bold}>ihm.</Text></Text>

        <Text style={styles.example}>Präpositionen:</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} aus</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} bei</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} mit</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} nach</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} seit</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} von</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} zu</Text>

        <Text style={styles.example}>Wechselpräpositionen (Dativ für Ort!)</Text>
        <Text style={styles.text}>👉 Merke: Bei <Text style={styles.bold}>eine Ortsangabe </Text>(ohne Bewegung) wird der Dativ verwendet</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} in</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} auf</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} über</Text>
        <Text style={[styles.text, styles.bold]}>{`\u2022`} unter</Text>

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
            <Text style={styles.cell}>dem</Text>
            <Text style={styles.cell}>der</Text>
            <Text style={styles.cell}>dem</Text>
            <Text style={styles.cell}>den</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Unbestimmt</Text>
            <Text style={styles.cell}>einem</Text>
            <Text style={styles.cell}>einer</Text>
            <Text style={styles.cell}>einem</Text>
            <Text style={styles.cell}>---</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.rowHeader}>
            <Text style={styles.cellHeader}>Nominativ</Text>
            <Text style={styles.cellHeader}>Dativ</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>ich</Text>
            <Text style={styles.cell}>mir</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>du</Text>
            <Text style={styles.cell}>dir</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>er</Text>
            <Text style={styles.cell}>ihm</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>sie</Text>
            <Text style={styles.cell}>ihr</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>es</Text>
            <Text style={styles.cell}>ihm</Text>
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
            <Text style={styles.cell}>ihnen</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Sie (Höflichkeitsform)</Text>
            <Text style={styles.cell}>Ihnen</Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>);
};

function getStyles(theme) {
  return StyleSheet.create({
    container: {
      padding: 20,
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
      color: theme.dativ,
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
      backgroundColor: theme.dativ,
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