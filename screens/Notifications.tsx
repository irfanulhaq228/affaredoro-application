import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import NotificationCard from '../components/NotificationCard';
import { notifications } from '../data';
import { useTheme } from '../theme/ThemeProvider';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';
import NotFoundItem from '../components/NotFoundItem';

const Notifications = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  /**
   * Render header
   */

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  const submit = async () => {
    setIsLoading(true)
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


      fetch(`${baseUrl}/notification/viewAll?userId=${mydata?._id}`, requestOptions)
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



  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.headerIconContainer, {
            borderColor: dark ? COLORS.dark3 : COLORS.grayscale200
          }]}>
          <Image
            source={icons.back}
            resizeMode='contain'
            style={[styles.arrowBackIcon, {
              tintColor: dark ? COLORS.white : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {
          color: dark ? COLORS.white : COLORS.greyscale900
        }]}>Notifications</Text>
        <Text>{"  "}</Text>
      </View>
    )
  }
  return (
    <>
    {isLoading && <LoaderScreen/>}
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={styles.headerNoti}>
            <View style={styles.headerNotiLeft}>
              <Text style={[styles.notiTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Recent</Text>
              <View style={styles.headerNotiView}>
                <Text style={styles.headerNotiTitle}>4</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          </View> */}
          {data?.length>0?<FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <NotificationCard
                title={item.title}
                description={item.subTitle}
                icon={item.type === "chat"? icons.chat: item.type === 'product'? icons.box2 : item?.type==='follow'? icons.user:item?.type==='order'?icons.box3:icons.discount}
                date={item.createdAt}
                status={item.status}
                onPress={()=>console.log(item)}
              />
            )}
          /> : <NotFoundItem title='No Notification Found!' />}
        </ScrollView>
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
    justifyContent: "space-between",
    alignItems: 'center'
  },
  headerIconContainer: {
    height: 46,
    width: 46,
    borderWidth: 1,
    borderColor: COLORS.grayscale200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999
  },
  arrowBackIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.black
  },
  headerNoti: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12
  },
  headerNotiLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  notiTitle: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.black
  },
  headerNotiView: {
    height: 16,
    width: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4
  },
  headerNotiTitle: {
    fontSize: 10,
    fontFamily: "Urbanist Bold",
    color: COLORS.white
  },
  clearAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: "Urbanist Medium"
  }
})

export default Notifications