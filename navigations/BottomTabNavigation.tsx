import { View, Platform, Image, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Cart, Home, Orders, Profile, Wallet } from '../screens';
import PaymentHistory from '../screens/PaymentHistory';
import UploadItem from '../screens/UploadItem';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
    const { dark } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: Platform.OS !== 'ios',
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 90 : 60,
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    title: "",
                    tabBarIcon: ({ focused }: { focused: boolean }) => {
                        return (
                            <View style={{
                                alignItems: "center",
                                paddingTop: 16
                            }}>
                                <Image
                                    source={focused ? icons.home : icons.home2Outline}
                                    resizeMode="contain"
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                }}>Home</Text>
                            </View>
                        )
                    },
                }}
            />
            {/* <Tab.Screen
                name="cart"
                component={Cart}
                options={{
                    title: "",
                    tabBarIcon: ({ focused }: { focused: boolean }) => {
                        return (
                            <View style={{
                                alignItems: "center",
                                paddingTop: 16
                            }}>
                                <Image
                                    source={focused ? icons.bag3 : icons.bag3Outline}
                                    resizeMode="contain"
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                }}>Cart</Text>
                            </View>
                        )
                    },
                }}
            /> */}
            <Tab.Screen
                name="orders"
                component={Orders}
                options={{
                    title: "",
                    tabBarIcon: ({ focused }: { focused: boolean }) => {
                        return (
                            <View style={{
                                alignItems: "center",
                                paddingTop: 16
                            }}>
                                <Image
                                    source={focused ? icons.cart : icons.cartOutline}
                                    resizeMode="contain"
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                }}>Orders</Text>
                            </View>
                        )
                    },
                }}
            />


            <Tab.Screen
                name="AddProduct"
                component={UploadItem}
                options={{
                    title: "",
                    tabBarIcon: ({ focused }: { focused: boolean }) => {
                        return (
                            <View style={{
                                alignItems: "center",
                                paddingTop: 14,

                            }}>
                                <Image
                                    source={{ uri: 'https://img.icons8.com/m_rounded/512/plus.png' }}
                                    resizeMode="cover"
                                    style={{
                                        width: 65,
                                        height: 65,
                                        borderRadius: 200,
                                        // backgroundColor: focused ? dark ? COLORS.white : COLORS.white : dark ? COLORS.gray3 : COLORS.white,
                                        tintColor: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                    }}
                                />
                                {/* <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                }}>Wallet</Text> */}
                            </View>
                        )
                    },
                }}
            />



            <Tab.Screen
                name="Wallet"
                component={PaymentHistory}
                options={{
                    title: "",
                    tabBarIcon: ({ focused }: { focused: boolean }) => {
                        return (
                            <View style={{
                                alignItems: "center",
                                paddingTop: 16
                            }}>
                                <Image
                                    source={focused ? icons.wallet2 : icons.wallet2Outline}
                                    resizeMode="contain"
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                }}>Wallet</Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: "",
                    tabBarIcon: ({ focused }: { focused: boolean }) => {
                        return (
                            <View style={{
                                alignItems: "center",
                                paddingTop: 16
                            }}>
                                <Image
                                    source={focused ? icons.user : icons.userOutline}
                                    resizeMode="contain"
                                    style={{
                                        width: 24,
                                        height: 24,
                                        tintColor: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                    }}
                                />
                                <Text style={{
                                    ...FONTS.body4,
                                    color: focused ? dark ? COLORS.white : COLORS.primary : dark ? COLORS.gray3 : COLORS.gray3,
                                }}>Profile</Text>
                            </View>
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation