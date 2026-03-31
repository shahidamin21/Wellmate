import { LanguageCode, t } from "@/i18n";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
} from "@react-navigation/drawer";
import { useContext } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DailyCheckin from "../(drawer)/daily-checkin";
import HomeScreen from "../(drawer)/home-page";
import { LanguageContext } from "../../context/LanguageProvider";
import { ThemeContext } from "../_layout";

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation }: any) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);

  const isRTL = language === "ps" || language === "fa";

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
      style={{ backgroundColor: theme === "light" ? "#fff" : "#121212" }}
    >
      <View>
        <DrawerItem
          label={t("home", language)}
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("home-main")}
          labelStyle={{ color: theme === "light" ? "#000" : "#fff" }}
        />

        <DrawerItem
          label={t("dailyCheckin", language)}
          icon={({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("daily-checkin")}
          labelStyle={{ color: theme === "light" ? "#000" : "#fff" }}
        />

        <DrawerItem
          label={t("settings", language)}
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate("settings")}
          labelStyle={{ color: theme === "light" ? "#000" : "#fff" }}
        />
      </View>

      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: theme === "light" ? "#eee" : "#333",
        }}
      >
        <View style={styles.row}>
          <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>
            Dark Mode
          </Text>
          <Switch value={theme === "dark"} onValueChange={toggleTheme} />
        </View>

        <View style={styles.row}>
          <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>
            Language
          </Text>

          <View style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
            {["en", "ps", "fa"].map((l) => (
              <Text
                key={l}
                style={[
                  styles.langButton,
                  {
                    backgroundColor:
                      language === l
                        ? "#6a4c3b"
                        : theme === "light"
                          ? "#eee"
                          : "#333",
                    color:
                      language === l
                        ? "#fff"
                        : theme === "light"
                          ? "#000"
                          : "#fff",
                  },
                ]}
                onPress={() => setLanguage(l as LanguageCode)}
              >
                {l.toUpperCase()}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default function HomeDrawer() {
  const { theme } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#6a4c3b",
        drawerInactiveTintColor: "#6b7280",
        sceneContainerStyle: {
          backgroundColor: theme === "light" ? "#fff" : "#121212",
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="home-main" component={HomeScreen} />

      <Drawer.Screen name="daily-checkin" component={DailyCheckin} />

      <Drawer.Screen name="settings" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  langButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginHorizontal: 4,
  },
});
