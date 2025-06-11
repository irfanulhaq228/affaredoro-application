import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar, FlatList, Modal, TouchableWithoutFeedback, ToastAndroid, TextInput } from 'react-native';
import React, { useCallback, useReducer, useRef, useState } from 'react';
import { COLORS, SIZES, icons, images, socials } from '../constants';
import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView } from 'react-native-virtualized-view';
import AutoSlider from '../components/AutoSlider';
import { useTheme } from '../theme/ThemeProvider';
import SocialIcon from '../components/SocialIcon';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { popularProducts } from '../data';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';
import { baseUrl, getFirst10Chars } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTimeAgo } from '../utils/date';
import NotFoundItem from '../components/NotFoundItem';
import SwiperFlatList from 'react-native-swiper-flatlist';
import ShowCategoryModal from '../components/ShowCategoryModal';
import Button from '../components/Button';
import ButtonFilled from '../components/ButtonFilled';
import LoaderScreen from '../components/LoaderScreen';


const ProductDetails = ({ navigation, route }: { navigation: any, route: any }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { dark } = useTheme();
    const refRBSheet = useRef<any>(null);
    const refEDSheet = useRef<any>(null);
    const refDELSheet = useRef<any>(null);




    const [isFollow, setIsFollow] = useState<boolean>(false);
    const [localId, setLocalId] = useState<any>(null);
    const [isBrand, setIsBrand] = useState<boolean>(false);

    const [isFavourite, setIsFavourite] = useState<boolean>(false);
    const [productIds, setProductIds] = useState<any>([])

    const [data, setData] = useState<any>(null);
    const [prodData, setProdData] = useState<any>([]);
    const [bumpData, setBumpData] = useState<any>([]);
    const [brandData, setBrandData] = useState<any>([]);
    const [prod, setProd] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const id = route?.params?.id

    console.log(id);

    const [sliderImages, setSliderImages]: any = useState([]);






    const submit = async (userId: any) => {
        try {
            const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
            var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
            mydata = JSON.parse(mydata);
            setIsLoading(true);

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
                        if (resp?.data?.follow && resp.data.follow.some((item: any) => item._id === mydata?._id)) {
                            setIsFollow(true);
                        }
                        setIsLoading(false);
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false);
                    }
                    else {
                        setIsLoading(false);
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            setIsLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    const [allUser, setAllUser] = useState<any>([])



    const getAllSoldUser = async () => {
        try {

            setIsLoading(true)
            const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
            var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
            mydata = JSON.parse(mydata);


            if (!token) {
                ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
                return;
            }
            setIsLoading(true);
            const requestOptions: any = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pass the token here
                },
            };

            fetch(`${baseUrl}/users/getAll?userId=${mydata?._id}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setAllUser(resp?.data);
                        setIsLoading(false)
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false)
                    }
                    else {
                        setIsLoading(false)
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    setIsLoading(false)
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            setIsLoading(false)
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const submitProd = async (userId: any) => {
        try {

            setIsLoading(true)
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

            fetch(`${baseUrl}/product/viewAll?userId=${userId}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setProdData(resp?.data);
                        setIsLoading(false);
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false);
                    }
                    else {
                        setIsLoading(false);
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            setIsLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getBump = async () => {
        try {

            setIsLoading(true)
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

            fetch(`${baseUrl}/bump/viewAll`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setBumpData(resp?.data);
                        setIsLoading(false);
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false);
                    }
                    else {
                        setIsLoading(false);
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            setIsLoading(false);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getBrand = async (id: any) => {
        try {
            setIsLoading(true)
            const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
            var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
            mydata = JSON.parse(mydata);


            if (!token) {
                setIsLoading(false);
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

            fetch(`${baseUrl}/brand/get/${id}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setIsLoading(false)
                        setBrandData(resp?.data);
                        if (resp?.data?.follow && resp.data.follow.some((item: any) => item._id === mydata?._id)) {
                            setIsBrand(true);
                        }
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                        setIsLoading(false)
                    }
                    else {
                        setIsLoading(false)
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    setIsLoading(false)
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            setIsLoading(false)
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProd = async () => {
        try {

            const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
            var mydata: any = await AsyncStorage.getItem("data"); // Retrieve the stored token
            mydata = JSON.parse(mydata);

            setIsLoading(true)

            setLocalId(mydata?._id)

            if (!token) {
                setIsLoading(false);
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

            fetch(`${baseUrl}/product/get/${id}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setProductIds([resp.data])
                        setProd(resp?.data);
                        submitProd(resp?.data?.userId?._id)
                        submit(resp?.data?.userId?._id)
                        getBrand(resp?.data?.brandId?._id)
                        setIsFavorite(resp?.data?.like?.includes(mydata?._id));
                        setIsLoading(false)

                        if (resp?.data?.image?.length > 0) {
                            // use map
                            // resp?.data?.image?.forEach((image: any) => {
                            //     setSliderImages((prevImages: any) => [...prevImages, baseUrl + '/' + image]);
                            // });

                            setIsLoading(false)
                            setSliderImages(resp?.data?.image?.map((image: any) => baseUrl + '/' + image));
                        }
                    }
                    else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        setIsLoading(false)
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                    else {
                        setIsLoading(false)
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                })
                .catch((error) => {
                    setIsLoading(false)
                    ToastAndroid.show(error.message, ToastAndroid.SHORT);
                    console.error(error);
                });
        } catch (error: any) {
            setIsLoading(false)
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };



    useFocusEffect(
        useCallback(() => {
            getAllSoldUser()
            getProd();
            getBump()
        }, []))







    const submitFollow = async (id: any) => {

        setIsLoading(true)
        try {

            var mydata: any = await AsyncStorage.getItem('data');
            mydata = JSON.parse(mydata);


            if (mydata) {

                const formdata = {
                    id: id,
                    userId: mydata._id,
                };


                const requestOptions: any = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formdata), // Convert formdata to JSON string
                    redirect: "follow"
                };

                fetch(`${baseUrl}/users/toggleFollow`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const resp = JSON.parse(result)

                        if (resp.status === 'ok') {
                            setIsFollow(!isFollow)
                            submit(prod?.userId?._id)
                            ToastAndroid.show(resp.message, 2000)
                            setIsLoading(false)

                        } else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                            setIsLoading(false)

                        }

                    })
                    .catch((error) => {
                        ToastAndroid.show(error.message, 2000)
                        console.error(error)
                        setIsLoading(false)
                    });


            }
        } catch (error: any) {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
            setIsLoading(false)
        };
    }








    const submitBrand = async (id: any) => {

        try {
            setIsLoading(true)
            var mydata: any = await AsyncStorage.getItem('data');
            mydata = JSON.parse(mydata);


            if (mydata) {

                const formdata = {
                    id: id,
                    userId: mydata._id,
                };


                const requestOptions: any = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formdata), // Convert formdata to JSON string
                    redirect: "follow"
                };

                fetch(`${baseUrl}/brand/toggleBrand`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const resp = JSON.parse(result)

                        if (resp.status === 'ok') {
                            setIsLoading(false)
                            setIsBrand(!isBrand)
                            getBrand(prod?.brandId?._id)
                            ToastAndroid.show(resp.message, 2000)
                        } else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                            setIsLoading(false)
                        }

                    })
                    .catch((error) => {
                        ToastAndroid.show(error.message, 2000)
                        console.error(error)
                        setIsLoading(false)
                    });


            }
        } catch (error: any) {
            ToastAndroid.show(error.message, 2000)
            setIsLoading(false)
            console.error(error)
        };
    }









    const submitLike = async (id: any) => {

        setIsLoading(true)

        try {

            var mydata: any = await AsyncStorage.getItem('data');

            mydata = JSON.parse(mydata);


            if (mydata) {

                const formdata = {
                    productId: id,
                    userId: mydata._id,
                };


                const requestOptions: any = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formdata), // Convert formdata to JSON string
                    redirect: "follow"
                };

                fetch(`${baseUrl}/product/toggleLike`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const resp = JSON.parse(result)

                        if (resp.status === 'ok') {
                            setIsFavourite(!isFavourite)
                            ToastAndroid.show(resp.message, 2000)
                            setIsLoading(false)
                            getProd()
                        } else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                            setIsLoading(false)
                        }

                    })
                    .catch((error) => {
                        ToastAndroid.show(error.message, 2000)
                        console.error(error)
                        setIsLoading(false)
                    });


            }
        } catch (error: any) {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
            setIsLoading(false)
        };
    }




    // Slider images





    const [showOffer, setShowOffer] = useState(false)
    const [showReviewBundle, setShowReviewBundle] = useState(false)
    const [addBundle, setAddBundle] = useState<any>([])




    // function for add bundle if already added then remove bundle
    const addRemoveBundle = (item: any) => {
        let newBundle = [...productIds];

        // Check if the item already exists in the array by matching _id
        const index = newBundle.findIndex((obj) => obj._id === item._id);

        if (index === -1) {
            // If item is not found, add it
            newBundle.push(item);
        } else {
            // If item is found, remove it
            newBundle.splice(index, 1);
        }

        console.log(newBundle);
        setProductIds(newBundle);
    };








    const sumprice: any = (productIds.reduce((sum: any, product: any) => sum + (product.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)).toFixed(2)

    const ship: any = (productIds.reduce((sum: any, product: any) => sum + (product?.shipPrice || 0), 0)).toFixed(2)
    const taxprice: any = (productIds.reduce((sum: any, product: any) => sum + (product?.inclPrice || 0), 0)).toFixed(2)
    // const sumprice: any = 0
    // const taxprice = (addBundle.reduce((acc: any, curr: any) => acc + curr.tax, 0))?.toFixed(2)
    // const taxprice = (Number(sumprice)+Number(taxprice1))?.toFixed(2)
    const save: any = data?.bundleDiscount ? productIds.length > 0 ? productIds.length > 1 ? productIds.length > 2 ? productIds.length > 4 ? ((sumprice) - ((sumprice * data?.item5) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * data?.item3) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * data?.item2) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * 0) / 100))?.toFixed(2) : null : 0


    const [showBundle, setShowBundle] = useState(false)
    const [selPrice, setSelPrice] = useState('custom')
    const [bid, setBid] = useState<any>(0)

    console.log(save, sumprice, ',,,,,,,,,,,,,,,,,,,,,,,,');


    function calculateValue(n: any) {
        return (1.75 + (n - 1) * 1.05).toFixed(2);
    }






    const submitHandler = async () => {
        setIsLoading(true)

        var mydata: any = await AsyncStorage.getItem('data');

        mydata = JSON.parse(mydata);

        try {

            const formdata = new FormData();
            formdata.append("adminUser", data?._id);
            formdata.append("senderId", localId);
            formdata.append("userId", localId);
            formdata.append("sendBy", 'user');
            if (bid > 0) {
                formdata.append("bidPrice", bid);
                formdata.append("bidInclPrice", calculateValue(bid));
                formdata.append("bidStatus", 'Pending');
            }


            productIds?.map((i: any) => {
                formdata.append("productId", i?._id);
            })



            const requestOptions: any = {
                method: "POST",
                body: formdata,
                redirect: "follow"
            };

            fetch(`${baseUrl}/chat/create`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const resp = JSON.parse(result)

                    if (resp.status === 'ok') {
                        setBid(0);
                        setShowOffer(false);
                        setShowBundle(false);
                        setShowReviewBundle(false);
                        navigation.navigate("chat", { productIds: productIds, image: prod?.image[0], name: prod?.name, inclPrice: prod?.inclPrice, price: prod?.price, userId: mydata?._id, adminUser: prod?.userId?._id, sendBy: mydata?._id === prod?.userId?._id ? 'admin' : 'user', username: mydata?._id === prod?.userId?._id ? mydata?.username : prod?.userId?.username })
                        setIsLoading(false);
                    }

                    else if (resp.status === 'fail') {
                        ToastAndroid.show(resp.message, 2000)
                        setIsLoading(false);
                    }

                })
                .catch((error) => {
                    ToastAndroid.show(error.message, 2000)
                    console.error(error)
                    setIsLoading(false);
                });



        } catch (error: any) {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
            setIsLoading(false);
        };
    }











    const showBundleModal = () => {
        return (
            <Modal visible={showBundle}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowBundle(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowBundle(false)}>

                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.white, padding: 10, paddingBottom: 0, width: '100%', height: '100%' }}>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <View></View>
                                    <View>
                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12
                                        }]}>
                                            {productIds.length > 0 ? productIds.length > 1 ? productIds.length > 2 ? productIds.length > 3 ? productIds.length > 4 ? `${data?.item5}% discount applied. You'll save $${save}!` : `Add 1 more item to get ${data?.item5}% off` : `Add 2 more item to get ${data?.item5}% off` : `Add 1 more item to get ${data?.item3}% off` : `Add 1 more item to get ${data?.item2}% off` : 'Add 2 items to get 20% off'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center' }} onPress={() => {
                                        setShowBundle(false)
                                    }}>
                                        <Image
                                            source={icons.cancelSquare}
                                            resizeMode='contain'
                                            style={[styles.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                        />
                                    </TouchableOpacity>



                                </View>



                                <ScrollView>

                                    {renderBundleProducts()}

                                </ScrollView>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, backgroundColor: dark ? COLORS.dark1 : COLORS.white, marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 5 }}>
                                                {save ? <Text style={[styles.descTitle, {
                                                    color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                                }]}><Image
                                                        source={images.price}
                                                        resizeMode='contain'
                                                        style={{
                                                            width: 12, height: 12,
                                                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                        }}
                                                    /> {save}</Text> : null}
                                                {save !== sumprice ? <Text style={[styles.descTitle, {
                                                    color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14, textDecorationLine: save ? 'line-through' : 'none'
                                                }]}><Image
                                                        source={images.price}
                                                        resizeMode='contain'
                                                        style={{
                                                            width: 12, height: 12,
                                                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                        }}
                                                    /> {sumprice}</Text> : null}
                                            </View>
                                            <Text style={[styles.descTitle, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                            }]}><Image
                                                    source={images.price}
                                                    resizeMode='contain'
                                                    style={{
                                                        width: 12, height: 12,
                                                        tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                    }}
                                                /> {taxprice} incl.</Text>
                                        </View>
                                        {productIds.map((i: any, index: any) => {
                                            return (
                                                <>
                                                    {index < 1 ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, position: 'relative', }}>
                                                        <Image source={{ uri: baseUrl + '/' + i?.image[0] }} style={{ width: 50, height: 50, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                                                        {index === 0 ? <View style={{ position: 'absolute', backgroundColor: dark ? COLORS.black2 : COLORS.tertiaryWhite, top: 0, right: 0, borderRadius: 5, width: 55, height: 55, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                                            <Text style={[{
                                                                fontSize: 18,
                                                                fontFamily: "Urbanist Bold",
                                                                color: COLORS.greyscale900,
                                                                marginVertical: 8
                                                            }, {
                                                                color: dark ? COLORS.white : COLORS.greyscale900, marginVertical: 0, fontSize: 14
                                                            }]}>+{(productIds.length - 1) + 1}</Text>
                                                        </View> : null}

                                                    </View> : null}
                                                </>
                                            )
                                        })}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => setShowReviewBundle(true)}
                                        style={[styles.cartBtn, {
                                            backgroundColor: productIds?.length === 0 ? COLORS.gray : dark ? COLORS.white : COLORS.black, width: 130, height: 50
                                        }]} disabled={productIds?.length === 0 ? true : false}>
                                        <Text style={[styles.cartBtnText, {
                                            color: dark ? COLORS.black : COLORS.white, fontSize: 14
                                        }]}>Review Bundle</Text>
                                    </TouchableOpacity>

                                </View>






                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }




    const ShowReviewBundleModal = () => {
        return (

            <Modal visible={showReviewBundle}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowReviewBundle(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowReviewBundle(false)}>

                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, paddingHorizontal: 20, width: '95%' }}>

                                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                                    setShowReviewBundle(false)
                                }}>
                                    <Image
                                        source={icons.cancelSquare}
                                        resizeMode='contain'
                                        style={[styles.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                    />
                                </TouchableOpacity>


                                <Text style={[styles.descTitle, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>Review Bundle</Text>



                                <View style={{ marginBottom: 10 }}>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, }}>

                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>{productIds.length} {productIds.length > 1 ? "Items" : "Item"}</Text>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                                            {productIds.map((i: any, index: any) => {
                                                return (
                                                    <>
                                                        {index < 2 ? <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 2, position: 'relative', }}>
                                                            <Image source={{ uri: baseUrl + '/' + i?.image[0] }} style={{ width: 50, height: 50, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                                                            {index === 1 ? <View style={{ position: 'absolute', backgroundColor: dark ? COLORS.black2 : COLORS.tertiaryWhite, top: 0, right: 0, borderRadius: 5, width: 55, height: 55, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                                                <Text style={[{
                                                                    fontSize: 18,
                                                                    fontFamily: "Urbanist Bold",
                                                                    color: COLORS.greyscale900,
                                                                    marginVertical: 8
                                                                }, {
                                                                    color: dark ? COLORS.white : COLORS.greyscale900, marginVertical: 0, fontSize: 14
                                                                }]}>+{(productIds.length - 2) + 1}</Text>
                                                            </View> : null}

                                                        </View> : null}
                                                    </>
                                                )
                                            })}
                                        </View>

                                    </View>






                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, }}>

                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Order</Text>
                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}><Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 12, height: 12,
                                                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                }}
                                            /> {(Number(sumprice)).toFixed(2)}</Text>

                                    </View>




                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>

                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Shipping</Text>
                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}><Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 12, height: 12,
                                                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                }}
                                            /> {ship}</Text>

                                    </View>





                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>

                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Buyer Protection fee</Text>
                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}><Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 12, height: 12,
                                                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                }}
                                            /> {(Number(taxprice)).toFixed(2)}</Text>

                                    </View>



                                    {data?.bundleDiscount ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Bundle discount {productIds.length > 1 ? productIds.length > 2 ? productIds.length > 4 ? `(${data?.item5}% discount)` : `(${data?.item3}% discount)` : `(${data?.item2}% discount)` : null}</Text>
                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}><Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 12, height: 12,
                                                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                }}
                                            /> {(sumprice - save)?.toFixed(2)}</Text>

                                    </View> : null}



                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                                        <Text style={[styles.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Total to pay</Text>
                                        <Text
                                            style={[
                                                styles.descTitle,
                                                {
                                                    color: dark ? COLORS.white : COLORS.greyscale900,
                                                    fontSize: 14,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 12, height: 12,
                                                    tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                }}
                                            />
                                            {` ${(
                                                Number(sumprice) +
                                                (Number(taxprice)) +
                                                Number(ship) - (data?.bundleDiscount ? (Number(sumprice) - Number(save)) : 0)
                                            ).toFixed(2)}`}
                                        </Text>


                                    </View>



                                </View>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                                    <TouchableOpacity
                                        onPress={async () => {
                                            setShowBundle(false)
                                            setShowReviewBundle(false)


                                            var mydata: any = await AsyncStorage.getItem('data');
                                            mydata = JSON.parse(mydata);

                                            navigation.navigate("chat", { productIds: productIds, image: prod?.image[0], name: prod?.name, inclPrice: prod?.inclPrice, price: prod?.price, userId: mydata?._id, adminUser: prod?.userId?._id, sendBy: mydata?._id === prod?.userId?._id ? 'admin' : 'user', username: mydata?._id === prod?.userId?._id ? mydata?.username : prod?.userId?.username })
                                        }}
                                        style={[styles.cartBtn, {
                                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '100%',
                                        }]}>
                                        <Image
                                            source={icons.chatBubble2}
                                            resizeMode='contain'
                                            style={[styles.bagIcon, {
                                                tintColor: dark ? COLORS.white : COLORS.primary
                                            }]}
                                        />
                                        <Text style={[styles.cartBtnText, {
                                            color: dark ? COLORS.white : COLORS.primary,
                                        }]}>Message Seller</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        onPress={() => setShowOffer(true)}
                                        style={[styles.cartBtn, {
                                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '48%'
                                        }]}>
                                        {/* <Image
                          source={icons.bags}
                          resizeMode='contain'
                          style={[styles.bagIcon, {
                              tintColor: dark ? COLORS.black : COLORS.white
                          }]}
                      /> */}
                                        <Text style={[styles.cartBtnText, {
                                            color: dark ? COLORS.white : COLORS.primary,
                                        }]}>Make an offer</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("checkout", { productIds: productIds, discount: data?.bundleDiscount ? (sumprice - save)?.toFixed(2) : 0 })}
                                        style={[styles.cartBtn, {
                                            backgroundColor: dark ? COLORS.white : COLORS.black, width: '48%'
                                        }]}>
                                        <Image
                                            source={icons.bags}
                                            resizeMode='contain'
                                            style={[styles.bagIcon, {
                                                tintColor: dark ? COLORS.black : COLORS.white
                                            }]}
                                        />
                                        <Text style={[styles.cartBtnText, {
                                            color: dark ? COLORS.black : COLORS.white,
                                        }]}>Buy now</Text>
                                    </TouchableOpacity>





                                </View>




                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        )
    }




    const ShowOfferModal = () => {
        return (


            <Modal visible={showOffer}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowOffer(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowOffer(false)}>

                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, paddingHorizontal: 20, width: '95%' }}>

                                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                                    setShowOffer(false)
                                }}>
                                    <Image
                                        source={icons.cancelSquare}
                                        resizeMode='contain'
                                        style={[styles.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                    />
                                </TouchableOpacity>


                                <Text style={[styles.descTitle, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>Make an offer</Text>



                                <View style={{ marginBottom: 10 }}>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>

                                        <View>
                                            <Text style={[styles.descTitle, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                            }]}>{productIds.length} {productIds.length > 1 ? "Items" : "Item"}</Text>
                                            <Text style={[styles.reviewText, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12,
                                            }]}>{productIds.length > 1 ? "Bundle" : "Product"} price: $ {(productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0))}</Text>

                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                                            {productIds.map((i: any, index: any) => {
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
                                                                }]}>+{(productIds.length - 2) + 1}</Text>
                                                            </View> : null}

                                                        </View> : null}
                                                    </>
                                                )
                                            })}
                                        </View>

                                    </View>






                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                                        <TouchableOpacity
                                            style={[
                                                styles.methodContainer, { width: '30%', borderWidth: selPrice === '10' ? 2 : .3 }
                                            ]}
                                            onPress={() => {
                                                setBid(((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 10) / 100)))
                                                setSelPrice('10')
                                            }}>
                                            <View style={[styles.iconContainer, { gap: 5 }]}>

                                                <View>
                                                    <Text style={[styles.methodSubtitle, {
                                                        color: dark ? COLORS.white : COLORS.black
                                                    }]}>{" "}<Image
                                                            source={images.price}
                                                            resizeMode='contain'
                                                            style={{
                                                                width: 14, height: 14,
                                                                tintColor: dark ? COLORS.white : COLORS.black
                                                            }}
                                                        />{((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 10) / 100))?.toFixed(2)}</Text>

                                                    <View
                                                        style={[styles.starContainer, { marginHorizontal: 0 }]}>

                                                        <View>
                                                            <Text style={[styles.reviewText, {
                                                                color: dark ? COLORS.white : COLORS.greyScale800, fontSize: 12,
                                                            }]}>
                                                                {" "}10% off
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>



                                        <TouchableOpacity
                                            style={[
                                                styles.methodContainer, { width: '30%', borderWidth: selPrice === '20' ? 2 : .3 }
                                            ]}
                                            onPress={() => {
                                                setBid(((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 20) / 100)))
                                                setSelPrice('20')
                                            }}>
                                            <View style={[styles.iconContainer, { gap: 5 }]}>

                                                <View>
                                                    <Text style={[styles.methodSubtitle, {
                                                        color: dark ? COLORS.white : COLORS.black
                                                    }]}>{" "}<Image
                                                            source={images.price}
                                                            resizeMode='contain'
                                                            style={{
                                                                width: 14, height: 14,
                                                                tintColor: dark ? COLORS.white : COLORS.black
                                                            }}
                                                        />{((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 20) / 100))?.toFixed(2)}</Text>

                                                    <View
                                                        style={[styles.starContainer, { marginHorizontal: 0 }]}>

                                                        <View>
                                                            <Text style={[styles.reviewText, {
                                                                color: dark ? COLORS.white : COLORS.greyScale800, fontSize: 12,
                                                            }]}>
                                                                {" "}20% off
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>



                                        <TouchableOpacity
                                            style={[
                                                styles.methodContainer, { width: '30%', borderWidth: selPrice === 'custom' ? 2 : .3 }
                                            ]}
                                            onPress={() => {
                                                setBid(0)
                                                setSelPrice('custom')
                                            }}>
                                            <View style={[styles.iconContainer, { gap: 5 }]}>

                                                <View>
                                                    <Text style={[styles.methodSubtitle, {
                                                        color: dark ? COLORS.white : COLORS.black
                                                    }]}>{" "}<Image
                                                            source={images.price}
                                                            resizeMode='contain'
                                                            style={{
                                                                width: 14, height: 14,
                                                                tintColor: dark ? COLORS.white : COLORS.black
                                                            }}
                                                        />{((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) - (((productIds.reduce((sum: any, product: any) => sum + (product?.bid?.find((b: any) => b.userId === localId)?.price || product.price || 0), 0)) * 0) / 100))?.toFixed(2)}</Text>

                                                    <View
                                                        style={[styles.starContainer, { marginHorizontal: 0 }]}>

                                                        <View>
                                                            <Text style={[styles.reviewText, {
                                                                color: dark ? COLORS.white : COLORS.greyScale800, fontSize: 12,
                                                            }]}>
                                                                {" "}Set a price
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>




                                    </View>


                                    {selPrice === 'custom' ?

                                        <Input
                                            id="bid"
                                            onInputChanged={(id, value) => {
                                                setBid(value)
                                            }}
                                            placeholder="Enter Bid Price"
                                            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                                            icon={icons.diamond}
                                            defaultValue={bid}
                                            keyboardType="numeric"
                                        />

                                        : null}


                                    {/* {bid > 0 ? <Text style={[styles.reviewText, {
                                        color: dark ? COLORS.grayscale400 : COLORS.grayscale400, fontSize: 12, marginBottom: 10
                                    }]}><Image
                                            source={images.price}
                                            resizeMode='contain'
                                            style={{
                                                width: 12, height: 12,
                                                tintColor: dark ? COLORS.grayscale400 : COLORS.grayscale400
                                            }}
                                        /> {calculateValue(bid)} incl. Buyer Protection fee</Text> : null}


                                    <Text style={[styles.reviewText, {
                                        color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12, textAlign: 'center'
                                    }]}>You have 25 offer(s) remaining. We set a limit to make it easier for our members to manage and review offers.</Text> */}

                                </View>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                                    <TouchableOpacity
                                        onPress={() => {
                                            if (selPrice === 'custom' && !bid) {
                                                ToastAndroid.show('Must add a bid price', 2000)
                                            }
                                            else {
                                                submitHandler()
                                            }
                                        }}
                                        style={[styles.cartBtn, {
                                            backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 50
                                        }]}>

                                        {bid > 0 ? <>

                                            <Text style={[styles.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white,
                                            }]}>Offer </Text>
                                            <Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 14, height: 14,
                                                    tintColor: dark ? COLORS.black : COLORS.white
                                                }}
                                            />

                                            <Text style={[styles.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white,
                                            }]}>{bid}</Text>
                                        </> : <Text style={[styles.cartBtnText, {
                                            color: dark ? COLORS.black : COLORS.white,
                                        }]}>{bid > 0 ? `Offer $${bid}` : 'Offer'}</Text>}
                                    </TouchableOpacity>


                                </View>




                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        )
    }







    const renderBundleProducts = () => {

        return (
            <View>

                {prodData.length > 0 ? <View style={{
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    marginTop: 20
                }}>



                    <FlatList
                        data={prodData}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        columnWrapperStyle={{}}
                        showsVerticalScrollIndicator={false}
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
                                    button={
                                        <>
                                            <TouchableOpacity
                                                onPress={() => addRemoveBundle(item)}
                                                style={[
                                                    styles.cartBtn,
                                                    {
                                                        backgroundColor: productIds.some((obj: any) => obj._id === item._id)
                                                            ? COLORS.red
                                                            : dark
                                                                ? COLORS.dark3
                                                                : COLORS.tansparentPrimary,
                                                        width: SIZES.width / 2 - 42,
                                                        height: 45,
                                                        marginBottom: 10,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.cartBtnText,
                                                        {
                                                            color: productIds.some((obj: any) => obj._id === item._id)
                                                                ? COLORS.white
                                                                : dark
                                                                    ? COLORS.white
                                                                    : COLORS.primary,
                                                        },
                                                    ]}
                                                >
                                                    {productIds.some((obj: any) => obj._id === item._id) ? 'Remove' : 'Add'}
                                                </Text>
                                            </TouchableOpacity>




                                        </>
                                    }
                                />
                            )
                        }}
                    />
                </View> : <NotFoundItem title='No products found' />}
            </View>
        )
    }


    // render header
    const renderHeader = () => {

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <View style={styles.iconContainer}>

                    {localId === prod?.userId?._id ? null : <TouchableOpacity
                        onPress={() => submitLike(prod?._id)}>
                        <Image
                            source={isFavorite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={styles.bookmarkIcon}
                        />
                    </TouchableOpacity>}
                    {/* <TouchableOpacity
                        style={styles.sendIconContainer}
                        onPress={() => refRBSheet.current.open()}>
                        <Image
                            source={icons.send2}
                            resizeMode='contain'
                            style={styles.sendIcon}
                        />
                    </TouchableOpacity> */}
                    {localId === prod?.userId?._id ? null : <TouchableOpacity
                        onPress={async () => {

                            var mydata: any = await AsyncStorage.getItem('data');
                            mydata = JSON.parse(mydata);

                            navigation.navigate("chat", { productIds: productIds, image: prod?.image[0], name: prod?.name, inclPrice: prod?.inclPrice, price: prod?.price, userId: mydata?._id, adminUser: prod?.userId?._id, sendBy: mydata?._id === prod?.userId?._id ? 'admin' : 'user', username: mydata?._id === prod?.userId?._id ? mydata?.username : prod?.userId?.username })
                        }}>
                        <Image
                            source={isFavorite ? icons.chatBubble : icons.chatBubble}
                            resizeMode='contain'
                            style={[styles.bookmarkIcon, { marginLeft: 10 }]}
                        />
                    </TouchableOpacity>}
                </View>
            </View>
        )
    }



    const renderRecomendedProducts = () => {
        const [selectedCategories, setSelectedCategories] = useState<any[]>(["0"]);

        const filteredProducts = popularProducts.filter(product => selectedCategories.includes("0") || selectedCategories.includes(product.categoryId));


        return (
            <View>

                <View style={{
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    marginTop: 20
                }}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={prodData}
                        keyExtractor={item => item.id}
                        // numColumns={2}
                        // columnWrapperStyle={{ gap: 16 }}
                        // showsVerticalScrollIndicator={false}
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
                                    onPress={() => navigation.replace('ProductDetails', { id: item?._id })}
                                />
                            )
                        }}
                    />
                </View>
            </View>
        )
    }






    const [showBumpModal, setShowBumpModal] = useState(false)
    const [showBump, setShowBump] = useState(false)
    const [selBump, setSelBump] = useState<any>(null)
    const [showSold, setShowSold] = useState(false)
    const [showUser, setShowUser] = useState(false)
    const [selUser, setSelUser] = useState<any>(null)
    const [soldPrice, setSoldPrice] = useState<any>(null)
    const [isSold, setIsSold] = useState(false)




    const ShowBumpModal = () => {
        return (


            <Modal visible={showBump}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowBump(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowBump(false)}>

                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, paddingHorizontal: 20, width: '95%' }}>

                                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                                    setShowBump(false)
                                }}>
                                    <Image
                                        source={icons.cancelSquare}
                                        resizeMode='contain'
                                        style={[styles.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                    />
                                </TouchableOpacity>


                                <Text style={[styles.descTitle, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>Bump product</Text>



                                <View style={{ marginBottom: 15 }}>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>

                                        <View>
                                            <Text style={[styles.descTitle, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                            }]}>{prod?.name}</Text>
                                            <Text style={[styles.reviewText, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12,
                                            }]}>Product price: <Image
                                                    source={images.price}
                                                    resizeMode='contain'
                                                    style={{
                                                        width: 12, height: 12,
                                                        tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                    }}
                                                /> {prod?.price}</Text>

                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                                            <Image source={{ uri: baseUrl + '/' + prod?.image[0] }} style={{ width: 30, height: 30, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                                        </View>

                                    </View>



                                    <View>
                                        <TouchableOpacity
                                            onPress={() => setShowBumpModal(true)} style={[styles.inputContainer, {
                                                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                                                borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                                            }]}>

                                            <TextInput
                                                style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                                                placeholder="Choose your bump"
                                                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                                                selectionColor="#111"
                                                keyboardType='default'
                                                editable={false}
                                                value={selBump ? selBump?.day + '-day Bump' : ''}
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


                                </View>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                                    <TouchableOpacity
                                        onPress={() => {
                                            if (selBump) {
                                                navigation.navigate("checkout", { productIds: [prod], discount: 0, bumpPrice: ((prod?.price * selBump?.percentage) / 100).toFixed(2), bumpDay: selBump?.day, bumpOrder: true })
                                                setShowBump(false)
                                            }
                                            else {
                                                ToastAndroid.show('Please select bump', ToastAndroid.SHORT)
                                            }
                                        }}
                                        style={[styles.cartBtn, {
                                            backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 50
                                        }]}>
                                        {selBump ? <>
                                            <Text style={[styles.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white,
                                            }]}>Review order </Text>

                                            <Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 14, height: 14,
                                                    tintColor: dark ? COLORS.black : COLORS.white
                                                }}
                                            />

                                            <Text style={[styles.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white,
                                            }]}>{((prod?.price * selBump?.percentage) / 100).toFixed(2)}</Text>
                                        </>
                                            :
                                            <Text style={[styles.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white,
                                            }]}>{selBump ? 'Review order ' + ((prod?.price * selBump?.percentage) / 100).toFixed(2) : 'Review order'}</Text>}
                                    </TouchableOpacity>


                                </View>




                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        )
    }





    const ShowSoldModal = () => {
        return (


            <Modal visible={showSold}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSold(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowSold(false)}>

                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, paddingHorizontal: 20, width: '95%' }}>

                                <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                                    setShowSold(false)
                                }}>
                                    <Image
                                        source={icons.cancelSquare}
                                        resizeMode='contain'
                                        style={[styles.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                    />
                                </TouchableOpacity>


                                <Text style={[styles.descTitle, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>Make product {isSold ? 'sold' : 'reserved'}</Text>



                                <View style={{ marginBottom: 15 }}>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>

                                        <View>
                                            <Text style={[styles.descTitle, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                            }]}>{prod?.name}</Text>
                                            <Text style={[styles.reviewText, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12,
                                            }]}>Product price: $ {prod?.price}</Text>

                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 15 }}>

                                            <Image source={{ uri: baseUrl + '/' + prod?.image[0] }} style={{ width: 30, height: 30, padding: 0, margin: 0, borderRadius: 5 }} resizeMode="cover" />
                                        </View>

                                    </View>



                                    {isSold ? <Input
                                        id="bid"
                                        onInputChanged={(id, value) => {
                                            setSoldPrice(value)
                                        }}
                                        placeholder="Enter Product Price"
                                        placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                                        // icon={icons.diamond}
                                        defaultValue={bid}
                                        keyboardType="numeric"
                                    /> : null}


                                    <View>
                                        <TouchableOpacity
                                            onPress={() => setShowUser(true)} style={[styles.inputContainer, {
                                                backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                                                borderColor: dark ? COLORS.dark2 : COLORS.greyscale500, marginVertical: 5,
                                            }]}>

                                            <TextInput
                                                style={[styles.input, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                                                placeholder="Select User"
                                                placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                                                selectionColor="#111"
                                                keyboardType='default'
                                                editable={false}
                                                value={selUser?.username}
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


                                </View>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                                    <TouchableOpacity
                                        onPress={submitSold}
                                        style={[styles.cartBtn, {
                                            backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 50
                                        }]}>

                                        <Text style={[styles.cartBtnText, {
                                            color: dark ? COLORS.black : COLORS.white,
                                        }]}>{isSold ? 'Sold Now' : 'Reserved Now'}</Text>
                                    </TouchableOpacity>


                                </View>




                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        )
    }






    const submitSold = async () => {
        const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

        if (!token) {
            ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
            return;
        }
        setIsLoading(true);



        try {
            const formdata = new FormData();
            if (isSold) {
                formdata.append("sold", true);
                formdata.append("soldPrice", soldPrice);
                formdata.append("soldUserId", selUser?._id);
            }
            else {
                formdata.append("reserved", true);
                formdata.append("reservedUserId", selUser?._id);
            }

            const requestOptions: any = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token here
                },
                body: formdata,
                redirect: "follow"
            };

            fetch(`${baseUrl}/product/update/${prod?._id}`, requestOptions)
                .then((response) => response.text())
                .then(async (result) => {
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        setShowSold(false)
                        navigation.goBack()
                        ToastAndroid.show(isSold ? 'Sold successfully!' : 'Reserved successfully!', 2000)
                    } else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                    else if (resp.status === "fail") {
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






    const hideProd = async () => {
        const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

        if (!token) {
            ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
            return;
        }
        setIsLoading(true);



        try {
            const formdata = new FormData();

            formdata.append("hidden", true);


            const requestOptions: any = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token here
                },
                body: formdata,
                redirect: "follow"
            };

            fetch(`${baseUrl}/product/update/${prod?._id}`, requestOptions)
                .then((response) => response.text())
                .then(async (result) => {
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        setShowSold(false)
                        navigation.goBack()
                        ToastAndroid.show('Product hide successfully!', 2000)
                    } else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                    else if (resp.status === "fail") {
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





    const delProd = async () => {
        const token = await AsyncStorage.getItem("token"); // Retrieve the stored token

        if (!token) {
            ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
            return;
        }
        setIsLoading(true);



        try {
            const formdata = new FormData();

            formdata.append("hide", true);


            const requestOptions: any = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Pass the token here
                },
            };

            fetch(`${baseUrl}/product/delete/${prod?._id}`, requestOptions)
                .then((response) => response.text())
                .then(async (result) => {
                    const resp = JSON.parse(result);

                    if (resp.status === "ok") {
                        setShowSold(false)
                        navigation.goBack()
                        ToastAndroid.show('Product deleted successfully!', 2000)
                    } else if (resp.status === "TokenExpiredError") {
                        await AsyncStorage.clear();
                        navigation.navigate('login')
                        ToastAndroid.show(resp.message, ToastAndroid.SHORT);
                    }
                    else if (resp.status === "fail") {
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





    /**
     * render content
     */
    const renderContent = () => {
        const [selectedSize, setSelectedSize] = useState(null);
        const [selectedColor, setSelectedColor] = useState(null);
        const [quantity, setQuantity] = useState(1);

        const increaseQty = () => {
            setQuantity(quantity + 1);
        }

        const decreaseQty = () => {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        }

        const handleSizeSelect = (size: any) => {
            setSelectedSize(size);
        };
        const handleColorSelect = (color: any) => {
            setSelectedColor(color);
        };

        const renderCheckmark = (color: any) => {
            if (selectedColor === color) {
                return <FontAwesome name="check" size={18} color="white" />;
            }
            return null;
        };

        return (
            <View style={[styles.contentContainer, { marginBottom: localId === prod?.userId?._id ? 20 : 120 }]}>
                <View style={styles.contentView}>
                    <Text style={[styles.contentTitle, {
                        color: dark ? COLORS.white : COLORS.black,
                    }]}>
                        {prod?.name}
                    </Text>
                    {localId === prod?.userId?._id ? null : <TouchableOpacity
                        onPress={() => submitLike(prod?._id)}>
                        <Image
                            source={isFavorite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={[styles.bookmarkIcon, {
                                tintColor: dark ? COLORS.white : COLORS.black
                            }]}
                        />
                    </TouchableOpacity>}
                </View>
                {prod?.sizeId ? <View style={styles.ratingContainer}>
                    <View style={[styles.ratingView, {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.silver,
                    }]}>
                        <Text style={[styles.ratingViewTitle, {
                            color: dark ? COLORS.white : "#35383F",
                        }]}>{prod?.sizeId?.name}</Text>
                    </View>
                    <View>
                        <Text style={[styles.reviewText, {
                            color: dark ? COLORS.white : COLORS.greyScale800
                        }]}>
                            {"   "}{prod?.brandId?.name}
                        </Text>
                    </View>

                </View> : null}
                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200
                }]} />


                <Text style={[styles.descTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                }]}>Details</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Price:</Text>

                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                        width: '50%'
                    }]}>
                        <Image
                            source={images.price}
                            resizeMode='contain'
                            style={{
                                width: 12, height: 12,
                                tintColor: dark ? COLORS.greyscale300 : COLORS.greyScale800
                            }}
                        />{prod?.bid?.find((b: any) => b.userId === localId)?.price || prod?.price}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Charges:</Text>

                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                        <Text style={[styles.descText, {
                            color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                        }]}><Image
                                source={images.price}
                                resizeMode='contain'
                                style={{
                                    width: 12, height: 12,
                                    tintColor: dark ? COLORS.greyscale300 : COLORS.greyScale800
                                }}
                            />{prod?.bid?.find((b: any) => b.userId === localId)?.inclPrice || prod?.inclPrice}</Text>
                        <Text style={[styles.descText, {
                            color: dark ? COLORS.greyscale300 : COLORS.greyScale800, fontSize: 10
                        }]}>Includes buyer protection</Text>
                    </View>
                </View>



                {prod?.shipPrice ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Shipping:</Text>
                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800, width: '50%'
                    }]}><Image
                            source={images.price}
                            resizeMode='contain'
                            style={{
                                width: 12, height: 12,
                                tintColor: dark ? COLORS.greyscale300 : COLORS.greyScale800
                            }}
                        />{prod?.shipPrice}</Text>
                </View> : null}



                {prod?.totalPrice ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Total Price:</Text>
                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800, width: '50%'
                    }]}><Image
                            source={images.price}
                            resizeMode='contain'
                            style={{
                                width: 12, height: 12,
                                tintColor: dark ? COLORS.greyscale300 : COLORS.greyScale800
                            }}
                        />{prod?.totalPrice}</Text>
                </View> : null}


                {prod?.brandId ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Brand:</Text>

                    <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                        <Text style={[styles.descText, {
                            color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                        }]}>{prod?.brandId?.name}</Text>
                        {localId === prod?.userId?._id ? null : <TouchableOpacity
                            onPress={() => { submitBrand(prod?.brandId?._id) }}
                            style={[styles.cartBtn, {
                                backgroundColor: isBrand ? COLORS.tansparentPrimary : dark ? COLORS.white : COLORS.primary,
                                borderWidth: isBrand ? 1 : 0,
                                borderColor: isBrand ? COLORS.white : COLORS.transparentWhite,
                                width: 80, height: 30
                            }]}>
                            <Text style={[styles.cartBtnText, {
                                color: isBrand ? dark ? COLORS.white : COLORS.black : dark ? COLORS.black : COLORS.white,
                                fontSize: 12
                            }]}>{isBrand ? "Following" : "Follow"}</Text>
                        </TouchableOpacity>}

                    </View>
                </View> : null}


                {prod?.conditionId ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Condition:</Text>
                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800, width: '50%'
                    }]}>{prod?.conditionId?.name}</Text>
                </View> : null}


                {prod?.materialId?.length > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Material:</Text>
                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800, width: '50%'
                    }]}>{prod?.materialId?.map((color: any) => color.name).join(', ')}</Text>
                </View> : null}


                {prod?.colorId?.length > 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Color:</Text>
                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800, width: '50%'
                    }]}>{prod?.colorId?.map((color: any) => color.name).join(', ')}</Text>
                </View> : null}


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 10 }}>
                    <Text style={[styles.reviewText, {
                        color: dark ? COLORS.white : COLORS.greyScale800,
                    }]}>Uploaded:</Text>
                    <Text style={[styles.descText, {
                        color: dark ? COLORS.greyscale300 : COLORS.greyScale800, width: '50%'
                    }]}>{getTimeAgo(prod?.createdAt)}</Text>
                </View>





                <Text style={[styles.descTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                }]}>Description</Text>
                <Text style={[styles.descText, {
                    color: dark ? COLORS.greyscale300 : COLORS.greyScale800,
                }]}>{prod?.description}</Text>


                {localId === prod?.userId?._id ? null : <TouchableOpacity
                    onPress={async () => {

                        var mydata: any = await AsyncStorage.getItem('data');
                        mydata = JSON.parse(mydata);

                        navigation.navigate("chat", { productIds: productIds, image: prod?.image[0], name: prod?.name, inclPrice: prod?.inclPrice, price: prod?.price, userId: mydata?._id, adminUser: prod?.userId?._id, sendBy: mydata?._id === prod?.userId?._id ? 'admin' : 'user', username: mydata?._id === prod?.userId?._id ? mydata?.username : prod?.userId?.username })
                    }}
                    style={[styles.cartBtn, {
                        backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginTop: 12, width: SIZES.width - 32,
                    }]}>
                    <Image
                        source={icons.chatBubble2}
                        resizeMode='contain'
                        style={[styles.bagIcon, {
                            tintColor: dark ? COLORS.white : COLORS.primary
                        }]}
                    />
                    <Text style={[styles.cartBtnText, {
                        color: dark ? COLORS.white : COLORS.primary,
                    }]}>Message Seller</Text>
                </TouchableOpacity>}

                {localId !== prod?.userId?._id ? null :
                    <>
                        <TouchableOpacity
                            onPress={() => setShowBump(true)}
                            style={[styles.cartBtn, {
                                marginTop: 12, width: SIZES.width - 32,
                            }]}>
                            <Text style={[styles.cartBtnText, {
                            }]}>Bump</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => {
                                setShowSold(true)
                                setIsSold(true)
                            }}
                            style={[styles.cartBtn, {
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginTop: 12, width: SIZES.width - 32,
                            }]}>

                            <Text style={[styles.cartBtnText, {
                                color: dark ? COLORS.white : COLORS.primary,
                            }]}>Mark as sold</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => {
                                setShowSold(true)
                                setIsSold(false)
                            }}
                            style={[styles.cartBtn, {
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginTop: 12, width: SIZES.width - 32,
                            }]}>

                            <Text style={[styles.cartBtnText, {
                                color: dark ? COLORS.white : COLORS.primary,
                            }]}>Mark as reserved</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => refEDSheet.current.open()}
                            style={[styles.cartBtn, {
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginTop: 12, width: SIZES.width - 32,
                            }]}>

                            <Text style={[styles.cartBtnText, {
                                color: dark ? COLORS.white : COLORS.primary,
                            }]}>Hide</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => navigation.navigate('EditItem', { productId: prod?._id })}
                            style={[styles.cartBtn, {
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, marginTop: 12, width: SIZES.width - 32,
                            }]}>

                            <Text style={[styles.cartBtnText, {
                                color: dark ? COLORS.white : COLORS.primary,
                            }]}>Edit listing</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => refDELSheet.current.open()}
                            style={[styles.cartBtn, {
                                backgroundColor: dark ? COLORS.error : COLORS.error, marginTop: 12, width: SIZES.width - 32,
                            }]}>

                            <Text style={[styles.cartBtnText, {
                                color: dark ? COLORS.white : COLORS.white,
                            }]}>Delete</Text>
                        </TouchableOpacity>


                    </>
                }


                <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200, marginTop: 12
                }]} />




                {localId === prod?.userId?._id ? null : <TouchableOpacity
                    style={[
                        styles.methodContainer,
                        // Customize the border color for Email
                    ]}
                    onPress={() => navigation.navigate("viewprofile", { userId: data?._id })}
                >
                    <View style={[styles.iconContainer, { gap: 5 }]}>
                        <View style={styles.iconContainer1}>
                            <Image
                                source={{ uri: baseUrl + '/' + data?.image }}
                                resizeMode='cover'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 200
                                }} />
                        </View>
                        <View>
                            <Text style={[styles.methodSubtitle, {
                                color: dark ? COLORS.white : COLORS.black
                            }]}>{data?.username}</Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate("productreviews", { toUserId: data?._id })}
                                style={[styles.starContainer, { marginHorizontal: 0 }]}>
                                <View>
                                    <Image
                                        source={data?.rating === 0 ? icons.starOutline : icons.star}
                                        resizeMode='contain'
                                        style={[styles.starIcon, {
                                            tintColor: dark ? COLORS.white : COLORS.black
                                        }]}
                                    />
                                </View>
                                <View>
                                    <Text style={[styles.reviewText, {
                                        color: dark ? COLORS.white : COLORS.greyScale800
                                    }]}>
                                        {" "}{data?.rating} ({data?.reviews} reviews)
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            submitFollow(data?._id)
                        }}
                        style={[styles.cartBtn, {
                            backgroundColor: isFollow ? COLORS.tansparentPrimary : dark ? COLORS.white : COLORS.primary,
                            borderWidth: isFollow ? 1 : 0,
                            borderColor: isFollow ? COLORS.white : COLORS.transparentWhite,
                            width: 80, height: 45
                        }]}>
                        <Text style={[styles.cartBtnText, {
                            color: isFollow ? dark ? COLORS.white : COLORS.black : dark ? COLORS.black : COLORS.white,
                            fontSize: 14
                        }]}>{isFollow ? "Following" : "Follow"}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>}

                {localId === prod?.userId?._id ? null : <View style={[styles.separateLine, {
                    backgroundColor: dark ? COLORS.greyscale900 : COLORS.grayscale200, marginVertical: 12
                }]} />}



                <Text style={[styles.descTitle, {
                    color: dark ? COLORS.white : COLORS.greyscale900,
                }]}>Member's Items ({prodData?.length})</Text>


                {/* {data?.products > 1 && localId !== prod?.userId?._id ? <View
                    style={[
                        styles.methodContainer,
                    ]}
                >
                    <View style={[styles.iconContainer, { gap: 5 }]}>

                        <View>
                            <Text style={[styles.methodSubtitle, {
                                color: dark ? COLORS.white : COLORS.black
                            }]}>{" "}Shop bundles</Text>

                            <View
                                style={[styles.starContainer, { marginHorizontal: 0 }]}>

                                <View>
                                    <Text style={[styles.reviewText, {
                                        color: dark ? COLORS.white : COLORS.greyScale800
                                    }]}>
                                        {" "}Get upto 50% off
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowBundle(true)}
                        style={[styles.cartBtn, {
                            backgroundColor: dark ? COLORS.white : COLORS.black, width: 130, height: 50
                        }]}>
                        <Text style={[styles.cartBtnText, {
                            color: dark ? COLORS.black : COLORS.white, fontSize: 14
                        }]}>Create Bundle</Text>
                    </TouchableOpacity>
                </View> : null} */}



                {renderRecomendedProducts()}
            </View>
        )
    }
    return (

        <>

            {isLoading && <LoaderScreen />}
            <View style={[styles.area,
            { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
                <StatusBar hidden />
                <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                    {/* <AutoSlider images={sliderImages} /> */}
                    <View style={{ height: localId === prod?.userId?._id ? 'auto' : SIZES.width * 0.8, width: '100%' }}>
                        <SwiperFlatList
                            paginationStyleItem={{ width: 10, height: 10, borderRadius: 200 }}
                            showPagination
                            autoplay
                            autoplayDelay={2}
                            autoplayLoop
                            paginationActiveColor={COLORS.white}
                            data={sliderImages}
                            renderItem={({ item }) => (
                                <View style={{ position: 'relative' }}>

                                    <Image
                                        source={{ uri: item }}
                                        style={{
                                            width: SIZES.width,
                                            height: SIZES.width * 0.9,
                                            backgroundColor: COLORS.silver,
                                        }}
                                        resizeMode={'stretch'}
                                    />

                                </View>
                            )}

                        />

                    </View>
                    {renderHeader()}
                    {renderContent()}


                </ScrollView>

                {localId === prod?.userId?._id ? null : <View style={[styles.cartBottomContainer, {
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    borderTopColor: dark ? COLORS.dark1 : COLORS.white,
                }]}>

                    <TouchableOpacity
                        onPress={() => setShowOffer(true)}
                        style={[styles.cartBtn, {
                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                        }]}>

                        <Text style={[styles.cartBtnText, {
                            color: dark ? COLORS.white : COLORS.primary,
                        }]}>Make an offer</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={async () => {

                            navigation.navigate("checkout", { productIds: productIds, discount: data?.bundleDiscount ? (sumprice - save)?.toFixed(2) : 0 })
                        }}
                        style={[styles.cartBtn, {
                            backgroundColor: dark ? COLORS.white : COLORS.black,
                        }]}>
                        <Image
                            source={icons.bags}
                            resizeMode='contain'
                            style={[styles.bagIcon, {
                                tintColor: dark ? COLORS.black : COLORS.white
                            }]}
                        />
                        <Text style={[styles.cartBtnText, {
                            color: dark ? COLORS.black : COLORS.white,
                        }]}>Buy now</Text>
                    </TouchableOpacity>
                </View>}

                {showBundleModal()}
                {ShowReviewBundleModal()}
                {ShowOfferModal()}
                {ShowSoldModal()}
                {ShowBumpModal()}




                <ShowCategoryModal show={showUser} setShow={setShowUser} title={'Select User'} data={allUser} value={'_id'} name={'username'} setSel={setSelUser} sel={selUser} onPress={() => {
                    setShowUser(false)
                }} />


                <ShowCategoryModal show={showBumpModal} setShow={setShowBumpModal} title={'Select Bump Days'} data={bumpData} value={'_id'} name={'day'} setSel={setSelBump} sel={selBump} onPress={() => {
                    setShowBumpModal(false)
                }} />




                <RBSheet
                    ref={refDELSheet}
                    closeOnPressMask={true}
                    height={222}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: dark ? COLORS.greyscale300 : COLORS.greyscale300,
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 222,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                            alignItems: "center",
                            width: "100%"
                        }
                    }}>
                    <Text style={[styles.bottomSubtitle, {
                        color: dark ? COLORS.red : COLORS.red
                    }]}>Delete Product</Text>
                    <View style={[styles.separateLine, {
                        backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
                    }]} />

                    <View style={styles.selectedCancelContainer}>
                        <Text style={[styles.cancelTitle, {
                            color: dark ? COLORS.secondaryWhite : COLORS.greyscale900
                        }]}>Are you sure you want to delete your product?</Text>
                        {/* <Text style={[styles.cancelSubtitle, {
                        color: dark ? COLORS.grayscale400 : COLORS.grayscale700
                    }]}>Only 80% of the money you can refund from your payment according to our policy.</Text> */}
                    </View>

                    <View style={[styles.bottomContainer]}>
                        <Button
                            title="Cancel"
                            style={{
                                width: (SIZES.width - 32) / 2 - 8,
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => refDELSheet.current.close()}
                        />
                        <ButtonFilled
                            title="Yes, Delete"
                            style={styles.removeButton}
                            onPress={() => {
                                refDELSheet.current.close();
                                delProd()
                            }}
                        />
                    </View>
                </RBSheet>



                <RBSheet
                    ref={refEDSheet}
                    closeOnPressMask={true}
                    height={222}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: dark ? COLORS.greyscale300 : COLORS.greyscale300,
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 222,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                            alignItems: "center",
                            width: "100%"
                        }
                    }}>
                    <Text style={[styles.bottomSubtitle, {
                        color: dark ? COLORS.red : COLORS.red
                    }]}>Hide Product</Text>
                    <View style={[styles.separateLine, {
                        backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
                    }]} />

                    <View style={styles.selectedCancelContainer}>
                        <Text style={[styles.cancelTitle, {
                            color: dark ? COLORS.secondaryWhite : COLORS.greyscale900
                        }]}>Are you sure you want to hide your product?</Text>
                        {/* <Text style={[styles.cancelSubtitle, {
                        color: dark ? COLORS.grayscale400 : COLORS.grayscale700
                    }]}>Only 80% of the money you can refund from your payment according to our policy.</Text> */}
                    </View>

                    <View style={[styles.bottomContainer]}>
                        <Button
                            title="Cancel"
                            style={{
                                width: (SIZES.width - 32) / 2 - 8,
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => refEDSheet.current.close()}
                        />
                        <ButtonFilled
                            title="Yes, Hide"
                            style={styles.removeButton}
                            onPress={() => {
                                refEDSheet.current.close();
                                hideProd()
                            }}
                        />
                    </View>
                </RBSheet>


                <RBSheet
                    ref={refRBSheet}
                    closeOnPressMask={true}
                    height={360}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0,0,0,0.5)",
                        },
                        draggableIcon: {
                            backgroundColor: dark ? COLORS.dark3 : COLORS.grayscale200,
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 360,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                            alignItems: "center",
                        }
                    }}
                >
                    <Text style={[styles.bottomTitle, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Share</Text>
                    <View style={[styles.separateLine, {
                        backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                        marginVertical: 12
                    }]} />
                    <View style={styles.socialContainer}>
                        <SocialIcon
                            icon={socials.whatsapp}
                            name="WhatsApp"
                            onPress={() => refRBSheet.current.close()}
                        />
                        <SocialIcon
                            icon={socials.twitter}
                            name="X"
                            onPress={() => refRBSheet.current.close()}
                        />
                        <SocialIcon
                            icon={socials.facebook}
                            name="Facebook"
                            onPress={() => refRBSheet.current.close()}
                        />
                        <SocialIcon
                            icon={socials.instagram}
                            name="Instagram"
                            onPress={() => refRBSheet.current.close()}
                        />
                    </View>
                    <View style={styles.socialContainer}>
                        <SocialIcon
                            icon={socials.yahoo}
                            name="Yahoo"
                            onPress={() => refRBSheet.current.close()}
                        />
                        <SocialIcon
                            icon={socials.titktok}
                            name="Tiktok"
                            onPress={() => refRBSheet.current.close()}
                        />
                        <SocialIcon
                            icon={socials.messenger}
                            name="Chat"
                            onPress={() => refRBSheet.current.close()}
                        />
                        <SocialIcon
                            icon={socials.wechat}
                            name="Wechat"
                            onPress={() => refRBSheet.current.close()}
                        />
                    </View>
                </RBSheet>
            </View>

        </>
    )
}

