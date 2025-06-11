import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, TextInput, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import Input from '../components/Input';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerModal from '../components/DatePickerModal';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ShowCategoryModal from '../components/ShowCategoryModal';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';


const EditItem = ({ navigation, route }: any) => {
  const { dark } = useTheme();
  const [images, setImages] = useState<any>([]);
  const [error, setError] = useState();
  const [prod, setProd] = useState<any>(null);

  const productId = route?.params?.productId

  console.log(images);


  const pickerRef = useRef<any>();

  useEffect(() => {

    // Automatically open the picker when the component mounts
    if (pickerRef.current) {
      pickerRef.current; // Open picker on iOS
    }
  }, []);


  const [sel, setSel] = useState<any>(null);
  const [name, setName] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const [price, setPrice] = useState<any>(null);
  const [selParentCategoryData, setSelParentCategoryData] = useState<any>(null);
  const [selBrand, setSelBrand] = useState<any>(null);
  const [selSize, setSelSize] = useState<any>(null);
  const [selCond, setSelCond] = useState<any>(null);
  const [selPkg, setSelPkg] = useState<any>(null);
  const [selColor, setSelColor] = useState<any>([]);
  const [selMaterial, setSelMaterial] = useState<any>([]);
  const [showCategory, setShowCategory] = useState(false);
  const [showSubSubSubCategory, setShowSubSubSubCategory] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [showPackage, setShowPackage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // const colorOptions = [
  //   { label: 'red', value: 'red', count: 0 },
  //   { label: 'green', value: 'green', count: 0 },
  //   { label: 'blue', value: 'blue', count: 0 }
  // ];

  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [brandOptions, setBrandOptions] = useState<any>([]);
  const [sizeOptions, setSizeOptions] = useState<any>([]);
  const [colorOptions, setColorOptions] = useState<any>([]);
  const [conditionOptions, setConditionOptions] = useState<any>([]);
  const [packageOptions, setPackageOptions] = useState<any>([]);
  const [materialOptions, setMaterialOptions] = useState<any>([]);





  // const conditionOptions: any = [
  //   { label: 'New with tags', value: 'New with tags', subTitle:'A brand-new, unused item with tags attached or in the original packaging.', count: 0 },
  //   { label: 'New without tags', value: 'New without tags', subTitle:'A brand-new, unused item without tags or original packaging.', count: 0 },
  //   { label: 'Very good', value: 'Very good', subTitle:'A lightly used item that may have slight imperfections, but still looks great. Include photos and descriptions of any flaws in your listing.', count: 0 },
  //   { label: 'Good', value: 'Good', subTitle:'A used item that may show imperfections and signs of wear. Include photos and descriptions of flaws in your listing.', count: 0 },
  //   { label: 'Satisfactory', value: 'Satisfactory', subTitle:'A frequently used item with imperfections and signs of wear. Include photos and descriptions of flaws in your listing.', count: 0 },

  // ];

  // const packageOptions: any = [
  //   { label: 'Small', value: 'Small', subTitle:'For items that’d fit in a large envelope.', count: 0 },
  //   { label: 'Medium', value: 'Medium', subTitle:'For items that’d fit in a shoebox.', count: 0 },
  //   { label: 'Large', value: 'Large', subTitle:'For items that’d fit in a moving box.', count: 0 },

  // ];





  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 0, // 0 means unlimited selection
      quality: 0.8,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
      } else {
        if (response.assets) {
          // Add new images to the existing array
          const newImages: any = [...images, ...response.assets];
          setImages(newImages);
        }
      }
    });
  };


  const handleDeleteImage = (index: any) => {

    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

  };







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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
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
      setIsLoading(false);
    }
  };






  const submitProdData = async () => {
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

      fetch(`${baseUrl}/product/get/${productId}`, requestOptions)
        .then((response) => response.json()) // Directly parse JSON
        .then(async (resp) => {
          if (resp.status === "ok") {
            setProd(resp?.data);
            setName(resp.data?.name)
            setDescription(resp.data?.description)
            const categoryId = resp?.data?.categoryId?.at(-1)
            setSel(categoryId)
            setSelBrand(resp?.data?.brandId)
            setSelSize(resp?.data?.sizeId)
            setSelColor(resp?.data?.colorId)
            setSelMaterial(resp?.data?.materialId)
            setSelPkg(resp?.data?.packageSizeId)
            setSelCond(resp?.data?.conditionId)
            setPrice(resp?.data?.price)
            if (Array.isArray(resp?.data?.image)) {
              const newImages = resp.data.image.map((i: string) => ({ uri: `${baseUrl}/${i}` }));
              setImages((prevImages: any) => [...prevImages, ...newImages]);
            }



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
      submitCategory();
      submitBrand();
      submitSize();
      submitCondition();
      submitColor();
      submitMaterial();
      submitPackageSize();
      submitProdData()

      if (selParentCategoryData) {
        setShowCategory(true);
      }
    }, [selParentCategoryData]))







  const submit = async () => {

    const token = await AsyncStorage.getItem("token"); // Retrieve the stored token



    if (!token) {
      ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
      return;
    }


    setIsLoading(true)


    try {

      const formdata = new FormData();
      if (prod?.name !== name) {
        formdata.append("name", name);
      }
      if (prod?.description !== description) {
        formdata.append("description", description);
      }
      if (prod?.price !== price) {
        formdata.append("price", price);
      }

      const categoryId = prod?.categoryId?.at(-1)

      if (categoryId?._id !== sel?._id) {
        formdata.append("categoryId", sel?._id);
      }

      if (prod?.brandId?._id !== selBrand?._id) {
        formdata.append("brandId", selBrand?._id);
      }

      if (prod?.sizeId?._id !== selSize?._id) {
        formdata.append("sizeId", selSize?._id);
      }

      // Update conditionId only if changed
      if (prod?.conditionId?._id !== selCond?._id) {
        formdata.append("conditionId", selCond?._id);
      }

      // Update colorId only if there's a difference
      if (selColor?.length > 0) {
        const prodColorIds = prod?.colorId?.map((c: any) => c._id) || [];
        selColor.forEach((i: any) => {
          if (!prodColorIds.includes(i._id)) {
            formdata.append("colorId", i._id);
          }
        });
      }

      // Update materialId only if there's a difference
      if (selMaterial?.length > 0) {
        const prodMaterialIds = prod?.materialId?.map((m: any) => m._id) || [];
        selMaterial.forEach((i: any) => {
          if (!prodMaterialIds.includes(i._id)) {
            formdata.append("materialId", i._id);
          }
        });
      }

      // Update packageSizeId only if changed
      if (prod?.packageSizeId?._id !== selPkg?._id) {
        formdata.append("packageSizeId", selPkg._id);
      }


      if (images.length > 0) {
        const prodImageUris = prod?.image?.map((img: any) => img.uri || img) || [];
      
        images.forEach((image: any) => {
          // Check if image is new (not already in prod images)
          if (!prodImageUris.includes(image.uri)) {
            formdata.append('image', {
              uri: image.uri,
              type: image?.type || 'image/jpeg',
              name: image?.fileName || `image_${Date.now()}.jpg`,
            } as any); // You can define a proper type instead of `any` if needed
          }
        });
      }
      


      const requestOptions: any = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: formdata,
        redirect: "follow"
      };

      fetch(`${baseUrl}/product/update/${productId}`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          console.log(result)
          const resp = JSON.parse(result)

          if (resp.status === 'ok') {
            navigation.goBack()
            ToastAndroid.show('Product updated successfully!', ToastAndroid.SHORT);

          }

          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }

          else if (resp.status === 'fail') {
            ToastAndroid.show(resp.message, 2000)
          }

        })
        .catch((error) => {
          ToastAndroid.show(error.message, 2000)
          console.error(error)
        });



    } catch (error: any) {
      ToastAndroid.show(error.message, 2000)
      console.error(error)
    };
  }





  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Upload Product" navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            flexDirection: "column",
            borderWidth: .4,
            borderRadius: 10,
            minHeight: 132,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
            borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,
            position: 'relative'
          }}>
            {/* <View style={styles.avatarContainer}> */}
            {/* <Image
                source={image === null ? images.user1 : image}
                resizeMode="cover"
                style={styles.avatar} /> */}

            {images.length > 0 ? (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, flexWrap: 'wrap', padding: 5 }}>
                {images?.map((item: any, index: any) => {
                  return (<>
                    <View style={{
                      margin: 4,
                      position: 'relative',
                      borderRadius: 8,

                    }}>
                      <Image source={{ uri: item.uri }} style={{
                        width: 95,
                        height: 95,
                        aspectRatio: 1,
                        borderRadius: 8,
                      }} />
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 0, 0, 0.7)',
                          borderRadius: 12,
                          padding: 4,
                        }}
                        onPress={() => handleDeleteImage(index)}
                      >
                        <Icon name="trash" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </>)
                })}

                <TouchableOpacity
                  onPress={pickImage}
                  style={[styles.pickImage, { width: 100, height: 100 }]}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={COLORS.white} />
                </TouchableOpacity>

              </View>
            ) : (
              <>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.pickImage}>
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={COLORS.white} />


                </TouchableOpacity>
                <Text style={{ ...FONTS.body4, color: dark ? COLORS.grayTie : COLORS.black }}>Upload Photos</Text>
              </>
            )}



            {/* </View> */}
          </View>
          <View>
            <Input
              id="title"
              onInputChanged={(id, value) => {
                setName(value)
              }}
              defaultValue={name}
              placeholder="Title"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
            />
            <Input
              id="description"
              onInputChanged={(id, value) => {
                setDescription(value)
              }}
              defaultValue={description}
              placeholder="Description"
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              multiline
              minHeight={52}
            />
            <View>
              <TouchableOpacity
                onPress={() => setShowCategory(true)} style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
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


            {sel?.hasBrand ? <View>
              <TouchableOpacity
                onPress={() => setShowBrand(true)} style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select Brand"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                  selectionColor="#111"
                  keyboardType='default'
                  editable={false}
                  value={selBrand?.name}
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

            </View> : null}


            {sel?.hasSize ? <View>
              <TouchableOpacity
                onPress={() => setShowSize(true)} style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select Size"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                  selectionColor="#111"
                  keyboardType='default'
                  editable={false}
                  value={selSize?.name}
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

            </View> : null}


            {sel?.hasCondition ? <View>
              <TouchableOpacity
                onPress={() => setShowCondition(true)} style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select Condition"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                  selectionColor="#111"
                  keyboardType='default'
                  editable={false}
                  value={selCond?.name}
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

            </View> : null}


            {sel?.hasColor ? <View>
              <TouchableOpacity
                onPress={() => setShowColor(true)} style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select upto 2 colors"
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

            </View> : null}


            {sel?.hasMaterial ? <View>
              <TouchableOpacity
                onPress={() => setShowMaterial(true)} style={[styles.inputContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                  borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                }]}>

                <TextInput
                  style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Select upto 3 materials"
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

            </View> : null}


            <Input
              id="price"
              onInputChanged={(id, value) => {
                setPrice(value)
              }}
              defaultValue={price?.toString()}
              placeholder="Price "
              placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
              keyboardType="decimal-pad" />

          </View>






          {!sel?.hasCustomShipping && sel ? <View>
            <TouchableOpacity
              onPress={() => setShowPackage(true)} style={[styles.inputContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
              }]}>

              <TextInput
                style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                placeholder="Select your package size"
                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                selectionColor="#111"
                keyboardType='default'
                editable={false}
                value={selPkg?.name}
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

          </View> : null}






          <View style={styles.bottomContainer}>
            <ButtonFilled
              title="Upload"
              style={styles.continueButton}
              onPress={submit}
            />
          </View>
        </ScrollView>


      </View>


      <ShowCategoryModal selParentCategoryData={selParentCategoryData} setSelParentCategoryData={setSelParentCategoryData} show={showCategory} setShow={setShowCategory} title={'Select Category'} data={categoryOptions} value={'_id'} name={'name'} setSel={setSel} moreSel={true} sel={sel} onPress={() => {
        setShowCategory(false)
      }} />




      <ShowCategoryModal show={showBrand} setShow={setShowBrand} title={'Select Brand'} data={brandOptions} value={'_id'} name={'name'} setSel={setSelBrand} sel={selBrand} onPress={() => {
        setShowBrand(false)
      }} />


      <ShowCategoryModal show={showSize} setShow={setShowSize} title={'Select Size'} data={sizeOptions} value={'_id'} name={'name'} setSel={setSelSize} sel={selSize} onPress={() => {
        setShowSize(false)
      }} />


      <ShowCategoryModal show={showCondition} setShow={setShowCondition} title={'Select Condition'} data={conditionOptions} value={'_id'} name={'name'} setSel={setSelCond} sel={selCond} onPress={() => {
        setShowCondition(false)
      }} />



      <ShowCategoryModal show={showColor} setShow={setShowColor} title={'Select Color'} data={colorOptions} name={'name'} value={'_id'} setSel={setSelColor} sel={selColor} allow={2} onPress={() => {
        if (selColor.length >= 1) {
          setShowColor(false)
        }
      }} />


      <ShowCategoryModal show={showMaterial} setShow={setShowMaterial} title={'Select Material'} data={materialOptions} name={'name'} value={'_id'} setSel={setSelMaterial} sel={selMaterial} allow={3} onPress={() => {
        if (selMaterial.length >= 2) {
          setShowMaterial(false)
        }
      }} />



      <ShowCategoryModal show={showPackage} setShow={setShowPackage} title={'Select Package Size'} data={packageOptions} name={'name'} value={'_id'} setSel={setSelPkg} sel={selPkg} onPress={() => {
        setShowPackage(false)
      }} />


    </SafeAreaView>
  )
};



