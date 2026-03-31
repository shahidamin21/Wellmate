import { Stack } from "expo-router";
import React, { createContext, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LanguageProvider } from "../context/LanguageProvider";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export default function RootLayout() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: theme === "light" ? "#fff" : "#121212",
      }}
    >
      <SafeAreaProvider>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <LanguageProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </LanguageProvider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
