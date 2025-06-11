import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { ongoingOrders } from '../data';
import { SIZES, COLORS, icons, images } from '../constants';
import RBSheet from "react-native-raw-bottom-sheet";
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ButtonFilled from '../components/ButtonFilled';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import NotFoundItem from '../components/NotFoundItem';

const CompletedOrders = () => {
  const [orders, setOrders] = useState(ongoingOrders);
  const refRBSheet = useRef<any>(null);
  const { dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();

  const [orderData, setOrderData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localId, setLocalId] = useState<any>(null);



  const submitOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

      var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
      mydata = JSON.parse(mydata);


      setLocalId(mydata?._id)


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

      fetch(`${baseUrl}/order/getAll?fromUserId=${true}&orderStatus=${'completed'}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setOrderData(resp?.data);
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else {

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



  useFocusEffect(
    useCallback(() => {
      submitOrder();
    }, []))









  return (
    <View style={[styles.container, {
      backgroundColor: dark ? COLORS.dark1 : COLORS.white
    }]}>
      {orderData.length > 0 ? <FlatList
        data={orderData}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.cardContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.tansparentPrimary,
          }]}>
            <View style={[styles.summaryContainer, {
            }]}>

              <TouchableOpacity
                onPress={() => { }}
                style={styles.addressContainer}>
                <View style={styles.addressLeftContainer}>
                  <View style={styles.view1}>
                    <View style={styles.view2}>
                      {item?.productId.map((i: any, index: any) => {
                        return (
                          <>
                            {index < 2 ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, position: 'relative', }}>
                              <Image source={{ uri: baseUrl + '/' + i?.image[0] }} style={{ width: 50, height: 50, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                              {index === 1 ? <View style={{ position: 'absolute', backgroundColor: dark ? COLORS.black2 : COLORS.tertiaryWhite, top: 0, right: 0, borderRadius: 5, width: 55, height: 55, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={[{
                                  fontSize: 18,
                                  fontFamily: "Urbanist Bold",
                                  color: COLORS.greyscale900,
                                  marginVertical: 8
                                }, {
                                  color: dark ? COLORS.white : COLORS.greyscale900, marginVertical: 0, fontSize: 14
                                }]}>+{(item?.productId.length - 2) + 1}</Text>
                              </View> : null}

                            </View> : null}
                          </>
                        )
                      })}
                    </View>
                  </View>
                  {item?.productId ? <View style={[styles.viewAddress, {}]}>
                    <View style={styles.viewView}>
                      {item?.bumpOrder ? <Text style={[styles.homeTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                      }]}>{item?.bumpDay}-day Bump</Text> : <Text style={[styles.homeTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                      }]}>{item?.productId?.length > 1 ? `Bundle ${item?.productId?.length} items` : item?.productId[0]?.name}</Text>}

                    </View>
                    <Text style={[styles.addressTitle, {
                      color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}>
                      Total Bill: <Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 13, height: 13,
                          tintColor: dark ? COLORS.grayscale200 : COLORS.grayscale700
                        }}
                      />{item?.total}</Text>
                    <Text style={[styles.addressTitle, {
                      color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}>
                      Order Status: {item?.orderStatus}</Text>
                  </View> : <Text style={[styles.addressTitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                  }]}>
                    Add Product</Text>}
                </View>
                {/* <Image
                  source={icons.arrowRight}
                  resizeMode='contain'
                  style={[styles.arrowRightIcon, {
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }]}
                /> */}
              </TouchableOpacity>
            </View>
            <View style={[styles.separateLine, {
              marginVertical: 10,
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.gray,
            }]} />
            <View style={styles.buttonContainer}>
              {/* <TouchableOpacity
                onPress={() => refRBSheet.current.open()}
                style={[styles.cancelBtn, {
                  borderColor: dark ? COLORS.white : COLORS.primary
                }]}>
                <Text style={[styles.cancelBtnText, {
                  color: dark ? COLORS.white : COLORS.primary,
                }]}>Cancel Order</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => navigation.navigate("OrderDetails", { orderId: item?._id })}
                style={[styles.receiptBtn, {
                  backgroundColor: dark ? COLORS.dark3 : COLORS.primary,
                  borderColor: dark ? COLORS.dark3 : COLORS.primary,
                  width: '100%'
                }]}>
                <Text style={styles.receiptBtnText}>View Order</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      /> : <NotFoundItem title='No Order Found!' />}
      <RBSheet
        ref={refRBSheet}
        closeOnPressMask={true}
        height={332}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale300 : COLORS.greyscale300,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 332,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            alignItems: "center",
            width: "100%"
          }
        }}>
        <Text style={[styles.bottomSubtitle, {
          color: dark ? COLORS.red : COLORS.red
        }]}>Cancel Order</Text>
        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
        }]} />

        <View style={styles.selectedCancelContainer}>
          <Text style={[styles.cancelTitle, {
            color: dark ? COLORS.secondaryWhite : COLORS.greyscale900
          }]}>Are you sure you want to cancel your order?</Text>
          <Text style={[styles.cancelSubtitle, {
            color: dark ? COLORS.grayscale400 : COLORS.grayscale700
          }]}>Only 80% of the money you can refund from your payment according to our policy.</Text>
        </View>

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
            title="Yes, Cancel"
            style={styles.removeButton}
            onPress={() => {
              refRBSheet.current.close();
              navigation.navigate("cancelorder");
            }}
          />
        </View>
      </RBSheet>
    </View>
  )
};

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: COLORS.tertiaryWhite,
    marginVertical: 22
  },
  cardContainer: {
    width: SIZES.width - 32,
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
    justifyContent: "space-between"
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  remindMeText: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%"
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "Urbanist SemiBold",
    color: "red",
    textAlign: "center",
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: "100%"
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 8,
    marginTop: 16
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  duration: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
  },
  priceItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,

  },
  reviewContainer: {
    position: "absolute",
    top: 6,
    right: 16,
    width: 46,
    height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.transparentWhite2,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  rating: {
    fontSize: 12,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    marginLeft: 4
  },

})

export default CompletedOrders