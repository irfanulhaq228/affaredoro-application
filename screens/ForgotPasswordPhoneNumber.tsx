import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput, Image, Platform, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import Header from '../components/Header';
import CheckBox from '@react-native-community/checkbox';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import auth from "@react-native-firebase/auth";
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

type Nav = {
  navigate: (value: string) => void
}

const ForgotPasswordPhoneNumber = ({navigation, route}:{navigation:any, route:any}) => {
  const { navigate } = useNavigation<Nav>();

  const phoneLink= route?.params?.phoneLink

  const [error, setError] = useState(null);
  const [isChecked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors, dark } = useTheme();


  // Fetch codes from rescountries api
  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(response => response.json())
      .then(data => {
        let areaData = data.map((item: any) => {
          return {
            code: item.alpha2Code,
            item: item.name,
            callingCode: `+${item.callingCodes[0]}`,
            flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
          }
        });

        setAreas(areaData);
        if (areaData.length > 0) {
          let defaultData = areaData.filter((a: any) => a.code == "US");

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0])
          }
        }
      })
  }, []);



    

  



  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const sendOtp = async () => {
    try {
      setIsLoading(true);
      if (phoneNumber.length < 10) {
        setIsLoading(false);
        ToastAndroid.show("Please enter a valid 10-digit phone number", 2000);
        return;
      }
      const confirmationResult: any = await auth().signInWithPhoneNumber(selectedArea?.callingCode + phoneNumber);
      navigation.navigate('otpverification',{confirmation:confirmationResult, phone: phoneNumber, countryCode: selectedArea?.callingCode, phoneLink:true})
      setConfirmation(confirmationResult);
      ToastAndroid.show("Please enter the OTP sent to your phone.", 2000);
      setIsLoading(false);
    } catch (error: any) {
      ToastAndroid.show(error.message, 2000);
      setIsLoading(false);
    }
  };



  const submit = async () => {
    setIsLoading(true);
  
    try {
      const formdata = {
        "phone":phoneNumber,
        "countryCode": selectedArea?.callingCode,
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
            sendOtp()
            setIsLoading(false);
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
      // setIsLoading(false);
    }
  };

  // Render countries codes modal
  function RenderAreasCodesModal() {

    const renderItem = ({ item }: { item: any }) => {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: "row"
          }}
          onPress={() => {
            setSelectedArea(item),
              setModalVisible(false)
          }}>
          <Image
            source={{ uri: item.flag }}
            resizeMode='contain'
            style={{
              height: 30,
              width: 30,
              marginRight: 10
            }}
          />
          <Text style={{ fontSize: 16, color: "#fff" }}>{item.item}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.primary,
                borderRadius: 12
              }}>
              <FlatList
                data={areas}
                renderItem={renderItem}
                horizontal={false}
                keyExtractor={(item) => item.code}
                style={{
                  padding: 20,
                  marginBottom: 20
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
          }]}>Enter Your Phone Number</Text>
          <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500 }]}>
            <TouchableOpacity
              style={styles.selectFlagContainer}
              onPress={() => setModalVisible(true)}>
              <View style={{ justifyContent: "center" }}>
                <Image
                  source={icons.down}
                  resizeMode='contain'
                  style={styles.downIcon}
                />
              </View>
              <View style={{ justifyContent: "center", marginLeft: 5 }}>
                <Image
                  source={{ uri: selectedArea?.flag }}
                  resizeMode="contain"
                  style={styles.flagIcon}
                />
              </View>
              <View style={{ justifyContent: "center", marginLeft: 5 }}>
                <Text style={{ color: dark ? COLORS.white : COLORS.black, fontSize: 12 }}>{selectedArea?.callingCode}</Text>
              </View>
            </TouchableOpacity>
            {/* Phone Number Text Input */}
            <TextInput
              style={[styles.input, { color: dark ? COLORS.white : COLORS.black }]}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.gray}
              selectionColor="#111"
              keyboardType="numeric"
              onChangeText={(value) => setPhoneNumber(value)}
            />
          </View>
          {phoneLink?null:<View style={styles.checkBoxContainer}>
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
          </View>}
          <ButtonFilled
            title={phoneLink?"Verify Phone":"Reset Password"}
            onPress={() => {
              // navigate("otpverification")
              submit()
            }}
            style={styles.button}
          />
          {phoneLink?null:<TouchableOpacity
            onPress={() => navigate("login")}>
            <Text style={[styles.forgotPasswordBtnText, {
              color: dark ? COLORS.white : COLORS.primary
            }]}>Remember the password?</Text>
          </TouchableOpacity>}
          <View>
          </View>
          {phoneLink?null:<View style={styles.bottomContainer}>
            <Text style={[styles.bottomLeft, {
              color: dark ? COLORS.white : COLORS.black
            }]}>Don't have an account ?</Text>
            <TouchableOpacity
              onPress={() => navigate("signup")}
            >
              <Text style={[styles.bottomRight, {
                color: dark ? COLORS.white : COLORS.primary
              }]}>{" "}Sign Up</Text>
            </TouchableOpacity>
          </View>}
        </ScrollView>
      </View>
      {RenderAreasCodesModal()}
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
    marginVertical: 18,
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
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: .4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: "#111"
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  flagIcon: {
    width: 30,
    height: 30
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,
    color: "#111"
  }
})

export default ForgotPasswordPhoneNumber