import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Modal, TouchableWithoutFeedback, TextInput, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS, SIZES, icons, illustrations } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Fontisto from "react-native-vector-icons/Fontisto";
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import { productReviews } from "../data";
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Rating from '../components/Rating';
import ReviewCard from '../components/ReviewCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';
import NotFoundItem from '../components/NotFoundItem';

const ProductReviews = ({navigation,route}:any) => {
  const { colors, dark } = useTheme();
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState<number>(0); // Specify type for rating
  const [review, setReview] = useState<string>(""); // Specify type for review
  const toUserId= route?.params?.toUserId



  const [data, setData] = useState<any>([]);
  const [rate, setRate] = useState<any>(null);
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


      fetch(`${baseUrl}/rating/viewAll/${toUserId}`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            setData(resp?.data);
            setRate(resp);
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
      // setIsLoading(false);
    }
  };


  const submitStar = async (star:any) => {
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


      fetch(`${baseUrl}/rating/viewAll/${toUserId}?star=${star}`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            setData(resp?.data);
            setRate(resp);
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
      // setIsLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      submit();
    }, []))


  // useEffect(() => {
  //   setRatingModalVisible(true);
  // }, []);
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
              source={icons.back}
              resizeMode='contain'
              style={[styles.backIcon, {
                tintColor: dark ? COLORS.white : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>
            {rate?.averageRating} ({rate?.count} reviews)
          </Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, {
              tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity> */}
      </View>
    )
  }

  /**
   * 
   * @returns render reviews modal
   */

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
                }]}
                onChangeText={(text) => setReview(text)}
                defaultValue={review}
              />
              <ButtonFilled
                title="Write Review"
                onPress={() => {
                  setRatingModalVisible(false)
                  navigation.goBack()
                }}
                style={{
                  width: "100%",
                  marginTop: 12
                }}
              />
              <Button
                title="Cancel"
                onPress={() => {
                  setRatingModalVisible(false)
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

  /*
  ** render content
  */
  const renderContent = () => {
    const [selectedRating, setSelectedRating] = useState("All");

    const renderRatingButton = (rating: any) => (
      <TouchableOpacity
        key={rating}
        style={[styles.ratingButton, selectedRating === rating && styles.selectedRatingButton, {
          borderColor: dark ? COLORS.white : COLORS.primary,
        }]}
        onPress={() => {
          submitStar(rating==='All'?'':rating)
          setSelectedRating(rating)
        }}
      >
        <Fontisto name="star" size={12} color={selectedRating === rating ? COLORS.white : dark ? COLORS.white : COLORS.primary} />
        <Text style={[styles.ratingButtonText, selectedRating === rating && styles.selectedRatingButtonText, {
          color: selectedRating === rating ? COLORS.white : dark ? COLORS.white : COLORS.primary
        }]}>{rating}</Text>
      </TouchableOpacity>
    );

    const filteredReviews = selectedRating === "All" ? productReviews : productReviews.filter((review: any) => review.avgRating === selectedRating);
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.container, { backgroundColor: colors.background }]}>

          
        {/* Horizontal FlatList for rating buttons */}
        <FlatList
          horizontal
          data={["All", 5, 4, 3, 2, 1]}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => renderRatingButton(item)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ratingButtonContainer}
        />
        {data?.length>0?<>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <ReviewCard
              avatar={{uri:baseUrl+'/'+item?.fromUserId?.image}}
              name={item?.fromUserId?.fullName}
              description={item.reviews}
              avgRating={item.star}
              date={item.createdAt}
              numLikes={item.numLikes}
            />
          )}
        />

        </>:<NotFoundItem title='No rating found!'/>}
      </ScrollView>
    )
  }
  return (

    <>

    {isLoading && <LoaderScreen/>}
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        {renderContent()}
      </View>
      {renderModal()}
    </SafeAreaView>

    </>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    paddingBottom:0
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
    height: 622,
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

export default ProductReviews