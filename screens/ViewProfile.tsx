import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, FlatList, ScrollView, Modal, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import React, { useCallback, useReducer, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { popularProducts } from '../data';
import Input from '../components/Input';;
import ButtonFilled from '../components/ButtonFilled';
import { baseUrl, getFirst10Chars } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotFoundItem from '../components/NotFoundItem';
import LoaderScreen from '../components/LoaderScreen';



// Inbox tabs
const ViewProfile = ({ navigation, route }: { navigation: any, route: any }) => {
  const layout = useWindowDimensions();
  const { colors, dark } = useTheme();
  const [data, setData] = useState<any>(null);
  const [prodData, setProdData] = useState<any>([]);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localId, setLocalId] = useState<any>(null);
  const userId = route?.params?.userId
  const [edit, setEdit] = useState<any>(route?.params?.edit)
  const [productIds, setProductIds] = useState<any>([])


  const submit = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

      setIsLoading(true)

      var mydata: any = await AsyncStorage.getItem('data');
      mydata = JSON.parse(mydata);
      setLocalId(mydata?._id)
      setEdit(mydata?._id === userId)

      if (!token) {
        ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
        setIsLoading(false)
        return;
      }

      const requestOptions: any = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      };

      fetch(`${baseUrl}/users/viewUser/${userId}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setData(resp?.data);
            if (
              resp?.data?.follow &&
              resp.data.follow.some((item: any) => item._id === mydata?._id)
            ) {
              setIsFollow(true);
            }
            setIsLoading(false)
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
          else {

            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
        })
        .catch((error) => {

          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          setIsLoading(false)
          console.error(error);
        });
    } catch (error: any) {

      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      console.error(error);
      setIsLoading(false)
    } finally {
      // setIsLoading(false);
    }
  };

  const submitProd = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

      setIsLoading(true)

      if (!token) {
        ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
        setIsLoading(false)
        return;
      }

      const requestOptions: any = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      };

      console.log(localId, userId);
      

      fetch(`${baseUrl}/product/viewAll?userId=${userId}&admin=${localId===userId?true:false}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setProdData(resp?.data);
            setIsLoading(false)
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
          else {
            setIsLoading(false)
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
        })
        .catch((error) => {
          setIsLoading(false)
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
          console.error(error);
        });
    } catch (error: any) {
      setIsLoading(false)
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };



  useFocusEffect(
    useCallback(() => {
      submit();
      submitProd();
    }, [localId]))







  const submitFollow = async (id: any) => {

    try {
      setIsLoading(true)
      var mydata: any = await AsyncStorage.getItem('data');

      mydata = JSON.parse(mydata);


      if (mydata) {

        const formdata = {
          id: id,
          userId: mydata._id,
        };


        const requestOptions: any = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata), // Convert formdata to JSON string
          redirect: "follow"
        };

        fetch(`${baseUrl}/users/toggleFollow`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resp = JSON.parse(result)

            if (resp.status === 'ok') {
              setIsFollow(!isFollow)
              submit()
              ToastAndroid.show(resp.message, 2000)
              setIsLoading(false)
            } else if (resp.status === 'fail') {
              ToastAndroid.show(resp.message, 2000)
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





  const [showOffer, setShowOffer] = useState(false)
  const [showReviewBundle, setShowReviewBundle] = useState(false)
  const [addBundle, setAddBundle] = useState<any>([])




  // function for add bundle if already added then remove bundle
  const addRemoveBundle = (item: any) => {
    let newBundle = [...productIds];

    // Check if the item already exists in the array by matching _id
    const index = newBundle.findIndex((obj) => obj._id === item._id);

    if (index === -1) {
      // If item is not found, add it
      newBundle.push(item);
    } else {
      // If item is found, remove it
      newBundle.splice(index, 1);
    }

    console.log(newBundle);
    setProductIds(newBundle);
  };








  const sumprice: any = (productIds.reduce((sum: any, product: any) => sum + (product.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)).toFixed(2)
  // const sumprice: any = 0
  // const taxprice = (addBundle.reduce((acc: any, curr: any) => acc + curr.tax, 0))?.toFixed(2)
  const ship: any = (productIds.reduce((sum: any, product: any) => sum + (product?.shipPrice || 0), 0)).toFixed(2)
  const taxprice: any = (productIds.reduce((sum: any, product: any) => sum + (product?.inclPrice || 0), 0)).toFixed(2)
  const save: any = data?.bundleDiscount ? productIds.length > 0 ? productIds.length > 1 ? productIds.length > 2 ? productIds.length > 4 ? ((sumprice) - ((sumprice * data?.item5) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * data?.item3) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * data?.item2) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * 0) / 100))?.toFixed(2) : null : 0


  const [showBundle, setShowBundle] = useState(false)
  const [selPrice, setSelPrice] = useState('custom')
  const [bid, setBid] = useState<any>(0)

  console.log(save, bid, ',,,,,,,,,,,,,,,,,,,,,,,,');


  function calculateValue(n: any) {
    return (1.75 + (n - 1) * 1.05).toFixed(2);
  }






  const submitHandler = async () => {
    setIsLoading(true)

    var mydata: any = await AsyncStorage.getItem('data');

    mydata = JSON.parse(mydata);

    try {

      const formdata = new FormData();
      formdata.append("adminUser", data?._id);
      formdata.append("senderId", localId);
      formdata.append("userId", localId);
      formdata.append("sendBy", 'user');
      if (bid > 0) {
        formdata.append("bidPrice", bid);
        formdata.append("bidInclPrice", calculateValue(bid));
        formdata.append("bidStatus", 'Pending');
      }


      productIds?.map((i: any) => {
        formdata.append("productId", i?._id);
      })



      const requestOptions: any = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      fetch(`${baseUrl}/chat/create`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const resp = JSON.parse(result)

          if (resp.status === 'ok') {
            setBid(0);
            setShowOffer(false);
            setShowBundle(false);
            setShowReviewBundle(false);
            navigation.navigate("chat", { productIds: productIds, image: productIds[0]?.image[0], name: productIds[0]?.name, inclPrice: productIds[0]?.inclPrice, price: productIds[0]?.price, userId: mydata?._id, adminUser: productIds[0]?.userId?._id, sendBy: mydata?._id === productIds[0]?.userId?._id ? 'admin' : 'user', username: mydata?._id === productIds[0]?.userId?._id ? mydata?.username : productIds[0]?.userId?.username })
            setIsLoading(false)
          }

          else if (resp.status === 'fail') {
            ToastAndroid.show(resp.message, 2000)
            setIsLoading(false)
          }

        })
        .catch((error) => {
          setIsLoading(false)
          ToastAndroid.show(error.message, 2000)
          console.error(error)
        });



    } catch (error: any) {
      setIsLoading(false)
      ToastAndroid.show(error.message, 2000)
      console.error(error)
    };
  }











  const showBundleModal = () => {
    return (
      <Modal visible={showBundle}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBundle(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowBundle(false)}>

          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.white, padding: 10, paddingBottom: 0, width: '100%', height: '100%' }}>



                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <View></View>
                  <View>
                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12
                    }]}>
                      {productIds.length > 0 ? productIds.length > 1 ? productIds.length > 2 ? productIds.length > 3 ? productIds.length > 4 ? `${data?.item5}% discount applied. You'll save $${save}!` : `Add 1 more item to get ${data?.item5}% off` : `Add 2 more item to get ${data?.item5}% off` : `Add 1 more item to get ${data?.item3}% off` : `Add 1 more item to get ${data?.item2}% off` : 'Add 2 items to get 20% off'}
                    </Text>
                  </View>
                  <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center' }} onPress={() => {
                    setShowBundle(false)
                  }}>
                    <Image
                      source={icons.cancelSquare}
                      resizeMode='contain'
                      style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                    />
                  </TouchableOpacity>



                </View>



                <ScrollView>

                  {renderBundleProducts()}

                </ScrollView>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, backgroundColor: dark ? COLORS.dark1 : COLORS.white, marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                    <View>
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 5 }}>
                        {save ? <Text style={[styles2.descTitle, {
                          color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                        }]}><Image
                            source={images.price}
                            resizeMode='contain'
                            style={{
                              width: 12, height: 12,
                              tintColor: dark ? COLORS.white : COLORS.greyscale900
                            }}
                          /> {save}</Text> : null}
                        {save !== sumprice ? <Text style={[styles2.descTitle, {
                          color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14, textDecorationLine: save ? 'line-through' : 'none'
                        }]}><Image
                            source={images.price}
                            resizeMode='contain'
                            style={{
                              width: 12, height: 12,
                              tintColor: dark ? COLORS.white : COLORS.greyscale900
                            }}
                          /> {sumprice}</Text> : null}
                      </View>
                      <Text style={[styles2.descTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                      }]}><Image
                          source={images.price}
                          resizeMode='contain'
                          style={{
                            width: 12, height: 12,
                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                          }}
                        /> {taxprice} incl.</Text>
                    </View>
                    {productIds?.length > 0 && productIds?.map((i: any, index: any) => {
                      return (
                        <>
                          {index < 1 ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, position: 'relative', }}>
                            <Image source={{ uri: baseUrl + '/' + i?.image[0] }} style={{ width: 50, height: 50, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                            {index === 0 ? <View style={{ position: 'absolute', backgroundColor: dark ? COLORS.black2 : COLORS.tertiaryWhite, top: 0, right: 0, borderRadius: 5, width: 55, height: 55, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                              <Text style={[{
                                fontSize: 18,
                                fontFamily: "Urbanist Bold",
                                color: COLORS.greyscale900,
                                marginVertical: 8
                              }, {
                                color: dark ? COLORS.white : COLORS.greyscale900, marginVertical: 0, fontSize: 14
                              }]}>+{(productIds.length - 1) + 1}</Text>
                            </View> : null}

                          </View> : null}
                        </>
                      )
                    })}
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowReviewBundle(true)}
                    style={[styles2.cartBtn, {
                      backgroundColor: productIds?.length === 0 ? COLORS.gray : dark ? COLORS.white : COLORS.black, width: 130, height: 50
                    }]} disabled={productIds?.length === 0 ? true : false}>
                    <Text style={[styles2.cartBtnText, {
                      color: dark ? COLORS.black : COLORS.white, fontSize: 14
                    }]}>Review Bundle</Text>
                  </TouchableOpacity>

                </View>






              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }




  const ShowReviewBundleModal = () => {
    return (

      <Modal visible={showReviewBundle}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReviewBundle(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowReviewBundle(false)}>

          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, paddingHorizontal: 20, width: '95%' }}>

                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                  setShowReviewBundle(false)
                }}>
                  <Image
                    source={icons.cancelSquare}
                    resizeMode='contain'
                    style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                  />
                </TouchableOpacity>


                <Text style={[styles2.descTitle, {
                  color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                }]}>Review Bundle</Text>



                <View style={{ marginBottom: 10 }}>


                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, }}>

                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}>{productIds.length} {productIds.length > 1 ? "Items" : "Item"}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                      {productIds?.length > 0 && productIds?.map((i: any, index: any) => {
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






                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, }}>

                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}>Order</Text>
                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}><Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 12, height: 12,
                          tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }}
                      /> {(Number(sumprice)).toFixed(2)}</Text>

                  </View>




                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>

                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}>Shipping</Text>
                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}><Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 12, height: 12,
                          tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }}
                      /> {ship}</Text>

                  </View>





                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>

                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}>Buyer Protection fee</Text>
                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}><Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 12, height: 12,
                          tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }}
                      /> {(Number(taxprice)).toFixed(2)}</Text>

                  </View>



                  {save ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}>Bundle discount {productIds.length > 1 ? productIds.length > 2 ? productIds.length > 4 ? `(${data?.item5}% discount)` : `(${data?.item3}% discount)` : `(${data?.item2}% discount)` : null}</Text>
                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}><Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 12, height: 12,
                          tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }}
                      /> {(sumprice - save)?.toFixed(2)}</Text>

                  </View> : null}



                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                    <Text style={[styles2.descTitle, {
                      color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                    }]}>Total to pay</Text>
                    <Text
                      style={[
                        styles2.descTitle,
                        {
                          color: dark ? COLORS.white : COLORS.greyscale900,
                          fontSize: 14,
                        },
                      ]}
                    >
                      <Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 14, height: 14,
                          tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }}
                      />{` ${(
                        Number(sumprice) +
                        (Number(taxprice)) +
                        Number(ship) -
                        (data?.bundleDiscount ? (Number(sumprice) - Number(save)) : 0)
                      ).toFixed(2)}`}
                    </Text>


                  </View>



                </View>



                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                  <TouchableOpacity
                    onPress={async () => {
                      setShowBundle(false)
                      setShowReviewBundle(false)


                      var mydata: any = await AsyncStorage.getItem('data');
                      mydata = JSON.parse(mydata);

                      navigation.navigate("chat", { productIds: productIds, image: productIds[0]?.image[0], name: productIds[0]?.name, inclPrice: productIds[0]?.inclPrice, price: productIds[0]?.price, userId: mydata?._id, adminUser: productIds[0]?.userId?._id, sendBy: mydata?._id === productIds[0]?.userId?._id ? 'admin' : 'user', username: mydata?._id === productIds[0]?.userId?._id ? mydata?.username : productIds[0]?.userId?.username })
                    }}
                    style={[styles2.cartBtn, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '100%',
                    }]}>
                    <Image
                      source={icons.chatBubble2}
                      resizeMode='contain'
                      style={[styles2.bagIcon, {
                        tintColor: dark ? COLORS.white : COLORS.primary
                      }]}
                    />
                    <Text style={[styles2.cartBtnText, {
                      color: dark ? COLORS.white : COLORS.primary,
                    }]}>Message Seller</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => setShowOffer(true)}
                    style={[styles2.cartBtn, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '48%'
                    }]}>
                    {/* <Image
                            source={icons.bags}
                            resizeMode='contain'
                            style={[styles.bagIcon, {
                                tintColor: dark ? COLORS.black : COLORS.white
                            }]}
                        /> */}
                    <Text style={[styles2.cartBtnText, {
                      color: dark ? COLORS.white : COLORS.primary,
                    }]}>Make an offer</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    onPress={() => navigation.navigate("checkout", { productIds: productIds, discount: data?.bundleDiscount ? (sumprice - save)?.toFixed(2) : 0 })}
                    style={[styles2.cartBtn, {
                      backgroundColor: dark ? COLORS.white : COLORS.black, width: '48%'
                    }]}>
                    <Image
                      source={icons.bags}
                      resizeMode='contain'
                      style={[styles2.bagIcon, {
                        tintColor: dark ? COLORS.black : COLORS.white
                      }]}
                    />
                    <Text style={[styles2.cartBtnText, {
                      color: dark ? COLORS.black : COLORS.white,
                    }]}>Buy now</Text>
                  </TouchableOpacity>





                </View>




              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    )
  }




  const ShowOfferModal = () => {
    return (


      <Modal visible={showOffer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOffer(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOffer(false)}>

          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, paddingHorizontal: 20, width: '95%' }}>

                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                  setShowOffer(false)
                }}>
                  <Image
                    source={icons.cancelSquare}
                    resizeMode='contain'
                    style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                  />
                </TouchableOpacity>


                <Text style={[styles2.descTitle, {
                  color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                }]}>Make an offer</Text>



                <View style={{ marginBottom: 10 }}>


                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>

                    <View>
                      <Text style={[styles2.descTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                      }]}>{productIds.length} {productIds.length > 1 ? "Items" : "Item"}</Text>
                      <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12,
                      }]}>{productIds.length > 1 ? "Bundle" : "Product"} price: $ {(productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0))}</Text>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                      {productIds?.length > 0 && productIds?.map((i: any, index: any) => {
                        return (
                          <>
                            {index < 2 ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, position: 'relative', }}>
                              <Image source={{ uri: baseUrl + '/' + i?.image[0] }} style={{ width: 30, height: 30, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                              {index === 1 ? <View style={{ position: 'absolute', backgroundColor: dark ? COLORS.black2 : COLORS.tertiaryWhite, top: 0, right: 0, borderRadius: 5, width: 35, height: 35, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
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






                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                    <TouchableOpacity
                      style={[
                        styles2.methodContainer, { width: '30%', borderWidth: selPrice === '10' ? 2 : .3 }
                      ]}
                      onPress={() => {
                        setBid(((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 10) / 100)))
                        setSelPrice('10')
                      }}>
                      <View style={[styles2.iconContainer, { gap: 5 }]}>

                        <View>
                          <Text style={[styles2.methodSubtitle, {
                            color: dark ? COLORS.white : COLORS.black
                          }]}>{" "}<Image
                              source={images.price}
                              resizeMode='contain'
                              style={{
                                width: 14, height: 14,
                                tintColor: dark ? COLORS.white : COLORS.black
                              }}
                            />{((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 10) / 100))?.toFixed(2)}</Text>

                          <View
                            style={[styles.starContainer, { marginHorizontal: 0 }]}>

                            <View>
                              <Text style={[styles.reviewText, {
                                color: dark ? COLORS.white : COLORS.greyScale800, fontSize: 12,
                              }]}>
                                {" "}10% off
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>



                    <TouchableOpacity
                      style={[
                        styles2.methodContainer, { width: '30%', borderWidth: selPrice === '20' ? 2 : .3 }
                      ]}
                      onPress={() => {
                        setBid(((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 20) / 100)))
                        setSelPrice('20')
                      }}>
                      <View style={[styles2.iconContainer, { gap: 5 }]}>

                        <View>
                          <Text style={[styles2.methodSubtitle, {
                            color: dark ? COLORS.white : COLORS.black
                          }]}>{" "}<Image
                              source={images.price}
                              resizeMode='contain'
                              style={{
                                width: 14, height: 14,
                                tintColor: dark ? COLORS.white : COLORS.black
                              }}
                            />{((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 20) / 100))?.toFixed(2)}</Text>

                          <View
                            style={[styles.starContainer, { marginHorizontal: 0 }]}>

                            <View>
                              <Text style={[styles.reviewText, {
                                color: dark ? COLORS.white : COLORS.greyScale800, fontSize: 12,
                              }]}>
                                {" "}20% off
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>



                    <TouchableOpacity
                      style={[
                        styles2.methodContainer, { width: '30%', borderWidth: selPrice === 'custom' ? 2 : .3 }
                      ]}
                      onPress={() => {
                        setBid(0)
                        setSelPrice('custom')
                      }}>
                      <View style={[styles2.iconContainer, { gap: 5 }]}>

                        <View>
                          <Text style={[styles2.methodSubtitle, {
                            color: dark ? COLORS.white : COLORS.black
                          }]}>{" "}<Image
                              source={images.price}
                              resizeMode='contain'
                              style={{
                                width: 14, height: 14,
                                tintColor: dark ? COLORS.white : COLORS.black
                              }}
                            />{((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 0) / 100))?.toFixed(2)}</Text>

                          <View
                            style={[styles.starContainer, { marginHorizontal: 0 }]}>

                            <View>
                              <Text style={[styles.reviewText, {
                                color: dark ? COLORS.white : COLORS.greyScale800, fontSize: 12,
                              }]}>
                                {" "}Set a price
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>




                  </View>


                  {selPrice === 'custom' ?

                    <Input
                      id="bid"
                      onInputChanged={(id, value) => {
                        setBid(value)
                      }}
                      placeholder="Enter Bid Price"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      icon={icons.diamond}
                      defaultValue={bid}
                      keyboardType="numeric"
                    />

                    : null}


                  {/* {bid > 0 ? <Text style={[styles.reviewText, {
                    color: dark ? COLORS.grayscale400 : COLORS.grayscale400, fontSize: 12, marginBottom: 10
                  }]}><Image
                      source={images.price}
                      resizeMode='contain'
                      style={{
                        width: 12, height: 12,
                        tintColor: dark ? COLORS.grayscale400 : COLORS.grayscale400
                      }}
                    /> {calculateValue(bid)} incl. Buyer Protection fee</Text> : null}


                  <Text style={[styles.reviewText, {
                    color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12, textAlign: 'center'
                  }]}>You have 25 offer(s) remaining. We set a limit to make it easier for our members to manage and review offers.</Text> */}

                </View>



                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                  <TouchableOpacity
                    onPress={submitHandler}
                    style={[styles2.cartBtn, {
                      backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 50
                    }]}>

                    {bid > 0 ? <>

                      <Text style={[styles2.cartBtnText, {
                        color: dark ? COLORS.black : COLORS.white,
                      }]}>Offer </Text>
                      <Image
                        source={images.price}
                        resizeMode='contain'
                        style={{
                          width: 14, height: 14,
                          tintColor: dark ? COLORS.black : COLORS.white
                        }}
                      />
                      <Text style={[styles2.cartBtnText, {
                        color: dark ? COLORS.black : COLORS.white,
                      }]}>{bid?.toFixed(2)} </Text>

                    </> : <Text style={[styles2.cartBtnText, {
                      color: dark ? COLORS.black : COLORS.white,
                    }]}>{bid > 0 ? `Offer $${bid}` : 'Offer'}</Text>}
                  </TouchableOpacity>


                </View>




              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    )
  }










  const hideProd = async (id: any) => {
    const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

    if (!token) {
      ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);



    try {
      const formdata = new FormData();

      formdata.append("hidden", false);


      const requestOptions: any = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: formdata,
        redirect: "follow"
      };

      fetch(`${baseUrl}/product/update/${id}`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            ToastAndroid.show('Product unhide successfully!', 2000)
            submitProd()
            setIsLoading(false)
          } else if (resp.status === "TokenExpiredError") {
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
      setIsLoading(false)
    } finally {
      // setIsLoading(false);
    }
  };






  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <View style={[styles.headerContainer, { minHeight: 40 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.arrowLeft}
              resizeMode='contain'
              style={[styles.arrowLeftIcon, {
                tintColor: dark ? COLORS.white : COLORS.primary
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900, width: '70%'
          }]}>{data?.username}</Text>
        </View>
        <View style={styles.headerRight}>
          {/* <TouchableOpacity>
            <Image
              source={icons.search}
              resizeMode='contain'
              style={[styles.searchIcon, {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity> */}
          {/* {edit ? null : <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={icons.moreCircle}
              resizeMode='contain'
              style={[styles.moreCircleIcon, {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>} */}
        </View>
      </View>
    )
  }





  const renderRecomendedProducts = () => {
    const [selectedCategories, setSelectedCategories] = useState<any[]>(["0"]);

    const filteredProducts = popularProducts.filter(product => selectedCategories.includes("0") || selectedCategories.includes(product.categoryId));


    return (
      <View>

        {prodData?.length > 0 ? <View style={{
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          marginTop: 20
        }}>
          <FlatList
            // showsHorizontalScrollIndicator={false}
            data={prodData}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{}}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <ProductCard
                  id={item?._id}
                  hidden={item?.hidden ? <View style={[styles.favouriteContainer, { top: 50, backgroundColor: COLORS.success }]}>
                    <TouchableOpacity onPress={() => { hideProd(item?._id) }}>
                      <Image
                        source={icons.hide}
                        resizeMode='contain'
                        style={styles.heartIcon}
                      />
                    </TouchableOpacity>
                  </View> : null}
                  like={item?.like}
                  name={item.name}
                  image={{ uri: baseUrl + '/' + item?.image[0] }}
                  inclPrice={getFirst10Chars(item?.categoryId[item?.categoryId?.length - 1]?.name)}
                  price={item?.bid?.find((b: any) => b.userId === localId)?.totalPrice || item?.totalPrice}
                  size={item.sizeId?.name}
                  onPress={() => {
                    if (item?.hidden) {
                      ToastAndroid.show('Product is hidden', ToastAndroid.SHORT);
                      return;
                    }
                    else navigation.replace('ProductDetails', { id: item?._id })
                  }}
                />
              )
            }}
          />
        </View> : <NotFoundItem img={data?.vacation ? 'https://cdn-icons-png.freepik.com/512/6195/6195626.png' : null} title={data?.vacation ? localId === data?._id ? 'Your vacation mode is on!' : 'Member is on vacation mode!' : 'No products found'} />}
      </View>
    )
  }








  const renderBundleProducts = () => {

    return (
      <View>

        {prodData.length > 0 ? <View style={{
          backgroundColor: dark ? COLORS.dark1 : COLORS.white,
          marginTop: 20
        }}>



          <FlatList
            data={prodData}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{}}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <ProductCard
                  id={item?._id}
                  like={item?.like}
                  name={item.name}
                  image={{ uri: baseUrl + '/' + item?.image[0] }}
                  inclPrice={getFirst10Chars(item?.categoryId[item?.categoryId?.length - 1]?.name)}
                  price={item?.bid?.find((b: any) => b.userId === localId)?.totalPrice || item?.totalPrice}
                  size={item.sizeId?.name}
                  onPress={() => navigation.replace('ProductDetails', { id: item?._id })}
                  button={
                    <>
                      <TouchableOpacity
                        onPress={() => addRemoveBundle(item)}
                        style={[
                          styles2.cartBtn,
                          {
                            backgroundColor: productIds.some((obj: any) => obj._id === item._id)
                              ? COLORS.red
                              : dark
                                ? COLORS.dark3
                                : COLORS.tansparentPrimary,
                            width: SIZES.width / 2 - 42,
                            height: 45,
                            marginBottom: 10,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles2.cartBtnText,
                            {
                              color: productIds.some((obj: any) => obj._id === item._id)
                                ? COLORS.white
                                : dark
                                  ? COLORS.white
                                  : COLORS.primary,
                            },
                          ]}
                        >
                          {productIds.some((obj: any) => obj._id === item._id) ? 'Remove' : 'Add'}
                        </Text>
                      </TouchableOpacity>




                    </>
                  }
                />
              )
            }}
          />
        </View> : <NotFoundItem title='No products found' />}
      </View>
    )
  }


  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);



  const dropdownItems = [
    { label: 'Block', value: 'block', icon: icons.hide },
    { label: 'Report', value: 'report', icon: icons.download2 },
  ];

  const handleDropdownSelect = (item: any) => {
    setSelectedItem(item.value);
    setModalVisible(false);

    // Perform actions based on the selected item
    switch (item.value) {
      case 'block':
        // Handle Share action
        setModalVisible(false);
        // navigation.navigate("(tabs)")
        break;
      case 'report':
        // Handle Download E-Receipt action
        setModalVisible(false);
        // navigation.navigate("(tabs)")
        break;

      default:
        break;
    }
  };


  const ShowDropdownModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback>
              <View style={{ top: 62, right: 12, position: 'absolute' }}>
                <View style={{
                  width: 202,
                  padding: 16,
                  backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                  borderRadius: 8
                }}>

                  <FlatList
                    data={dropdownItems}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: 'center',
                          marginVertical: 12
                        }}
                        onPress={() => handleDropdownSelect(item)}>
                        <Image
                          source={item.icon}
                          resizeMode='contain'
                          style={{
                            width: 20,
                            height: 20,
                            marginRight: 16,
                            tintColor: dark ? COLORS.white : COLORS.black
                          }}
                        />
                        <Text style={{
                          fontSize: 14,
                          fontFamily: "Urbanist SemiBold",
                          color: dark ? COLORS.white : COLORS.black
                        }}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>)
  }


  return (
    <>

      {isLoading && <LoaderScreen />}

      <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {renderHeader()}

          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.userContainer, {
                  borderBottomWidth: dark ? 0 : 0,
                },
              ]}>
              <View style={styles.userImageContainer}>
                {data?.image ? <Image
                  source={{ uri: baseUrl + '/' + data?.image }}
                  resizeMode="cover"
                  style={styles.userImage}
                /> : <Image
                  source={images.user2}
                  resizeMode="contain"
                  style={styles.userImage}
                />}
              </View>
              <View style={{ width: '65%' }}>
                <View style={[styles.userInfoContainer]}>
                  <Text style={[styles.userName, {
                    color: dark ? COLORS.white : COLORS.black
                  }]}>{data?.username}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("productreviews", { toUserId: data?._id })}
                    style={[styles.starContainer, { marginHorizontal: 0 }]}>
                    <View>
                      <Image
                        source={data?.rating === 0 ? icons.starOutline : icons.star}
                        resizeMode='contain'
                        style={[styles.starIcon, {
                          tintColor: dark ? COLORS.white : COLORS.black
                        }]}
                      />
                    </View>
                    <View>
                      <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800
                      }]}>{data?.rating} ({data?.reviews} reviews)</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}>
                  <TouchableOpacity >
                    <Text style={[styles.userName, {
                      color: dark ? COLORS.white : COLORS.black
                    }]}>{prodData?.length}</Text>
                    <Text style={[styles.lastMessageTime, {
                      color: dark ? COLORS.white : COLORS.black
                    }]}>products</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    navigation.navigate("Followers", { userId })
                  }}>
                    <Text style={[styles.userName, {
                      color: dark ? COLORS.white : COLORS.black
                    }]}>{data?.follow?.length}</Text>
                    <Text style={[styles.lastMessageTime, {
                      color: dark ? COLORS.white : COLORS.black
                    }]}>followers</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    navigation.navigate("Following", { userId })
                  }} >
                    <Text style={[styles.userName, {
                      color: dark ? COLORS.white : COLORS.black
                    }]}>{data?.following?.length}</Text>
                    <Text style={[styles.lastMessageTime, {
                      color: dark ? COLORS.white : COLORS.black
                    }]}>followings</Text>
                  </TouchableOpacity>
                </View>
                <View >

                  <View>

                  </View>
                </View>
              </View>
            </View>



            <View style={{ paddingHorizontal: 5 }}>
              {data?.country ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 5 }}>
                <Image
                  source={icons.pin}
                  resizeMode='contain'
                  style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black, width: 20, height: 20 }]}
                />
                <Text style={[styles2.reviewText, {
                  color: dark ? COLORS.white : COLORS.greyScale800, width: '92%'
                }]}>{data?.showCity ? data?.city + ',' : null} {data?.country}</Text>
              </View> : null}

              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 5 }}>
              <Image
                source={icons.clock2}
                resizeMode='contain'
                style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black, width: 15, height: 15 }]}
              />
              <Text style={[styles2.reviewText, {
                color: dark ? COLORS.white : COLORS.greyScale800, width: '92%'
              }]}>Last seen 23 minutes ago</Text>
            </View> */}

              {data?.emailLink ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 5 }}>
                <Image
                  source={icons.google}
                  resizeMode='contain'
                  style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black, width: 15, height: 15 }]}
                />
                <Text style={[styles2.reviewText, {
                  color: dark ? COLORS.white : COLORS.greyScale800, width: '92%'
                }]}>Verified from Google</Text>
              </View> : null}

              {data?.facebookLink ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 5 }}>
                <Image
                  source={icons.facebook2}
                  resizeMode='contain'
                  style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black, width: 15, height: 15 }]}
                />
                <Text style={[styles2.reviewText, {
                  color: dark ? COLORS.white : COLORS.greyScale800, width: '92%'
                }]}>Verified from Facebook</Text>
              </View> : null}

              {data?.phoneLink ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, gap: 5 }}>
                <Image
                  source={icons.call}
                  resizeMode='contain'
                  style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black, width: 15, height: 15 }]}
                />
                <Text style={[styles2.reviewText, {
                  color: dark ? COLORS.white : COLORS.greyScale800, width: '92%'
                }]}>Verified from Phone</Text>
              </View> : null}

            </View>

            {data?.about ? <>
              <Text style={[styles2.descTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900,
              }]}>About</Text>
              <Text style={[styles2.descText, {
                color: dark ? COLORS.greyscale300 : COLORS.greyScale800, marginBottom: 10
              }]}>{data?.about}</Text>
            </> : null}

            <ButtonFilled
              title={edit ? "Edit Profile" : isFollow ? "Following" : "Follow"}
              onPress={() => {
                if (edit) {
                  navigation.navigate("editprofile")
                }
                else {
                  submitFollow(data?._id)
                }
              }}
              color={isFollow ? COLORS.white : dark ? COLORS.black : COLORS.white}
              style={{
                marginVertical: 6,
                width: SIZES.width - 32,
                borderRadius: 30,
                backgroundColor: isFollow ? COLORS.tansparentPrimary : dark ? COLORS.white : COLORS.primary,
                borderWidth: isFollow ? 1 : 0,
                borderColor: isFollow ? COLORS.white : COLORS.transparentWhite
              }}
            />


            <View style={[styles2.separateLine, {
              backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200, marginTop: 12
            }]} />





            <Text style={[styles2.descTitle, {
              color: dark ? COLORS.white : COLORS.greyscale900,
            }]}>Member's Items ({prodData?.length})</Text>


            {/* {!edit && data?.products > 1 ? <View
              style={[
                styles2.methodContainer,
              ]}
            >
              <View style={[styles2.iconContainer, { gap: 5 }]}>

                <View>
                  <Text style={[styles2.methodSubtitle, {
                    color: dark ? COLORS.white : COLORS.black
                  }]}>{" "}Shop bundles</Text>

                  <View
                    style={[styles2.starContainer, { marginHorizontal: 0 }]}>

                    <View>
                      <Text style={[styles2.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800
                      }]}>
                        {" "}Get upto 50% off
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowBundle(true)}
                style={[styles2.cartBtn, {
                  backgroundColor: dark ? COLORS.white : COLORS.black, width: 130, height: 50
                }]}>
                <Text style={[styles2.cartBtnText, {
                  color: dark ? COLORS.black : COLORS.white, fontSize: 14
                }]}>Create Bundle</Text>
              </TouchableOpacity>
            </View> : null} */}



            {renderRecomendedProducts()}

          </ScrollView>
          {showBundleModal()}
          {ShowReviewBundleModal()}
          {ShowOfferModal()}
          {ShowDropdownModal()}

        </View>
      </SafeAreaView>

    </>
  )
};

