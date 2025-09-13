import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigator";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { View, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Bold.ttf"),
    // ...otros estilos si los necesitas
  });

  useEffect(() => {
    AsyncStorage.removeItem("questions_db_version")
      .then(() => console.log("AsyncStorage version key removed for test"))
      .catch(console.error);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <StatusBar
        style="light"
        translucent
        backgroundColor="transparent"
        hidden
      />
      <AppNavigator />
    </PaperProvider>
  );
}
