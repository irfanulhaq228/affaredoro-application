import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, FlatList, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Feather from "react-native-vector-icons/Feather";
import { useTheme } from '../theme/ThemeProvider';
import { Calls, Chats } from '../tabs';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { messsagesData } from '../data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import { getTimeAgo } from '../utils/date';
import NotFoundItem from '../components/NotFoundItem';



interface MessageItem {
  id: string;
  userImg: any;
  fullName: string;
  lastMessage: string;
  lastMessageTime: string;
  messageInQueue: number;
  isOnline: boolean;
}


// Inbox tabs
const Inbox = ({ navigation, route }: { navigation: any, route: any }) => {
  const layout = useWindowDimensions();
  const { colors, dark } = useTheme();


  const [data, setData] = useState<any>(null);
  const [loginId, setLoginId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);



  const submitData = async () => {
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


      fetch(`${baseUrl}/chatConversation/viewAll?userId=${mydata?._id}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {

          if (resp.status === "ok") {
            setData(resp?.data);
            setLoginId(mydata?._id);

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
      submitData()

    }, []))



  /**
   * render header
   */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
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
            color: dark ? COLORS.white : COLORS.greyscale900
          }]}>Inbox</Text>
        </View>
        {/* <View style={styles.headerRight}>
          <TouchableOpacity>
            <Image
              source={icons.search}
              resizeMode='contain'
              style={[styles.searchIcon, {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={icons.moreCircle}
              resizeMode='contain'
              style={[styles.moreCircleIcon, {
                tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
              }]}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }




  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      key={index}
      onPress={async () => {

        var mydata: any = await AsyncStorage.getItem('data');
        mydata = JSON.parse(mydata);

        navigation.navigate("chat", { productIds: item?.productId, image: item?.productId[0]?.image[0], name: item?.productId[0]?.name, inclPrice: item?.productId[0]?.inclPrice, price: item?.productId[0]?.price, adminUser: item?.adminUser?._id, userId: item?.userId?._id, sendBy: mydata?._id === item?.adminUser?._id ? 'admin' : 'user', username: mydata?._id === item?.adminUser?._id ? item?.userId?.username : item?.adminUser?.username })

      }}
      style={[
        styles.userContainer, {
          borderBottomWidth: dark ? 0 : 1,
          paddingBottom: 5
        },
        index % 2 !== 0 ? {
          backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
          borderBottomWidth: dark ? 0 : 1,
          borderTopWidth: dark ? 0 : 0
        } : null,
      ]}>
      <View style={styles.userImageContainer}>
        {item.isOnline && item.isOnline === true && (
          <View style={styles.onlineIndicator} />
        )}

        <Image
          source={{ uri: loginId === item?.userId?._id ? baseUrl + '/' + item?.adminUser?.image : baseUrl + '/' + item?.userId?.image }}
          resizeMode="contain"
          style={styles.userImage}
        />
      </View>
      <View style={{ flexDirection: "row", width: SIZES.width - 104 }}>
        <View style={[styles.userInfoContainer]}>
          <Text style={[styles.userName, {
            color: dark ? COLORS.white : COLORS.black
          }]}>{loginId === item?.userId?._id ? item?.adminUser?.fullName : item?.userId.fullName}</Text>
          <Text style={styles.lastSeen}>{item.lastMessage}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
            {item?.productId.map((i: any, index: any) => {
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
                      }]}>+{(item?.productId.length - 2) + 1}</Text>
                    </View> : null}

                  </View> : null}
                </>
              )
            })}
          </View>
        </View>
        <View style={{
          position: "absolute",
          right: 4,
          alignItems: "center"
        }}>
          <Text style={[styles.lastMessageTime, {
            color: dark ? COLORS.white : COLORS.black
          }]}>{getTimeAgo(item.lastMessageDateTime)}</Text>
          <View>
            {
              item.messageInQueue > 0 && (
                <TouchableOpacity style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: item.messageInQueue ? dark ? COLORS.white : COLORS.primary : "transparent",
                  marginTop: 12
                }}>
                  <Text style={[styles.messageInQueue, {
                    color: dark ? COLORS.primary : COLORS.white
                  }]}>{`${item.messageInQueue}`}</Text>
                </TouchableOpacity>
              )
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}

        <View>
          {data?.length>0?<FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />:<NotFoundItem title='No chat found!' height={300}/>}
        </View>

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
    marginBottom: 20

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
  onlineIndicator: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.white,
    borderWidth: 2,
    position: 'absolute',
    top: 14,
    right: 2,
    zIndex: 1000,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  userInfoContainer: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: "Urbanist Bold",
    marginBottom: 4,
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

export default Inbox