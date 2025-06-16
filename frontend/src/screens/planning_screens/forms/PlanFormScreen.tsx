import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { usePlan } from "../../../context/PlanContext";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const PlanFormScreen = () => {
  const { setPlanData } = usePlan();
  const [step, setStep] = useState(1);

  // Form state
  const [date, setDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState([9, 12]);
  const [concept, setConcept] = useState("");
  const [budget, setBudget] = useState("");
  const [brief, setBrief] = useState("");

  const handleSave = () => {
    setPlanData({ date, timeRange, concept, budget, brief });
  };

  return (
    <ScrollView style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.heading}>Plan Tarihi</Text>
          <Text style={styles.dateText}>
            {date.toDateString()}
          </Text>
          {/* Takvim yerine şimdilik sabit bugünkü tarih gösteriliyor */}

          <Text style={styles.heading}>Saat Aralığı</Text>
          <MultiSlider
            values={timeRange}
            min={0}
            max={24}
            step={1}
            onValuesChange={setTimeRange}
            sliderLength={300}
            selectedStyle={{ backgroundColor: "#D6FF00" }}
            unselectedStyle={{ backgroundColor: "#444" }}
            containerStyle={{ alignSelf: "center", marginTop: 10 }}
          />
          <Text style={styles.timeText}>
            {timeRange[0]}:00 - {timeRange[1]}:00
          </Text>

          <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.heading}>Plan Konsepti</Text>
          {["Tarihi Gezi", "Kahve Planı", "Gece Eğlencesi", "Akşam Yemeği"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, concept === item && styles.optionSelected]}
              onPress={() => setConcept(item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.heading}>Bütçe</Text>
          {["Düşük", "Orta", "Yüksek"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.option, budget === item && styles.optionSelected]}
              onPress={() => setBudget(item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.nextButton} onPress={() => setStep(4)}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.heading}>Plan Brief</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Plan hakkında kısa bir açıklama..."
            placeholderTextColor="#aaa"
            multiline
            value={brief}
            onChangeText={setBrief}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default PlanFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    padding: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 14,
  },
  dateText: {
    color: "#fff",
    fontSize: 16,
  },
  timeText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  option: {
    backgroundColor: "#2a2a2a",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: "#D6FF00",
  },
  optionText: {
    color: "#fff",
    fontSize: 15,
  },
  textArea: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: "#D6FF00",
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  nextText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#D6FF00",
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
});
