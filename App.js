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
import { Provider, useSelector } from 'react-redux'
import { store } from './store';
import ModuleScreen from './screens/learning/module/ModuleScreen';
import QuestionScreen from './screens/learning/module/question/QuestionScreen';
import ResultScreen from './screens/learning/module/question/ResultScreen';
import ProfileScreen from './screens/ProfileScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import { CopilotProvider } from 'react-native-copilot';
import ShopScreen from './screens/ShopScreen';
import Toast from 'react-native-toast-message';
import ProfileSettingScreen from './screens/ProfileSettingScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AchievementScreen from './screens/AchievementScreen';
import OTPVerificationScreen from './screens/auth/VerifyOtpScreen';
// import * as SplashScreen from 'expo-splash-screen';
// import { useCallback, useEffect, useState } from 'react';

// SplashScreen.preventAutoHideAsync();
// SplashScreen.setOptions({
//   duration: 1000,
//   fade: true,
// });


const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();
// const isOnboardingComplete = false;
// const isFirstLaunch = false;

function BottomTabNavigator() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'LevelScreen') {
            iconName = focused
              ? 'school'
              : 'school-outline';
          } else if (route.name === 'LeaderboardScreen') {
            iconName = focused
              ? 'trophy'
              : 'trophy-outline';
          } else if (route.name === 'ShopScreen') {
            iconName = focused
              ? 'cart'
              : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused
              ? 'person'
              : 'person-outline';
          }

          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          width: '90%',
          marginHorizontal: 20,
          height: 70,
          paddingTop: 8,
          borderRadius: 10,
          backgroundColor: GlobalStyles.colors.primary,
          elevation: 5, // for Android shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        tabBarActiveTintColor: GlobalStyles.colors.accent,
        tabBarInactiveTintColor: '#FFFFF0',
      })}
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
          tabBarIconStyle: {
            marginTop: 6,
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
          tabBarIconStyle: {
            marginTop: 6
          }
        }}
      />
      <BottomTabs.Screen
        name="LeaderboardScreen"
        component={LeaderboardScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: 6,
          }
        }}
      />
      <BottomTabs.Screen
        name="ShopScreen"
        component={ShopScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: 6,
          }
        }}
      />
      <BottomTabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIconStyle: {
            marginTop: 6,
            color: 'white'
          }
        }}
      />
    </BottomTabs.Navigator >
  );
}

function RootNavigator() {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ModuleScreen"
            component={ModuleScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="QuestionScreen"
            component={QuestionScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ResultScreen"
            component={ResultScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProfileSettingScreen"
            component={ProfileSettingScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AchievementScreen"
            component={AchievementScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
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
          <Stack.Screen
            name="VerifyOTPScreen"
            component={OTPVerificationScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
      {/* <Stack.Screen name="LevelScreen" component={LevelScreen} /> */}
    </Stack.Navigator>
  )
}

export default function App() {
  // const [appIsReady, setAppIsReady] = useState(false);

  // useEffect(() => {
  //   async function prepare() {
  //     try {
  //       // Pre-load fonts, make any API calls you need to do here
  //       // Artificially delay for two seconds to simulate a slow loading
  //       // experience. Remove this if you copy and paste the code!
  //       await new Promise(resolve => setTimeout(resolve, 2000));
  //     } catch (e) {
  //       console.warn(e);
  //     } finally {
  //       // Tell the application to render
  //       setAppIsReady(true);
  //       console.log('App is ready');
  //     }
  //   }

  //   prepare();
  // }, []);

  // const onLayoutRootView = useCallback(() => {
  //   if (appIsReady) {
  //     SplashScreen.hide();
  //   }
  // }, [appIsReady]);

  // if (!appIsReady) {
  //   return null;
  // }

  return (
    <SafeAreaView style={style.container}>
      <Provider store={store}>
        <CopilotProvider style={{ top: 16 }}>
          <NavigationContainer
          // onReady={onLayoutRootView}
          >
            <RootNavigator />
            <Toast />
          </NavigationContainer>
        </CopilotProvider>
      </Provider>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1.
  }
})
