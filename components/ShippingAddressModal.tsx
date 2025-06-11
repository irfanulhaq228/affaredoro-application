import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import Input from './Input';
import DatePickerModal from './DatePickerModal';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from './ButtonFilled';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ShowCategoryModal from './ShowCategoryModal';
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

const ShippingAddressModal = ({ show, setShow, }: any) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [shippingFullName, setShippingFullName] = useState<any>(null);
  const [shippingCountry, setShippingCountry] = useState<any>(null);
  const [shippingAddress1, setShippingAddress1] = useState<any>(null);
  const [shippingAddress2, setShippingAddress2] = useState<any>(null);
  const [shippingZipCode, setShippingZipCode] = useState<any>(null);
  const [shippingCity, setShippingCity] = useState<any>(null);
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

            setShippingFullName(resp?.data?.shippingFullName)
            setShippingAddress1(resp?.data?.shippingAddress1)
            setShippingCountry(resp?.data?.shippingCountry)
            setShippingAddress2(resp?.data?.shippingAddress2)
            setShippingCity(resp?.data?.shippingCity)
            setShippingZipCode(resp?.data?.shippingZipCode)

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

      if (shippingFullName !== data?.shippingFullName || data?.fullName) {
        formdata.append("shippingFullName", shippingFullName?shippingFullName : data?.fullName);
      }
      if (shippingCountry !== data?.shippingCountry) {
        formdata.append("shippingCountry", shippingCountry);
      }
      if (shippingAddress1 !== data?.shippingAddress1) {
        formdata.append("shippingAddress1", shippingAddress1);
      }
      if (shippingAddress2 !== data?.shippingAddress2) {
        formdata.append("shippingAddress2", shippingAddress2);
      }
      if (shippingZipCode !== data?.shippingZipCode) {
        formdata.append("shippingZipCode", shippingZipCode);
      }
      if (shippingCity !== data?.shippingCity) {
        formdata.append("shippingCity", shippingCity);
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
            ToastAndroid.show('Shipping Address updated successfully!', ToastAndroid.SHORT);
            setShow(false)
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
    <Modal visible={show}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShow(!show)}
    >
      <TouchableWithoutFeedback onPress={() => setShow(!show)}>

        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableWithoutFeedback>
              <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, width: '90%', paddingHorizontal: 0,  paddingBottom: 20, }}>

                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                  setShow(!show)
                }}>
                  <Image
                    source={icons.cancelSquare}
                    resizeMode='contain'
                    style={[{
                      width: 24,
                      height: 24,
                      tintColor: COLORS.black
                    }, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                  />
                </TouchableOpacity>


                <Text style={[{
                  fontSize: 18,
                  fontFamily: "Urbanist Bold",
                  color: COLORS.greyscale900,
                  marginVertical: 8
                }, {
                  color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                }]}>Manage Shipping Address</Text>
                
                <View >
                      <View style={{ marginVertical: 0, padding:10 }}>
                        <View
                          style={{
                            marginTop: 0,
                            width: '100%',
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
                            id="shippingFullName"
                            onInputChanged={(id, value) => {
                              setShippingFullName(value)
                            }}
                            defaultValue={shippingFullName ? shippingFullName : data?.fullName}
                            placeholder="M Adnan"
                          />
                        </View>
                        <View
                          style={{
                            marginTop: 0,
                            width: '100%',
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
                            id="shippingCountry"
                            onInputChanged={(id, value) => {
                              setShippingCountry(value)
                            }}
                            defaultValue={shippingCountry ? shippingCountry : data?.country}
                            placeholder="3235 Royal Ln. mesa, new jersy 34567"
                          />
                        </View>
                        <View
                          style={{
                            marginTop: 0,
                            width: '100%',
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
                            id="shippingAddress1"
                            onInputChanged={(id, value) => {
                              setShippingAddress1(value)
                            }}
                            defaultValue={shippingAddress1}
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
                            id="shippingAddress2"
                            onInputChanged={(id, value) => {
                              setShippingAddress2(value)
                            }}
                            defaultValue={shippingAddress2}
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
                            style={{ width: '49%' }}>
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
                              id="shippingCity"
                              onInputChanged={(id, value) => {
                                setShippingCity(value)
                              }}

                              defaultValue={shippingCity ? shippingCity : data?.city}
                              placeholder="hason nagar"
                            />
                          </View>
                          <View
                            style={{ width: '49%', }}>
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
                              id="shippingZipCode"
                              onInputChanged={(id, value) => {
                                setShippingZipCode(value)
                              }}
                              defaultValue={shippingZipCode}
                              placeholder="3456"
                            />
                          </View>
                        </View>



                        <ButtonFilled
                      title="Save"
                      style={[styles.continueButton,{width:'100%', marginVertical:20}]}
                      onPress={() => submitData()}
                    />
                      </View>
                    

                </View>
              </View>


          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16
  },
});

export default ShippingAddressModal