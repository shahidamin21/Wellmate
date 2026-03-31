import { LanguageCode, t } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANGUAGES: { id: LanguageCode; name: string; nativeName: string }[] = [
  { id: "en", name: "English", nativeName: "English" },
  { id: "ps", name: "Pashto", nativeName: "پښتو" },
  { id: "fa", name: "Dari", nativeName: "دری" },
];

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  const router = useRouter();

  const handleLanguageSelect = (languageId: LanguageCode) => {
    setSelectedLanguage(languageId);
  };

  const handleContinue = async () => {
    if (selectedLanguage) {
      await AsyncStorage.setItem("wellmate_language", selectedLanguage);
      router.replace("/goal-selection");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Welcome */}
        <View style={styles.welcome}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🌱</Text>
          </View>
          <Text style={styles.title}>
            {t("welcomeTitle", selectedLanguage)}
          </Text>
          <Text style={styles.subtitle}>
            {t("welcomeSubtitle", selectedLanguage)}
          </Text>
        </View>

        {/* Language Section */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>
            {t("selectLanguage", selectedLanguage)}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {t("selectLanguageSubtitle", selectedLanguage)}
          </Text>

          <View style={styles.languageList}>
            {LANGUAGES.map((lang) => {
              const selected = selectedLanguage === lang.id;
              return (
                <TouchableOpacity
                  key={lang.id}
                  onPress={() => handleLanguageSelect(lang.id)}
                  style={[
                    styles.languageCard,
                    selected && styles.languageCardSelected,
                  ]}
                >
                  <View style={styles.languageCardContent}>
                    <View>
                      <Text
                        style={[
                          styles.languageName,
                          selected && styles.languageNameSelected,
                        ]}
                      >
                        {lang.name}
                      </Text>
                      <Text
                        style={[
                          styles.languageNative,
                          selected && styles.languageNativeSelected,
                        ]}
                      >
                        {lang.nativeName}
                      </Text>
                    </View>
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
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedLanguage}
          style={[
            styles.continueButton,
            !selectedLanguage && styles.continueButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.continueText,
              !selectedLanguage && styles.continueTextDisabled,
            ]}
          >
            {t("continue", selectedLanguage)}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          {t("footerNote", selectedLanguage)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff8f0" },
  scroll: { flexGrow: 1, padding: 24 },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 32,
  },

  welcome: { alignItems: "center", marginBottom: 48 },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  iconText: { fontSize: 36 },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6a4c3b",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    lineHeight: 22,
  },

  languageSection: { marginBottom: 32 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4a4a4a",
    marginBottom: 8,
    textAlign: "center",
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 16,
    textAlign: "center",
  },

  languageList: { gap: 12 },

  languageCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },

  languageCardSelected: {
    backgroundColor: "#d6b88c",
    borderColor: "#d6b88c",
  },

  languageCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  languageName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a4a4a",
  },

  languageNameSelected: { color: "#fff" },

  languageNative: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  languageNativeSelected: { color: "#fff" },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#777",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderColor: "#fff",
    backgroundColor: "#fff",
  },

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

  continueButtonDisabled: {
    backgroundColor: "#aaa",
  },

  continueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  continueTextDisabled: {
    color: "#eee",
  },

  footerNote: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginTop: 16,
  },
});
