import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, TextInput, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, SIZES, icons, illustrations, images } from '../constants';
import HeaderWithSearch from '../components/HeaderWithSearch';
import { orderList } from '../data';
import Feather from "react-native-vector-icons/Feather";
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import OrderListItem from '../components/OrderListItem';
import ShippingAddressModal from '../components/ShippingAddressModal';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import SettingsPaymentModal from '../components/SettingsPaymentModal';
import Button from '../components/Button';
import ShowCategoryModal from '../components/ShowCategoryModal';

const OrderDetails = ({ navigation, route }: { navigation: any, route: any }) => {
  const { colors, dark } = useTheme();


  const [modalVisible, setModalVisible] = useState(false);

  // Render modal
  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => navigation.replace("(tabs)")}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalSubContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
              <View style={styles.backgroundIllustration}>
                <Image
                  source={illustrations.background}
                  resizeMode='contain'
                  style={[styles.modalIllustration, {
                    tintColor: dark ? COLORS.white : COLORS.primary,
                  }]}
                />
                <Image
                  source={icons.check}
                  resizeMode='contain'
                  style={[styles.editPencilIcon, {
                    tintColor: dark ? COLORS.primary : COLORS.white
                  }]}
                />
              </View>
              <Text style={[styles.modalTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900,
              }]}>Order Successful!</Text>
              <Text style={[styles.modalSubtitle, {
                color: dark ? COLORS.white : COLORS.black,
              }]}>
                Your order has been placed successfully.
              </Text>
              <ButtonFilled
                title="Continue"
                onPress={() => {
                  setModalVisible(false)
                  navigation.replace("(tabs)")
                }}
                style={styles.successBtn}
              />
              <Button
                title="View Order"
                onPress={() => {
                  setModalVisible(false)
                  navigation.replace("(tabs)")
                }}
                textColor={dark ? COLORS.white : COLORS.primary}
                style={{
                  width: "100%",
                  marginTop: 12,
                  borderRadius: 32,
                  backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                  borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  // show status array
  const statusOption = [
    {
      name: 'Pending',
      value: 'pending'
    },
    // {
    //   name:'Cancellled',
    //   value:'cancelled'
    // },
    {
      name: 'Shipping',
      value: 'shipping'
    },
    {
      name: 'Ready for Delivery',
      value: 'ready for delivery'
    },
    {
      name: 'Delivered',
      value: 'completed'
    },
  ]

  const [showStatus, setShowStatus] = useState<any>(false)
  const [selStatus, setSelStatus] = useState<any>(null)



  const [showAddress, setShowAddress] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [localId, setLocalId] = useState<any>(null);


  const [productIds, setProductIds] = useState<any>([])
  const [orderData, setOrderData] = useState<any>(null)
  const orderId = route?.params?.orderId
  const discount = route?.params?.discount



  const fetchData = async () => {

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


      fetch(`${baseUrl}/users/get`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {
            setData(resp?.data);
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else if (resp.status === "fail") {
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





  const fetchOrder = async () => {

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


      fetch(`${baseUrl}/order/get/${orderId}`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {
            setOrderData(resp?.data);
            setProductIds(resp?.data?.productId)
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else if (resp.status === "fail") {
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




  const fetchCards = async () => {

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


      fetch(`${baseUrl}/users/get-default-card`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {
            setCard(resp?.data);
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else if (resp.status === "fail") {
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
    fetchData();
    // fetchCards();
    fetchOrder();
  }, [showAddress,]));






  const submit = async (value: any) => {
    const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

    if (!token) {
      ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);

    console.log(selStatus?.value);


    try {
      const formdata = {
        orderStatus: value,
      };

      const requestOptions: any = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: JSON.stringify(formdata), // Convert formdata to JSON string
      };

      fetch(`${baseUrl}/order/update/${orderId}`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            // setModalVisible(true)
            ToastAndroid.show('Status Updared', 2000)
            fetchOrder()
            // navigation.goBack()
          } else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else if (resp.status === "fail") {
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
      // setIsLoading(false);
    }
  };




  return (<>
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderWithSearch
          title="Order Details"
          icon={icons.moreCircle}
          onPress={() => null}
        />
        <ScrollView
          contentContainerStyle={{
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            marginTop: 12
          }}
          showsVerticalScrollIndicator={false}>

          {orderData?.bumpOrder ? null : <>
            <Text style={[styles.summaryTitle, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}>Shipping Address</Text>
            <View style={[styles.summaryContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
            }]}>
              <View style={[styles.separateLine, {
                backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
              }]} />
              <View
                // onPress={() => { 
                //   // setShowAddress(true)
                //  }}
                style={styles.addressContainer}>
                <View style={styles.addressLeftContainer}>
                  <View style={styles.view1}>
                    <View style={styles.view2}>
                      <Image
                        source={icons.location2}
                        resizeMode='contain'
                        style={styles.locationIcon}
                      />
                    </View>
                  </View>
                  <View style={[styles.viewAddress, { width: '65%' }]}>
                    <View style={styles.viewView}>
                      <Text style={[styles.homeTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                      }]}>{orderData?.fullName}</Text>
                    </View>
                    <Text style={[styles.addressTitle, {
                      color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}>
                      {orderData?.address1}</Text>
                    <Text style={[styles.addressTitle, {
                      color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                    }]}>
                      {orderData?.zipCode}, {orderData?.country}, {orderData?.city}</Text>
                  </View>
                </View>
                {/* <Image
                source={icons.arrowRight}
                resizeMode='contain'
                style={[styles.arrowRightIcon, {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900
                }]}
              /> */}
              </View>
            </View>
          </>}
          <Text style={[styles.summaryTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Order</Text>
          <View style={[styles.summaryContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
          }]}>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <View
              // onPress={() => {  }}
              style={styles.addressContainer}>
              <View style={styles.addressLeftContainer}>
                <View style={styles.view1}>
                  <View style={styles.view2}>
                    {productIds.map((i: any, index: any) => {
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
                              }]}>+{(productIds.length - 2) + 1}</Text>
                            </View> : null}

                          </View> : null}
                        </>
                      )
                    })}
                  </View>
                </View>
                {productIds ? <View style={[styles.viewAddress, { width: '65%' }]}>
                  <View style={styles.viewView}>
                    <Text style={[styles.homeTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{productIds?.length > 1 ? `Bundle ${productIds?.length} items` : productIds[0]?.name}</Text>

                  </View>
                  <Text style={[styles.addressTitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                  }]}>
                    <Image
                      source={images.price}
                      resizeMode='contain'
                      style={{
                        width: 12, height: 12,
                        tintColor: dark ? COLORS.grayscale200 : COLORS.grayscale700
                      }}
                    />{(productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.totalPrice || product.totalPrice || 0), 0))?.toFixed(2)}</Text>
                  {/* <Text style={[styles.addressTitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                  }]}>
                    <Image
                      source={images.price}
                      resizeMode='contain'
                      style={{
                        width: 12, height: 12,
                        tintColor: dark ? COLORS.grayscale200 : COLORS.grayscale700
                      }}
                    />{(productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.inclPrice || product.inclPrice || 0), 0))?.toFixed(2)} Includes Buyer Protection</Text> */}
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
            </View>
          </View>


          <Text style={[styles.summaryTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Payment Method</Text>

          <View style={[styles.summaryContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
          }]}>
            <View style={[styles.separateLine, {
              backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200
            }]} />
            <View
              // onPress={() => { 
              //   // setShowCard(true)
              //  }}
              style={styles.addressContainer}>
              <View style={styles.addressLeftContainer}>
                <View style={styles.view1}>
                  <View style={styles.view2}>
                    <Image
                      source={icons.masterCardLogo}
                      resizeMode='contain'
                      style={styles.locationIcon}
                    />
                  </View>
                </View>
                {orderData?.last4 ? <View style={[styles.viewAddress, { width: '65%' }]}>
                  <View style={styles.viewView}>
                    <Text style={[styles.homeTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>{orderData?.brand}</Text>
                    {/* <View style={styles.defaultView}>
                      <Text style={[styles.defaultTitle, {
                        color: dark ? COLORS.white : COLORS.primary
                      }]}>Default</Text>
                    </View> */}
                  </View>
                  <Text style={[styles.addressTitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                  }]}>
                    ********{orderData?.last4}</Text>
                  <Text style={[styles.addressTitle, {
                    color: dark ? COLORS.grayscale200 : COLORS.grayscale700,
                  }]}>
                    Expires: {orderData?.expMonth}/{orderData?.expYear}</Text>
                </View> : <Text style={[styles.addressTitle, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>
                  Add Payment Method</Text>}
              </View>
              {/* <Image
                source={icons.arrowRight}
                resizeMode='contain'
                style={[styles.arrowRightIcon, {
                  tintColor: dark ? COLORS.white : COLORS.greyscale900
                }]}
              /> */}
            </View>
          </View>
          <View style={[styles.separateLine, {
            backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
            marginTop: 4,
            marginBottom: 16
          }]} />

          <Text style={[styles.summaryTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Order Summary</Text>


          {orderData?.bumpOrder ?
            <View style={[styles.summaryContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>{orderData?.bumpDay}-day bump</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}><Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.total}</Text>
              </View>

              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>VAT (5%)</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.primary }]}>- <Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.vat}</Text>
              </View>

              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Total</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}><Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.total}</Text>
              </View>
            </View>
            : <View style={[styles.summaryContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Order Status</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{orderData?.orderStatus}</Text>
                  {localId === orderData?.toUserId ? <TouchableOpacity
                    onPress={() => {
                      setShowStatus(true)
                    }}
                    style={[styles.cartBtn, {
                      backgroundColor: dark ? COLORS.white : COLORS.primary,
                      borderWidth: 0,
                      borderColor: COLORS.transparentWhite,
                      width: 80, height: 30
                    }]}>
                    <Text style={[styles.cartBtnText, {
                      color: dark ? COLORS.black : COLORS.white,
                      fontSize: 12
                    }]}>Change</Text>
                  </TouchableOpacity> : null}
                </View>
              </View>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Order</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}><Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.subTotal}</Text>
              </View>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Buyer Protection fee</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}><Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.buyerFee}</Text>
              </View>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Shipping</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.primary }]}><Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.shipping}</Text>
              </View>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Discount</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.primary }]}>- <Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.discount}</Text>
              </View>
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>VAT (5%)</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.primary }]}>- <Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.vat}</Text>
              </View>
              <View style={[styles.separateLine, {
                backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200
              }]} />
              <View style={styles.view}>
                <Text style={[styles.viewLeft, {
                  color: dark ? COLORS.grayscale200 : COLORS.grayscale700
                }]}>Total</Text>
                <Text style={[styles.viewRight, { color: dark ? COLORS.white : COLORS.greyscale900 }]}><Image
                  source={images.price}
                  resizeMode='contain'
                  style={{
                    width: 12, height: 12,
                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                  }}
                />{orderData?.total}</Text>
              </View>
            </View>}


        </ScrollView>
      </View>
      {/* <View style={[styles.buttonContainer, {
        backgroundColor: dark ? COLORS.dark2 : COLORS.white,
      }]}>
        <ButtonFilled
          title="Order Now"
          onPress={() => submit()}
          style={styles.placeOrderButton}
        />
      </View> */}
    </SafeAreaView>




    <ShowCategoryModal show={showStatus} setShow={setShowStatus} title={'Select Status'} data={statusOption} name={'name'} value={'value'} setSel={setSelStatus} sel={selStatus} onPress={submit} />
    {renderModal()}
    <ShippingAddressModal show={showAddress} setShow={setShowAddress} />
    <SettingsPaymentModal show={showCard} setShow={setShowCard} navigation={navigation} getData={fetchCards} />
  </>
  )
};

