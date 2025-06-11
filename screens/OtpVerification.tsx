import { View, Text, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { OtpInput } from "react-native-otp-entry";
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import auth from "@react-native-firebase/auth";
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderScreen from '../components/LoaderScreen';

type Nav = {
    navigate: (value: string) => void
}

const OTPVerification = ({ navigation, route }: { navigation: any, route: any }) => {
    const { navigate } = useNavigation<Nav>();

    const email = route?.params?.email
    const phoneLink = route?.params?.phoneLink
    const phone = route?.params?.phone
    const countryCode = route?.params?.countryCode
    const newconfirmation = route?.params?.confirmation
    const [confirmation, setConfirmation] = useState(newconfirmation);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [wait, setWait] = useState(false)




    const [time, setTime] = useState(59);
    const { colors, dark } = useTheme();

    useEffect(() => {
        setConfirmation(newconfirmation);
        const intervalId = setInterval(() => {
            setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [newconfirmation]);


    const sendOtp = async () => {
        try {

            const confirmationResult: any = await auth().signInWithPhoneNumber(phone + countryCode);
            setConfirmation(confirmationResult);
            setTime(59)
            ToastAndroid.show("Please enter the OTP sent to your phone.", 2000);
        } catch (error: any) {
            ToastAndroid.show(error.message, 2000);
        }
    };



    const submit = async () => {
        setIsLoading(true);

        try {
            const formdata = {
                "email": email,
            };

            const requestOptions: any = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata), // Convert formdata to JSON string
            };

            fetch(`${baseUrl}/users/checkData`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    console.log(result);
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        // sendOtp()
                        setTime(59)
                        setIsLoading(false);
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);

                    } else if (resp.status === "fail") {
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                    setIsLoading(false);
                });
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };


    const verifyOtp = async () => {
        try {

            setIsLoading(true);
            if (otp.length !== 6) {
                ToastAndroid.show("Please enter a valid OTP.", 2000);
                setIsLoading(false);
                return;
            }
            if (!confirmation) {
                await newconfirmation.confirm(otp);
            }
            else {
                await confirmation.confirm(otp);
            }

            if (phoneLink) {

                var mydata: any = await AsyncStorage.getItem('data');
                mydata = JSON.parse(mydata);

                const formdata = new FormData();
                formdata.append("phoneLink", true);


                console.log(mydata?._id);


                const requestOptions: any = {
                    method: "PUT",
                    body: formdata,
                    redirect: "follow"
                };

                fetch(`${baseUrl}/users/update/${mydata?._id}`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const resp = JSON.parse(result)
                        console.log(resp)

                        if (resp.status === 'ok') {
                            ToastAndroid.show('Phone authentication successful', 2000)
                            setWait(false)
                            navigation.navigate('settingssecurity')
                            setIsLoading(false);
                        }
                        else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                            setWait(false)
                            setIsLoading(false);
                        }

                    })
                    .catch((error) => {
                        console.error(error)
                        ToastAndroid.show(error.message, 2000)
                        setWait(false)
                        setIsLoading(false);
                    });



            }
            else {
                navigation.replace('changepassword', { phone, countryCode });
                ToastAndroid.show("Phone number verified successfully!", 2000);
                setIsLoading(false);
            }


        } catch (error) {
            ToastAndroid.show("Invalid OTP. Please try again.", 2000);
            setIsLoading(false);
        }
    };



    const verify = async () => {
        setIsLoading(true);

        try {
            const formdata = {
                "email": email,
                "otp": otp
            };

            const requestOptions: any = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formdata), // Convert formdata to JSON string
            };

            fetch(`${baseUrl}/users/verifyOtp`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    console.log(result);
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        // sendOtp()
                        navigation.replace('changepassword', { email });
                        setIsLoading(false);
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);

                    } else if (resp.status === "fail") {
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false);
                    }
                })
                .catch((error) => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    setIsLoading(false);
                    console.error(error);
                });
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
        {isLoading && <LoaderScreen/>}
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Forgot Password" navigation={navigation} />
                <ScrollView>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.black
                    }]}>Code has been send to {phone ? countryCode + phone : email}</Text>
                    <OtpInput
                        numberOfDigits={6}
                        onTextChange={(text) => console.log(text)}
                        focusColor={COLORS.primary}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => {
                            setOtp(text)
                            console.log(`OTP is ${text}`)
                        }}
                        theme={{
                            pinCodeContainerStyle: {
                                backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite,
                                borderColor: dark ? COLORS.gray : COLORS.secondaryWhite,
                                borderWidth: .4,
                                borderRadius: 10,
                                height: 48,
                                width: 48,
                            },
                            pinCodeTextStyle: {
                                color: dark ? COLORS.white : COLORS.black,
                            }
                        }} />
                    <View style={styles.codeContainer}>
                        {time !== 0 ? <>
                            <Text style={[styles.code, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>Resend code in</Text>
                            <Text style={[styles.time, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>{`  ${time}  `}</Text>
                            <Text style={[styles.code, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>s</Text>
                        </> :
                            <TouchableOpacity onPress={() => {
                                if (phone) {
                                    sendOtp()
                                }
                                else if (email) {
                                    submit()
                                }
                            }}>
                                <Text style={[styles.code, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textDecorationLine: 'underline'
                                }]}>Resend code</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>
                <ButtonFilled
                    title="Verify"
                    style={styles.button}
                    onPress={() => {
                        if (phone) {
                            verifyOtp()
                        }
                        else if (email) {
                            verify()
                        }
                    }}
                />
            </View>
        </SafeAreaView>

        </>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white
    },
    title: {
        fontSize: 18,
        fontFamily: "Urbanist Medium",
        color: COLORS.greyscale900,
        textAlign: "center",
        marginVertical: 54
    },
    OTPStyle: {
        borderRadius: 8,
        height: 58,
        width: 58,
        backgroundColor: COLORS.secondaryWhite,
        borderBottomColor: "gray",
        borderBottomWidth: .4,
        borderWidth: .4,
        borderColor: "gray"
    },
    codeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
        justifyContent: "center"
    },
    code: {
        fontSize: 18,
        fontFamily: "Urbanist Medium",
        color: COLORS.greyscale900,
        textAlign: "center"
    },
    time: {
        fontFamily: "Urbanist Medium",
        fontSize: 18,
        color: COLORS.primary
    },
    button: {
        borderRadius: 32
    }
})

export default OTPVerification