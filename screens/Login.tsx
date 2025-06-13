import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Platform, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import SocialButton from '../components/SocialButton';
import OrSeparator from '../components/OrSeparator';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken, LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import LoaderScreen from '../components/LoaderScreen';
import SocialButtonV2 from '../components/SocialButtonV2';




type Nav = {
  navigate: (value: string) => void
}

const Login = ({ navigation }: { navigation: any }) => {
  const { navigate } = useNavigation<Nav>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [password, setPassword] = useState<any>(null);
  const [passwordHide, setPasswordHide] = useState<any>(true);
  const [isChecked, setChecked] = useState(false);
  const [wait, setWait] = useState(false)
  const { colors, dark } = useTheme();



  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '310039757931-lg37ahr39sug3npf8ok1omcg93pbh5si.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, [])




  const storedata = async (data: any, token: any, login?: any) => {
    try {
      await AsyncStorage.setItem("data", JSON.stringify(data));
      await AsyncStorage.setItem("token", JSON.stringify(token));
      await AsyncStorage.setItem("login", JSON.stringify(login));
    } catch (error) {
      console.log(error);
    }
  };







  const submit = async () => {
    await AsyncStorage.clear();
    setIsLoading(true);

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    try {
      const formdata = {
        email,
        password,
      };

      const requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata), // Convert formdata to JSON string
      };

      fetch(`${baseUrl}/users/login`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const resp = JSON.parse(result);
          console.log("----", resp);
          if (resp.status === "ok") {
            storedata(resp.data, resp?.token, true);
            navigation?.replace("(tabs)");
            ToastAndroid.show(resp.message, 2000)
            setIsLoading(false)
          } else if (resp.status === "move") {
            storedata(resp.data, resp?.token);
            navigation?.replace("fillyourprofile");
            setIsLoading(false)
          } else if (resp.status === "fail") {
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
        })
        .catch((error) => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          setIsLoading(false)
          console.error(error);
        });
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      setIsLoading(false)
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  // Implementing apple authentication
  const appleAuthHandler = () => {
    console.log("Apple Authentication")
  };








  const onGoogleButtonPress = async () => {

    setIsLoading(true)
    await AsyncStorage.clear()

    // Check if your device supports Google Play
    try {
      // await GoogleSignin.revokeAccess();
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

      setWait(true)
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
            console.error(error)
            setIsLoading(false)
          });

      }



    } catch (error: any) {
      //   setVisible(false)
      console.log(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setWait(false)
        setIsLoading(false)
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setWait(false)
        setIsLoading(false)
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setWait(false)
        setIsLoading(false)
        // play services not available or outdated
      } else {
        // some other error happened
        setWait(false)
        setIsLoading(false)
      }
    }
  }



  const onFacebookButtonPress = async () => {
    setIsLoading(true)
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        setIsLoading(false)
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        setIsLoading(false)
        throw new Error('Something went wrong obtaining access token');
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      const firebaseUserCredential: any = await auth().signInWithCredential(facebookCredential);

      console.log(firebaseUserCredential);

      setWait(true)


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

    <SafeAreaView style={[styles.area, {
      backgroundColor: colors.background
    }]}>
      <View style={[styles.container, {
        backgroundColor: colors.background
      }]}>
        <Header title="" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={[styles.logo, {
                tintColor: dark ? COLORS.golden : COLORS.black
              }]}
            />
          </View>
          <Text style={[styles.title, {
            color: dark ? COLORS.white : COLORS.black
          }]}>Login to Your Account</Text>
          <Input
            id="email"
            onInputChanged={(id, value) => {
              setEmail(value)
            }}
            errorText={!email && error ? 'Please enter your email' : ''}
            placeholder="Email"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
          />
          <Input
            onInputChanged={(id, value) => {
              setPassword(value)
            }}
            errorText={!password && error ? 'Please enter your password' : ''}
            autoCapitalize="none"
            id="password"
            placeholder="Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={passwordHide}
            icon1={passwordHide ? icons.hide : icons.show}
            onPress1={() => {
              setPasswordHide(!passwordHide)
            }}
          />
          <View style={styles.checkBoxContainer}>
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                style={styles.checkbox}
                value={isChecked}
                boxType="square"
                onTintColor={isChecked ? dark ? COLORS.white : COLORS.primary : COLORS.gray}
                onFillColor={isChecked ? dark ? COLORS.white : COLORS.primary : COLORS.gray}
                onCheckColor={COLORS.white}
                onValueChange={setChecked}
                tintColors={{ true: dark ? COLORS.white : COLORS.primary, false: COLORS.gray }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.privacy, {
                  color: dark ? COLORS.white : COLORS.black
                }]}>Remenber me</Text>
              </View>
            </View>
          </View>
          <ButtonFilled
            title="Login"
            onPress={submit}
            style={styles.button}
          />
          <TouchableOpacity
            onPress={() => navigate("forgotpasswordmethods")}>
            <Text style={[styles.forgotPasswordBtnText, {
              color: dark ? COLORS.white : COLORS.primary
            }]}>Forgot the password?</Text>
          </TouchableOpacity>
          <View>
            <OrSeparator text="or continue with" mainStyle={{marginBottom:5}}/>
            <View style={styles.socialBtnContainer}>
              {/* <SocialButton
                icon={icons.appleLogo}
                onPress={appleAuthHandler}
                tintColor={dark ? COLORS.white : COLORS.black}
              /> */}
              {/* <SocialButton
                icon={icons.facebook}
                onPress={onFacebookButtonPress}
              /> */}

              <SocialButtonV2 title="Continue with Google" icon={icons.google} onPress={() => {
            // navigate("signup")

            onGoogleButtonPress()
          }} />
              {/* <SocialButton
                icon={icons.google}
                onPress={onGoogleButtonPress}
              /> */}
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={[styles.bottomLeft, {
              color: dark ? COLORS.white : COLORS.black
            }]}>Don't have an account ?</Text>
            <TouchableOpacity
              onPress={() => navigate("signup")}>
              <Text style={[styles.bottomRight, {
                color: dark ? COLORS.white : COLORS.primary
              }]}>{"  "}Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingBottom: 0,
    backgroundColor: COLORS.white
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 22
  },
  checkBoxContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  checkbox: {
    marginRight: Platform.OS === "ios" ? 8 : 14,
    height: 16,
    width: 16,
    borderRadius: 4,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginLeft: 2
  },
  privacy: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
  },
  socialTitle: {
    fontSize: 19.25,
    fontFamily: "Urbanist Medium",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 26
  },
  socialBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  bottomLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: "black"
  },
  bottomRight: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary
  },
  button: {
    marginVertical: 6,
    width: SIZES.width - 32,
    borderRadius: 30
  },
  forgotPasswordBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 12
  }
})

export default Login