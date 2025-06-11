import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ScrollView, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COLORS, SIZES, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseProducts, categories, ratings, sorts } from '../data';
import NotFoundCard from '../components/NotFoundCard';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ProductCard from '../components/ProductCard';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ShowCategoryModal from '../components/ShowCategoryModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, getFirst10Chars } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';



const Search = ({ navigation, route }: any) => {

  const cat = route?.params?.cat
  const refRBSheet = useRef<any>(null);
  const { dark, colors } = useTheme();


  const [minPrice, setMinPrice] = useState<any>(null);
  const [maxPrice, setMaxPrice] = useState<any>(null);
  const [sel, setSel] = useState<any>(cat ? cat : null);

  const [applyFilter, setApplyFilter] = useState(false);
  const [showSizeCategory, setShowSizeCategory] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showSubSubCategory, setShowSubSubCategory] = useState(false);
  const [prodData, setProdData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localId, setLocalId] = useState<any>(null);
  const [resultsCount, setResultsCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);



  const [selBrand, setSelBrand] = useState<any>([]);
  const [selSize, setSelSize] = useState<any>([]);
  const [selCond, setSelCond] = useState<any>([]);
  const [selPkg, setSelPkg] = useState<any>(null);
  const [selSort, setSelSort] = useState<any>(null);
  const [selColor, setSelColor] = useState<any>([]);
  const [selMaterial, setSelMaterial] = useState<any>([]);
  const [showCategory, setShowCategory] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [selParentCategoryData, setSelParentCategoryData] = useState<any>(null);



  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [brandOptions, setBrandOptions] = useState<any>([]);
  const [sizeOptions, setSizeOptions] = useState<any>([]);
  const [colorOptions, setColorOptions] = useState<any>([]);
  const [conditionOptions, setConditionOptions] = useState<any>([]);
  const [packageOptions, setPackageOptions] = useState<any>([]);
  const [materialOptions, setMaterialOptions] = useState<any>([]);
  const [sortOptions, setSortOptions] = useState<any>([{
    id: 1,
    name: 'Low to High',
    value: 'lowToHigh'
  },
  {
    id: 2,
    name: 'High to Low',
    value: 'highToLow'
  },
  {
    id: 3,
    name: 'Newest First',
    value: 'newestFirst'
  },
  ]);




  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = () => {
    // const allProducts = prodData.filter((product: any) =>
    //   product.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    // setFilteredProducts(allProducts);
    // // setResultsCount(allProducts.length);
  };


  const submitProd = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
      var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
      mydata = JSON.parse(mydata);

      setIsLoading(true)

      setLocalId(mydata?._id)
      setIsLoading(true)

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

      fetch(`${baseUrl}/product/viewAll?search=${searchQuery}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setProdData(resp?.data);
            // setFilteredProducts(resp?.data);

            const allProducts = resp?.data.filter((product: any) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(allProducts);
            setResultsCount(resp?.data?.length);
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


  const filterProd = async (selBrand: any, selSize: any, selCond: any, selColor: any, selMaterial: any, sel: any, minPrice: any, maxPrice: any, selSort: any) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

      setIsLoading(true)

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

      fetch(`${baseUrl}/product/viewAll?brandId=${selBrand ? selBrand?.map((i: any) => i._id).join(', ') : ''}&sizeId=${selSize ? selSize?.map((i: any) => i._id).join(', ') : ''}&conditionId=${selCond ? selCond?.map((i: any) => i._id).join(', ') : ''}&colorId=${selColor ? selColor?.map((i: any) => i._id).join(', ') : ''}&materialId=${selMaterial ? selMaterial?.map((i: any) => i._id).join(', ') : ''}&categoryId=${sel ? sel?._id : ''}&minPrice=${minPrice ? minPrice : ''}&maxPrice=${maxPrice ? maxPrice : ''}&sortBy=${selSort ? selSort?.value : ''}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setProdData(resp?.data);
            // setFilteredProducts(resp?.data);

            const allProducts = resp?.data.filter((product: any) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(allProducts);
            setResultsCount(resp?.data?.length);
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



  useFocusEffect(useCallback(() => {

    
    if (cat && sel) {
      filterProd(selBrand ? selBrand : null, selSize ? selSize : null, selCond ? selCond : null, selColor ? selColor : null, selMaterial ? selMaterial : null, sel ? sel : null, minPrice ? minPrice : null, maxPrice ? maxPrice : null, selSort ? selSort : null)
    }
    else {
      submitProd()
    }
  }, [searchQuery]))






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

      fetch(`${baseUrl}/category/viewAll?parentCategoryId=${selParentCategoryData?._id}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setCategoryOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };




  const handleCategoryPress = async (item: any) => {
    if (item?.subCategoryCount > 0) {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
          return;
        }

        const requestOptions: any = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(`${baseUrl}/category/viewAll?parentCategoryId=${item?._id}`, requestOptions);
        const resp = await response.json();

        if (resp.status === "ok") {
          setSelParentCategoryData(item);   // ✅ update parent item
          setCategoryOptions(resp.data);    // ✅ update new category list
          setShowCategory(true);            // ✅ keep modal open
        }
        else if (resp.status === "TokenExpiredError") {
          await AsyncStorage.clear();
          navigation.navigate('login');
          ToastAndroid.show(resp.message, ToastAndroid.SHORT);
        }
        else {
          ToastAndroid.show(resp.message, ToastAndroid.SHORT);
        }
      } catch (error: any) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
        console.error(error);
      }
    } else {
      setSel(item);              // ✅ finally select item
      setShowCategory(false);    // ✅ close modal
    }
  };





  const submitBrand = async () => {
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

      fetch(`${baseUrl}/brand/viewAll?parentCategoryId=${selParentCategoryData?._id}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setBrandOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };




  const submitSize = async () => {
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

      fetch(`${baseUrl}/size/viewAll?categoryId=${sel?._id}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setSizeOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };




  const submitCondition = async () => {
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

      fetch(`${baseUrl}/condition/viewAll`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setConditionOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };




  const submitColor = async () => {
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

      fetch(`${baseUrl}/color/viewAll`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setColorOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };




  const submitMaterial = async () => {
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

      fetch(`${baseUrl}/material/viewAll`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setMaterialOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };





  const submitPackageSize = async () => {
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

      fetch(`${baseUrl}/packageSize/viewAll`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setPackageOptions(resp?.data);
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
      // setIsLoading(false);
    }
  };



  useFocusEffect(
    useCallback(() => {
      submitCategory();
      submitBrand();
      submitSize();
      submitCondition();
      submitColor();
      submitMaterial();
      submitPackageSize();

      if (selParentCategoryData) {
        setShowCategory(true);
      }
    }, []))









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
            Search
          </Text>
        </View>
        {/* <TouchableOpacity>
          <Image
            source={icons.moreCircle}
            resizeMode='contain'
            style={[styles.moreIcon, {
              tintColor: dark ? COLORS.white : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity> */}
      </View>
    )
  }
  /**
   * Render content
  */
  const renderContent = () => {

    return (
      <View style={{ width: '100%' }}>
        {/* Search bar */}
        <View
          style={[styles.searchBarContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.silver, marginBottom: 10
          }]}>
          <TouchableOpacity
            onPress={handleSearch}>
            <Image
              source={icons.search2}
              resizeMode='contain'
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            placeholder='Search'
            placeholderTextColor={COLORS.gray}
            style={[styles.searchInput, {
              color: dark ? COLORS.white : COLORS.greyscale900
            }]}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          {/* <TouchableOpacity
            onPress={() => refRBSheet.current.open()}>
            <Image
              source={icons.filter}
              resizeMode='contain'
              style={[styles.filterIcon, {
                tintColor: dark ? COLORS.white : COLORS.primary
              }]}
            />
          </TouchableOpacity> */}
        </View>


        {(sel || selSize?.length > 0 || selBrand?.length > 0 || selCond?.length > 0 || selColor?.length > 0 || selMaterial?.length > 0 || selSort || minPrice || maxPrice) ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 10, width: '100%', height: 40 }}>

          {sel?.name ? <View
            style={[{
              flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: .4,
              borderRadius: 10,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              gap: 5,
              paddingHorizontal: 8,
              marginEnd: 5,
            }]}>
            <View>
              <Text style={[styles.tabText, {
                color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
              }]}>{sel?.name}</Text>

            </View>

            <TouchableOpacity onPress={() => {
              setSel(null)
              setSelParentCategoryData(null)
              submitCategory()
              filterProd(selBrand, selSize, selCond, selColor, selMaterial, null, minPrice, maxPrice, selSort)
            }} style={{ justifyContent: "center" }}>
              <Image
                source={icons.cancelSquare}
                resizeMode='contain'
                style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
              />
            </TouchableOpacity>


          </View> : null}

          {selSort?.name ? <View
            style={[{
              flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: .4,
              borderRadius: 10,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              gap: 5,
              paddingHorizontal: 8,
              marginEnd: 5,
            }]}>
            <View>
              <Text style={[styles.tabText, {
                color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
              }]}>{selSort?.name}</Text>

            </View>

            <TouchableOpacity onPress={() => {
              setSelSort(null)
              filterProd(selBrand, selSize, selCond, selColor, selMaterial, sel, minPrice, maxPrice, null)
            }} style={{ justifyContent: "center" }}>
              <Image
                source={icons.cancelSquare}
                resizeMode='contain'
                style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
              />
            </TouchableOpacity>


          </View> : null}


          {minPrice && maxPrice ? <View
            style={[{
              flexDirection: "row",
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: .4,
              borderRadius: 10,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              gap: 5,
              paddingHorizontal: 8,
              marginEnd: 5,
            }]}>
            <View>
              <Text style={[styles.tabText, {
                color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
              }]}>{minPrice} - {maxPrice}</Text>

            </View>

            <TouchableOpacity onPress={() => {
              setMinPrice(null)
              setMaxPrice(null)
              filterProd(selBrand, selSize, selCond, selColor, selMaterial, sel, null, null, selSort)
            }} style={{ justifyContent: "center" }}>
              <Image
                source={icons.cancelSquare}
                resizeMode='contain'
                style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
              />
            </TouchableOpacity>


          </View> : null}



          {selSize?.length > 0 ?
            selSize?.map((i: any) => {
              return (<>
                <View
                  style={[{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: .4,
                    borderRadius: 10,
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    gap: 5,
                    paddingHorizontal: 8,
                    marginEnd: 5,
                  }]}>
                  <Text style={[styles.tabText, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
                  }]}>{i?.name}</Text>

                  <TouchableOpacity onPress={() => {
                    const newSelSize = selSize?.filter((item: any) => item?._id !== i?._id);
                    setSelSize(newSelSize);
                    filterProd(selBrand, newSelSize, selCond, selColor, selMaterial, sel, minPrice, maxPrice, selSort)
                  }} style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.cancelSquare}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
                    />
                  </TouchableOpacity>


                </View>
              </>)
            })

            : null}


          {selBrand?.length > 0 ?
            selBrand?.map((i: any) => {
              return (<>
                <View
                  style={[{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: .4,
                    borderRadius: 10,
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    gap: 5,
                    paddingHorizontal: 8,
                    marginEnd: 5,
                  }]}>
                  <Text style={[styles.tabText, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
                  }]}>{i?.name}</Text>

                  <TouchableOpacity onPress={() => {
                    const newSelBrand = selBrand?.filter((item: any) => item?._id !== i?._id);
                    setSelBrand(newSelBrand);
                    filterProd(newSelBrand, selSize, selCond, selColor, selMaterial, sel, minPrice, maxPrice, selSort)
                  }} style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.cancelSquare}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
                    />
                  </TouchableOpacity>


                </View>
              </>)
            })

            : null}


          {selCond?.length > 0 ?
            selCond?.map((i: any) => {
              return (<>
                <View
                  style={[{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: .4,
                    borderRadius: 10,
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    gap: 5,
                    paddingHorizontal: 8,
                    marginEnd: 5,
                  }]}>
                  <Text style={[styles.tabText, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
                  }]}>{i?.name}</Text>

                  <TouchableOpacity onPress={() => {
                    const newSelCond = selCond?.filter((item: any) => item?._id !== i?._id);
                    setSelCond(newSelCond);
                    filterProd(selBrand, selSize, newSelCond, selColor, selMaterial, sel, minPrice, maxPrice, selSort)
                  }} style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.cancelSquare}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
                    />
                  </TouchableOpacity>


                </View>
              </>)
            })

            : null}


          {selColor?.length > 0 ?
            selColor?.map((i: any) => {
              return (<>
                <View
                  style={[{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: .4,
                    borderRadius: 10,
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    gap: 5,
                    paddingHorizontal: 8,
                    marginEnd: 5,
                  }]}>
                  <Text style={[styles.tabText, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
                  }]}>{i?.name}</Text>

                  <TouchableOpacity onPress={() => {
                    const newSelColor = selColor?.filter((item: any) => item?._id !== i?._id);
                    setSelColor(newSelColor);
                    filterProd(selBrand, selSize, selCond, newSelColor, selMaterial, sel, minPrice, maxPrice, selSort)
                  }} style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.cancelSquare}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
                    />
                  </TouchableOpacity>


                </View>
              </>)
            })

            : null}


          {selMaterial?.length > 0 ?
            selMaterial?.map((i: any) => {
              return (<>
                <View
                  style={[{
                    flexDirection: "row",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: .4,
                    borderRadius: 10,
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    gap: 5,
                    paddingHorizontal: 8,
                    marginEnd: 5,
                  }]}>
                  <Text style={[styles.tabText, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black, fontSize: 13
                  }]}>{i?.name}</Text>

                  <TouchableOpacity onPress={() => {
                    const newSelMaterial = selMaterial?.filter((item: any) => item?._id !== i?._id);
                    setSelMaterial(newSelMaterial);

                    filterProd(selBrand, selSize, selCond, selColor, newSelMaterial, sel, minPrice, maxPrice, selSort)
                  }} style={{ justifyContent: "center" }}>
                    <Image
                      source={icons.cancelSquare}
                      resizeMode='contain'
                      style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.white : COLORS.black }]}
                    />
                  </TouchableOpacity>


                </View>
              </>)
            })

            : null}

        </ScrollView> : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.reusltTabContainer}>
            {
              searchQuery && searchQuery.length > 0 ? (
                <>
                  <Text style={[styles.tabText, {
                    color: dark ? COLORS.secondaryWhite : COLORS.black
                  }]}>Result for "{searchQuery}"</Text>
                </>
              ) : (
                <Text style={[styles.tabText, {
                  color: dark ? COLORS.secondaryWhite : COLORS.black
                }]}>Products</Text>
              )
            }
            <View style={styles.resultContainer}>
              <Text style={[styles.tabText, {
                color: dark ? COLORS.secondaryWhite : COLORS.black
              }]}>{" "}{resultsCount} founds</Text>
            </View>
          </View>

          {/* Results container  */}
          <View>
            {/* result list */}
            <View style={{
              backgroundColor: dark ? COLORS.dark1 : COLORS.white,
              marginVertical: 16, paddingBottom: 210, marginBottom: 50
            }}>
              {resultsCount && resultsCount > 0 ? (
                <>
                  <FlatList
                    data={prodData}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    columnWrapperStyle={{}}
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
                          onPress={() => navigation.navigate('ProductDetails', { id: item?._id })}
                        />
                      )
                    }}
                  />
                </>
              ) : (
                <NotFoundCard />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }






  return (

    <>
      {isLoading && <LoaderScreen />}
      <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {renderHeader()}
          <View>
            {renderContent()}
          </View>
          <RBSheet
            ref={refRBSheet}
            closeOnPressMask={true}
            height={580}
            customStyles={{
              wrapper: {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              draggableIcon: {
                backgroundColor: dark ? COLORS.dark3 : "#000",
              },
              container: {
                borderTopRightRadius: 32,
                borderTopLeftRadius: 32,
                height: 580,
                backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                alignItems: "center",
              }
            }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', paddingLeft: 15 }}>
              <Text style={[styles.bottomTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900
              }]}>Filter</Text>
              <View style={styles.separateLine} />
              <View style={{ width: SIZES.width - 32 }}>

                <View>
                  <TouchableOpacity
                    onPress={() => setShowCategory(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Category"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={sel?.name}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>


                <View>
                  <TouchableOpacity
                    onPress={() => setShowBrand(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Brand"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={selBrand?.map((color: any) => color.name).join(', ')}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>


                <View>
                  <TouchableOpacity
                    onPress={() => setShowSize(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Size"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={selSize?.map((color: any) => color.name).join(', ')}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>


                <View>
                  <TouchableOpacity
                    onPress={() => setShowCondition(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Condition"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={selCond?.map((color: any) => color.name).join(', ')}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>


                <View>
                  <TouchableOpacity
                    onPress={() => setShowColor(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Colors"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={selColor?.map((color: any) => color.name).join(', ')}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>


                <View>
                  <TouchableOpacity
                    onPress={() => setShowMaterial(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Materials"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={selMaterial?.map((color: any) => color.name).join(', ')}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>



                <View>
                  <TouchableOpacity
                    onPress={() => setShowSort(true)} style={[styles.inputContainer, {
                      backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                      borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginVertical: 5,
                    }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Select Sort By"
                      placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                      selectionColor="#111"
                      keyboardType='default'
                      editable={false}
                      value={selSort?.name}
                    />
                    <View
                      style={[styles.selectFlagContainer, { width: 28, }]}
                    >
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={icons.down}
                          resizeMode='contain'
                          style={[styles.downIcon, { width: 18, height: 18, tintColor: dark ? COLORS.grayTie : COLORS.black }]}
                        />
                      </View>

                    </View>

                  </TouchableOpacity>

                </View>





                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
                  <View style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    width: '48%',
                    marginVertical: 5,
                  }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Min Price"
                      placeholderTextColor={dark ? COLORS.white : COLORS.black}
                      selectionColor="#111"
                      keyboardType='numeric'
                      onChangeText={(text) => setMinPrice(text)}
                      defaultValue={minPrice?.toString()}
                    />


                  </View>
                  <View style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                    width: '48%',
                    marginVertical: 5,
                  }]}>

                    <TextInput
                      style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                      placeholder="Max Price"
                      placeholderTextColor={dark ? COLORS.white : COLORS.black}
                      selectionColor="#111"
                      keyboardType='numeric'
                      onChangeText={(text) => setMinPrice(text)}
                      defaultValue={minPrice?.toString()}
                    />


                  </View>

                </View>

              </View>

            </ScrollView>



            <ShowCategoryModal selParentCategoryData={selParentCategoryData} setSelParentCategoryData={setSelParentCategoryData} show={showCategory} setShow={setShowCategory} title={'Select Category'} data={categoryOptions} value={'_id'} name={'name'} setSel={setSel} moreSel={true} sel={sel} onPress={handleCategoryPress} />




            <ShowCategoryModal show={showBrand} setShow={setShowBrand} title={'Select Brand'} data={brandOptions} value={'_id'} name={'name'} setSel={setSelBrand} allow={100} sel={selBrand} onPress={() => {
              setShowBrand(false)
            }} />


            <ShowCategoryModal show={showSize} setShow={setShowSize} title={'Select Size'} data={sizeOptions} value={'_id'} name={'name'} setSel={setSelSize} sel={selSize} allow={100} onPress={() => {
              setShowSize(false)
            }} />


            <ShowCategoryModal show={showCondition} setShow={setShowCondition} title={'Select Condition'} data={conditionOptions} value={'_id'} name={'name'} setSel={setSelCond} sel={selCond} allow={100} onPress={() => {
              setShowCondition(false)
            }} />



            <ShowCategoryModal show={showColor} setShow={setShowColor} title={'Select Color'} data={colorOptions} name={'name'} value={'_id'} setSel={setSelColor} sel={selColor} allow={100} onPress={() => {

              setShowColor(false)

            }} />


            <ShowCategoryModal show={showMaterial} setShow={setShowMaterial} title={'Select Material'} data={materialOptions} name={'name'} value={'_id'} setSel={setSelMaterial} sel={selMaterial} allow={100} onPress={() => {

              setShowMaterial(false)

            }} />



            <ShowCategoryModal show={showPackage} setShow={setShowPackage} title={'Select Package Size'} data={packageOptions} name={'name'} value={'_id'} setSel={setSelPkg} allow={100} sel={selPkg} onPress={() => {
              setShowPackage(false)
            }} />


            <ShowCategoryModal show={showSort} setShow={setShowSort} title={'Select Sort By'} data={sortOptions} name={'name'} value={'value'} setSel={setSelSort} sel={selSort} onPress={() => {
              setShowSort(false)
            }} />


            <View style={styles.separateLine} />

            <View style={styles.bottomContainer}>
              <Button
                title="Reset"
                style={{
                  width: (SIZES.width - 32) / 2 - 8,
                  backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                  borderRadius: 32,
                  borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                }}
                textColor={dark ? COLORS.white : COLORS.primary}
                onPress={() => refRBSheet.current.close()}
              />
              <Button
                title="Filter"
                textColor={dark ? COLORS.primary : COLORS.white}
                style={{
                  width: (SIZES.width - 32) / 2 - 8,
                  backgroundColor: dark ? COLORS.white : COLORS.primary,
                  borderRadius: 32,
                  borderColor: dark ? COLORS.white : COLORS.primary
                }}
                onPress={() => {
                  refRBSheet.current.close()
                  filterProd(selBrand ? selBrand : null, selSize ? selSize : null, selCond ? selCond : null, selColor ? selColor : null, selMaterial ? selMaterial : null, sel ? sel : null, minPrice ? minPrice : null, maxPrice ? maxPrice : null, selSort ? selSort : null)

                }}
              />
            </View>
          </RBSheet>
        </View>
      </SafeAreaView>

    </>
  )
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,

  },
  inputContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: .4,
    borderRadius: 10,
    height: 52,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: COLORS.greyscale500,
  },
  downIcon: {
    width: 10,
    height: 10,
    tintColor: "#111"
  },
  selectFlagContainer: {
    width: 90,
    height: 50,
    marginHorizontal: 5,
    flexDirection: "row",
  },
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    width: SIZES.width - 32,
    justifyContent: "space-between",
    marginBottom: 16
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
  searchBarContainer: {
    width: SIZES.width - 32,
    backgroundColor: COLORS.secondaryWhite,
    padding: 16,
    borderRadius: 12,
    height: 52,
    paddingVertical: 5,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center"
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    marginHorizontal: 8
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between"
  },
  tabBtn: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 32
  },
  selectedTab: {
    width: (SIZES.width - 32) / 2 - 6,
    height: 42,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: COLORS.primary,
    borderRadius: 32
  },
  tabBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    textAlign: "center"
  },
  selectedTabText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
    textAlign: "center"
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.black,
  },
  subResult: {
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary
  },
  resultLeftView: {
    flexDirection: "row"
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: SIZES.width
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  logoutButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    textAlign: "center",
    marginTop: 12
  },
  separateLine: {
    height: .4,
    width: SIZES.width - 32,
    backgroundColor: COLORS.greyscale300,
    marginVertical: 12
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black,
    marginVertical: 12
  },
  reusltTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: SIZES.width - 32,
    justifyContent: "space-between"
  },
  viewDashboard: {
    flexDirection: "row",
    alignItems: "center",
    width: 36,
    justifyContent: "space-between"
  },
  dashboardIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.primary
  },
  tabText: {
    fontSize: 20,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.black
  }
})

export default Search