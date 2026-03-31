import { LanguageCode, t } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

type GrowthObject = {
  id: string;
  nameKey: string;
  emoji: string;
  descriptionKey: string;
};

const GROWTH_OBJECTS: GrowthObject[] = [
  {
    id: "pomegranate",
    nameKey: "pomegranateTree",
    emoji: "🌳",
    descriptionKey: "pomegranateDesc",
  },
  {
    id: "garden",
    nameKey: "flowerGarden",
    emoji: "🌸",
    descriptionKey: "flowerGardenDesc",
  },
  {
    id: "grapevine",
    nameKey: "grapevine",
    emoji: "🍇",
    descriptionKey: "grapevineDesc",
  },
  {
    id: "carpet",
    nameKey: "wovenCarpet",
    emoji: "🧶",
    descriptionKey: "wovenCarpetDesc",
  },
];

export default function GoalSelectionScreen() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const router = useRouter();

  useEffect(() => {
    const fetchLanguage = async () => {
      const lang = await AsyncStorage.getItem("wellmate_language");
      if (lang) setLanguage(lang as LanguageCode);
    };
    fetchLanguage();
  }, []);

  const handleObjectSelect = async (objectId: string) => {
    setSelectedObject(objectId);
    await AsyncStorage.setItem("wellmate_growth_object", objectId);
  };

  const handleContinue = async () => {
    if (selectedObject) {
      try {
        await AsyncStorage.setItem("wellmate_growth_object", selectedObject);

        await AsyncStorage.setItem("setup_done", "true");

        router.replace("/(drawer)/home-page");
      } catch (error) {
        console.error("Error saving growth object:", error);
      }
    }
  };

  const handleBack = () => {
    router.push("/language-selection");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#6a4c3b" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{t("chooseYourGrowth", language)}</Text>
          <Text style={styles.subtitle}>
            {t("chooseYourGrowthSubtitle", language)}
          </Text>
        </View>

        {/* Growth Objects */}
        <View style={styles.objectList}>
          {GROWTH_OBJECTS.map((obj) => {
            const selected = selectedObject === obj.id;
            return (
              <TouchableOpacity
                key={obj.id}
                onPress={() => handleObjectSelect(obj.id)}
                style={[
                  styles.objectCard,
                  selected && styles.objectCardSelected,
                ]}
              >
                <View style={styles.objectContent}>
                  {/* Emoji */}
                  <View
                    style={[
                      styles.objectEmoji,
                      selected && styles.objectEmojiSelected,
                    ]}
                  >
                    <Text style={styles.emojiText}>{obj.emoji}</Text>
                  </View>

                  {/* Text */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.objectName,
                        selected && styles.objectNameSelected,
                      ]}
                    >
                      {t(obj.nameKey, language)}
                    </Text>
                    <Text
                      style={[
                        styles.objectDescription,
                        selected && styles.objectDescriptionSelected,
                      ]}
                    >
                      {t(obj.descriptionKey, language)}
                    </Text>
                  </View>

                  {/* Radio Indicator */}
                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterSelected,
                    ]}
                  >
                    {selected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedObject}
          style={[
            styles.continueButton,
            !selectedObject && styles.continueButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.continueText,
              !selectedObject && styles.continueTextDisabled,
            ]}
          >
            {t("continue", language)}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>{t("footerNote", language)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff8f0" },
  scroll: { flexGrow: 1, padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  backButton: { padding: 8 },
  titleSection: { marginBottom: 24, alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6a4c3b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },
  objectList: { gap: 12, marginBottom: 24 },
  objectCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  objectCardSelected: { backgroundColor: "#d6b88c", borderColor: "#d6b88c" },
  objectContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  objectEmoji: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  objectEmojiSelected: { backgroundColor: "rgba(214,184,140,0.3)" },
  emojiText: { fontSize: 32 },
  objectName: { fontSize: 18, fontWeight: "600", color: "#4a4a4a" },
  objectNameSelected: { color: "#fff" },
  objectDescription: { fontSize: 14, color: "#777", marginTop: 4 },
  objectDescriptionSelected: { color: "#fff" },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { borderColor: "#fff", backgroundColor: "#fff" },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#d6b88c",
  },
  continueButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: "#d6b88c",
    alignItems: "center",
  },
  continueButtonDisabled: { backgroundColor: "#aaa" },
  continueText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  continueTextDisabled: { color: "#eee" },
  footerNote: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 16,
  },
});
