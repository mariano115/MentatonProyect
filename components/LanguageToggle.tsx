import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";

interface LanguageToggleProps {
  selected: "es" | "en";
  onSelect: (lang: "es" | "en") => void;
}

export default function LanguageToggle({ selected, onSelect }: LanguageToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.flagButton,
          selected === "es" ? styles.flagActive : styles.flagInactive,
        ]}
        onPress={() => onSelect("es")}
        activeOpacity={0.8}
      >
        <Image
          //source={require("../assets/icons/spain.png")}
          style={[
            styles.flagImage,
            selected !== "es" && styles.flagImageInactive,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.flagButton,
          selected === "en" ? styles.flagActive : styles.flagInactive,
        ]}
        onPress={() => onSelect("en")}
        activeOpacity={0.8}
      >
        <Image
          //source={require("../assets/icons/usa.png")}
          style={[
            styles.flagImage,
            selected !== "en" && styles.flagImageInactive,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  flagButton: {
    borderRadius: 12,
    padding: 6,
    backgroundColor: "#f2f2f2",
    borderWidth: 2,
    borderColor: "transparent",
  },
  flagActive: {
    borderColor: "#9629b1",
    backgroundColor: "#fff",
  },
  flagInactive: {
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  flagImage: {
    width: 40,
    height: 28,
    resizeMode: "contain",
    opacity: 1,
  },
  flagImageInactive: {
    opacity: 0.4,
  },
});
