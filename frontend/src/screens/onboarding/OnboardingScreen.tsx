import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useUser } from "../../context/UserContext";
import { postOnboarding } from "../../api/user"; // Kendi API çağrınla değiştir
const NEON = "#D6FF00";
const DARK_BG = "#181818";
const CARD_BG = "#23272f";
const KNOCKBOLD = "KnockoutBold";

const questions = [
  {
    key: "venue_types",
    title: "Ne tarz mekan/cafe/restoranlardan hoşlanırsın?",
    options: [
      "3rd wave coffee", "Pub", "Fine dining", "Tatlıcı", "Klasik cafe", "Brunch", "Kokteyl bar", "Çaycı"
    ]
  },
  {
    key: "interests",
    title: "En çok ilgilendiğin alanlar?",
    options: [
      "Spor", "Sinema", "Teknoloji", "Oyun", "Seyahat", "Sanat", "Yemek", "Doğa", "Müzik"
    ]
  },
  {
    key: "music_types",
    title: "Dinlediğin müzik türleri?",
    options: [
      "Rock", "Elektronik", "Jazz", "Hip-hop", "Pop", "Klasik", "Rap", "Türkçe"
    ]
  },
  {
    key: "personality_traits",
    title: "Seni en iyi tanımlayan özellikler?",
    options: [
      "Macera sever", "Sosyal", "Planlı", "Spontane", "Analitik", "Yalnız", "Takım oyuncusu"
    ]
  },
  {
    key: "extra_traits",
    title: "Eklemek istediğin başka bir özellik?",
    options: [
      "Organizatör", "Düzenli", "Yardımsever", "Esprili", "Rekabetçi", "Yenilikçi"
    ]
  }
];

export default function OnboardingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const { setUser } = useUser();

  const current = questions[step];

  const handleSelect = (key: string, value: string) => {
    setAnswers((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value]
      };
    });
  };

  const handleNext = () => {
    if (!answers[current.key] || answers[current.key].length === 0) {
      Alert.alert("Lütfen en az bir seçim yap.");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSave = async () => {
    if (!answers[current.key] || answers[current.key].length === 0) {
      Alert.alert("Lütfen en az bir seçim yap.");
      return;
    }
    setSaving(true);
    try {
      // API'ye answers'ı gönder
      const user = await postOnboarding(answers);
      setUser(user);
    } catch (e) {
      Alert.alert("Hata", "Kaydedilemedi. Lütfen tekrar dene.");
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{current.title}</Text>
        <ScrollView contentContainerStyle={styles.optionsWrap}>
          {current.options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                (answers[current.key] || []).includes(option) && styles.selected
              ]}
              onPress={() => handleSelect(current.key, option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  (answers[current.key] || []).includes(option) && { color: DARK_BG }
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.bottomRow}>
          <Text style={styles.pageNo}>{`${step + 1} / 5`}</Text>
          {step < questions.length - 1 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.nextText}>{saving ? "Kaydediliyor..." : "Save"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK_BG, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: CARD_BG, borderRadius: 20, padding: 24, width: "90%", alignItems: "center", minHeight: 420 },
  title: { color: NEON, fontFamily: KNOCKBOLD, fontSize: 18, marginBottom: 18, textAlign: "center", letterSpacing: 0.4 },
  optionsWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  option: {
    paddingHorizontal: 18, paddingVertical: 10,
    backgroundColor: "#2a2d36", borderRadius: 20, margin: 7,
    borderWidth: 2, borderColor: "#444"
  },
  selected: { backgroundColor: NEON, borderColor: NEON },
  optionText: { color: "#fff", fontFamily: KNOCKBOLD, fontSize: 15 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 28 },
  pageNo: { color: "#bbb", fontFamily: KNOCKBOLD, fontSize: 15 },
  nextBtn: { backgroundColor: NEON, paddingVertical: 10, paddingHorizontal: 32, borderRadius: 10 },
  nextText: { color: "#222", fontFamily: KNOCKBOLD, fontSize: 16, fontWeight: "bold" },
});
