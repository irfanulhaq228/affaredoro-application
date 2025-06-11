import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ToastAndroid } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, icons, images, SIZES } from '../constants';
import SettingsItem from '../components/SettingsItem';
import Button from '../components/Button';
import ButtonFilled from '../components/ButtonFilled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

type Nav = {
  navigate: (value: string) => void
}

const Profile = ({navigation}:{navigation:any}) => {
  const refRBSheet = useRef<any>(null);
  const { dark, colors, setScheme } = useTheme();
  const { navigate } = useNavigation<Nav>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  const submit = async () => {
    setIsLoading(true)
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
            setIsLoading(false)
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
          else if (resp.status === "fail") {
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
        })
        .catch((error) => {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          console.error(error);
          setIsLoading(false)
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

  /**
   * Render header
   */
  const renderHeader = () => {
    return (
      <TouchableOpacity style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={[styles.logo,{tintColor:dark ? COLORS.golden : COLORS.greyscale900}]}
          />
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Profile</Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.headerIcon, {
              tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity> */}
      </TouchableOpacity>
    )
  }
  /**
   * Render User Profile
   */
  const renderProfile = () => {
    const [image, setImage] = useState(images.user1)

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

    return (
      <View style={styles.profileContainer}>
        <View>
          {data?.image ? <Image
            source={{ uri: baseUrl + '/' + data?.image }}
            resizeMode='cover'
            style={styles.avatar}
          /> : <Image
            source={image}
            resizeMode='cover'
            style={styles.avatar}
          />}
          {/* <TouchableOpacity
            onPress={pickImage}
            style={styles.picContainer}>
            <MaterialIcons name="edit" size={16} color={COLORS.white} />
          </TouchableOpacity> */}
        </View>
        <Text style={[styles.title, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>{data?.fullName}</Text>
        <Text style={[styles.subtitle, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>{data?.email}</Text>
      </View>
    )
  }
  /**
   * Render Settings
   */
  const renderSettings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
      setIsDarkMode((prev) => !prev);
      dark ? setScheme('light') : setScheme('dark')
    };

    return (
      <View style={styles.settingsContainer}>
        {/* <SettingsItem
          icon={icons.cartOutline}
          name="My Cart"
          onPress={() => navigate("cart")}
        /> */}
        <SettingsItem
          icon={icons.squareInfo}
          name="My Profile"
          onPress={() => navigation.navigate("viewprofile",{userId:data?._id, edit:true})}
        />
        {/* <SettingsItem
          icon={icons.addFileOutline}
          name="Upload Product"
          onPress={() => navigate("UploadItem")}
        /> */}
        <SettingsItem
          icon={icons.chatBubble2Outline}
          name="Inbox"
          onPress={() => navigate("inbox")}
        />
        <SettingsItem
          icon={icons.document2Outline}
          name="Customer Orders"
          onPress={() => navigate("CustomerOrders")}
        />
        <SettingsItem
          icon={icons.bell3}
          name="My Notification"
          onPress={() => navigate("notifications")}
        />
        <SettingsItem
          icon={icons.cargo}
          name="Shipping Address"
          onPress={() => navigate("ShippingAddress")}  
        />
        <SettingsItem
          icon={icons.location2Outline}
          name="Billing Address"
          onPress={() => navigate("BillingAddress")}
        />
        <SettingsItem
          icon={icons.userOutline}
          name="Edit Profile"
          onPress={() => navigate("editprofile")}
        />
        <SettingsItem
          icon={icons.bell2}
          name="Notification"
          onPress={() => navigate("settingsnotifications")}
        />
        <SettingsItem
          icon={icons.masterCardLogo}
          name="Payment Card"
          onPress={() => navigate("settingspayment")}
        />
        <SettingsItem
          icon={icons.wallet2Outline}
          name="Payout Banks"
          onPress={() => navigate("SettingsBankAccounts")}
        />
        <SettingsItem
          icon={icons.shieldOutline}
          name="Security"
          onPress={() => navigate("settingssecurity")}
        />
        {/* <TouchableOpacity
          onPress={() => navigate("settingslanguage")}
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.more}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Language & Region</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={[styles.rightLanguage, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>English (US)</Text>
            <Image
              source={icons.arrowRight}
              resizeMode='contain'
              style={[styles.settingsArrowRight, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.settingsItemContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={icons.show}
              resizeMode='contain'
              style={[styles.settingsIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
            <Text style={[styles.settingsName, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Dark Mode</Text>
          </View>
          <View style={styles.rightContainer}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? '#fff' : COLORS.white}
              trackColor={{ false: '#EEEEEE', true: COLORS.primary }}
              ios_backgroundColor={COLORS.white}
              style={styles.switch}
            />
          </View>
        </TouchableOpacity>
        <SettingsItem
          icon={icons.lockedComputerOutline}
          name="Terms & Conditions"
          onPress={() => navigate("SettingsTermsAndConditions")}
        />
        <SettingsItem
          icon={icons.infoCircle}
          name="About"
          onPress={() => navigate("SettingsAbout")}
        />
        {/* <SettingsItem
          icon={icons.infoCircle}
          name="Help Center"
          onPress={() => navigate("settingshelpcenter")}
        /> */}
        {/* <SettingsItem
          icon={icons.people4}
          name="Invite Friends"
          onPress={() => navigate("settingsinvitefriends")}
        /> */}
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.logoutContainer}>
          <View style={styles.logoutLeftContainer}>
            <Image
              source={icons.logout}
              resizeMode='contain'
              style={[styles.logoutIcon, {
                tintColor: "red"
              }]}
            />
            <Text style={[styles.logoutName, {
              color: "red"
            }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <>
    {isLoading && <LoaderScreen />}
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderProfile()}
          {renderSettings()}
        </ScrollView>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={SIZES.height * .8}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200,
            height: 4
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 260,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white
          }
        }}
      >
        <Text style={styles.bottomTitle}>Logout</Text>
        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
        }]} />
        <Text style={[styles.bottomSubtitle, {
          color: dark ? COLORS.white : COLORS.black
        }]}>Are you sure you want to log out?</Text>
        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <ButtonFilled
            title="Yes, Logout"
            style={styles.logoutButton}
            onPress={async() => {
              await AsyncStorage.clear();
              navigation.replace('login')
              refRBSheet.current.close()
            }}
          />
        </View>
      </RBSheet>
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
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    height: 32,
    width: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  headerIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  profileContainer: {
    alignItems: "center",
    borderBottomColor: COLORS.grayscale400,
    borderBottomWidth: .4,
    paddingVertical: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 999
  },
  picContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    position: "absolute",
    right: 0,
    bottom: 12
  },
  title: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginTop: 12
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.greyscale900,
    fontFamily: "Urbanist Medium",
    marginTop: 4
  },
  settingsContainer: {
    marginVertical: 12
  },
  settingsItemContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  settingsName: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  settingsArrowRight: {
    width: 24,
    height: 24,
    tintColor: COLORS.greyscale900
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightLanguage: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    marginRight: 8
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  logoutContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  logoutLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.greyscale900
  },
  logoutName: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "Urbanist SemiBold",
    color: "red",
    textAlign: "center",
    marginTop: 12
  },
  bottomSubtitle: {
    fontSize: 20,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 28
  },
  separateLine: {
    width: SIZES.width,
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginTop: 12
  }
})

export default Profile