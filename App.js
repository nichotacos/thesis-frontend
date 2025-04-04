import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from './screens/OnboardingScreen';
import { useState } from 'react';

export default function App() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex(prevIndex => prevIndex + 1);
  };

  const handleSkip = () => {
    console.log("Onboarding skipped");
    // You might navigate to the main app screen here
  };

  return (
    <SafeAreaView style={style.container}>
      <OnboardingScreen onNext={handleNext} onSkip={handleSkip} />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1.
  }
})
