import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet, ImageSourcePropType, GestureResponderEvent, ViewStyle, TextStyle, ImageStyle } from "react-native";

interface CustomButtonProps {
  label: string;
  imageSource: ImageSourcePropType;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  iconStyle?: ImageStyle;
}

export default function CustomButton({
  label,
  imageSource,
  onPress,
  style,
  labelStyle,
  iconStyle,
}: CustomButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.label, { fontFamily: "Montserrat" }, labelStyle]} numberOfLines={2} adjustsFontSizeToFit>
        {label}
      </Text>
      <Image source={imageSource} style={[styles.icon, iconStyle]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 12, height: 12 }, // Más desplazamiento a la derecha y abajo
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
    width: 100,
    height: 150,
    overflow: "hidden",
  },
  label: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 20, // Más grande
    textAlign: "center",
    height: "38%", // Más espacio para el título
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    includeFontPadding: false,
    textAlignVertical: "center",
    fontFamily: "Montserrat",
  },
  icon: {
    width: 64, // Más grande
    height: "62%", // Ajusta para ocupar el resto
    resizeMode: "contain",
    marginTop: 2,
  },
});