const styles = StyleSheet.create({
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        paddingHorizontal: 16,
        width: "100%"
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32
    },
    removeButton: {
        width: (SIZES.width - 32) / 2 - 8,
        borderRadius: 32
    },
    bottomSubtitle: {
        fontSize: 22,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        textAlign: "center",
        marginVertical: 12
    },
    selectedCancelContainer: {
        marginVertical: 24,
        paddingHorizontal: 36,
        width: "100%"
    },
    cancelTitle: {
        fontSize: 18,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.greyscale900,
        textAlign: "center",
    },
    cancelSubtitle: {
        fontSize: 14,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        textAlign: "center",
        marginVertical: 8,
        marginTop: 16
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
    methodContainer: {
        width: SIZES.width - 32,
        minHeight: 42,
        borderRadius: 22,
        borderColor: "gray",
        borderWidth: .3,
        flexDirection: "row",
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: "center",
        marginTop: 12,
        padding: 10
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 32,
        zIndex: 999,
        left: 16,
        right: 16
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    sendIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    sendIconContainer: {
        marginLeft: 8
    },
    iconContainer1: {
        width: 60,
        height: 60,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.tansparentPrimary,
    },
    icon: {
        width: 32,
        height: 32,
        tintColor: COLORS.primary
    },
    methodTitle: {
        fontSize: 14,
        fontFamily: "Urbanist Medium",
        color: COLORS.greyscale600
    },
    methodSubtitle: {
        fontSize: 16,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    contentContainer: {
        marginHorizontal: 12,
        marginBottom: 120,
    },
    separateLine: {
        width: SIZES.width - 32,
        height: 1,
        backgroundColor: COLORS.grayscale200,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.black,
        textAlign: "center",
        marginTop: 12
    },
    socialContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
        width: SIZES.width - 32
    },
    contentView: {
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        width: SIZES.width - 32
    },
    contentTitle: {
        fontSize: 30,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        marginVertical: 12
    },
    ratingView: {
        width: 68,
        height: 24,
        borderRadius: 4,
        backgroundColor: COLORS.silver,
        alignItems: "center",
        justifyContent: "center"
    },
    ratingViewTitle: {
        fontSize: 10,
        fontFamily: "Urbanist SemiBold",
        color: "#35383F",
        textAlign: "center"
    },
    starContainer: {
        marginHorizontal: 16,
        flexDirection: "row",
        alignItems: "center"
    },
    starIcon: {
        height: 12,
        width: 19
    },
    reviewText: {
        fontSize: 14,
        fontFamily: "Urbanist Medium",
        color: COLORS.greyScale800
    },
    descTitle: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 8
    },
    descText: {
        fontSize: 14,
        color: COLORS.greyScale800,
        fontFamily: "Urbanist Regular",
    },
    featureContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        marginVertical: 12
    },
    featureView: {
        flexDirection: "column",
    },
    sizeContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    sizeView: {
        height: 40,
        width: 40,
        borderRadius: 999,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: COLORS.greyscale600,
        marginRight: 12
    },
    sizeText: {
        fontSize: 16,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale600,
        textAlign: "center"
    },
    selectedSize: {
        backgroundColor: 'black',
        borderColor: 'black',
    },
    selectedText: {
        color: 'white',
    },
    colorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    colorView: {
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8
    },
    selectedColor: {
        marginRight: 7.8
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: SIZES.width - 32,
        marginVertical: 12
    },
    qtyViewContainer: {
        backgroundColor: COLORS.silver,
        height: 48,
        width: 134,
        borderRadius: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 16
    },
    qtyViewText: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        textAlign: "center"
    },
    qtyMidText: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        textAlign: "center",
        marginHorizontal: 16
    },
    cartBottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: SIZES.width,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 104,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        borderTopColor: COLORS.white,
        borderTopWidth: 1,
    },
    cartTitle: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: COLORS.greyscale600,
        marginBottom: 6
    },
    cartSubtitle: {
        fontSize: 24,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
    },
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
    bagIcon: {
        height: 20,
        width: 20,
        tintColor: COLORS.white,
        marginRight: 8
    }
})
export default ProductDetails