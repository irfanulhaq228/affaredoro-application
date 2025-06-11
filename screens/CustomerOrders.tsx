import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, icons, images, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import CustomerOngoingOrders from '../tabs/CustomerOngoingOrders';
import CustomerCompletedOrders from '../tabs/CustomerCompletedOrders';
import CustomerCancelledOrders from '../tabs/CustomerCancelledOrders';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

const renderScene = SceneMap({
  first: CustomerOngoingOrders,
  second: CustomerCompletedOrders,
  third: CustomerCancelledOrders
});

const CustomerOrders = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const layout = useWindowDimensions();
  const { dark, colors } = useTheme();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Ongoing' },
    { key: 'second', title: 'Completed' },
    { key: 'third', title: 'Cancelled' }
  ]);




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




  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: dark ? COLORS.white : COLORS.primary,
      }}
      style={{
        backgroundColor: colors.background,
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[{
          color: focused ? dark ? COLORS.white : COLORS.primary : "gray",
          fontSize: 16,
          fontFamily: "Urbanist SemiBold"
        }]}>
          {route.title}
        </Text>
      )}
    />
  )

  /**
  * Render header
  */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={images.logo}
              resizeMode='contain'
              style={[styles.backIcon, {
                tintColor: dark ? COLORS.golden : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            My Orders
          </Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, {
              tintColor: dark ? COLORS.white : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity> */}
      </View>
    )
  }

  return (
    <>

      {isLoading && <LoaderScreen />}

      <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {renderHeader()}


          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, width: '100%' }}>
            <View style={[
              styles.cardContainer,
              {
                backgroundColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
                borderRadius: 16,
                padding: 16,
                shadowColor: dark ? 'transparent' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                borderWidth: dark ? 1 : 0,
                borderColor: dark ? COLORS.greyScale800 : 'transparent',
              }
            ]}>
              <View style={styles.addressLeftContainer}>
                <Text style={[
                  styles.homeTitle,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                    fontSize: 22,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }
                ]}>
                  <Image
                    source={images.price}
                    resizeMode='contain'
                    style={{
                      width: 20, height: 20,
                      tintColor: dark ? COLORS.white : COLORS.black
                    }}
                  /> {(data?.wallet?.pending)?.toFixed(2)}
                </Text>
              </View>

              <View style={[
                styles.separateLine,
                {
                  marginVertical: 12,
                  marginTop: 5,
                  height: 1,
                  backgroundColor: dark ? COLORS.greyScale800 : COLORS.gray,
                }
              ]} />

              <View style={[
                styles.buttonContainer,
                {
                  alignSelf: 'center',
                  backgroundColor: dark ? COLORS.greyScale800 : COLORS.white,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: dark ? COLORS.greyscale600 : COLORS.gray,
                }
              ]}>
                <Text style={{
                  color: dark ? COLORS.white : COLORS.black,
                  fontSize: 14,
                  fontFamily: 'Urbanist SemiBold',
                  fontWeight: '600',
                }}>
                  Pending Amount
                </Text>
              </View>
            </View>
            <View style={[
              styles.cardContainer,
              {
                backgroundColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
                borderRadius: 16,
                padding: 16,
                shadowColor: dark ? 'transparent' : '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                borderWidth: dark ? 1 : 0,
                borderColor: dark ? COLORS.greyScale800 : 'transparent',
              }
            ]}>
              <View style={styles.addressLeftContainer}>
                <Text style={[
                  styles.homeTitle,
                  {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                    fontSize: 22,
                    fontWeight: 'bold',
                    marginBottom: 8,
                  }
                ]}>
                  <Image
                    source={images.price}
                    resizeMode='contain'
                    style={{
                      width: 20, height: 20,
                      tintColor: dark ? COLORS.white : COLORS.black
                    }}
                  /> {(data?.wallet?.available)?.toFixed(2)}
                </Text>
              </View>

              <View style={[
                styles.separateLine,
                {
                  marginVertical: 12,
                  marginTop: 5,
                  height: 1,
                  backgroundColor: dark ? COLORS.greyScale800 : COLORS.gray,
                }
              ]} />

              <View style={[
                styles.buttonContainer,
                {
                  alignSelf: 'center',
                  backgroundColor: dark ? COLORS.greyScale800 : COLORS.white,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: dark ? COLORS.greyscale600 : COLORS.gray,
                }
              ]}>
                <Text style={{
                  color: dark ? COLORS.white : COLORS.black,
                  fontSize: 14,
                  fontFamily: 'Urbanist SemiBold',
                  fontWeight: '600',
                }}>
                  Available Amount
                </Text>
              </View>
            </View>



          </View>



          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
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
    backgroundColor: COLORS.white,
    padding: 16,
    paddingBottom:0
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 16
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    marginLeft: 16
  },
  moreIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },

  cardContainer: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  statusContainer: {
    width: 54,
    height: 24,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.primary,
    borderWidth: 1
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: "Urbanist Medium",
  },
  separateLine: {
    width: "100%",
    height: .7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImageContainer: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginHorizontal: 12,
    backgroundColor: COLORS.silver
  },
  productImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
  },
  detailsRightContainer: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 17,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  address: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 6
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
  },
  serviceText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "Urbanist Medium",
    marginTop: 6
  },
  cancelBtn: {
    width: (SIZES.width - 32) / 2 - 16,
    height: 46,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
  },
  receiptBtn: {
    width: (SIZES.width - 32) / 2 - 16,
    height: 46,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  receiptBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginTop: 0
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  viewAddress: {
    marginHorizontal: 16
  },
  viewView: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeTitle: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.greyscale900
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 0,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    width: '100%',
    marginVertical: 5
  },
  view1: {
    height: 52,
    width: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
  },
  view2: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
})

export default CustomerOrders