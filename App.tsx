import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image, LogBox, Modal, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeProvider';
import AppNavigation from './navigations/AppNavigation';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';
import { baseUrl, stripe_public_key } from './constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StripeProvider } from '@stripe/stripe-react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import NotificationToast, { showCustomNotification } from './components/CustomNotificationToast';
import { COLORS, icons, illustrations, SIZES } from './constants';
import Rating from './components/Rating';
import ButtonFilled from './components/ButtonFilled';
import Button from './components/Button';


//Ignore all log notifications
LogBox.ignoreAllLogs();

export default function App() {

  const { colors, dark } = useTheme();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState<number>(0); // Specify type for rating
  const [review, setReview] = useState<string>(""); // Specify type for review


  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getOrderRating = async () => {
    setIsLoading(true)
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token



      // if (!token) {
      //   ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
      //   return;
      // }

      const requestOptions: any = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
      };


      fetch(`${baseUrl}/order/rating`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            setData(resp?.data[0]);
            if(resp.data.length>0){
              setRatingModalVisible(true)
            }
            else{
              setRatingModalVisible(false)
            }
            setIsLoading(false)
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            // ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
          else if (resp.status === "fail") {
            // ToastAndroid.show(resp.message, ToastAndroid.SHORT);
            setIsLoading(false)
          }
        })
        .catch((error) => {
          // ToastAndroid.show(error.message, ToastAndroid.SHORT);
          console.error(error);
          setIsLoading(false)
        });
    } catch (error: any) {
      // ToastAndroid.show(error.message, ToastAndroid.SHORT);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitRating = async (status:any) => {
    setIsLoading(true)
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
      var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
      mydata = JSON.parse(mydata);



      if (!token) {
        ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
        return;
      }
      const formdata = {
        toUserId:data?.toUserId?._id,
        orderId:data?._id,
        fromUserId:mydata?._id,
        star:rating,
        reviews:review,
        status:status
      };
  
      const requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: JSON.stringify(formdata), // Convert formdata to JSON string
      };


      fetch(`${baseUrl}/rating/create`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            setRatingModalVisible(false)
            ToastAndroid.show('Rating added successfully!', ToastAndroid.SHORT)
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
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



  useEffect(() => {
    getOrderRating();
  }, [data])



  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={ratingModalVisible}>
        {/* <TouchableWithoutFeedback
            onPress={() => setModalVisible(false)}> */}
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalSubContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite
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
                source={icons.editPencil}
                resizeMode='contain'
                style={[styles.editPencilIcon, {
                  tintColor: dark ? COLORS.primary : COLORS.white
                }]}
              />
            </View>
            <Text style={[styles.modalTitle, {
              color: dark ? COLORS.white : COLORS.primary,
            }]}>Order Completed!</Text>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width:'100%' }}>

              <View>
                <Text style={[styles.descTitle, {
                  color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                }]}>{data?.productId.length} {data?.productId.length > 1 ? "Items" : "Item"}</Text>
                <Text style={[styles.reviewText, {
                  color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12,
                }]}>{data?.productId.length > 1 ? "Total Bill" : "Total Bill"} price: $ {data?.total}</Text>

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                {data?.productId.map((i: any, index: any) => {
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
                          }]}>+{(data?.productId.length - 2) + 1}</Text>
                        </View> : null}

                      </View> : null}
                    </>
                  )
                })}
              </View>

            </View>




            <Text style={[styles.modalSubtitle, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>
              Please give your rating & also your review...
            </Text>
            <Rating
              color={dark ? COLORS.white : COLORS.primary}
              rating={rating}
              setRating={setRating}
            />
            <TextInput
              placeholder="Write your review here..."
              placeholderTextColor={dark ? COLORS.gray : COLORS.gray}
              style={[styles.modalInput, {
                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                color: dark ? COLORS.white : COLORS.primary
              }]}
              onChangeText={(text) => setReview(text)}
              defaultValue={review}
            />
            <ButtonFilled
              title="Submit"
              onPress={() => {
                if(rating===0){
                  ToastAndroid.show('Must give rating', 2000)
                }
                else if(!review){
                  ToastAndroid.show('Must add reviews', 2000)
                }
                else{
                  submitRating('approve')
                }
              }}
              style={{
                width: "100%",
                marginTop: 12
              }}
            />
            <Button
              title="Cancel"
              onPress={() => {
                submitRating('cancel')
              }}
              textColor={dark ? COLORS.white : COLORS.primary}
              style={{
                width: "100%",
                marginTop: 12,
                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
              }}
            />
          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    )
  }



  const submit = async (token: string) => {



    try {

      var mydata: any = await AsyncStorage.getItem('data');
      const mytoken = await AsyncStorage.getItem('token');

      mydata = JSON.parse(mydata);


      if (mydata) {

        const formdata = new FormData();
        formdata.append("fcmToken", token);


        const requestOptions: any = {
          method: "PUT",
          body: formdata,
          redirect: "follow"
        };

        fetch(`${baseUrl}/users/update/${mydata?._id}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const resp = JSON.parse(result)

            if (resp.status === 'ok') {

            } else if (resp.status === 'fail') {
              ToastAndroid.show(resp.message, 2000)
            }

          })
          .catch((error) => {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
          });


      }
    } catch (error: any) {
      ToastAndroid.show(error.message, 2000)
      console.error(error)
    };
  }

  useEffect(() => {
    try {
      // in app notification
      const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
        console.log('FCM Message Data:', remoteMessage.data);
        console.log('FCM Message Notification:', remoteMessage.notification);
        handleNotification(remoteMessage.notification.title, remoteMessage.notification.body)
        showCustomNotification({
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });

      });

      // background notification
      messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
        console.log('FCM Background Message Data:', remoteMessage.data);
        console.log('FCM Background Message Notification:', remoteMessage.notification);

        // You can handle background messages here.
        // Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body)
        handleNotification(remoteMessage.notification.title, remoteMessage.notification.body)

      });

      // fcm token generate
      messaging()
        .getToken()
        .then(token => {
          console.log('FCM Token:', token);
          submit(token);

          // You may want to send this token to your server for sending push notifications.
        })
        .catch(error => {
          console.log('FCM Token Error:', error);
        });

      return unsubscribe;
    } catch (er) {
      console.log(er);
    }
  }, []);



  const handleNotification = async (title: any, body: any) => {

    // PushNotification.cancelAllLocalNotifications();


    PushNotification.localNotificationSchedule({
      channelId: "test-channel",
      title: title,
      message: body,
      // actions: ["View", "Cancel"],
      // actions: ["ReplyInput"],
      // reply_placeholder_text: "Write your response...", // (required)
      // reply_button_text: "Reply", // (required)
      date: new Date(Date.now()),
      allowWhileIdle: true,
      invokeApp: false,
      playSound: false, // (optional) default: true
      soundName: "notification_sound", // (optional) See `soundName` parameter of `localNotification` functionimportance
      vibrate: true,
      // repeatTime: 2,
    });



    // PushNotification.configure({
    //   onAction: function (notification) {
    //     if (notification.action === 'View') {
    //       console.log('Alarm Snoozed');
    //       // Linking.openURL('GidsolCMS://');
    //       // navi
    //     }
    //     else if (notification.action === 'Cancel') {
    //       console.log('Alarm Stoped');
    //       //PushNotification.cancelAllLocalNotifications();
    //     }
    //     else {
    //       console.log('Notification opened');
    //     }
    //   },
    //   actions: ["View", "Cancel"],
    // });
  }



  return (<>
    <StripeProvider
      publishableKey={stripe_public_key}
    // merchantIdentifier="merchant.com.yourapp" // For Apple Pay if needed
    >
      <ThemeProvider>
        <SafeAreaProvider>
          <NotificationToast />
          <AppNavigation />
        </SafeAreaProvider>
      </ThemeProvider>
    </StripeProvider>
    {renderModal()}
  </>
  );
}


const styles = StyleSheet.create({
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
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    paddingBottom: 0
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 0
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
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
  reviewHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  reviewHeaderLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  starTitle: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.black2
  },
  seeAll: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary
  },
  // Styles for rating buttons
  ratingButtonContainer: {
    paddingVertical: 10,
    marginVertical: 12
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedRatingButton: {
    backgroundColor: COLORS.primary,
  },
  ratingButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 10,
  },
  selectedRatingButtonText: {
    color: COLORS.white,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Urbanist Bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12,
    marginHorizontal: 16
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalSubContainer: {
    height: SIZES.height * 0.94,
    width: SIZES.width * 0.86,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999
  },
  modalIllustration: {
    height: 150,
    width: 150,
  },
  modalInput: {
    width: "100%",
    height: 52,
    backgroundColor: COLORS.tansparentPrimary,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginVertical: 12
  },
  editPencilIcon: {
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 60,
  }
})