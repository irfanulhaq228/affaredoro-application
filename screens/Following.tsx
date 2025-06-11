import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity, ImageSourcePropType, ToastAndroid, Dimensions } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, icons, SIZES } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { friends } from '../data';
import { useTheme } from '../theme/ThemeProvider';
import InviteFriendCard from '../components/InviteFriendCard';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import NotFoundItem from '../components/NotFoundItem';


type InviteFriendCardProps = {
  _id?: any;
  rating?: any;
  reviews?: string;
  name: string;
  avatar: ImageSourcePropType;  // Assuming avatar is an image source
};

// Invite Friends
const Following = ({ navigation, route }: { navigation: any, route: any }) => {
  const { colors, dark } = useTheme()
  const userId = route?.params?.userId



  const RenderFollowers: React.FC<InviteFriendCardProps> = ({ name, avatar, rating, reviews, _id }) => {
    return (
      <TouchableOpacity style={styles2.container} onPress={() => navigation.replace("viewprofile", { userId: _id })}>
        <View style={styles2.leftContainer}>
          <Image
            source={avatar}
            resizeMode='cover'
            style={styles2.avatar}
          />
          <View style={styles2.viewContainer}>
            <Text style={[styles2.name, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>{name}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("productreviews")}
              style={[styles2.starContainer, { marginHorizontal: 0 }]}>
              <View>
                <Image
                  source={rating === 0 ? icons.starOutline : icons.star}
                  resizeMode='contain'
                  style={[{
                    height: 12,
                    width: 19
                  }, {
                    tintColor: dark ? COLORS.white : COLORS.black
                  }]}
                />
              </View>
              <View>
                <Text style={[styles2.reviewText, {
                  color: dark ? COLORS.white : COLORS.greyScale800
                }]}>{rating} ({reviews} reviews)</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

      </TouchableOpacity>
    )
  }





  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  const submit = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

      var mydata: any = await AsyncStorage.getItem('data');
      mydata = JSON.parse(mydata);

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

      fetch(`${baseUrl}/users/viewUser/${userId}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setData(resp?.data);

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
      submit();
    }, []))


  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Following" navigation={navigation} />


        {data?.following?.length > 0 ? <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <FlatList
            data={data?.following}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <RenderFollowers
                _id={item._id}
                name={item.username}
                rating={item.rating}
                reviews={item.reviews}
                avatar={{ uri: baseUrl + '/' + item.image }}

              />
            )}
          />
        </ScrollView> : <NotFoundItem title='No following found' height={500} />}
      </View>
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
    backgroundColor: COLORS.white,
    padding: 16,
    paddingBottom: 0,
  },
  scrollView: {
    paddingVertical: 5,

  }
})




const styles2 = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    marginVertical: 12,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 52,
    width: 52,
    borderRadius: 999,
  },
  name: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
    marginBottom: 6,
  },
  phoneNumber: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
  },
  viewContainer: {
    marginLeft: 16,
  },
  btn: {
    width: 72,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  btnText: {
    fontFamily: "Urbanist Medium",
    color: COLORS.white,
    fontSize: 12,
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
});

export default Following