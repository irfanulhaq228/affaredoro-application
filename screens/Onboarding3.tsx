import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageContainer from '../components/PageContainer';
import DotsView from '../components/DotsView';
import Onboarding1Styles from '../styles/OnboardingStyles';
import { COLORS, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import ButtonOutlined from '../components/ButtonOutlined';
import { useNavigation } from '@react-navigation/native';

type Nav = {
  navigate: (value: string) => void
}

const Onboarding3 = () => {
  const { navigate } = useNavigation<Nav>();
  const [progress, setProgress] = useState(0);
  const { colors, dark } = useTheme();
  // add useEffect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 1) {
          clearInterval(intervalId);
          return prevProgress;
        }
        return prevProgress + 0.5;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (progress >= 1) {
      // navigate to the onboarding4 screen
      // navigate('onboarding4')
    }
  }, [progress, navigate]);

  return (
    <SafeAreaView style={[Onboarding1Styles.container, { backgroundColor: colors.background }]}>
      <PageContainer>
        <View style={Onboarding1Styles.contentContainer}>
          <Image
            source={illustrations.onboarding3}
            resizeMode="contain"
            style={Onboarding1Styles.illustration}
          />
          <View style={[Onboarding1Styles.buttonContainer, {
            backgroundColor: colors.background
          }]}>
            <View style={Onboarding1Styles.titleContainer}>
              <Text style={[Onboarding1Styles.title, { color: colors.text }]}>Select What You</Text>
              <Text style={[Onboarding1Styles.subTitle, {
                color: dark ? COLORS.white : COLORS.primary
              }]}> LOVE</Text>
            </View>
            <Text style={[Onboarding1Styles.description, { color: colors.text }]}>
              Your statisfaction is our number one priority. Find the best deals on the items you love.
            </Text>
            <View style={Onboarding1Styles.dotsContainer}>
              {/* {progress < 1 && <DotsView progress={progress} numDots={4} />} */}
            </View>
            <ButtonFilled
              title="Next"
              onPress={() => navigate('onboarding4')}
              style={Onboarding1Styles.nextButton}
            />
            <ButtonOutlined
              title="Skip"
              onPress={() => navigate('login')}
              style={Onboarding1Styles.skipButton}
            />
          </View>
        </View>
      </PageContainer>
    </SafeAreaView>
  );
};

export default Onboarding3;