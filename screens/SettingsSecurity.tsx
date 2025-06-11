import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import GlobalSettingsItem from '../components/GlobalSettingsItem';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';



type Nav = {
    navigate: (value: string) => void
}

// Settings for security purposes
const SettingsSecurity = ({ navigation }: { navigation: any }) => {
    const { navigate } = useNavigation<Nav>();
    const [showCity, setCity] = useState(false);
    const [vacation, setVacation] = useState(false);
    const [emailLink, setEmailLink] = useState(false);
    const [facebookLink, setFacebookLink] = useState(false);
    const [phoneLink, setPhoneLink] = useState(false);
    const [wait, setWait] = useState(false)
    const { colors, dark } = useTheme();




    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '310039757931-lg37ahr39sug3npf8ok1omcg93pbh5si.apps.googleusercontent.com',
        });
    }, [])




    const [data, setData] = useState<any>(false);
    const [isLoading, setIsLoading] = useState(false);




    const submit = async () => {

        var mydata: any = await AsyncStorage.getItem('data');
        mydata = JSON.parse(mydata);

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
                .then(async(result) => {
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        setData(resp?.data);
                        setCity(resp?.data?.showCity);
                        setVacation(resp?.data?.vacation);
                        setEmailLink(resp?.data?.emailLink);
                        setFacebookLink(resp?.data?.facebookLink);
                        setPhoneLink(resp?.data?.phoneLink);

                    } else if (resp.status === "fail") {
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                      }
                })
                .catch((error) => {
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    useFocusEffect(
        useCallback(() => {
            submit();
        }, []))




    const submitData = async ({ showCity, vacation }: {
        showCity?: any,
        vacation?: any,

    }) => {

        try {


            setIsLoading(true)


            var mydata: any = await AsyncStorage.getItem('data');

            mydata = JSON.parse(mydata);


            const formdata = new FormData();

            if (showCity !== undefined) {
                formdata.append("showCity", showCity);
            }


            if (vacation !== undefined) {
                formdata.append("vacation", vacation);
            }



            const requestOptions: any = {
                method: "PUT",
                body: formdata,
                redirect: "follow"
            };




            fetch(`${baseUrl}/users/update/${mydata?._id}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    console.log(result)
                    const resp = JSON.parse(result)

                    if (resp.status === 'ok') {
                        ToastAndroid.show('Status updated successfully!', ToastAndroid.SHORT);
                        submit()
                    }

                })
                .catch((error) => {
                    ToastAndroid.show(error.message, 2000)
                    console.error(error)
                });



        } catch (error: any) {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
        };
    }







    const onGoogleButtonPress = async () => {


        var mydata: any = await AsyncStorage.getItem('data');

        mydata = JSON.parse(mydata);

        // Check if your device supports Google Play
        try {
            // await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const userInfo: any = await GoogleSignin.signIn();



            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(userInfo.data.idToken);

            // // Sign-in the user with the credential
            const checkautlogin = auth().signInWithCredential(googleCredential);

            // console.log(checkautlogin);

            //   setMyData({ userInfo });

            setWait(true)
            if (userInfo) {


                const formdata = new FormData();
                formdata.append("emailLink", true);

                const requestOptions: any = {
                    method: "PUT",
                    body: formdata,
                    redirect: "follow"
                };

                fetch(`${baseUrl}/users/update/${mydata?._id}`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const resp = JSON.parse(result)

                        if (resp.status === 'ok') {
                            setEmailLink(true)
                            ToastAndroid.show('Google Linked successful', 2000)
                            setWait(false)
                        }
                        else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                            setWait(false)
                        }

                    })
                    .catch((error) => {
                        ToastAndroid.show(error.message, 2000)
                        setWait(false)
                        console.error(error)
                    });

            }



        } catch (error: any) {
            //   setVisible(false)
            console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setWait(false)
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setWait(false)
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setWait(false)
                // play services not available or outdated
            } else {
                // some other error happened
                setWait(false)
            }
        }
    }



    const onFacebookButtonPress = async () => {
        try {

            var mydata: any = await AsyncStorage.getItem('data');

            mydata = JSON.parse(mydata);

            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                throw new Error('User cancelled the login process');
            }

            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                throw new Error('Something went wrong obtaining access token');
            }

            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

            const firebaseUserCredential: any = await auth().signInWithCredential(facebookCredential);

            console.log(firebaseUserCredential);

            setWait(true)


            if (firebaseUserCredential) {

                const formdata = new FormData();
                formdata.append("facebookLink", true);


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
                            ToastAndroid.show('Facebook authentication successful', 2000)
                            setWait(false)
                            submit()
                        }
                        else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                            setWait(false)
                        }

                    })
                    .catch((error) => {
                        console.error(error)
                        ToastAndroid.show(error.message, 2000)
                        setWait(false)
                    });



            }

        } catch (error: any) {
            console.log('Error:', error.message);
            setWait(false)
        }
    };




    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Security" navigation={navigation} />
                <ScrollView style={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
                    <GlobalSettingsItem
                        title="Show city in profile"
                        isNotificationEnabled={showCity}
                        toggleNotificationEnabled={() => { submitData({ showCity: !showCity }) }}
                    />
                    <GlobalSettingsItem
                        title="Vacation mode"
                        isNotificationEnabled={vacation}
                        toggleNotificationEnabled={() => { submitData({ vacation: !vacation }) }}
                    />

                    <View style={styles.view}>
                        <Text style={[styles.viewLeft, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Google</Text>
                        {dark ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (!emailLink) {
                                        onGoogleButtonPress();
                                    }
                                }}
                                disabled={emailLink ? true : false}
                                style={[styles.btn, {
                                    backgroundColor: emailLink ? "transparent" : COLORS.dark3,
                                    borderColor: emailLink ? COLORS.dark3 : COLORS.white,
                                    borderWidth: emailLink ? 1 : 0
                                }]}>
                                <Text style={[styles.btnText, { color: emailLink ? COLORS.white : COLORS.white }]}>
                                    {emailLink ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    if (!emailLink) {
                                        onGoogleButtonPress();
                                    }
                                }}
                                disabled={emailLink ? true : false}
                                style={[styles.btn, {
                                    backgroundColor: emailLink ? COLORS.white : COLORS.primary,
                                    borderColor: emailLink ? COLORS.primary : COLORS.white,
                                    borderWidth: 1
                                }]}>
                                <Text style={[styles.btnText, { color: emailLink ? COLORS.primary : COLORS.white }]}>
                                    {emailLink ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* <View style={styles.view}>
                        <Text style={[styles.viewLeft, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Facebook</Text>
                        {dark ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (!facebookLink) {
                                        onFacebookButtonPress();
                                    }
                                }}
                                disabled={facebookLink ? true : false}
                                style={[styles.btn, {
                                    backgroundColor: facebookLink ? "transparent" : COLORS.dark3,
                                    borderColor: facebookLink ? COLORS.dark3 : COLORS.white,
                                    borderWidth: facebookLink ? 1 : 0
                                }]}>
                                <Text style={[styles.btnText, { color: facebookLink ? COLORS.white : COLORS.white }]}>
                                    {facebookLink ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    if (!facebookLink) {
                                        onFacebookButtonPress();
                                    }
                                }}
                                disabled={facebookLink ? true : false}
                                style={[styles.btn, {
                                    backgroundColor: facebookLink ? COLORS.white : COLORS.primary,
                                    borderColor: facebookLink ? COLORS.primary : COLORS.white,
                                    borderWidth: 1
                                }]}>
                                <Text style={[styles.btnText, { color: facebookLink ? COLORS.primary : COLORS.white }]}>
                                    {facebookLink ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View> */}

                    {/* <View style={styles.view}>
                        <Text style={[styles.viewLeft, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Phone</Text>
                        {dark ? (
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('forgotpasswordphonenumber', { phoneLink: true }) }}
                                disabled={phoneLink ? true : false}
                                style={[styles.btn, {
                                    backgroundColor: phoneLink ? "transparent" : COLORS.dark3,
                                    borderColor: phoneLink ? COLORS.dark3 : COLORS.white,
                                    borderWidth: phoneLink ? 1 : 0
                                }]}>
                                <Text style={[styles.btnText, { color: phoneLink ? COLORS.white : COLORS.white }]}>
                                    {phoneLink ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('forgotpasswordphonenumber', { phoneLink: true }) }}
                                disabled={phoneLink ? true : false}
                                style={[styles.btn, {
                                    backgroundColor: phoneLink ? COLORS.white : COLORS.primary,
                                    borderColor: phoneLink ? COLORS.primary : COLORS.white,
                                    borderWidth: 1
                                }]}>
                                <Text style={[styles.btnText, { color: phoneLink ? COLORS.primary : COLORS.white }]}>
                                    {phoneLink ? "Linked" : "Link"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View> */}
                    {/* <Button
                        title="Change PIN"
                        style={{
                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            marginTop: 22
                        }}
                        textColor={dark ? COLORS.white : COLORS.black}
                        onPress={() => { navigate("changepin") }}
                    /> */}
                    <Button
                        title="Change Password"
                        style={{
                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            marginTop: 22
                        }}
                        textColor={dark ? COLORS.white : COLORS.black}
                        onPress={() => { navigation.navigate("changepassword", { email: data?.email, change: true }) }}
                    />
                    {/* <Button
                        title="Change Email"
                        style={{
                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            marginTop: 22
                        }}
                        textColor={dark ? COLORS.white : COLORS.black}
                        onPress={() => { navigate("changeemail") }}
                    /> */}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    btn: {
        width: 72,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: 16,
    },
    btnText: {
        fontFamily: "Urbanist Medium",
        color: COLORS.white,
        fontSize: 12,
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    scrollView: {
        marginVertical: 22
    },
    arrowRight: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900
    },
    view: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16
    },
    viewLeft: {
        fontSize: 18,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.greyscale900,
        marginRight: 8
    },
    button: {
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
        borderColor: COLORS.tansparentPrimary,
        marginTop: 22
    }
})

export default SettingsSecurity