const styles = StyleSheet.create({
  cartBtn: {
    height: 52,
    width: 155,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    backgroundColor: COLORS.black,
    flexDirection: "row",
  },
  cartBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.white,
    textAlign: "center"
  },
  editPencilIcon: {
    width: 52,
    height: 52,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 54,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalSubContainer: {
    height: 520,
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
  },
  successBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32
  },
  receiptBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyScale800
  },
  methodContainer: {
    width: SIZES.width - 20,
    minHeight: 42,
    borderRadius: 22,
    borderColor: "gray",
    borderWidth: .3,
    flexDirection: "row",
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: "center",
    marginVertical: 5,
    marginStart: 10,

    padding: 10
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  methodSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
  },
  starContainer: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 0,
    marginBottom: 30,
    marginTop: 12,
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
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
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
  locationIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white
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
  defaultView: {
    width: 64,
    height: 26,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
    marginHorizontal: 12
  },
  defaultTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary,
  },
  addressTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  viewAddress: {
    marginHorizontal: 16
  },
  arrowRightIcon: {
    height: 16,
    width: 16,
    tintColor: COLORS.greyscale900
  },
  orderSummaryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  addItemView: {
    width: 78,
    height: 26,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.primary,
    borderWidth: 1.4,
  },
  addItemText: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.primary,
  },
  viewItemTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  viewLeftItemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary,
    marginRight: 16
  },
  viewItemTypeTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
    marginRight: 16
  },
  placeOrderButton: {
    marginBottom: 12,
    marginTop: 6
  },
  shippingMethods: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    marginVertical: 16
  },
  promoCodeContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    marginVertical: 12
  },
  codeInput: {
    width: SIZES.width - 112,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  addPromoBtn: {
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    width: SIZES.width,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  }
});

export default OrderDetails