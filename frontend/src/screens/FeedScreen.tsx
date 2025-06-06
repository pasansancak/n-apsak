import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const KNOCKBOLD = "KnockoutBold";

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed Screen Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: DARK_BG },
  text: { fontSize: 22, color: NEON, fontFamily: KNOCKBOLD, letterSpacing: 1.2 }
});
