import { View, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { transactionHistory } from '../data';
import TransactionHistoryItem from '../components/TransactionHistoryItem';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import { getTimeAgo } from '../utils/date';
import NotFoundItem from '../components/NotFoundItem';

// Transactions history
const Income = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { colors } = useTheme();


    const [orderData, setOrderData] = useState<any>([]);
    const [selOrder, setSelOrder] = useState<any>(null);
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
  
        fetch(`${baseUrl}/order/getAll?toUserId=${true}`, requestOptions)
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
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* <Header title="Transaction History" /> */}
                <ScrollView
                    contentContainerStyle={{ marginVertical: 16 }}
                    showsVerticalScrollIndicator={false}>
                    {orderData?.length>0?<FlatList
                        data={orderData}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TransactionHistoryItem
                                image={{uri:baseUrl+'/'+item?.fromUserId?.image}} 
                                name={item?.fromUserId?.username}
                                date={getTimeAgo(item.createdAt)}
                                type={"Top up"}
                                amount={item.total}
                                onPress={() => {
                                  // navigation.navigate("topupereceipt")
                                }}
                            />
                        )}
                    /> : <NotFoundItem title='No Income Found!' />}
                </ScrollView>
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
        // padding: 16
    }
})

export default Income