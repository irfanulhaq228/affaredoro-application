import { View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { categories, myWishlist } from '../data';
import HeaderWithSearch from '../components/HeaderWithSearch';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import WishlistCard from '../components/WishlistCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, getFirst10Chars } from '../constants/baseUrl';
import ProductCard from '../components/ProductCard';
import LoaderScreen from '../components/LoaderScreen';
import NotFoundItem from '../components/NotFoundItem';

// Define the type for the component props
interface MyWishlistProps {
  navigation: NavigationProp<any>;
}

const MyWishlist: React.FC<MyWishlistProps> = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["0"]);




  const [data, setData] = useState<any>(null);
  const [localId, setLocalId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


  const submit = async () => {
    setIsLoading(true)
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

      var mydata: any = await AsyncStorage.getItem('data');

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


      fetch(`${baseUrl}/product/getLike`, requestOptions)
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

  // Filter products based on selected categories
  const filteredProducts = myWishlist.filter(product =>
    selectedCategories.includes("0") || selectedCategories.includes(product.categoryId)
  );



  return (<>

    {isLoading && <LoaderScreen />}

    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderWithSearch
          title="My Wishlist"
          icon={icons.search}
          onPress={() => navigation.navigate("Search")}
        />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          <View style={{
            backgroundColor: dark ? COLORS.dark1 : COLORS.white,
            marginVertical: 16
          }}>
            {data?.length > 0 ? <FlatList
              data={data}
              keyExtractor={item => item._id}
              numColumns={2}
              columnWrapperStyle={{ gap: 16 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ProductCard
                  id={item?._id}
                  like={item?.like}
                  name={item.name}
                  image={{ uri: baseUrl + '/' + item?.image[0] }}
                  inclPrice={getFirst10Chars(item?.categoryId[item?.categoryId?.length - 1]?.name)}
                  price={item?.bid?.find((b: any) => b.userId === localId)?.totalPrice || item?.totalPrice}
                  size={item.sizeId?.name}
                  onPress={() => navigation.navigate('ProductDetails', { id: item?._id })}
                />
              )}
            /> : <NotFoundItem title='No Wishlist Item Found!' />}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>

  </>
  );
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
    paddingBottom: 0
  },
  scrollView: {
    marginVertical: 2
  }
});

export default MyWishlist;