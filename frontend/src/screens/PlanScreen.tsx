import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NEON = "#D6FF00";
const DARK_BG = "#181818";
const KNOCKBOLD = "KnockoutBold";


export default function PlanScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const formattedDate = selectedDate
  .toDateString()
  .split(" ")
  .slice(0, 3)
  .join(" "); 

  const handleRegionChangeComplete = (region: Region) => {
    console.log("Harita bölgesi değişti:", region);
  };

  const onDateChange = (event: any, date?: Date) => {
    if (event.type === "set" && date) {
      setSelectedDate(date);
      setShowPicker(false);
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 41.07724033186125,
            longitude: 29.0095841512084,
            latitudeDelta: 0.7423763943618766,
            longitudeDelta: 0.49127273261546733,
          }}
          showsUserLocation={true}
          scrollEnabled={true}
          zoomEnabled={true}
          onRegionChangeComplete={handleRegionChangeComplete}
        />

        {/* Tarih + Arama kutusu */}
        <View style={styles.dateBox}>
          <TouchableOpacity onPress={() => setShowPicker(!showPicker)} style={styles.dateTextWrapper}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#aaa" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Bir yer ara..."
              placeholderTextColor="#aaa"
            />
          </View>
        </View>

        {/* Takvim kutusu */}
        {showPicker && (
          <View style={styles.pickerBox}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="inline"
              minimumDate={new Date()}
              maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              onChange={onDateChange}
              style={{
                transform: [{ scale: 0.85 }],
              }}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            console.log("Plan oluşturma başlatıldı");
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  dateBox: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    zIndex: 11,
    width: "90%",
  },
  dateTextWrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.35)", // daha opak
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  dateText: {
    color: "#fff",
    fontSize: 14,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    padding: 0,  
  },  
  pickerBox: {
    position: "absolute",
    top: 130,
    alignSelf: "center",
    zIndex: 20,
    backgroundColor: "#0f0f0f",
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: "#0f0f0f",
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: DARK_BG,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: NEON,
  },
  fabText: {
    fontSize: 32,
    color: "#fff",
    fontFamily: KNOCKBOLD,
  },
});
