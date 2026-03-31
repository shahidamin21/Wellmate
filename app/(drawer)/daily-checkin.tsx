import { BurgerMenu } from "@/components/BurgerMenu";
import { t } from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { LanguageContext } from "../../context/LanguageProvider";

type MoodOption = { id: string; emoji: string };
const BREATHING_DURATION = 45;

export default function CheckInScreen() {
  const { language } = useContext(LanguageContext);
  const router = useRouter();
  const navigation = useNavigation();

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(BREATHING_DURATION);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const isRTL = language === "ps" || language === "fa";

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  const MOOD_OPTIONS: MoodOption[] = [
    { id: "great", emoji: "😊" },
    { id: "good", emoji: "🙂" },
    { id: "okay", emoji: "😐" },
    { id: "low", emoji: "😔" },
    { id: "tough", emoji: "😢" },
  ];

  const POSITIVE_MESSAGES: string[] = t("checkin.positiveMessages", language);
  const MOOD_LABELS: Record<string, string> = t("checkin.moods", language);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!selectedMood) handleMoodSelect("okay");
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, {
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 4000 }),
        ),
        -1,
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 4000 }),
          withTiming(0.4, { duration: 4000 }),
        ),
        -1,
      );
    } else {
      scale.value = withSpring(1);
      opacity.value = withTiming(0.5);
    }
  }, [isRunning]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    const today = new Date().toDateString();
    await AsyncStorage.setItem(
      `wellmate_checkin_${today}`,
      JSON.stringify({ mood: moodId, completedAt: new Date().toISOString() }),
    );

    const msg =
      POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
    setCurrentMessage(msg);
    setShowMessage(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView
      style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("checkin.title", language)}</Text>
          <BurgerMenu onPress={openDrawer} />
        </View>

        {!showMessage ? (
          <>
            {/* Breathing */}
            <View style={styles.breathing}>
              <View style={styles.circleWrapper}>
                <Animated.View style={[styles.outerCircle, animatedStyle]} />
                <View style={styles.innerCircle}>
                  <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
                </View>
              </View>

              <Text style={styles.instruction}>
                {isRunning
                  ? t("checkin.breathe", language)
                  : t("checkin.ready", language)}
              </Text>

              <View style={styles.controls}>
                {!isRunning ? (
                  <>
                    {timeLeft < BREATHING_DURATION && (
                      <TouchableOpacity
                        onPress={() => {
                          setTimeLeft(BREATHING_DURATION);
                          setIsRunning(false);
                        }}
                        style={styles.secondaryBtn}
                      >
                        <FontAwesome5 name="redo" size={18} color="#6a4c3b" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => setIsRunning(true)}
                      style={styles.primaryBtn}
                    >
                      <FontAwesome5 name="play" size={20} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsRunning(false)}
                    style={styles.primaryBtn}
                  >
                    <FontAwesome5 name="pause" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Mood */}
            <Text style={[styles.sectionTitle, { textAlign: "left" }]}>
              {t("checkin.moodPrompt", language)}
            </Text>
            {MOOD_OPTIONS.map((mood) => {
              const selected = selectedMood === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  onPress={() => handleMoodSelect(mood.id)}
                  style={[styles.moodCard, selected && styles.moodSelected]}
                >
                  <View style={styles.moodRow}>
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodText}>{MOOD_LABELS[mood.id]}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <View style={styles.completeBox}>
            <Text style={styles.completeTitle}>
              {t("checkin.complete", language)}
            </Text>
            <Text style={styles.completeMsg}>{currentMessage}</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.doneBtn}
            >
              <Text style={{ color: "#fff" }}>
                {t("checkin.returnHome", language)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  breathing: { alignItems: "center", marginVertical: 30 },
  circleWrapper: {
    width: 220,
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  outerCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(106,76,59,0.12)",
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(106,76,59,0.25)",
    backgroundColor: "rgba(106,76,59,0.2)",
  },
  timer: { fontSize: 36, fontWeight: "700", color: "#6a4c3b" },
  instruction: {
    marginTop: 24,
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  controls: { flexDirection: "row", marginTop: 24, gap: 14 },
  primaryBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6a4c3b",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 24,
    marginBottom: 12,
    color: "#111827",
  },
  moodCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  moodSelected: { backgroundColor: "#fff6e9", borderColor: "#6a4c3b" },
  moodRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  moodEmoji: { fontSize: 26 },
  moodText: { fontSize: 16, color: "#111827", fontWeight: "500" },
  completeBox: { alignItems: "center", marginTop: 80, padding: 24 },
  completeTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  completeMsg: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
    color: "#6b7280",
  },
  doneBtn: {
    backgroundColor: "#6a4c3b",
    paddingVertical: 16,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
});
