import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';
import DatePickerModal from '../components/DatePickerModal';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ShowCategoryModal from '../components/ShowCategoryModal';
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';



// console.log(State.getAllStates())


interface Item {
  flag: string;
  item: string;
  code: string
}

interface RenderItemProps {
  item: Item;
}

const BillingAddress = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [billingFullName, setBillingFullName] = useState<any>(null);
  const [billingCountry, setBillingCountry] = useState<any>(null);
  const [billingAddress1, setBillingAddress1] = useState<any>(null);
  const [billingAddress2, setBillingAddress2] = useState<any>(null);
  const [billingZipCode, setBillingZipCode] = useState<any>(null);
  const [billingCity, setBillingCity] = useState<any>(null);
  const { dark } = useTheme();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);



  const submit = async () => {

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

            setBillingFullName(resp?.data?.billingFullName)
            setBillingAddress1(resp?.data?.billingAddress1)
            setBillingCountry(resp?.data?.billingCountry)
            setBillingAddress2(resp?.data?.billingAddress2)
            setBillingCity(resp?.data?.billingCity)
            setBillingZipCode(resp?.data?.billingZipCode)

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


  useFocusEffect(useCallback(() => {
    submit();
  }, []))




  const submitData = async () => {


    try {


      setIsLoading(true)


      var mydata: any = await AsyncStorage.getItem('data');

      mydata = JSON.parse(mydata);


      const formdata = new FormData();

      if (billingFullName !== data?.billingFullName) {
        formdata.append("billingFullName", billingFullName);
      }
      if (billingCountry !== data?.billingCountry) {
        formdata.append("billingCountry", billingCountry);
      }
      if (billingAddress1 !== data?.billingAddress1) {
        formdata.append("billingAddress1", billingAddress1);
      }
      if (billingAddress2 !== data?.billingAddress2) {
        formdata.append("billingAddress2", billingAddress2);
      }
      if (billingZipCode !== data?.billingZipCode) {
        formdata.append("billingZipCode", billingZipCode);
      }
      if (billingCity !== data?.billingCity) {
        formdata.append("billingCity", billingCity);
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
            ToastAndroid.show('Billing Address updated successfully!', ToastAndroid.SHORT);
            navigation?.goBack()
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



  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Manage Billing Address" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 20 }}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginVertical: 0 }}>
                <View
                  style={{
                    marginTop: 0,
                    width: SIZES.width - 32,
                  }}>
                  <Text style={[{
                    ...FONTS.body4,
                    marginVertical: 4,
                    fontFamily: "Urbanist SemiBold",
                  }, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>
                    Full name
                  </Text>
                  <Input
                    id="billingFullName"
                    onInputChanged={(id, value) => {
                      setBillingFullName(value)
                    }}
                    defaultValue={billingFullName?billingFullName:data?.fullName}
                    placeholder="M Adnan"
                  />
                </View>
                <View
                  style={{
                    marginTop: 0,
                    width: SIZES.width - 32,
                  }}>
                  <Text style={[{
                    ...FONTS.body4,
                    marginVertical: 4,
                    fontFamily: "Urbanist SemiBold",
                  }, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>
                    Country
                  </Text>
                  <Input
                    id="billingCountry"
                    onInputChanged={(id, value) => {
                      setBillingCountry(value)
                    }}
                    defaultValue={billingCountry?billingCountry:data?.country}
                    placeholder="3235 Royal Ln. mesa, new jersy 34567" 
                  />
                </View>
                <View
                  style={{
                    marginTop: 0,
                    width: SIZES.width - 32,
                  }}>
                  <Text style={[{
                    ...FONTS.body4,
                    marginVertical: 4,
                    fontFamily: "Urbanist SemiBold",
                  }, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>
                    Address line 1
                  </Text>
                  <Input
                    id="billingAddress1"
                    onInputChanged={(id, value) => {
                      setBillingAddress1(value)
                    }}
                    defaultValue={billingAddress1}
                    placeholder="3235 Royal Ln. mesa, new jersy 34567"
                  />
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={[{
                    ...FONTS.body4,
                    marginVertical: 4,
                    fontFamily: "Urbanist SemiBold",
                  }, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                  }]}>
                    Address line 2 (Optional)
                  </Text>
                  <Input
                    id="billingAddress2"
                    onInputChanged={(id, value) => {
                      setBillingAddress2(value)
                    }}
                    defaultValue={billingAddress2} 
                    placeholder="2143" 
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 12,
                  }}>
                  <View
                    style={{ width: (SIZES.width - 32) / 2 - 10 }}>
                    <Text style={[{
                      ...FONTS.body4,
                      marginVertical: 4,
                      fontFamily: "Urbanist SemiBold",
                    }, {
                      color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>
                      City
                    </Text>
                    <Input
                      id="billingCity"
                      onInputChanged={(id, value) => {
                        setBillingCity(value)
                      }}

                      defaultValue={billingCity?billingCity:data?.city} 
                      placeholder="hason nagar" 
                    />
                  </View>
                  <View
                    style={{ width: (SIZES.width - 32) / 2 - 10 }}>
                    <Text style={[{
                      ...FONTS.body4,
                      marginVertical: 4,
                      fontFamily: "Urbanist SemiBold",
                    }, {
                      color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>
                      Zip Code
                    </Text>
                    <Input
                      id="billingZipCode"
                      onInputChanged={(id, value) => {
                        setBillingZipCode(value)
                      }}
                      defaultValue={billingZipCode}
                      placeholder="3456" 
                    />
                  </View>
                </View>
              </View>
            </View>


          </View>
          <View style={styles.bottomContainer}>
            <ButtonFilled
              title="Save"
              style={styles.continueButton}
              onPress={() => submitData()}
            />
          </View>
        </ScrollView>
      </View>
     



    </SafeAreaView>
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
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: .4,
    borderRadius: 6,
    height: 52,
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
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 20
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
  },
  genderContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: .4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  }
});
 

export default BillingAddress