// const pickerStyles = {
//   inputIOS: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     color: COLORS.greyscale600,
//     paddingRight: 30,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     color: COLORS.greyscale600,
//     paddingRight: 30,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500
//   },
// };

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
    paddingBottom: 0
  },
  avatarContainer: {
    marginVertical: 12,
    alignItems: "center",
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  avatar: {
    height: 130,
    width: 130,
    borderRadius: 65,
  },
  pickImage: {
    height: 62,
    width: 62,
    borderRadius: 10,
    backgroundColor: COLORS.transparentSecondary,
    alignItems: 'center',
    justifyContent: 'center',
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
  flagIcon: {
    width: 30,
    height: 30
  },
  input: {
    flex: 1,
    marginVertical: 10,
    height: 40,
    fontSize: 14,

  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.greyscale500,
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "space-between",
    marginTop: 4,
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: SIZES.width - 32,
    alignItems: "center",
    marginVertical: 20
  },
  continueButton: {
    width: SIZES.width - 32,
    borderRadius: 32,
  },
  genderContainer: {
    flexDirection: "row",
    borderColor: COLORS.greyscale500,
    borderWidth: .4,
    borderRadius: 6,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: COLORS.greyscale500,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: COLORS.greyscale600,
    paddingRight: 30,
    height: 58,
    width: SIZES.width - 32,
    alignItems: 'center',
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16
  },
});

export default EditItem