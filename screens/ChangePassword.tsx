import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableWithoutFeedback, Modal, Platform, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Input from '../components/Input';
import CheckBox from '@react-native-community/checkbox';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';



const ChangePassword = ({ navigation, route }: { navigation: any, route: any }) => {
  const countryCode = route?.params?.countryCode
  const phone = route?.params?.phone
  const email = route?.params?.email
  const change = route?.params?.change
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState<any>(null);
  const [passwordHide, setPasswordHide] = useState<any>(true);
  const [cpassword, setCPassword] = useState<any>(null);
  const [cpasswordHide, setCPasswordHide] = useState<any>(true);
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, dark } = useTheme();



  
  
    const submit = async () => {
      setIsLoading(true);
    
      if (!password ||!cpassword) {
        ToastAndroid.show("Password and Confirm Password are required", 2000);
        setIsLoading(false);
        return;
      }
      if (password!== cpassword) {
        ToastAndroid.show("Password and Confirm Password do not match", 2000);
        setIsLoading(false);
        return;
      }
     
      try {
        const formdata = {
          "password": password,
        };
    
        const requestOptions: any = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata), // Convert formdata to JSON string
        };
    
        fetch(`${baseUrl}/users/updatePassword?${email?`email=${email}`:`phone=${phone}&countryCode=${countryCode}`}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            const resp = JSON.parse(result);
    
            if (resp.status === "ok") {
              setModalVisible(true);
              setIsLoading(false);
              ToastAndroid.show('Password updated successfully!', ToastAndroid.SHORT);
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
        setIsLoading(false);
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  




  // Render modal
  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalSubContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
              <Image
                source={dark ? illustrations.passwordSuccessResetDark : illustrations.passwordSuccess}
                resizeMode='contain'
                style={styles.modalIllustration}
              />
              <Text style={[styles.modalTitle, {
                color: dark ? COLORS.white : COLORS.black
              }]}>Congratulations!</Text>
              <Text style={[styles.modalSubtitle, {
                color: dark ? COLORS.grayscale200 : COLORS.greyscale600
              }]}>Your account is ready to use. You will be redirected to the Home page in a few seconds..</Text>
              <ButtonFilled
                title="Continue"
                onPress={() => {
                  setModalVisible(false)
                  if(change){
                    navigation.goBack()
                  }
                  else{
                    navigation.replace('login')
                  }
                }}
                style={{
                  width: "100%",
                  marginTop: 12
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  return (
    <>

    {isLoading && <LoaderScreen/>}
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Change Password" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image
              source={dark ? illustrations.passwordSuccessDark : illustrations.newPassword}
              resizeMode='contain'
              style={styles.success}
            />
          </View>
          <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>Reset Password</Text>
          {/* <Input
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['password']}
            autoCapitalize="none"
            id="password"
            placeholder="Old Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={true}
          /> */}
          
          <Input
            onInputChanged={(id,value) => {
              setPassword(value)
            }}
            errorText={!password && error ? 'Please enter your password' : ''}
            autoCapitalize="none"
            id="newPassword"
            placeholder="New Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={passwordHide}
            icon1={passwordHide?icons.hide:icons.show}
            onPress1={() => {
              setPasswordHide(!passwordHide)
            }}
          />
          
          <Input
            onInputChanged={(id,value) => {
              setCPassword(value)
            }}
            errorText={!cpassword && error ? 'Please enter your password' : ''}
            autoCapitalize="none"
            id="confirmNewPassword"
            placeholder="Confirm New Password"
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            icon={icons.padlock}
            secureTextEntry={cpasswordHide}
            icon1={cpasswordHide?icons.hide:icons.show}
            onPress1={() => {
              setCPasswordHide(!cpasswordHide)
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
                <Text style={[styles.privacy, { color: dark ? COLORS.white : COLORS.black }]}>Remember me</Text>
              </View>
            </View>
          </View>
          <View>
          </View>
        </ScrollView>
        <ButtonFilled
          title="Continue"
          onPress={submit}
          style={styles.button}
        />
        {renderModal()}
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
  success: {
    width: SIZES.width * 0.8,
    height: 250
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 52
  },
  title: {
    fontSize: 18,
    fontFamily: "Urbanist Medium",
    color: COLORS.black,
    marginVertical: 12
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginVertical: 18,
    position: "absolute",
    bottom: 12,
    right: 0,
    left: 0,
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
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Urbanist Bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.greyscale600,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  modalSubContainer: {
    height: 494,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22
  }
})

export default ChangePassword