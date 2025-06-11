import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Platform, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? 'example@gmail.com' : '',
  },
  inputValidities: {
    email: false
  },
  formIsValid: false,
}

type Nav = {
  navigate: (value: string) => void
}

const ForgotPasswordEmail = ({navigation}:{navigation:any}) => {
  const { navigate } = useNavigation<Nav>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState<any>(null);
  const [isChecked, setChecked] = useState(false);
  const { colors, dark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  




    
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
                navigation.navigate('otpverification',{email: email})
                setIsLoading(false);
                ToastAndroid.show(resp.message, ToastAndroid.SHORT);

              } else if (resp.status === "fail") {
                setIsLoading(false);
                ToastAndroid.show(resp.message, ToastAndroid.SHORT);
              }
            })
            .catch((error) => {
              setIsLoading(false);
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
              console.error(error);
            });
        } catch (error: any) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          console.error(error);
          setIsLoading(false);
        } finally {
          // setIsLoading(false);
        }
      };


  return (
    <>

{isLoading && <LoaderScreen/>}

    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Forgot Password" navigation={navigation} />
        <ScrollView style={{ paddingVertical: 54 }} showsVerticalScrollIndicator={false}>
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
          }]}>Enter to Your Email</Text>
          <Input
            id="email"
            onInputChanged={(id,value) => {
              setEmail(value)
            }}
            errorText={!email && error ? 'Please enter your email' : ''}
            placeholder="Email"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.email}
            keyboardType="email-address"
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
                }]}>Remember me</Text>
              </View>
            </View>
          </View>
          <ButtonFilled
            title="Reset Password"
            onPress={() => {
              // navigate("otpverification")
              submit()
            }}
            style={styles.button}
          />
          <TouchableOpacity
            onPress={() => navigate("login")}>
            <Text style={[styles.forgotPasswordBtnText, {
              color: dark ? COLORS.white : COLORS.primary
            }]}>Remember the password?</Text>
          </TouchableOpacity>
          <View>
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
 </> )
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
    marginVertical: 32,
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
    marginRight: Platform.OS == "ios" ? 8 : 14,
    marginLeft: 4,
    height: 16,
    width: 16,
    borderColor: COLORS.primary,
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

export default ForgotPasswordEmail