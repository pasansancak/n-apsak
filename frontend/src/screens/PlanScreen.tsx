import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PlanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Plan Screen Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f1f5f9" },
  text: { fontSize: 22, fontWeight: "600", color: "#64748b" }
});
