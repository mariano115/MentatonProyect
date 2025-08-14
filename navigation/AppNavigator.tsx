import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import QuestionScreen from "../screens/QuestionScreen";

export type RootStackParamList = {
    Home: undefined;
    Question: {
        category: string;
        icon: any;
        difficulty: string;
        language: string;
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Question" component={QuestionScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}