const styles = StyleSheet.create({
  heartIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  favouriteContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: COLORS.primary,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    paddingBottom: 0,

  },
  starContainer: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  starIcon: {
    height: 12,
    width: 19
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyScale800
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between"
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  arrowLeftIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.primary
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    marginLeft: 12
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  moreCircleIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black,
    marginLeft: 12
  },
  addPostBtn: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: 72,
    right: 16,
    zIndex: 999,
    shadowRadius: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 }
  },
  iconBtnContainer: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center"
  },
  notiContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 16,
    width: 16,
    borderRadius: 999,
    backgroundColor: COLORS.red,
    position: "absolute",
    top: 1,
    right: 1,
    zIndex: 999,
  },
  notiText: {
    fontSize: 10,
    color: COLORS.white,
    fontFamily: "Urbanist Medium"
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 50,
    marginVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  searchInput: {
    width: '100%',
    height: '100%',
    marginHorizontal: 12,
  },
  flatListContainer: {
    paddingBottom: 100,
  },
  userContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  oddBackground: {
    backgroundColor: COLORS.tertiaryWhite,
  },
  userImageContainer: {
    paddingVertical: 15,
    marginRight: 22,
  },

  userImage: {
    height: 70,
    width: 70,
    borderRadius: 200,
  },
  userInfoContainer: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Urbanist Bold",
  },
  lastSeen: {
    fontSize: 14,
    color: "gray",
  },
  lastMessageTime: {
    fontSize: 12,
    fontFamily: "Urbanist Regular"
  },
  messageInQueue: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.white
  }
})




