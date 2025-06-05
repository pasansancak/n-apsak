import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AdviceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Advice Screen Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f1f5f9" },
  text: { fontSize: 22, fontWeight: "600", color: "#64748b" }
});
