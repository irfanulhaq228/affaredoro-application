import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: isTestMode ? 'John Doe' : '',
    email: isTestMode ? 'example@gmail.com' : '',
    username: isTestMode ? "" : "",
    phoneNumber: ''
  },
  inputValidities: {
    fullName: false,
    email: false,
    username: false,
    phoneNumber: false,
  },
  formIsValid: false,
}

type Nav = {
  navigate: (value: string) => void
}

const FillYourProfile = ({ navigation }: { navigation: any }) => {
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [areas, setAreas] = useState([]);
  const [data, setData] = useState<any>(null);
  const [fullName, setFullName] = useState<any>(null);
  const [email, setEmail] = useState<any>(null);
  const [username, setUsername] = useState<any>(null);
  const [phone, setPhone] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const { colors, dark } = useTheme();

  const today = new Date();
  const startDate = getFormatedDate(
    new Date(today.setDate(today.getDate() + 1)),
    "YYYY/MM/DD"
  );

  const [startedDate, setStartedDate] = useState('Please select date of birth');

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };


  const storedata = async (login: any) => {
    try {
      await AsyncStorage.setItem("login", JSON.stringify(login));
    } catch (error) {
      console.log(error);
    }
  };




  const submit = async () => {


    try {


      setIsLoading(true)

      if (!email) {
        setError("error")
        setIsLoading(false)
        return
      }

      if (!username) {
        setError("error")
        setIsLoading(false)
        return
      }

      if (!fullName) {
        setError("error")
        setIsLoading(false)
        return
      }

      if (!image) {
        ToastAndroid.show('Must add your profile image', 2000)
        setIsLoading(false)
        return
      }


      var mydata: any = await AsyncStorage.getItem('data');

      mydata = JSON.parse(mydata);
      console.log(mydata);


      if (mydata) {

        const formdata = new FormData();
        formdata.append("fullName", fullName);
        formdata.append("username", username);
        formdata.append("email", email);
        formdata.append("birthDay", startedDate);
        formdata.append("completeProfile", true);
        formdata.append("phone", phone);
        formdata.append("countryCode", selectedArea?.callingCode);
        formdata.append("image", {
          uri: image?.uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        });


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
              storedata(true)
              navigation?.replace('(tabs)')
              setIsLoading(false)
            }

          })
          .catch((error) => {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
            setIsLoading(false)
          });


      }
    } catch (error: any) {
      ToastAndroid.show(error.message, 2000)
      console.error(error)
      setIsLoading(false)
    };
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        var mydata: any = await AsyncStorage.getItem('data');
        const mytoken = await AsyncStorage.getItem('token');

        mydata = JSON.parse(mydata);
        if (mydata?.image) {
          setImage({ uri: mydata?.image });
        }
        setFullName(mydata?.fullName)
        setUsername(mydata?.username)
        setEmail(mydata?.email)
        console.log(mydata);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [error]);


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
      }
    });
  };

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
  }, [])
  

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
        visible={modalVisible}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                height: SIZES.height,
                width: SIZES.width,
                backgroundColor: COLORS.primary,
                borderRadius: 12
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close-outline" size={24} color={COLORS.primary} />
              </TouchableOpacity>
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
      {isLoading && <LoaderScreen />}

      <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <ScrollView style={{ flex: 1, height: SIZES.height }} showsVerticalScrollIndicator={false}>
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title="Fill Your Profile" navigation={navigation} />
            <View style={{ alignItems: "center", marginVertical: 12 }}>
              <View style={styles.avatarContainer}>
                {<Image
                  source={image === null ? icons.userDefault2 : image}
                  resizeMode="cover"
                  style={styles.avatar} />}
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
                  <Text style={{ ...FONTS.body4, color: COLORS.grayscale400 }}>{startedDate}</Text>
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
            </View>
          </View>
          <DatePickerModal
            open={openStartDatePicker}
            selectedDate={startedDate}
            onClose={() => setOpenStartDatePicker(false)}
            onChangeStartDate={(date) => setStartedDate(date)}
          />
          {RenderAreasCodesModal()}
          <View style={styles.bottomContainer}>
            {/* <Button
          title="Skip"
          style={{
            width: (SIZES.width - 32) / 2 - 8,
            borderRadius: 32,
            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
            borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
          }}
          textColor={dark ? COLORS.white : COLORS.primary}
          onPress={() => navigate("login")}
          /> */}
            <ButtonFilled
              title="Submit"
              style={styles.continueButton}
              onPress={() => submit()}
            />
          </View>
        </ScrollView>
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
    borderRadius: 12,
    height: 52,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 12,
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
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 52,
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
    paddingVertical: 24,
    right: 16,
    left: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center"
  },
  continueButton: {
    width: (SIZES.width - 32),
    borderRadius: 32,
  },
  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    position: "absolute",
    right: 16,
    top: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }
})

export default FillYourProfile