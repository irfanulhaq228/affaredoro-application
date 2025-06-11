import { View, Text, ToastAndroid, Linking, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import ButtonFilled from './ButtonFilled';
import { useTheme } from '../theme/ThemeProvider';

const LinkStripe = ({ navigation }: any) => {

  const { dark } = useTheme();




    const [isLoading, setIsLoading] = useState(false);



    const [data, setData] = useState<any>(null);


    const userSubmit = async () => {
        setIsLoading(true)
        try {
            const token = await AsyncStorage.getItem("token"); // Retrieve the stored token



            if (!token) {
                ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
                return;
            }

            const requestOptions: any = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pass the token here
                },
            };


            fetch(`${baseUrl}/users/get`, requestOptions)
                .then((response) => response.text())
                .then(async (result) => {
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        setData(resp?.data);
                        setIsLoading(false)
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false)
                    }
                    else if (resp.status === "fail") {
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false)
                    }
                })
                .catch((error) => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                    setIsLoading(false)
                });
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };




      useEffect(() => {
        userSubmit()
      }, []);


    const handleOnboard = async (stripeAccountId: any) => {
        setIsLoading(true);
        try {
            // 1. Get your stored auth token
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                ToastAndroid.show('Unauthorized: No token found', ToastAndroid.SHORT);
                return;
            }

            // 2. Define your redirect URLs (these must match what your backend expects)
            const refreshUrl = 'https://affaredoro.com/SettingsBankAccounts';
            const returnUrl = 'https://affaredoro.com/OnboardingSuccess';

            // 3. Build request options
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ stripeAccountId, refreshUrl, returnUrl }),
            };

            // 4. Call your onboardStripe API
            const response = await fetch(`${baseUrl}/users/onboardStripe`, requestOptions);
            const respJson = await response.json();

            // 5. Handle the response
            if (respJson.status === 'ok' && respJson.data?.url) {
                // Open Stripe's hosted onboarding page
                Linking.openURL(respJson.data.url);
            } else {
                // Show the error message from your API
                ToastAndroid.show(respJson.message || 'Onboarding failed', ToastAndroid.SHORT);
            }
        } catch (error: any) {
            console.error('Onboard error:', error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    };



    
    


    return (
        <SafeAreaView style={[ { flex:1,backgroundColor: dark ? COLORS.dark1 : COLORS.white, height: SIZES.height - 100, justifyContent: 'center', alignItems: 'center' }]}>

        <Text style={[{
          fontSize: 20,
          fontFamily: "Urbanist Bold",
          color: COLORS.black,
          marginHorizontal: 16,
          textAlign: 'center'
        }, {
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>
          Please connect your account to recieve a payment
        </Text>

        <ButtonFilled
          title="Connect"
          onPress={()=>{
            handleOnboard(data?.stripeAccountId)
            // navigation.navigate('OnboardingSuccess')
          }}
          style={{
            marginVertical: 20,
            width: SIZES.width - 72,
            borderRadius: 30
          }}
        />

      </SafeAreaView>
    )
}

export default LinkStripe