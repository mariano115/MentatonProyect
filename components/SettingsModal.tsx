import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import LanguageToggle from "./LanguageToggle";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDifficulty?: string;
  onSelectDifficulty?: (difficulty: string) => void;
}

const difficulties = [
  { label: "Fácil", value: "facil" },
  { label: "Medio", value: "media" },
  { label: "Difícil", value: "dificil" },
];

function getNextDifficulty(current?: string) {
  const idx = difficulties.findIndex((d) => d.value === current);
  return difficulties[(idx + 1) % difficulties.length];
}

export default function SettingsModal({
  visible,
  onClose,
  selectedDifficulty,
  onSelectDifficulty,
}: SettingsModalProps) {
  const [language, setLanguage] = useState<"es" | "en">("es");
  const current =
    difficulties.find((d) => d.value === selectedDifficulty) || difficulties[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Configuración</Text>
          <TouchableOpacity
            style={styles.difficultyButton}
            onPress={() => {
              if (onSelectDifficulty) {
                const next = getNextDifficulty(selectedDifficulty);
                onSelectDifficulty(next.value);
              }
            }}
          >
            <Text style={styles.difficultyButtonText}>
              Dificultad: {current.label}
            </Text>
          </TouchableOpacity>
          <LanguageToggle selected={language} onSelect={setLanguage} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#222",
    fontFamily: "Montserrat",
  },
  difficultyButton: {
    backgroundColor: "#9629b1",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 24,
    width: "80%", // Fijo al 80% del modal
    alignItems: "center",
  },
  difficultyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: "#222",
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "bold",
  },
});
