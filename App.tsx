import React from 'react';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View, Platform } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat': require('./assets/fonts/Montserrat-Bold.ttf'),
    // ...otros estilos si los necesitas
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider>
      <StatusBar style="light" translucent backgroundColor="transparent" hidden />
      <AppNavigator />
    </PaperProvider>
  );
}