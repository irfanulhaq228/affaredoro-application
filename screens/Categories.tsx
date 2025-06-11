import { View, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { categories } from '../data';
import Category from '../components/Category';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import { useFocusEffect } from '@react-navigation/native';

const Categories = ({navigation}:{navigation:any}) => {
  const { colors } = useTheme()


  const [catData, setCatData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);





  const submitCategory = async () => {
    try {

      setIsLoading(true);

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

      fetch(`${baseUrl}/category/viewAll`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setCatData(resp?.data);
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



  useFocusEffect(useCallback(() => {
    submitCategory()
  }, []))


  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="More Category"  navigation={navigation} />
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={catData}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            numColumns={4}
            renderItem={({ item, index }) => (
              <Category
                name={item.name}
                icon={{ uri: baseUrl + '/' + item.image }}
                onPress={() => navigation.navigate('search',{cat:item}) }

              />
            )}
          />
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
    padding: 16
  },
  scrollView: {
    marginVertical: 22
  }
})

export default Categories