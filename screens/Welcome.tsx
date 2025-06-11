import { View, Text, StyleSheet, Image, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, icons, images } from "../constants";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import SocialButtonV2 from "../components/SocialButtonV2";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../constants/baseUrl";
import LoaderScreen from "../components/LoaderScreen";



// Welcome screen
const Welcome = ({ navigation }: { navigation: any }) => {

  const [wait, setWait] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { navigate } = useNavigation<any>();
  const { colors, dark } = useTheme();


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '310039757931-lg37ahr39sug3npf8ok1omcg93pbh5si.apps.googleusercontent.com',
    });
  }, [])



  const storedata = async (data: any, token: any, login?: any) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
      await AsyncStorage.setItem("token", JSON.stringify(token));
      if(login){
        await AsyncStorage.setItem("login", JSON.stringify(login));
      }

    } catch (error) {
      console.log(error);
    }
  };



  const onGoogleButtonPress = async () => {


    await AsyncStorage.clear()

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
      setIsLoading(true)
      if (userInfo) {


        const formdata = new FormData();
        formdata.append("fullName", userInfo?.data.user?.name);
        formdata.append("email", userInfo?.data.user?.email);
        formdata.append("username", userInfo?.data.user?.givenName);
        formdata.append("image", userInfo?.data.user?.photo);
        formdata.append("emailLink", true);


        const requestOptions: any = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };

        fetch(`${baseUrl}/users/registerSocial`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resp = JSON.parse(result)

            console.log(resp);
            
            if (resp.status === 'ok') {
              storedata(resp.data, resp?.token, true)
              ToastAndroid.show('Google authentication successful', 2000)
              navigation.replace('(tabs)')
              setWait(false)
              setIsLoading(false)
            } 
            else if (resp.status === 'move') {
              storedata(resp.data, resp?.token)
              ToastAndroid.show('Google authentication successful', 2000)
              navigation.replace('fillyourprofile')
              setWait(false)
              setIsLoading(false)
            }
            else if (resp.status === 'fail') {
              ToastAndroid.show(resp.message, 2000)
              setWait(false)
              setIsLoading(false)
            }

          })
          .catch((error) => {
            ToastAndroid.show(error.message, 2000)
            setWait(false)
            setIsLoading(false)
            console.error(error)
          });

      }



    } catch (error: any) {
      //   setVisible(false)
      console.log(error)
      setIsLoading(false)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setWait(false)
        setIsLoading(false)
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
      setIsLoading(true)

      if (firebaseUserCredential) {

        const formdata = new FormData();
        formdata.append("fullName", firebaseUserCredential.additionalUserInfo.profile?.name);
        formdata.append("email", firebaseUserCredential.additionalUserInfo.profile?.email);
        formdata.append("username", firebaseUserCredential.user?.displayName);
        formdata.append("image", firebaseUserCredential?.user?.photoURL);
        formdata.append("facebookLink", true);

        const requestOptions: any = {
          method: "POST",
          body: formdata,
          redirect: "follow"
        };

        fetch(`${baseUrl}/users/registerSocial`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resp = JSON.parse(result)
            console.log(resp.status)

            if (resp.status === 'ok') {
              storedata(resp.data, resp?.token, true)
              ToastAndroid.show('Facebook authentication successful', 2000)
              navigation.replace('(tabs)')
              setWait(false)
              setIsLoading(false)
            } 
            else if (resp.status === 'move') {
              storedata(resp.data, resp?.token)
              ToastAndroid.show('Facebook authentication successful', 2000)
              navigation.replace('fillyourprofile')
              setWait(false)
              setIsLoading(false)
            }
            else if (resp.status === 'fail') {
              ToastAndroid.show(resp.message, 2000)
              setWait(false)
              setIsLoading(false)
            }

          })
          .catch((error) => {
            console.error(error)
            ToastAndroid.show(error.message, 2000)
            setWait(false)
            setIsLoading(false)
          });



      }

    } catch (error: any) {
      console.log('Error:', error.message);
      setWait(false)
      setIsLoading(false)
    }
  };









  return (
    <>

{isLoading && <LoaderScreen/>}

    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={images.logo}
          resizeMode="contain"
          style={[styles.logo, { tintColor: dark ? COLORS.golden : COLORS.black }]}
        />
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back!</Text>
        <Text style={[styles.subtitle, { color: dark ? COLORS.white : "black" }]}>
          Hello there, continue with and search your favourites products easly on Affare Doro.
        </Text>
        <View style={{ marginVertical: 32 }}>
          {/* <SocialButtonV2 title="Continue with Apple" icon={icons.appleLogo} onPress={() => navigate("signup")}
            iconStyles={{ tintColor: dark ? COLORS.white : COLORS.black }} /> */}
          <SocialButtonV2 title="Continue with Google" icon={icons.google} onPress={() => {
            // navigate("signup")

            onGoogleButtonPress()
          }} />
          {/* <SocialButtonV2 title="Continue with Facebook" icon={icons.facebook} onPress={() => {
            onFacebookButtonPress()
            // navigate("signup")
          }} /> */}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.loginTitle, {
            color: dark ? COLORS.white : "black"
          }]}>Already have account? </Text>
          <TouchableOpacity
            onPress={() => navigate("login")}>
            <Text style={[styles.loginSubtitle, {
              color: dark ? COLORS.white : COLORS.primary,
            }]}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={[styles.bottomTitle, {
          color: dark ? COLORS.white : COLORS.black
        }]}>
          By continuing, you accept the Terms Of Use and
        </Text>
        <TouchableOpacity onPress={() => navigate("login")}>
          <Text style={[styles.bottomSubtitle, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Privacy Policy.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

    </>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 22,
    marginTop: -22,
  },
  title: {
    fontSize: 28,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    marginVertical: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: "black",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  loginTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: "black",
  },
  loginSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 32,
    right: 0,
    left: 0,
    width: SIZES.width - 32,
    alignItems: "center",
  },
  bottomTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
  },
  bottomSubtitle: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
    textDecorationLine: "underline",
    marginTop: 2,
  },
});

export default Welcome;