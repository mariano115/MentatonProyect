import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useState } from "react";
import SettingsModal from "../components/SettingsModal";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [difficulty, setDifficulty] = useState("media"); // Estado para dificultad

    // Datos de cada categoría
    const categories = [
        {
            id: 1,
            label: "historia y geografia",
            icon: require('../assets/icons/earth.png'),
        },
        {
            id: 2,
            label: "naturaleza y ciencia",
            icon: require('../assets/icons/science.png'),
        },
        {
            id: 3,
            label: "artes",
            icon: require('../assets/icons/art.png'),
        },
        {
            id: 4,
            label: "entretenimiento y espectaculo",
            icon: require('../assets/icons/entertainment.png'),
        },
        {
            id: 5,
            label: "deportes y juegos",
            icon: require('../assets/icons/sports.png'),
        },
        {
            id: 6,
            label: "cambalache",
            icon: require('../assets/icons/blender.png'),
        },
    ];

    return (
        <LinearGradient
            colors={["#464eb5", "#9629b1"]}
            style={styles.container}
        >
            {/* Botón de configuración arriba a la derecha */}
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setSettingsVisible(true)}
            >
                <Image
                    source={require('../assets/icons/settings.png')}
                    style={styles.settingsIcon}
                />
            </TouchableOpacity>
            <SettingsModal
                visible={settingsVisible}
                onClose={() => setSettingsVisible(false)}
                selectedDifficulty={difficulty}
                onSelectDifficulty={setDifficulty}
            />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Mentaton</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {categories.map((category, idx) => (
                    <CustomButton
                        key={category.id}
                        style={styles.topicsButton}
                        imageSource={category.icon}
                        label={category.label}
                        onPress={() =>
                            (navigation as any).navigate("Question", {
                                category: category.label,
                                icon: category.icon,
                                difficulty: difficulty,
                                language: 'es' // Usa el valor actualizado
                            })
                        }
                    />
                ))}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    settingsButton: {
        position: "absolute",
        top: 40,
        right: 24,
        zIndex: 2,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 24,
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    settingsIcon: {
        width: 28,
        height: 28,
        //tintColor: "#fff",
    },
    titleContainer: {
        marginBottom: 24,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        position: "absolute",
        top: 120, // más abajo
        left: 0,
        zIndex: 1,
    },
    title: {
        fontSize: 60,
        fontWeight: "400",
        color: "#fff",
        fontFamily: "Montserrat",
    },
    buttonsContainer: {
        width: "100%",
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginTop: 250, // baja los botones aún más
    },
    topicsButton: {
        height: 150,
        width: "45%",
        marginVertical: 8,
    }
});
