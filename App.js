import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from './screens/OnboardingScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import LevelScreen from './screens/learning/LevelScreen';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from './constants/styles';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();
const isLoggedIn = true;
// const isOnboardingComplete = false;
// const isFirstLaunch = false;

function BottomTabNavigator() {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary,
          height: 70,
          paddingTop: 8,
        },
        tabBarActiveTintColor: GlobalStyles.colors.accent,
        tabBarInactiveTintColor: 'black',
      }}
      initialRouteName="Home"
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          // tabBarLabelStyle: {
          //   fontSize: 14,
          //   marginTop: 6,
          //   fontFamily: 'Inter-Medium',
          // },
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={36} color={color} />
          ),
          tabBarIconStyle: {
            marginTop: 6
          }
        }}
      />
      <BottomTabs.Screen
        name="LevelScreen"
        component={LevelScreen}
        options={{
          tabBarShowLabel: false,
          // tabBarLabelStyle: {
          //   fontSize: 14,
          //   marginTop: 6,
          //   fontFamily: 'Inter-Medium',
          // },
          tabBarIcon: ({ color }) => (
            <Ionicons name="school-outline" size={36} color={color} />
          ),
          tabBarIconStyle: {
            marginTop: 6
          }
        }}
      />
    </BottomTabs.Navigator >
  );
}

export default function App() {

  return (
    <SafeAreaView style={style.container}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="RegisterScreen"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
          {/* <Stack.Screen name="LevelScreen" component={LevelScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1.
  }
})
