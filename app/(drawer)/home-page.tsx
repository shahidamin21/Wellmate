import { BurgerMenu } from "@/components/BurgerMenu";
import { t } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageContext } from "../../context/LanguageProvider";

type GrowthObject = {
  id: string;
  nameKey: string;
  emoji: string;
  descriptionKey: string;
};

const GROWTH_OBJECTS: Record<string, GrowthObject> = {
  pomegranate: {
    id: "pomegranate",
    nameKey: "pomegranateTree",
    emoji: "🌳",
    descriptionKey: "pomegranateDesc",
  },
  garden: {
    id: "garden",
    nameKey: "flowerGarden",
    emoji: "🌸",
    descriptionKey: "flowerGardenDesc",
  },
  grapevine: {
    id: "grapevine",
    nameKey: "grapevine",
    emoji: "🍇",
    descriptionKey: "grapevineDesc",
  },
  carpet: {
    id: "carpet",
    nameKey: "wovenCarpet",
    emoji: "🧶",
    descriptionKey: "wovenCarpetDesc",
  },
};

const DAILY_ACTIONS = [
  { id: "actionWater", icon: "💧" },
  { id: "actionWalk", icon: "🚶" },
  { id: "actionSunlight", icon: "☀️" },
  { id: "actionContact", icon: "📞" },
];

const CALM_MESSAGES = ["Msg1", "Msg2", "Msg3", "Msg4", "Msg5"];

export default function HomeScreen() {
  const { language } = useContext(LanguageContext); // use context
  const [selectedObject, setSelectedObject] = useState<GrowthObject | null>(
    null,
  );
  const [completedActions, setCompletedActions] = useState<Set<string>>(
    new Set(),
  );
  const [dailyMessage, setDailyMessage] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      const objectId = await AsyncStorage.getItem("wellmate_growth_object");
      if (objectId && GROWTH_OBJECTS[objectId])
        setSelectedObject(GROWTH_OBJECTS[objectId]);

      const today = new Date().toDateString();
      const savedActions = await AsyncStorage.getItem(
        `wellmate_actions_${today}`,
      );
      if (savedActions) setCompletedActions(new Set(JSON.parse(savedActions)));

      const todayIndex = new Date().getDay();
      setDailyMessage(CALM_MESSAGES[todayIndex % CALM_MESSAGES.length]);
    };

    initialize();
  }, []);

  const toggleAction = async (id: string) => {
    const newSet = new Set(completedActions);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setCompletedActions(newSet);

    const today = new Date().toDateString();
    await AsyncStorage.setItem(
      `wellmate_actions_${today}`,
      JSON.stringify(Array.from(newSet)),
    );
  };

  const isRTL = language === "ps" || language === "fa";
  const progress = (completedActions.size / DAILY_ACTIONS.length) * 100;

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 128 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t("goodMorning", language)}</Text>
            <Text style={styles.title}>{t("appName", language)}</Text>
          </View>
          <View style={styles.headerIcons}>
            <BurgerMenu onPress={() => navigation.toggleDrawer()} />
          </View>
        </View>

        {/* Growth Object */}
        {selectedObject && (
          <View style={styles.growthContainer}>
            <View style={styles.growthCard}>
              <View style={styles.growthRow}>
                <View style={styles.growthEmoji}>
                  <Text style={styles.growthEmojiText}>
                    {selectedObject.emoji}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.growthName, { textAlign: "left" }]}>
                    {t(selectedObject.nameKey, language)}
                  </Text>
                  <Text style={[styles.growthDesc, { textAlign: "left" }]}>
                    {t(selectedObject.descriptionKey, language)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Daily Message */}
        <View style={styles.dailyMessageContainer}>
          <View style={styles.dailyMessageCard}>
            <Text style={styles.dailyMessageText}>
              {t(dailyMessage, language)}
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {t("todaysProgress", language)}
            </Text>
            <Text style={styles.progressText}>
              {completedActions.size} / {DAILY_ACTIONS.length}
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Daily Actions */}
        <View style={styles.dailyActionsContainer}>
          <Text style={[styles.sectionTitle, { textAlign: "left" }]}>
            {t("dailyActions", language)}
          </Text>
          {DAILY_ACTIONS.map((action) => {
            const done = completedActions.has(action.id);
            return (
              <TouchableOpacity
                key={action.id}
                onPress={() => toggleAction(action.id)}
                style={[
                  styles.actionCard,
                  done ? styles.actionCardCompleted : styles.actionCardDefault,
                ]}
              >
                <View style={styles.actionRow}>
                  <View style={styles.actionLeft}>
                    <View style={styles.actionIconWrapper}>
                      <Text style={{ fontSize: 24 }}>{action.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.actionName,
                        done && styles.actionNameCompleted,
                      ]}
                    >
                      {t(action.id, language)}
                    </Text>
                  </View>
                  <View
                    style={[styles.checkbox, done && styles.checkboxCompleted]}
                  >
                    {done && <View style={styles.checkboxInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Check-in */}
        <View style={styles.checkInContainer}>
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => router.push("/daily-checkin")}
          >
            <View style={styles.checkInLeft}>
              <View style={styles.checkInIcon}>
                <Text style={{ fontSize: 20 }}>🧘</Text>
              </View>
              <View>
                <Text style={[styles.checkInTitle, { textAlign: "left" }]}>
                  {t("dailyCheckin", language)}
                </Text>
                <Text
                  style={[
                    styles.checkInSubtitle,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {t("checkinSubtitle", language)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1541275055241-329bbdf9a191",
            }}
            style={styles.motivationalImage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: { color: "#6b7280", fontSize: 14 },
  title: { color: "#111827", fontSize: 24, fontWeight: "700" },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 12 },
  growthContainer: { paddingHorizontal: 24, marginBottom: 24 },
  growthCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  growthRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  growthEmoji: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "rgba(14,165,233,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  growthEmojiText: { fontSize: 40 },
  growthName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  growthDesc: { fontSize: 14, color: "#6a4c3b" },
  dailyMessageContainer: { paddingHorizontal: 24, marginBottom: 24 },
  dailyMessageCard: {
    backgroundColor: "#fff6e9",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#a07d69",
  },
  dailyMessageText: {
    fontSize: 16,
    color: "#6a4c3b",
    textAlign: "center",
    lineHeight: 22,
  },
  progressContainer: { paddingHorizontal: 24, marginBottom: 24 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  progressText: { fontSize: 12, color: "#6b7280" },
  progressBarBackground: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6a4c3b",
    borderRadius: 12,
  },
  dailyActionsContainer: { paddingHorizontal: 24, marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  actionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  actionCardDefault: { backgroundColor: "#fff", borderColor: "#e5e7eb" },
  actionCardCompleted: { backgroundColor: "#fff6e9", borderColor: "#6a4c3b" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  actionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  actionName: { fontSize: 14, color: "#d1a667", fontWeight: "500" },
  actionNameCompleted: { color: "#6a4c3b" },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#6a4c3b",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: { backgroundColor: "#6a4c3b", borderColor: "#6a4c3b" },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#fff",
  },
  checkInContainer: { paddingHorizontal: 24, marginBottom: 24 },
  checkInButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#6a4c3b",
  },
  checkInLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkInIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  checkInTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  checkInSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
  imageContainer: { paddingHorizontal: 24, marginBottom: 24 },
  motivationalImage: { width: "100%", height: 192, borderRadius: 16 },
});
