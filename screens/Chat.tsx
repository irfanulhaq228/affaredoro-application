import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar, FlatList, TouchableWithoutFeedback, Modal, ScrollView, ToastAndroid } from 'react-native';
import React, { useState, useRef, useEffect, useReducer, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, icons, images, SIZES } from '../constants';
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from '../theme/ThemeProvider';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { popularProducts } from '../data';
import ProductCard from '../components/ProductCard';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';
import { ImageLibraryOptions, ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, getFirst10Chars } from '../constants/baseUrl';
import axios from 'axios';
import NotFoundItem from '../components/NotFoundItem';


// Define message type
interface Message {
    _id: string;
    message?: string;
    image?: string;
    createdAt: Date;
    user: {
        _id: number;
        avatar?: any;
    };
    hardCode?: boolean;
    sendBy?: string;
    adminUser?: string;
    userId?: string;
}

// Inbox Chat
const Chat = ({ navigation, route }: { navigation: any, route: any }) => {


    const productIdss = route?.params?.productIds
    const image = route?.params?.image
    const name = route?.params?.name
    const username = route?.params?.username
    const inclPricee = route?.params?.inclPrice
    const pricee = route?.params?.price
    const adminUser = route?.params?.adminUser
    const userId = route?.params?.userId
    const sendByy = route?.params?.sendBy





    const fixedMessage: any = {
        _id: Math.random().toString(36).substring(7),
        message: 'hii',
        createdAt: new Date(),
        user: { _id: 2 },
        hardCode: true,
        sendBy: 'admin',
        senderId: adminUser,
        adminUser: adminUser,
        userId: userId,
    };

    const [messages, setMessages] = useState<Message[]>([]);



    const [localId, setLocalId] = useState<any>(null)
    const [sendBy, setSendBy] = useState<any>(sendByy)
    const [price, setPrice] = useState<any>(pricee)
    const [inclPrice, setInclPrice] = useState<any>(inclPricee)
    const [productIds, setProductIds] = useState<any>(productIdss)
    const [productPrice, setProductPrice] = useState<any>(null)
    const [adminOffer, setAdminOffer] = useState<any>(null)


    const [toData, setToData] = useState<any>(null);
    const [fromData, setFromData] = useState<any>(null);
    const [prodData, setProdData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);


    const toSubmit = async () => {
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
                        setToData(resp?.data);

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


    const fromSubmit = async () => {
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

            fetch(`${baseUrl}/users/viewUser/${adminUser}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setFromData(resp?.data);
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



    const submitProd = async () => {
        try {
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

            fetch(`${baseUrl}/product/viewAll?userId=${adminUser}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {
                    if (resp.status === "ok") {
                        setProdData(resp?.data);
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


    const getChat = async () => {
        try {
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

            console.log(adminUser, userId, JSON.stringify([productIds]));
            const sendIds = productIds.map((item: any) => item._id);



            fetch(`${baseUrl}/chat/viewAll?adminUser=${adminUser}&userId=${userId}&productId=${JSON.stringify(sendIds)}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {




                    if (resp.status === "ok") {
                        // if (resp.data?.length > 0) {
                        // setMessages(previousMessages => [resp?.data, ...previousMessages]);
                        setMessages([...resp.data, fixedMessage,]);
                        // }
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


    const getBidProd = async () => {
        try {
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

            const sendIds = productIds.map((item: any) => item._id);


            fetch(`${baseUrl}/chat/bidProduct?adminUser=${adminUser}&userId=${userId}&productId=${JSON.stringify(sendIds)}`, requestOptions)
                .then((response) => response.json()) // Directly parse JSON
                .then(async (resp) => {




                    if (resp.status === "ok") {
                        // if (resp.data?.length > 0) {
                        // setMessages(previousMessages => [resp?.data, ...previousMessages]);
                        setProductPrice(resp.data?.bidPrice);
                        // }
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


            toSubmit();
            fromSubmit();
            submitProd();
            getChat();
            setSendBy(sendByy)
            setPrice(pricee)
            setInclPrice(inclPricee)
            setProductIds(productIdss)
            getBidProd()
        }, []))





    const [inputMessage, setInputMessage] = useState('');
    const [img, setImg] = useState<any>(null);
    const { colors, dark } = useTheme();
    const flatListRef = useRef<FlatList>(null);

    const handleInputText = (text: string) => {
        setInputMessage(text);
    };

    const submitHandler = async () => { 
        setIsLoading(true);

        if (!inputMessage && !img && bid === 0) {
            ToastAndroid.show("Please enter a message or upload an image", ToastAndroid.SHORT);
            setIsLoading(false);
            return;
        }

        try {
            const formdata = new FormData();

            if (inputMessage) {
                formdata.append("message", inputMessage.trim());
            }

            if (img) {
                formdata.append("image", {
                    uri: img.uri,
                    name: img.name,
                    type: img.type,
                } as any);
            }


            formdata.append("adminUser", adminUser);
            formdata.append("senderId", localId);
            formdata.append("userId", userId);
            formdata.append("sendBy", sendBy);

            if (bid > 0) {
                formdata.append("bidPrice", bid);
                formdata.append("bidInclPrice", calculateValue(bid));
                formdata.append("bidStatus", adminOffer ? "Accepted" : "Pending");
            }

            productIds?.forEach((i: any) => {
                formdata.append("productId", i?._id);
            });

            const response = await fetch(`${baseUrl}/chat/create`, {
                method: "POST",
                body: formdata,
            });

            const resultText = await response.text();
            const result = JSON.parse(resultText);

            if (result.status === 'ok') {
                getChat();
                getBidProd();
                setInputMessage("");
                setImg(null); // 👈 this resets URI so the next image is fresh
                setBid(0);
                setShowOffer(false);
                setShowBundle(false);
                setShowReviewBundle(false);

                if (adminOffer) {
                    declineStatus(adminOffer?._id);
                    if (productIds?.length === 1) {
                        axios.get(`${baseUrl}/product/updateBid?productId=${productIds[0]?._id}&userId=${adminOffer?.senderId}&price=${bid}`);
                    }
                }
            } else {
                ToastAndroid.show(result.message || "Something went wrong", ToastAndroid.SHORT);
            }

        } catch (error: any) {
            console.error("Submit error:", error);
            submitHandler()
            // ToastAndroid.show(error.message || "Unexpected error", ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    };



    const declineStatus = async (id: any) => {
        setIsLoading(true)


        try {

            const formdata = new FormData();
            formdata.append("bidStatus", "Decline");


            const requestOptions: any = {
                method: "PUT",
                body: formdata,
                redirect: "follow"
            };

            fetch(`${baseUrl}/chat/update/${id}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const resp = JSON.parse(result)

                    if (resp.status === 'ok') {
                        getChat()
                        getBidProd()
                        setShowOffer(false);
                        setShowReviewBundle(false);
                        setShowBundle(false);
                        if (!adminOffer) {
                            ToastAndroid.show('Offer decline successfully!', 2000)
                        }
                        setAdminOffer(null)

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

    const delChat = async () => {
        if (!selectedRemoveItem?._id) {
            ToastAndroid.show("No chat selected to delete.", ToastAndroid.SHORT);
            return;
        }

        setIsLoading(true);

        try {
            console.log("Deleting chat with ID:", selectedRemoveItem._id);

            const response = await axios.delete(`${baseUrl}/chat/delete/${selectedRemoveItem._id}`);
            const resp = response?.data;

            console.log("Delete response:", resp);

            if (resp?.status === 'ok') {
                getChat();
                getBidProd();
                setShowOffer(false);
                setShowReviewBundle(false);
                setShowBundle(false);
                setAdminOffer(null);
                setSelectedRemoveItem(null);
                setRemoveModalVisible(false);
            } else {
                const errorMessage = resp?.message || "Failed to delete chat.";
                ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
            }
        } catch (error: any) {
            console.error("API Error:", error);
            ToastAndroid.show(error?.response?.data?.message || error.message || "An unexpected error occurred", ToastAndroid.SHORT);
        } finally {
            setIsLoading(false);
        }
    };



    const acceptStatus = async (id: any) => {
        setIsLoading(true)


        try {

            const formdata = new FormData();
            formdata.append("bidStatus", "Accepted");


            const requestOptions: any = {
                method: "PUT",
                body: formdata,
                redirect: "follow"
            };

            fetch(`${baseUrl}/chat/update/${id?._id}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    const resp = JSON.parse(result)

                    if (resp.status === 'ok') {
                        getChat()
                        getBidProd()
                        setShowOffer(false);
                        setShowBundle(false);
                        setShowReviewBundle(false);
                        ToastAndroid.show('Offer accepted successfully!', 2000)

                        if (productIds?.length === 1) {
                            axios.get(`${baseUrl}/product/updateBid?productId=${productIds[0]?._id}&userId=${id?.senderId}&price=${id?.bidPrice}`)
                        }


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



    // Scroll to bottom when messages update
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
    }, [messages]);




    const handleImagePick = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 1200,
            maxWidth: 1200,
            quality: 0.8,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                const uri = asset.uri;
                const fileName = asset.fileName || `photo_${Date.now()}.jpg`;
                const type = asset.type || 'image/jpeg';

                if (uri) {
                    setImg({ uri, name: fileName, type });
                }
            }
        });
    };


    // Render message bubble
    const renderMessageItem = ({ item }: { item: any }) => {


        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: item?.senderId === localId ? 'flex-end' : 'flex-start',
                marginVertical: 8,
                marginHorizontal: 2,
            }}>
                {item?.senderId !== localId ? (
                    <TouchableOpacity onPress={() => navigation.navigate("viewprofile", { userId: item?.senderId !== userId ? fromData?._id : toData?._id })}>
                        <Image
                            source={{ uri: item?.senderId === item?.userId ? baseUrl + '/' + toData?.image : baseUrl + '/' + fromData?.image }}
                            style={{
                                width: 25,
                                height: 25,
                                borderRadius: 20,
                                marginHorizontal: 12,
                            }}
                        />
                    </TouchableOpacity>
                ) : null}



                {item?.senderId === localId && !item?.hardCode ? (
                    <View style={{ position: 'relative' }}>
                        <TouchableOpacity onPress={() => {
                            if (item?._id === selectedRemoveItem?._id) {
                                setRemoveModalVisible(false)
                                setSelectedRemoveItem(null)
                            }
                            else {
                                setRemoveModalVisible(true)
                                setSelectedRemoveItem(item)
                            }

                        }}>
                            <Image
                                source={icons.moreVertical}
                                style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 20,
                                    marginHorizontal: 12,
                                    tintColor: COLORS.gray
                                }}
                            />
                        </TouchableOpacity>

                        {removeModalVisible && item?._id === selectedRemoveItem?._id && (
                            <TouchableWithoutFeedback onPress={() => setRemoveModalVisible(false)}>
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 99999999999999,
                                }}>
                                    <TouchableWithoutFeedback>
                                        <View style={{ position: 'absolute', top: 0, right: -90 }}>
                                            <View style={{
                                                width: 120,
                                                padding: 5,
                                                paddingHorizontal: 10,
                                                backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                                                borderRadius: 8
                                            }}>
                                                <FlatList
                                                    data={dropdownRemoveItems}
                                                    keyExtractor={(item) => item.value}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            style={{
                                                                flexDirection: "row",
                                                                alignItems: 'center',
                                                                marginVertical: 12
                                                            }}
                                                            onPress={() => {
                                                                // handle item press
                                                                delChat()
                                                            }}
                                                        >
                                                            <Image
                                                                source={item.icon}
                                                                resizeMode='contain'
                                                                style={{
                                                                    width: 20,
                                                                    height: 20,
                                                                    marginRight: 16,
                                                                    tintColor: dark ? COLORS.white : COLORS.black
                                                                }}
                                                            />
                                                            <Text style={{
                                                                fontSize: 14,
                                                                fontFamily: "Urbanist SemiBold",
                                                                color: dark ? COLORS.white : COLORS.black
                                                            }}>
                                                                {item.label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        )}

                    </View>
                ) : null}



                <View style={{
                    backgroundColor: item?.senderId === localId ? COLORS.primary : COLORS.secondary,
                    borderRadius: 20,
                    maxWidth: '70%',
                    padding: 12,
                    marginLeft: 0,
                    marginRight: 0,
                }}>


                    {item.image && (
                        <Image
                            source={{ uri: baseUrl + '/' + item.image }}
                            style={{
                                width: 200,
                                height: 200,
                                borderRadius: 12,
                                marginBottom: 4,
                            }}
                            resizeMode="cover"
                        />
                    )}


                    {item?.hardCode ?
                        <>
                            <Text style={{ color: item?.senderId === localId ? COLORS.white : COLORS.black }}>
                                {item.message}, I'm {fromData?.username}
                            </Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate("productreviews", { toUserId: fromData?._id })}
                                style={[styles.starContainer, { marginBottom: 5, marginHorizontal: 0 }]}>
                                <View>
                                    <Image
                                        source={icons.starHalf2}
                                        resizeMode='contain'
                                        style={[styles.starIcon, {
                                            tintColor: item?.senderId === localId ? COLORS.white : COLORS.black
                                        }]}
                                    />
                                </View>
                                <View>
                                    <Text style={[styles.reviewText, {
                                        color: item?.senderId === localId ? COLORS.white : COLORS.black
                                    }]}>
                                        {" "}{fromData?.rating} ({fromData?.reviews} reviews)
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {fromData?.country ? <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 5, gap: 5 }}>
                                <Image
                                    source={icons.pin}
                                    resizeMode='contain'
                                    style={[styles.bookmarkIcon, { tintColor: item?.senderId === localId ? COLORS.white : COLORS.black, width: 20, height: 20 }]}
                                />
                                <Text style={[styles.reviewText, {
                                    color: item?.senderId === localId ? COLORS.white : COLORS.black,
                                }]}>{fromData?.showCity ? fromData?.city + ',' : null} {fromData?.country}</Text>
                            </View> : null}




                        </>
                        : item?.bidPrice ?
                            <>
                                <Text style={{ color: item?.senderId === localId ? COLORS.white : COLORS.black }}>
                                    ${item?.bidPrice} <Text style={{ color: item?.senderId === localId ? COLORS.gray : COLORS.gray, textDecorationLine: 'line-through' }}>
                                        ${productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)}
                                    </Text>

                                </Text>

                                {item?.senderId !== localId && (item?.bidStatus === 'Pending' || item?.bidStatus === 'pending') && localId === fromData?._id ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, flexWrap: 'wrap', gap: 10 }}>



                                        <TouchableOpacity
                                            onPress={() => acceptStatus(item)}
                                            style={[styles2.cartBtn, {
                                                backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 45
                                            }]}>
                                            <Text style={[styles2.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white, fontSize: 15
                                            }]}>Accept</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => declineStatus(item?._id)}
                                            style={[styles2.cartBtn, {
                                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '47%', minHeight: 45
                                            }]}>

                                            <Text style={[styles2.cartBtnText, {
                                                color: dark ? COLORS.white : COLORS.primary, fontSize: 15
                                            }]}>Decline this offer</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowOffer(true)
                                                setAdminOffer(item)
                                            }}
                                            style={[styles2.cartBtn, {
                                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '47%'
                                            }]}>
                                            <Text style={[styles2.cartBtnText, {
                                                color: dark ? COLORS.white : COLORS.primary, fontSize: 15
                                            }]}>Offer your price</Text>
                                        </TouchableOpacity>






                                    </View> :

                                    item?.senderId !== localId && (item?.bidStatus === 'Accepted' || item?.bidStatus === 'Pending' || item?.bidStatus === 'accepted' || item?.bidStatus === 'pending') && localId === toData?._id ?
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, flexWrap: 'wrap', gap: 10 }}>



                                            <TouchableOpacity
                                                onPress={() => navigation.navigate("checkout", { productIds: productIds, discount: fromData?.bundleDiscount ? (sumprice - save)?.toFixed(2) : 0 })}
                                                style={[styles2.cartBtn, {
                                                    backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 45
                                                }]}>
                                                <Text style={[styles2.cartBtnText, {
                                                    color: dark ? COLORS.black : COLORS.white, fontSize: 15
                                                }]}>Buy now</Text>
                                            </TouchableOpacity>






                                        </View> : <Text style={{ color: item?.senderId === localId ? COLORS.white : COLORS.black }}>
                                            {item?.bidStatus}
                                        </Text>}



                            </> : <Text style={{ color: item?.senderId === localId ? COLORS.white : COLORS.black }}>
                                {item?.message}
                            </Text>}

                    <Text style={{
                        color: item?.senderId === localId ? COLORS.white : COLORS.black,
                        fontSize: 10,
                        alignSelf: 'flex-end',
                        marginTop: 4,
                    }}>
                        {new Date(item?.createdAt)?.getHours()?.toString()?.padStart(2, '0')}:
                        {new Date(item?.createdAt)?.getMinutes()?.toString()?.padStart(2, '0')} {new Date(item?.createdAt).getHours() >= 12 ? 'PM' : 'AM'}
                    </Text>
                </View>




                {item?.senderId === localId ? (
                    <TouchableOpacity onPress={() => navigation.navigate("viewprofile", { userId: item?.senderId === item?.userId ? toData?._id : fromData?._id })}>
                        <Image
                            source={{ uri: item?.senderId === item?.userId ? baseUrl + '/' + toData?.image : baseUrl + '/' + fromData?.image }}
                            style={{
                                width: 25,
                                height: 25,
                                borderRadius: 20,
                                marginHorizontal: 12,
                            }}
                        />
                    </TouchableOpacity>
                ) : null}

                {(item?.adminUser?.toString() === item?.userId?.toString()) && (
                    <View style={{ width: 15 }} />
                )}
            </View>
        );
    };











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
    // const sumprice: any = 0
    // const taxprice = (addBundle.reduce((acc: any, curr: any) => acc + curr.tax, 0))?.toFixed(2)
    const ship: any = (productIds.reduce((sum: any, product: any) => sum + (product?.shipPrice || 0), 0)).toFixed(2)
    const taxprice: any = (productIds.reduce((sum: any, product: any) => sum + (product?.inclPrice || 0), 0)).toFixed(2)
    const save: any = fromData?.bundleDiscount ? productIds.length > 0 ? productIds.length > 1 ? productIds.length > 2 ? productIds.length > 4 ? ((sumprice) - ((sumprice * fromData?.item5) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * fromData?.item3) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * fromData?.item2) / 100))?.toFixed(2) : ((sumprice) - ((sumprice * 0) / 100))?.toFixed(2) : null : 0

    const [showBundle, setShowBundle] = useState(false)
    const [selPrice, setSelPrice] = useState('custom')
    const [bid, setBid] = useState<any>(0)



    function calculateValue(n: any) {
        return (1.75 + (n - 1) * 1.05).toFixed(2);
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
                                        <Text style={[styles2.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12
                                        }]}>
                                            {productIds.length > 0 ? productIds.length > 1 ? productIds.length > 2 ? productIds.length > 3 ? productIds.length > 4 ? `${fromData?.item5}% discount applied. You'll save $${save}!` : `Add 1 more item to get ${fromData?.item5}% off` : `Add 2 more item to get ${fromData?.item5}% off` : `Add 1 more item to get ${fromData?.item3}% off` : `Add 1 more item to get ${fromData?.item2}% off` : 'Add 2 items to get 20% off'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center' }} onPress={() => {
                                        setShowBundle(false)
                                    }}>
                                        <Image
                                            source={icons.cancelSquare}
                                            resizeMode='contain'
                                            style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
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
                                                {save ? <Text style={[styles2.descTitle, {
                                                    color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                                }]}><Image
                                                        source={images.price}
                                                        resizeMode='contain'
                                                        style={{
                                                            width: 12, height: 12,
                                                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                                                        }}
                                                    /> {save}</Text> : null}
                                                {save !== sumprice ? <Text style={[styles2.descTitle, {
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
                                            <Text style={[styles2.descTitle, {
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
                                        style={[styles2.cartBtn, {
                                            backgroundColor: productIds?.length === 0 ? COLORS.gray : dark ? COLORS.white : COLORS.black, width: 130, height: 50
                                        }]} disabled={productIds?.length === 0 ? true : false}>
                                        <Text style={[styles2.cartBtnText, {
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
                                        style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                    />
                                </TouchableOpacity>


                                <Text style={[styles2.descTitle, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>Review Bundle</Text>



                                <View style={{ marginBottom: 10 }}>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, }}>

                                        <Text style={[styles2.descTitle, {
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

                                        <Text style={[styles2.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Order</Text>
                                        <Text style={[styles2.descTitle, {
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

                                        <Text style={[styles2.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Shipping</Text>
                                        <Text style={[styles2.descTitle, {
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

                                        <Text style={[styles2.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Buyer Protection fee</Text>
                                        <Text style={[styles2.descTitle, {
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



                                    {save ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, }}>

                                        <Text style={[styles2.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Bundle discount {productIds.length > 1 ? productIds.length > 2 ? productIds.length > 4 ? `(${fromData?.item5}% discount)` : `(${fromData?.item3}% discount)` : `(${fromData?.item2}% discount)` : null}</Text>
                                        <Text style={[styles2.descTitle, {
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

                                        <Text style={[styles2.descTitle, {
                                            color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                        }]}>Total to pay</Text>
                                        <Text
                                            style={[
                                                styles2.descTitle,
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
                                            />{` ${(
                                                Number(sumprice) +
                                                (Number(taxprice)) +
                                                Number(ship) -
                                                (fromData?.bundleDiscount ? (Number(sumprice) - Number(save)) : 0)
                                            ).toFixed(2)}`}
                                        </Text>


                                    </View>



                                </View>



                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>


                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowBundle(false)
                                            setShowReviewBundle(false)
                                        }}
                                        style={[styles2.cartBtn, {
                                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '100%',
                                        }]}>
                                        <Image
                                            source={icons.chatBubble2}
                                            resizeMode='contain'
                                            style={[styles2.bagIcon, {
                                                tintColor: dark ? COLORS.white : COLORS.primary
                                            }]}
                                        />
                                        <Text style={[styles2.cartBtnText, {
                                            color: dark ? COLORS.white : COLORS.primary,
                                        }]}>Message Seller</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        onPress={() => setShowOffer(true)}
                                        style={[styles2.cartBtn, {
                                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: '48%'
                                        }]}>
                                        {/* <Image
                          source={icons.bags}
                          resizeMode='contain'
                          style={[styles.bagIcon, {
                              tintColor: dark ? COLORS.black : COLORS.white
                          }]}
                      /> */}
                                        <Text style={[styles2.cartBtnText, {
                                            color: dark ? COLORS.white : COLORS.primary,
                                        }]}>Make an offer</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("checkout", { productIds: productIds, discount: fromData?.bundleDiscount ? (sumprice - save)?.toFixed(2) : 0 })}
                                        style={[styles2.cartBtn, {
                                            backgroundColor: dark ? COLORS.white : COLORS.black, width: '48%'
                                        }]}>
                                        <Image
                                            source={icons.bags}
                                            resizeMode='contain'
                                            style={[styles2.bagIcon, {
                                                tintColor: dark ? COLORS.black : COLORS.white
                                            }]}
                                        />
                                        <Text style={[styles2.cartBtnText, {
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
                                        style={[styles2.bookmarkIcon, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                    />
                                </TouchableOpacity>


                                <Text style={[styles2.descTitle, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>Make an offer</Text>



                                <View style={{ marginBottom: 10 }}>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>

                                        <View>
                                            <Text style={[styles2.descTitle, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 14
                                            }]}>{productIds.length} {productIds.length > 1 ? "Items" : "Item"}</Text>
                                            <Text style={[styles2.reviewText, {
                                                color: dark ? COLORS.white : COLORS.greyscale900, fontSize: 12,
                                            }]}>{productIds.length > 1 ? "Bundle" : "Product"} price: $ {productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)}</Text>

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
                                                styles2.methodContainer, { width: '30%', borderWidth: selPrice === '10' ? 2 : .3 }
                                            ]}
                                            onPress={() => {
                                                setBid(((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) - (((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) * 10) / 100)))
                                                setSelPrice('10')
                                            }}>
                                            <View style={[styles2.iconContainer, { gap: 5 }]}>

                                                <View>
                                                    <Text style={[styles2.methodSubtitle, {
                                                        color: dark ? COLORS.white : COLORS.black
                                                    }]}>{" "}<Image
                                                            source={images.price}
                                                            resizeMode='contain'
                                                            style={{
                                                                width: 14, height: 14,
                                                                tintColor: dark ? COLORS.white : COLORS.black
                                                            }}
                                                        />{((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) - (((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) * 10) / 100))?.toFixed(2)}</Text>

                                                    <View
                                                        style={[styles2.starContainer, { marginHorizontal: 0 }]}>

                                                        <View>
                                                            <Text style={[styles2.reviewText, {
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
                                                styles2.methodContainer, { width: '30%', borderWidth: selPrice === '20' ? 2 : .3 }
                                            ]}
                                            onPress={() => {
                                                setBid(((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) - (((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) * 20) / 100)))
                                                setSelPrice('20')
                                            }}>
                                            <View style={[styles2.iconContainer, { gap: 5 }]}>

                                                <View>
                                                    <Text style={[styles2.methodSubtitle, {
                                                        color: dark ? COLORS.white : COLORS.black
                                                    }]}>{" "}<Image
                                                            source={images.price}
                                                            resizeMode='contain'
                                                            style={{
                                                                width: 14, height: 14,
                                                                tintColor: dark ? COLORS.white : COLORS.black
                                                            }}
                                                        />{((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) - (((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) * 20) / 100))?.toFixed(2)}</Text>

                                                    <View
                                                        style={[styles2.starContainer, { marginHorizontal: 0 }]}>

                                                        <View>
                                                            <Text style={[styles2.reviewText, {
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
                                                styles2.methodContainer, { width: '30%', borderWidth: selPrice === 'custom' ? 2 : .3 }
                                            ]}
                                            onPress={() => {
                                                setBid(0)
                                                setSelPrice('custom')
                                            }}>
                                            <View style={[styles2.iconContainer, { gap: 5 }]}>

                                                <View>
                                                    <Text style={[styles2.methodSubtitle, {
                                                        color: dark ? COLORS.white : COLORS.black
                                                    }]}>{" "}<Image
                                                            source={images.price}
                                                            resizeMode='contain'
                                                            style={{
                                                                width: 14, height: 14,
                                                                tintColor: dark ? COLORS.white : COLORS.black
                                                            }}
                                                        />{((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) - (((productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.price || 0), 0)) * 0) / 100))?.toFixed(2)}</Text>

                                                    <View
                                                        style={[styles2.starContainer, { marginHorizontal: 0 }]}>

                                                        <View>
                                                            <Text style={[styles2.reviewText, {
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


                                    {/* {bid > 0 ? <Text style={[styles2.reviewText, {
                                        color: dark ? COLORS.grayscale400 : COLORS.grayscale400, fontSize: 12, marginBottom: 10
                                    }]}><Image
                                            source={images.price}
                                            resizeMode='contain'
                                            style={{
                                                width: 12, height: 12,
                                                tintColor: dark ? COLORS.grayscale400 : COLORS.grayscale400
                                            }}
                                        /> {calculateValue(bid)} incl. Buyer Protection fee</Text> : null}


                                    <Text style={[styles2.reviewText, {
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
                                        style={[styles2.cartBtn, {
                                            backgroundColor: dark ? COLORS.white : COLORS.black, width: '100%', height: 50
                                        }]}>
                                        {bid > 0 ? <>

                                            <Text style={[styles2.cartBtnText, {
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
                                            <Text style={[styles2.cartBtnText, {
                                                color: dark ? COLORS.black : COLORS.white,
                                            }]}>{bid} </Text>

                                        </>
                                            :
                                            <Text style={[styles2.cartBtnText, {
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
                                                    styles2.cartBtn,
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
                                                        styles2.cartBtnText,
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


    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [selectedRemoveItem, setSelectedRemoveItem] = useState<any>(null);



    const dropdownRemoveItems = [
        { label: 'Delete', value: 'delete', icon: icons.trash },
    ];


    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);



    const dropdownItems = [
        { label: 'Block', value: 'block', icon: icons.hide },
        { label: 'Report', value: 'report', icon: icons.download2 },
    ];

    const handleDropdownSelect = (item: any) => {
        setSelectedItem(item.value);
        setModalVisible(false);

        // Perform actions based on the selected item
        switch (item.value) {
            case 'block':
                // Handle Share action
                setModalVisible(false);
                // navigation.navigate("(tabs)")
                break;
            case 'report':
                // Handle Download E-Receipt action
                setModalVisible(false);
                // navigation.navigate("(tabs)")
                break;

            default:
                break;
        }
    };


    const ShowDropdownModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ top: 62, right: 12, position: 'absolute' }}>
                                <View style={{
                                    width: 202,
                                    padding: 16,
                                    backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                                    borderRadius: 8
                                }}>

                                    <FlatList
                                        data={dropdownItems}
                                        keyExtractor={(item) => item.value}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: 'center',
                                                    marginVertical: 12
                                                }}
                                                onPress={() => handleDropdownSelect(item)}>
                                                <Image
                                                    source={item.icon}
                                                    resizeMode='contain'
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        marginRight: 16,
                                                        tintColor: dark ? COLORS.white : COLORS.black
                                                    }}
                                                />
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontFamily: "Urbanist SemiBold",
                                                    color: dark ? COLORS.white : COLORS.black
                                                }}>{item.label}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>)
    }




    const ShowRemoveModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={removeModalVisible}
                onRequestClose={() => setRemoveModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setRemoveModalVisible(false)}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{ top: 0, right: 0, position: 'absolute' }}>
                                <View style={{
                                    width: 202,
                                    padding: 16,
                                    backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
                                    borderRadius: 8
                                }}>

                                    <FlatList
                                        data={dropdownRemoveItems}
                                        keyExtractor={(item) => item.value}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: 'center',
                                                    marginVertical: 12
                                                }}
                                                onPress={() => {

                                                }}>
                                                <Image
                                                    source={item.icon}
                                                    resizeMode='contain'
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        marginRight: 16,
                                                        tintColor: dark ? COLORS.white : COLORS.black
                                                    }}
                                                />
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontFamily: "Urbanist SemiBold",
                                                    color: dark ? COLORS.white : COLORS.black
                                                }}>{item.label}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>)
    }








    return (
        <>


            <SafeAreaView style={[styles.container, {
                backgroundColor: colors.background
            }]}>
                {/* <StatusBar hidden={true} /> */}
                <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                    <View style={[styles.header, {
                        backgroundColor: dark ? COLORS.dark1 : COLORS.white
                    }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image
                                    source={icons.arrowLeft}
                                    resizeMode="contain"
                                    style={[styles.headerIcon, {
                                        tintColor: dark ? COLORS.white : COLORS.greyscale900
                                    }]}
                                />
                            </TouchableOpacity>
                            <Text style={[styles.headerTitle, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>{username}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                            {/* {localId === fromData?._id ? null : <TouchableOpacity
                                onPress={() => setShowBundle(true)}>
                                <Image
                                    source={icons.plus}
                                    resizeMode="contain"
                                    style={[styles.headerIcon, {
                                        tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
                                    }]}
                                />
                            </TouchableOpacity>} */}
                            {/* <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 16 }}>
                            <Image
                                source={icons.moreCircle}
                                resizeMode="contain"
                                style={[styles.headerIcon, {
                                    tintColor: dark ? COLORS.secondaryWhite : COLORS.greyscale900
                                }]}
                            />
                        </TouchableOpacity> */}
                        </View>
                    </View>

                    <View style={styles.chatContainer}>


                        <View
                            style={[
                                styles.methodContainer,
                                { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }
                                // Customize the border color for Email
                            ]}
                        >
                            <View style={[styles.iconContainer, { gap: 5 }]}>
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
                                <View>
                                    <Text style={[styles.methodSubtitle, {
                                        color: dark ? COLORS.white : COLORS.black
                                    }]}>{productIds?.length > 1 ? `Bundle ${productIds?.length} items` : productIds[0]?.name}</Text>

                                    <View
                                        style={[styles.starContainer, { marginHorizontal: 0 }]}>

                                        <View>
                                            <Text style={[styles.reviewText, {
                                                color: dark ? COLORS.white : COLORS.greyScale800
                                            }]}>
                                                <Image
                                                    source={images.price}
                                                    resizeMode='contain'
                                                    style={{
                                                        width: 12, height: 12,
                                                        tintColor: dark ? COLORS.white : COLORS.greyScale800
                                                    }}
                                                />{productPrice ? productPrice : productIds.reduce((sum: any, product: any) => sum + (product.totalPrice || 0), 0)}
                                            </Text>
                                            {/* <Text style={[styles.reviewText, {
                                            color: dark ? COLORS.white : COLORS.greyScale800,
                                        }]}>
                                            <Image
                                                source={images.price}
                                                resizeMode='contain'
                                                style={{
                                                    width: 12, height: 12,
                                                    tintColor: dark ? COLORS.white : COLORS.greyScale800
                                                }}
                                            />{productPrice ? calculateValue((productPrice)?.toFixed(2)) : (productIds.reduce((sum: any, product: any) => sum + (product.inclPrice || 0), 0))?.toFixed(2)} Includes
                                        </Text> */}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, width: '100%' }}>

                                <TouchableOpacity
                                    onPress={() => setShowOffer(true)}
                                    style={[styles.cartBtn, {
                                        backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary, width: localId === fromData?._id ? '100%' : '48%'
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


                                {localId === fromData?._id ? null : <TouchableOpacity
                                    onPress={() => navigation.navigate("checkout", { productIds: productIds, discount: fromData?.bundleDiscount ? (sumprice - save)?.toFixed(2) : 0 })}
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
                                </TouchableOpacity>}

                            </View>
                        </View>


                        <FlatList
                            showsVerticalScrollIndicator={false}
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderMessageItem}
                            keyExtractor={(item) => item._id}
                            inverted={true}
                            contentContainerStyle={{ paddingVertical: 10, }}
                        />
                    </View>

                    <View style={[styles.inputContainer, {
                        backgroundColor: dark ? COLORS.dark1 : COLORS.white
                    }]}>
                        <View style={[styles.inputMessageContainer, {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.grayscale100, minHeight: 50
                        }]}>

                            {img && (
                                <View style={{ position: 'relative' }}>
                                    <Image
                                        source={{ uri: img?.uri }}
                                        style={{
                                            width: 55,
                                            height: 55,
                                            borderRadius: 12,
                                            marginBottom: 4,
                                        }}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity style={{ position: 'absolute', padding: 3, right: -5, top: -5, backgroundColor: dark ? COLORS.white : COLORS.black, borderRadius: 8 }} onPress={() => {
                                        setImg(null)
                                    }}>
                                        <MaterialCommunityIcons
                                            name="close"
                                            size={16}
                                            color={dark ? COLORS.black : COLORS.white}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TextInput
                                style={[styles.input, {
                                    color: dark ? COLORS.secondaryWhite : COLORS.gray,
                                }]}
                                value={inputMessage}
                                onChangeText={handleInputText}
                                placeholderTextColor={COLORS.gray}
                                placeholder="Enter your message..."
                                onSubmitEditing={submitHandler}
                                returnKeyType="send"
                            />
                            <View style={styles.attachmentIconContainer}>
                                <TouchableOpacity onPress={handleImagePick} >
                                    <Feather name="image" size={24} color={COLORS.gray} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.microContainer, {
                                backgroundColor: (inputMessage.trim() === '' && img === '') ? COLORS.gray : dark ? COLORS.white : COLORS.primary,
                            }]}
                            onPress={submitHandler} disabled={isLoading}>
                            {(inputMessage.trim() === '' && img === '') ? (
                                <Feather
                                    name="send"
                                    size={20}
                                    color={dark ? COLORS.primary : COLORS.white}
                                />
                            ) : (
                                <Feather
                                    name="send"
                                    size={20}
                                    color={dark ? COLORS.primary : COLORS.white}
                                />
                            )}
                        </TouchableOpacity>
                    </View>




                    {showBundleModal()}
                    {ShowReviewBundleModal()}
                    {ShowOfferModal()}
                    {ShowDropdownModal()}

                </View>
            </SafeAreaView>

        </>
    );
};

const styles = StyleSheet.create({
    bookmarkIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    methodContainer: {
        width: SIZES.width - 20,
        minHeight: 42,
        borderRadius: 22,
        borderColor: "gray",
        borderWidth: .3,
        flexDirection: "row",
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: "center",
        marginVertical: 5,
        marginStart: 10,

        padding: 10
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center"
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
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    contentContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: COLORS.white,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.black,
        marginLeft: 22
    },
    headerIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        marginRight: 12,
    },
    chatContainer: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 5
    },
    inputMessageContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        backgroundColor: COLORS.grayscale100,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 12,
        alignItems: 'center'
    },
    attachmentIconContainer: {
        marginRight: 12,
    },
    input: {
        color: COLORS.gray,
        flex: 1,
        paddingHorizontal: 10,
        height: 30,
        padding: 0
    },
    microContainer: {
        height: 48,
        width: 48,
        borderRadius: 49,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
    }
});










const styles2 = StyleSheet.create({
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
        height: 20,
        width: 20
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
        height: 58,
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


export default Chat;