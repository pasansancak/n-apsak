import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const KNOCKBOLD = "KnockoutBold";

export default function PlanScreen() {
  // onRegionChangeComplete ile sadece kullanıcı harita hareketi bitirdiğinde işlem yap
  const handleRegionChangeComplete = (region: Region) => {
    // Şu anda sadece log, ileride event fetch veya API için kullanabilirsin
    console.log("Harita bölgesi değişti:", region);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        scrollEnabled={true}
        zoomEnabled={true}
        onRegionChangeComplete={handleRegionChangeComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_BG },
});
