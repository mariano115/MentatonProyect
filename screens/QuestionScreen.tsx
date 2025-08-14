import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { getRandomQuestion } from "../database/queries";


interface QuestionScreenProps {
    category: string;
    icon: any;
}

type QuestionRouteProp = RouteProp<RootStackParamList, 'Question'>;

export default function QuestionScreen() {
    const navigation = useNavigation();
    const { params } = useRoute<QuestionRouteProp>();
    const { category, icon, difficulty, language } = params;
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        console.log('[Screen] useEffect getRandomQuestion', { category, difficulty, language });
        getRandomQuestion(category, difficulty, language)
            .then(q => setCurrentQuestion(q))
            .catch(console.error);
    }, [category, difficulty, language]);

    const handleNextQuestion = () => {
        setShowAnswer(false);
        getRandomQuestion(category, difficulty, language)
            .then(q => setCurrentQuestion(q))
            .catch(console.error);
    };

    return (
        <LinearGradient
            colors={["#464eb5", "#9629b1"]}
            style={styles.container}
        >
            {/* Top bar: solo el título centrado */}
            <View style={styles.topBar}>
                <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryText}>{category}</Text>
                </View>
            </View>
            {/* Icono debajo del título */}
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.icon} />
            </View>
            <View style={styles.content}>
                <Text style={styles.questionLabel}>📖 Pregunta:</Text>
                <View style={styles.fixedQuestionContainer}>
                    <Text style={styles.questionText}>
                        {currentQuestion?.question || "Cargando pregunta..."}
                    </Text>
                </View>
                <View style={styles.fixedAnswerContainer}>
                    {!showAnswer ? (
                        <TouchableOpacity
                            style={styles.showAnswerButton}
                            onPress={() => setShowAnswer(true)}
                            disabled={!currentQuestion}
                        >
                            <Text style={styles.showAnswerText}>Mostrar Respuesta</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.answerContainer}>
                            <Text style={styles.answerLabel}>🧠 Respuesta:</Text>
                            <View style={styles.fixedAnswerTextContainer}>
                                <Text style={styles.answerText}>
                                    {currentQuestion?.answer || ""}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.actionsStack}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleNextQuestion}
                        disabled={!currentQuestion}
                    >
                        <Text style={styles.actionButtonText}>👉 Otra Pregunta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.menuButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.actionButtonText}>🔙 Volver al Menú</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    topBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 60,
        marginBottom: 15,
        position: "relative",
    },
    categoryTitleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    categoryText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: "Montserrat",
        marginBottom: 0,
        textAlign: "center",
    },
    iconContainer: {
        //width: 1',
        alignItems: "center",
        marginBottom: 16,
        marginTop: 8,
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 0,
        marginLeft: 0,
    },
    content: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 0,
    },
    fixedQuestionContainer: {
        minHeight: 90,
        maxHeight: 120,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    questionLabel: {
        color: "#fff",
        fontSize: 20, // más chico
        marginBottom: 6, // sube el texto de Pregunta:
        fontFamily: "Montserrat",
    },
    questionText: {
        color: "#fff",
        fontSize: 28, // más chico
        textAlign: "center",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        paddingHorizontal: 12,
        // marginBottom eliminado, el espacio lo da fixedQuestionContainer
    },
    fixedAnswerContainer: {
        minHeight: 110,
        maxHeight: 140,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 48,
    },
    fixedAnswerTextContainer: {
        minHeight: 40,
        maxHeight: 80,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    showAnswerButton: {
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 36,
        // marginBottom eliminado, el espacio lo da fixedAnswerContainer
    },
    showAnswerText: {
        color: "#9629b1",
        fontWeight: "bold",
        fontSize: 22,
        fontFamily: "Montserrat",
    },
    answerContainer: {
        alignItems: "center",
        // marginBottom eliminado, el espacio lo da fixedAnswerContainer
    },
    answerLabel: {
        color: "#fff",
        fontSize: 22,
        marginBottom: 5,
        fontFamily: "Montserrat",
    },
    answerText: {
        color: "#fff",
        fontSize: 32, // más grande
        fontWeight: "bold",
        fontFamily: "Montserrat",
        textAlign: "center",
        paddingHorizontal: 5,
    },
    actionsStack: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    actionButton: {
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        marginVertical: 8,
        width: "80%",
        alignItems: "center",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Montserrat",
    },
    menuButton: {
        backgroundColor: "rgba(255,255,255,0.10)",
    },
});