const styles2 = StyleSheet.create({
  methodContainer: {
    width: SIZES.width - 32,
    minHeight: 42,
    borderRadius: 22,
    borderColor: "gray",
    borderWidth: .3,
    flexDirection: "row",
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: "center",
    marginTop: 12,
    padding: 10
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    width: SIZES.width - 32,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 32,
    zIndex: 999,
    left: 16,
    right: 16
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  sendIconContainer: {
    marginLeft: 8
  },
  iconContainer1: {
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.tansparentPrimary,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: COLORS.primary
  },
  methodTitle: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyscale600
  },
  methodSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  contentContainer: {
    marginHorizontal: 12,
    marginBottom: 120,
  },
  separateLine: {
    width: SIZES.width - 32,
    height: 1,
    backgroundColor: COLORS.grayscale200,
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 12
  },
  socialContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    width: SIZES.width - 32
  },
  contentView: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: SIZES.width - 32
  },
  contentTitle: {
    fontSize: 30,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    marginVertical: 12
  },
  ratingView: {
    width: 68,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.silver,
    alignItems: "center",
    justifyContent: "center"
  },
  ratingViewTitle: {
    fontSize: 10,
    fontFamily: "Urbanist SemiBold",
    color: "#35383F",
    textAlign: "center"
  },
  starContainer: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  starIcon: {
    height: 20,
    width: 20
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyScale800
  },
  descTitle: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginVertical: 8
  },
  descText: {
    fontSize: 14,
    color: COLORS.greyScale800,
    fontFamily: "Urbanist Regular",
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    marginVertical: 12
  },
  featureView: {
    flexDirection: "column",
  },
  sizeContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  sizeView: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.greyscale600,
    marginRight: 12
  },
  sizeText: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale600,
    textAlign: "center"
  },
  selectedSize: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  selectedText: {
    color: 'white',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorView: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  selectedColor: {
    marginRight: 7.8
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    marginVertical: 12
  },
  qtyViewContainer: {
    backgroundColor: COLORS.silver,
    height: 48,
    width: 134,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16
  },
  qtyViewText: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    textAlign: "center"
  },
  qtyMidText: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    textAlign: "center",
    marginHorizontal: 16
  },
  cartBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: SIZES.width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 104,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    borderTopColor: COLORS.white,
    borderTopWidth: 1,
  },
  cartTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyscale600,
    marginBottom: 6
  },
  cartSubtitle: {
    fontSize: 24,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
  },
  cartBtn: {
    height: 58,
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
  bagIcon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white,
    marginRight: 8
  }
})

export default ViewProfile