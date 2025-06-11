import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ShowCategoryModal from '../components/ShowCategoryModal';
// import { Country, State, City } from 'country-state-city';
import GlobalSettingsItem from '../components/GlobalSettingsItem';
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';



// console.log(State.getAllStates())

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? 'John Doe' : '',
    email: isTestMode ? 'example@gmail.com' : '',
    nickname: isTestMode ? "" : "",
    phoneNumber: ''
  },
  inputValidities: {
    fullName: false,
    email: false,
    nickname: false,
    phoneNumber: false,
  },
  formIsValid: false,
}

interface Item {
  flag: string;
  item: string;
  code: string
}

interface RenderItemProps {
  item: Item;
}

const EditProfile = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [image, setImage] = useState<any>(null);
  const [newImg, setNewImg] = useState<any>(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [fullName, setFullName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [username, setUsername] = useState<any>(null);
  const [phone, setPhone] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [countryCode, setCountryCode] = useState<any>(null);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const { dark } = useTheme();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();


  const [startedDate, setStartedDate] = useState("12/12/2023");
  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };







  const [toggleDiscount, setToggleDiscount] = useState(false);
  const toggleDiscountFun = () => {
    setToggleDiscount(!toggleDiscount);
  }

  const [showGender, setShowGender] = useState(false);
  const [selectedGender, setSelectedGender] = useState<any>('');

  const [showCountry, setShowCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>('');

  const [showCity, setShowCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>('');


  const [showDiscount1, setShowDiscount1] = useState(false);
  const [showDiscount2, setShowDiscount2] = useState(false);
  const [showDiscount3, setShowDiscount3] = useState(false);
  const [selDiscount1, setSelDiscount1] = useState<any>('');
  const [selDiscount2, setSelDiscount2] = useState<any>('');
  const [selDiscount3, setSelDiscount3] = useState<any>('');

  const discountOptions = [
    { label: '-', value: 0, count: 0 },
    { label: '5%', value: 5, count: 0 },
    { label: '10%', value: 10, count: 0 },
    { label: '15%', value: 15, count: 0 },
    { label: '20%', value: 20, count: 0 },
    { label: '25%', value: 25, count: 0 },
    { label: '30%', value: 30, count: 0 },
    { label: '35%', value: 35, count: 0 },
    { label: '40%', value: 40, count: 0 },
    { label: '45%', value: 45, count: 0 },
    { label: '50%', value: 50, count: 0 },
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male', count: 0 },
    { label: 'Female', value: 'Female', count: 0 },
    { label: 'Other', value: 'Other', count: 0 },
  ];

  const handleGenderChange = (value: any) => {
    setSelectedGender(value);
  };


  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue)
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      })
    }, [dispatchFormState]);



  // Image Profile handler
  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        let imageUri = response.assets[0].uri;
        setImage({ uri: imageUri });
        setNewImg(true);
      }
    });
  };


  // fectch codes from rescountries api
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
          let defaultData = areaData.filter((a: any) => a.callingCode == countryCode);

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0])
          }
        }
      })
  }, [countryCode])





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
        .then(async(result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            setData(resp?.data);

            if (resp?.data?.image) {
              setImage({ uri: baseUrl + '/' + resp?.data?.image });
            }
            setFullName(resp?.data?.fullName)
            setUsername(resp?.data?.username)
            setEmail(resp?.data?.email)
            setPhone(resp?.data?.phone)
            setStartedDate(resp?.data?.birthDay)
            setCountryCode(resp?.data?.countryCode)
            setAbout(resp?.data?.about)
            setToggleDiscount(resp?.data?.bundleDiscount)
            setSelDiscount1({ value: resp?.data?.item2 })
            setSelDiscount2({ value: resp?.data?.item3 })
            setSelDiscount3({ value: resp?.data?.item5 })
            setSelectedGender({ value: resp?.data?.gender })
            setSelectedCountry({ name: resp?.data?.country })
            setSelectedCity({ name: resp?.data?.city })

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

      if (fullName !== data?.fullName) {
        formdata.append("fullName", fullName);
      }
      if (email !== data?.email) {
        formdata.append("email", email);
      }
      if (username !== data?.username) {
        formdata.append("username", username);
      }
      if (phone !== data?.phone) {
        formdata.append("phone", phone);
      }
      if (startedDate !== data?.birthDay) {
        formdata.append("birthDay", startedDate);
      }
      if (about !== data?.about) {
        formdata.append("about", about);
      }
      if (toggleDiscount !== data?.bundleDiscount) {
        formdata.append("bundleDiscount", toggleDiscount);
      }
      if (countryCode !== data?.countryCode) {
        formdata.append("countryCode", selectedArea?.callingCode);
      }
      if (selDiscount1?.value !== data?.item2) {
        formdata.append("item2", selDiscount1?.value);
      }
      if (selDiscount2?.value !== data?.item3) {
        formdata.append("item3", selDiscount2?.value);
      }
      if (selDiscount3?.value !== data?.item5) {
        formdata.append("item5", selDiscount3?.value);
      }
      if (selectedGender?.value !== data?.gender) {
        formdata.append("gender", selectedGender?.value);
      }
      if (selectedCountry?.name !== data?.country) {
        formdata.append("country", selectedCountry?.name);
      }
      if (selectedCity?.name !== data?.city) {
        formdata.append("city", selectedCity?.name);
      }

      if (newImg) {
        formdata.append("image", {
          uri: image?.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }



      const requestOptions: any = {
        method: "PUT",
        body: formdata,
        redirect: "follow"
      };


      console.log(selectedGender);


      fetch(`${baseUrl}/users/update/${mydata?._id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result)
          const resp = JSON.parse(result)

          if (resp.status === 'ok') {
            ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
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



  // render countries codes modal
  function RenderAreasCodesModal() {

    const renderItem = ({ item }: RenderItemProps) => {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: "row"
          }}
          onPress={() => {
            setSelectedArea(item),
              setModalVisible(false)
          }}
        >
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
              }}
            >
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
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Edit Profile" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image
                source={image === null ? images.user1 : image}
                resizeMode="cover"
                style={styles.avatar} />
              <TouchableOpacity
                onPress={pickImage}
                style={styles.pickImage}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={24}
                  color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Input
              id="fullName"
              onInputChanged={(id, value) => {
                setFullName(value)
              }}
              placeholder="Full Name"
              defaultValue={fullName}  // Bind input value from state
              placeholderTextColor={COLORS.gray} />
            <Input
              id="username"
              onInputChanged={(id, value) => {
                setUsername(value)
              }}
              placeholder="Username"
              defaultValue={username}  // Bind input value from state
              placeholderTextColor={COLORS.gray} />
            <Input
              id="email"
              onInputChanged={(id, value) => {
                setEmail(value)
              }}
              errorText={!email ? 'Please enter your email' : ''}
              placeholder="Email"
              defaultValue={email}  // Bind input value from state
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
              editable={false}
            />
            <View style={{
              width: SIZES.width - 32
            }}>
              <TouchableOpacity
                style={[styles.inputBtn, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                }]}
                onPress={handleOnPressStartDate}
              >
                <Text style={{ ...FONTS.body4, color: dark ? COLORS.white : COLORS.primary }}>{startedDate}</Text>
                <Feather name="calendar" size={24} color={COLORS.grayscale400} />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
              borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
            }]}>
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
                  <Text style={{ color: dark ? COLORS.white : "#111", fontSize: 12 }}>{selectedArea?.callingCode}</Text>
                </View>
              </TouchableOpacity>
              {/* Phone Number Text Input */}
              <TextInput
                style={[styles.input, { color: dark ? COLORS.white : COLORS.primary }]}
                onChangeText={(value) => {
                  setPhone(value)
                }}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.gray}
                value={phone}
                keyboardType="numeric"
              />
            </View>



            <View>
              <TouchableOpacity
                onPress={() => { setShowGender(true) }}
                style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select gender"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                  selectionColor="#111"
                  keyboardType='default'
                  editable={false}
                  value={selectedGender?.value}
                />
                <View
                  style={[styles.selectFlagContainer, { width: 28, }]}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.down}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                    />
                  </View>

                </View>

              </TouchableOpacity>

            </View>


{/* 
            <View>
              <TouchableOpacity
                onPress={() => { setShowCountry(true) }}
                style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select country"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                  selectionColor="#111"
                  keyboardType='default'
                  editable={false}
                  value={selectedCountry?.name}
                />
                <View
                  style={[styles.selectFlagContainer, { width: 28, }]}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.down}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                    />
                  </View>

                </View>

              </TouchableOpacity>

            </View>



            <View>
              <TouchableOpacity
                onPress={() => {
                  if (selectedCountry) {
                    setShowCity(true)
                  }
                  else {
                    ToastAndroid.show('Please select a country first.', 2000)
                  }
                }}
                style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select city"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                  selectionColor="#111"
                  keyboardType='default'
                  editable={false}
                  value={selectedCity?.name}
                />
                <View
                  style={[styles.selectFlagContainer, { width: 28, }]}
                >
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.down}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                    />
                  </View>

                </View>

              </TouchableOpacity>

            </View> */}

            <Input
              id="description"
              onInputChanged={(id, value) => {
                setAbout(value)
              }}
              defaultValue={about}
              placeholder="About you"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              multiline
              minHeight={52}
            />


            <GlobalSettingsItem
              title="Enable Bundle Discount"
              isNotificationEnabled={toggleDiscount}
              toggleNotificationEnabled={toggleDiscountFun}
            />


            {toggleDiscount ? <>


              <View>
                <TouchableOpacity
                  onPress={() => { setShowDiscount1(true) }}
                  style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                  }]}>

                  <TextInput
                    style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                    placeholder="2 items"
                    placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                    selectionColor="#111"
                    keyboardType='default'
                    editable={false}
                    value={selDiscount1?.value?.toString()==='0'?'':selDiscount1?.value?.toString()+'% on 2 items'}
                  />
                  <View
                    style={[styles.selectFlagContainer, { width: 28, }]}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={icons.down}
                        resizeMode='contain'
                        style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                      />
                    </View>

                  </View>

                </TouchableOpacity>

              </View>


              <View>
                <TouchableOpacity
                  onPress={() => { setShowDiscount2(true) }}
                  style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                  }]}>

                  <TextInput
                    style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                    placeholder="3 items"
                    placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                    selectionColor="#111"
                    keyboardType='default'
                    editable={false}
                    value={selDiscount2?.value?.toString()==='0'?'':selDiscount2?.value?.toString()+'% on 3 items'}
                  />
                  <View
                    style={[styles.selectFlagContainer, { width: 28, }]}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={icons.down}
                        resizeMode='contain'
                        style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                      />
                    </View>

                  </View>

                </TouchableOpacity>

              </View>


              <View>
                <TouchableOpacity
                  onPress={() => { setShowDiscount3(true) }}
                  style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                  }]}>

                  <TextInput
                    style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                    placeholder="5 items"
                    placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                    selectionColor="#111"
                    keyboardType='default'
                    editable={false}
                    value={selDiscount3?.value?.toString()==='0'?'':selDiscount3?.value?.toString()+'% on 5 items'}
                  />
                  <View
                    style={[styles.selectFlagContainer, { width: 28, }]}
                  >
                    <View style={{ justifyContent: "center" }}>
                      <Image
                        source={icons.down}
                        resizeMode='contain'
                        style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                      />
                    </View>

                  </View>

                </TouchableOpacity>

              </View>



            </> : null}



          </View>
          <View style={styles.bottomContainer}>
            <ButtonFilled
              title="Update"
              style={styles.continueButton}
              onPress={() => submitData()}
            />
          </View>
        </ScrollView>
      </View>
      <DatePickerModal
        open={openStartDatePicker}
        selectedDate={startedDate}
        onClose={() => setOpenStartDatePicker(false)}
        onChangeStartDate={(date) => setStartedDate(date)}
      />
      {RenderAreasCodesModal()}



      <ShowCategoryModal show={showDiscount1} setShow={setShowDiscount1} title={'Select Discount'} data={discountOptions} name={'label'} setSel={setSelDiscount1} sel={selDiscount1} onPress={() => {
        setShowDiscount1(false)
      }} />


      <ShowCategoryModal show={showDiscount2} setShow={setShowDiscount2} title={'Select Discount'} data={discountOptions} name={'label'} setSel={setSelDiscount2} sel={selDiscount2} onPress={() => {
        setShowDiscount2(false)
      }} />


      <ShowCategoryModal show={showDiscount3} setShow={setShowDiscount3} title={'Select Discount'} data={discountOptions} name={'label'} setSel={setSelDiscount3} sel={selDiscount3} onPress={() => {
        setShowDiscount3(false)
      }} />



      <ShowCategoryModal show={showGender} setShow={setShowGender} title={'Select Gender'} data={genderOptions} name={'label'} setSel={setSelectedGender} sel={selectedGender} onPress={() => {

        setShowGender(false)
      }} />

      {/* <ShowCategoryModal show={showCountry} setShow={setShowCountry} title={'Select Country'} data={Country.getAllCountries()} name={'name'} value={'isoCode'} setSel={setSelectedCountry} sel={selectedCountry} onPress={() => {
        setShowCountry(false)
      }} />

      <ShowCategoryModal show={showCity} setShow={setShowCity} title={'Select City'} data={City.getCitiesOfCountry(selectedCountry?.isoCode)} name={'name'} value={'name'} setSel={setSelectedCity} sel={selectedCity} onPress={() => {
        setShowCountry(false)
      }} /> */}


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

export default EditProfile