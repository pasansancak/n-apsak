import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  Animated,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
  Image,
  Linking,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from 'expo-constants';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const NEON = "#D6FF00";

export default function PlanScreen() {
  const [places, setPlaces] = useState([]);
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState(null);
  const [region, setRegion] = useState({
    latitude: 41.07724,
    longitude: 29.00958,
    latitudeDelta: 0.07,
    longitudeDelta: 0.05,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  const mapRef = useRef(null);

  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  const searchShiftAnim = useRef(new Animated.Value(0)).current;
  const interpolatedX = searchShiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const dateAnimOpacity = useRef(new Animated.Value(0)).current;
  const dateAnimTranslate = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    const toEvent = selectedCategory === "event";
    Animated.timing(searchShiftAnim, {
      toValue: toEvent ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.timing(dateAnimOpacity, {
        toValue: toEvent ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dateAnimTranslate, {
        toValue: toEvent ? 0 : -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedCategory]);

  const formattedDate = selectedDate.toDateString().split(" ").slice(0, 3).join(" ");

  const handleCategoryPress = async (type) => {
    setSelectedCategory(type);
    setShowPicker(false);
    if (!mapRef.current) return;

    const cam = await mapRef.current.getCamera();
    const { latitude, longitude } = cam.center;

    console.log("API:", GOOGLE_API_KEY);

    const radius = 1500;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setPlaces(data.results || []);
      // Region "refresh"
      setRegion((prev) => ({
        ...prev,
        latitudeDelta: prev.latitudeDelta * 0.9999,
      }));
    } catch (err) {
      console.error("Category Fetch Error", err);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchText.trim()) return;
    setSelectedCategory(null);
    setShowPicker(false);

    const { latitude, longitude } = region;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      searchText
    )}&location=${latitude},${longitude}&radius=5000&key=${GOOGLE_API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setPlaces(data.results || []);
      if (data.results.length > 0 && mapRef.current) {
        const coords = data.results.map((p) => ({
          latitude: p.geometry.location.lat,
          longitude: p.geometry.location.lng,
        }));
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }
    } catch (err) {
      console.error("Search Error:", err);
    }
  };

  const handleMarkerPress = async (placeId) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos,types,rating,user_ratings_total,formatted_phone_number,url,opening_hours&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();
      setSelectedPlaceDetails(data.result);
    } catch (err) {
      console.error("Place Details Error", err);
    }
  };

  const getIconByType = (types = []) => {
    if (types.includes("cafe")) return "coffee";
    if (types.includes("restaurant")) return "silverware-fork-knife";
    if (types.includes("museum")) return "bank";
    if (types.includes("bar")) return "glass-cocktail";
    if (types.includes("night_club")) return "music";
    return "map-marker";
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowPicker(false);
      setSelectedPlaceDetails(null);
    }}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          showsUserLocation={true}
          showsPointsOfInterest={false}
        >
          {places.map((place) => (
            <Marker
              key={place.place_id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              onPress={() => handleMarkerPress(place.place_id)}
            >
              <View style={styles.customMarkerContainer}>
                <View style={styles.iconBubble}>
                  <MaterialCommunityIcons name={getIconByType(place.types)} size={12} color="#fff" />
                </View>
                <Text style={styles.ratingText}>
                  {place.rating ? place.rating.toFixed(1).replace(".", ",") : "?"}
                </Text>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Bar */}
        <View style={styles.dateBox}>
          {selectedCategory === "event" && (
            <Animated.View
              style={{
                opacity: dateAnimOpacity,
                transform: [{ translateX: dateAnimTranslate }],
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginRight: 8,
              }}
            >
              <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
                <Text style={{ fontSize: 13, color: "#fff" }}>{formattedDate}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              transform: [{ translateX: interpolatedX }],
            }}
          >
            <MaterialCommunityIcons name="magnify" size={20} color="#aaa" style={{ marginRight: 6 }} />
            <TextInput
              style={{ color: "#fff", fontSize: 15, flex: 1 }}
              placeholder="Bir yer ara..."
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
            />
          </Animated.View>
        </View>

        {showPicker && (
          <View style={styles.pickerBox}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="inline"
              accentColor="#D6FF00"
              themeVariant="dark"
              minimumDate={new Date()}
              maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
              onChange={(e, d) => {
                if (e.type === "set" && d) {
                  setSelectedDate(d);
                  setShowPicker(false);
                }
              }}
              style={{ transform: [{ scale: 0.85 }]}}
            />
          </View>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={styles.categoryRowContent}>
          {[
            "restaurant", "cafe", "museum", "event",
            "bar", "night_club", "shopping_mall", "gym", "library"
          ].map((type) => (
            <TouchableOpacity key={type} style={styles.categoryButton} onPress={() => handleCategoryPress(type)}>
              <Text style={styles.categoryText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 📍 Marker Detay Kartı */}
        {selectedPlaceDetails && (
          <View style={styles.floatingCard}>
            {selectedPlaceDetails.photos?.length > 0 && (
              <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${selectedPlaceDetails.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`,
                }}
                style={styles.cardPhoto}
                resizeMode="cover"
              />
            )}
            <Text style={styles.cardTitle}>{selectedPlaceDetails.name}</Text>
            {selectedPlaceDetails.rating && (
              <Text style={styles.cardRating}>
                ⭐ {selectedPlaceDetails.rating} ({selectedPlaceDetails.user_ratings_total})
              </Text>
            )}
            <Text style={styles.cardDesc}>
              {selectedPlaceDetails.types?.[0]?.replaceAll("_", " ")}{" "}
              {selectedPlaceDetails.opening_hours?.weekday_text?.[0] && `• ${selectedPlaceDetails.opening_hours.weekday_text[0]}`}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              {selectedPlaceDetails.url && (
                <TouchableOpacity style={styles.cardButton} onPress={() => Linking.openURL(selectedPlaceDetails.url)}>
                  <Text style={styles.cardButtonText}>Yol Tarifi</Text>
                </TouchableOpacity>
              )}
              {selectedPlaceDetails.formatted_phone_number && (
                <TouchableOpacity style={styles.cardButton} onPress={() => Linking.openURL(`tel:${selectedPlaceDetails.formatted_phone_number}`)}>
                  <Text style={styles.cardButtonText}>Ara</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  dateBox: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 18,
    zIndex: 11,
    width: "90%",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 16,
  },
  pickerBox: {
    position: "absolute",
    top: 164,
    alignSelf: "center",
    zIndex: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#0f0f0f",
    overflow: "hidden",
  },
  categoryRow: {
    position: "absolute",
    top: 122,
    width: "100%",
  },
  categoryRowContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  customMarkerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: 20,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#000",
  },
  iconBubble: {
    backgroundColor: "rgba(212, 255, 0, 0.75)",
    borderRadius: 999,
    padding: 4,
    marginRight: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    minWidth: 26,
    textAlign: "center",
  },
  floatingCard: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 16,
    zIndex: 1000,
    opacity: 0.95,
  },
  cardPhoto: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardRating: {
    color: "#D6FF00",
    fontSize: 14,
    marginTop: 4,
  },
  cardDesc: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 6,
  },
  cardButton: {
    flex: 1,
    backgroundColor: "#181818",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#D6FF00",
    fontWeight: "bold",
  },
});
