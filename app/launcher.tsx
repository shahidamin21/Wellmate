// app/launcher.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Launcher() {
  const router = useRouter();

  useEffect(() => {
    const checkSetup = async () => {
      const setupDone = await AsyncStorage.getItem("setup_done");
      console.log("SETUP DONE:", setupDone);
      if (setupDone === "true") {
        router.replace("/(drawer)/home-page");
      } else {
        router.replace("/language-selection");
      }
    };

    checkSetup();
  }, []);

  return null;
}
