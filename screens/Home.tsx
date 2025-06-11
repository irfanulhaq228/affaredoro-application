import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, TextInput, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, icons, images, SIZES } from '../constants';
import { baseUrl, getFirst10Chars, getFirstChars } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderScreen from '../components/LoaderScreen';
import SwiperFlatList from 'react-native-swiper-flatlist';
import SubHeaderItem from '../components/SubHeaderItem';
import Category from '../components/Category';
import ProductCard from '../components/ProductCard';

const Home = ({ navigation }: any) => {
  const { dark, colors } = useTheme();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [token, setToken] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [localId, setLocalId] = useState<any>(null);
  const [catData, setCatData] = useState<any>([]);
  const [prodData, setProdData] = useState<any>([]);
  const [noti, setNoti] = useState<any>(0);
  const [recomendData, setRecomendData] = useState<any>([]);
  const [slider, setSlider] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${baseUrl}/users/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      if (resp.status === 'ok') {
        setData(resp.data);
      } else if (resp.status === 'TokenExpiredError') {
        await AsyncStorage.clear();
        navigation.navigate('login');
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const fetchSlider = async (token: string) => {
    try {
      const res = await fetch(`${baseUrl}/slider/viewAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      if (resp.status === 'ok') {
        setSlider(resp.data);
      } else {
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const fetchNotif = async () => {
    try {


      var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
      mydata = JSON.parse(mydata);


      const res = await fetch(`${baseUrl}/notification/countUnreadData?userId=${mydata?._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      if (resp.status === 'ok') {
        setNoti(resp.data);
      } else {
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error(error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const fetchCategories = async (token: string) => {
    try {
      const res = await fetch(`${baseUrl}/category/viewAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      if (resp.status === 'ok') {
        setCatData(resp.data);
      } else {
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchProducts = async (token: string) => {
    try {
      const res = await fetch(`${baseUrl}/product/viewAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      if (resp.status === 'ok') {
        setProdData(resp.data);
      } else {
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchRecomended = async (token: string) => {
    try {
      const res = await fetch(`${baseUrl}/product/getRecomend`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const resp = await res.json();
      if (resp.status === 'ok') {
        setRecomendData(resp.data);
      } else {
        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const initScreen = async () => {
    setIsLoading(true);
    try {
      let storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        console.log("No token found, retrying...");
        await new Promise(resolve => setTimeout(resolve, 500)); // small delay
        storedToken = await AsyncStorage.getItem('token'); // try again
      }

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      // fetch data after setting token
      await Promise.all([
        fetchUser(storedToken),
        fetchSlider(storedToken),
      ]);

      setIsLoading(false);

      fetchProducts(storedToken);
      fetchCategories(storedToken);
      fetchRecomended(storedToken);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      initScreen();
      fetchNotif()
    }, [])
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.viewLeft}>
        {data?.image ? (
          <Image source={{ uri: `${baseUrl}/${data.image}` }} style={styles.userIcon} />
        ) : (
          <Image source={images.user1} style={styles.userIcon} />
        )}
        <View style={styles.viewNameContainer}>
          <Text style={styles.greeeting}>Hello, Welcome👋</Text>
          <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>{getFirst10Chars(data?.username)}</Text>
        </View>
      </View>
      <View style={styles.viewRight}>

        {/* <TouchableOpacity
          onPress={() => { navigation.navigate('UploadItem') }}
          style={[styles.cartBtn, {
            backgroundColor:dark ? COLORS.white : COLORS.primary,
            width: 80, height: 30
          }]}>
          <Text style={[styles.cartBtnText, {
            color: dark ? COLORS.black : COLORS.white,
            fontSize: 12
          }]}>Sell now</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => navigation.navigate('notifications')}>
          <Image source={icons.notificationBell2} style={[styles.bellIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]} />
          {noti > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -5,
                right: 0,
                backgroundColor: 'red',
                borderRadius: 10,
                width: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                {noti}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('mywishlist')}>
          <Image source={icons.heartOutline} style={[styles.bookmarkIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('search')}
      style={[styles.searchBarContainer, { backgroundColor: dark ? COLORS.dark2 : '#F5F5F5' }]}
    >
      <Image source={icons.search2} style={styles.searchIcon} />
      <TextInput
        placeholder="Search for products..."
        placeholderTextColor={COLORS.gray}
        style={styles.searchInput}
        editable={false}
      />
    </TouchableOpacity>
  );

  const renderBanner = () => (
    <View style={{ height: 150, width: '100%' }}>
      <SwiperFlatList
        paginationStyleItem={{ width: 10, height: 10, borderRadius: 200 }}
        showPagination
        autoplay
        autoplayDelay={2}
        autoplayLoop
        paginationActiveColor={COLORS.white}
        data={slider}
        renderItem={({ item }) => (
          <View style={{ position: 'relative' }}>
            <Image source={{ uri: `${baseUrl}/${item.image}` }} style={{ width: SIZES.width - 35, height: '100%', backgroundColor: COLORS.silver, borderRadius: 10 }} />
          </View>
        )}
      />
    </View>
  );

  const renderCategories = () => (
    <View>
      <SubHeaderItem title="Categories" navTitle="See all" onPress={() => navigation.navigate('categories')} />
      <FlatList
        data={catData.slice(0, 9)}
        keyExtractor={(item) => item._id}
        numColumns={4}
        renderItem={({ item }) => (
          <Category
            name={item.name}
            icon={{ uri: `${baseUrl}/${item.image}` }}
            onPress={() => navigation.navigate('search', { cat: item })}
          />
        )}
      />
    </View>
  );

  const renderAllProducts = () => (
    <View style={{ marginBottom: 30 }}>
      <SubHeaderItem title="Popular Products" navTitle="See All" onPress={() => navigation.navigate('search')} />
      <FlatList
        data={prodData}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            id={item._id}
            like={item.like}
            name={item.name}
            image={{ uri: `${baseUrl}/${item.image[0]}` }}
            inclPrice={getFirst10Chars(item?.categoryId[item?.categoryId?.length - 1]?.name)}
            price={item.bid?.find((b: any) => b.userId === localId)?.totalPrice || item.totalPrice}
            size={item.sizeId?.name}
            onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
          />
        )}
      />
    </View>
  );

  const renderRecomendedProducts = () => (
    <View>
      <SubHeaderItem title="Recommended for you" navTitle="" onPress={() => { }} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recomendData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductCard
            id={item._id}
            like={item.like}
            name={item.name}
            image={{ uri: `${baseUrl}/${item.image[0]}` }}
            inclPrice={getFirst10Chars(item?.categoryId[item?.categoryId?.length - 1]?.name)}
            price={item.bid?.find((b: any) => b.userId === localId)?.totalPrice || item.totalPrice}
            size={item.sizeId?.name}
            onPress={() => navigation.navigate('ProductDetails', { id: item._id })}
          />
        )}
      />
    </View>
  );

  return (
    <>
      {isLoading && <LoaderScreen />}
      <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { paddingBottom: 40 }]}>
          {renderHeader()}
          {renderSearchBar()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {slider.length > 0 && renderBanner()}
            {catData.length > 0 && renderCategories()}
            {recomendData.length > 0 && renderRecomendedProducts()}
            {prodData.length > 0 && renderAllProducts()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
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
  container: { flex: 1, padding: 16 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userIcon: { width: 48, height: 48, borderRadius: 24 },
  viewLeft: { flexDirection: 'row', alignItems: 'center' },
  greeeting: { fontSize: 12, color: 'gray' },
  title: { fontSize: 20, fontWeight: 'bold' },
  viewNameContainer: { marginLeft: 12 },
  viewRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bellIcon: { height: 24, width: 24, marginRight: 8 },
  bookmarkIcon: { height: 24, width: 24 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 52, borderRadius: 12, marginVertical: 16 },
  searchIcon: { width: 24, height: 24, tintColor: COLORS.gray },
  searchInput: { flex: 1, marginHorizontal: 8, fontSize: 16 },
});

export default Home;
