import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { AddNewAddress, AddNewCard, AddPromo, Address, Call, CancelOrder, CancelOrderPaymentMethods, Categories, ChangeEmail, ChangePassword, ChangePIN, Chat, Checkout, CheckoutSuccessful, ChooseShippingMethods, ProductDetails, CreateNewPassword, CreateNewPIN, CustomerService, EditProfile, EnterYourPIN, Ereceipt, FillYourProfile, Fingerprint, ForgotPasswordEmail, ForgotPasswordMethods, ForgotPasswordPhoneNumber, Inbox, Login, MostPopularProducts, MyWishlist, Notifications, Onboarding1, Onboarding2, Onboarding3, Onboarding4, OtpVerification, PaymentMethods, ProductEreceipt, ProductReviews, Search, SelectShippingAddress, SettingsHelpCenter, SettingsInviteFriends, SettingsLanguage, SettingsNotifications, SettingsPayment, SettingsSecurity, Signup, TopupEreceipt, TopupEwalletAmount, TopupEwalletMethods, TrackOrder, TransactionHistory, VideoCall, Welcome, SettingsTermsAndConditions } from '../screens';
import BottomTabNavigation from './BottomTabNavigation';
import ViewProfile from '../screens/ViewProfile';
import Followers from '../screens/Followers';
import Following from '../screens/Following';
import UploadItem from '../screens/UploadItem';
import ShippingAddress from '../screens/ShippingAddress';
import BillingAddress from '../screens/BillingAddress';
import AddBankScreen from '../screens/AddBankScreen';
import SettingsBankAccounts from '../screens/SettingsBankAccounts';
import EditItem from '../screens/EditItem';
import OrderDetails from '../screens/OrderDetails';
import Income from '../screens/Income';
import CustomerOrders from '../screens/CustomerOrders';
import SettingsAbout from '../screens/SettingsAbout';
import OnboardingSuccess from '../screens/OnboardingSuccess';
import OnboardingFail from '../screens/OnboardingFail';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState<any>(null)
    const [isLogin, setIsLogin] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const checkIfFirstLaunch = async () => {
            try {
                const value = await AsyncStorage.getItem('alreadyLaunched')
                const login = await AsyncStorage.getItem('login')
                setIsLogin(login)
                if (value === null) {
                    await AsyncStorage.setItem('alreadyLaunched', 'true')
                    setIsFirstLaunch(true)
                } else {
                    setIsFirstLaunch(true)
                }
            } catch (error) {
                setIsFirstLaunch(true)
            }
            setIsLoading(false) // Set loading state to false once the check is complete
        }

        checkIfFirstLaunch()
    }, [])

    if (isLoading) {
        return null // Render a loader or any other loading state component
    }


    const linking = {
        prefixes: [
            'affaredoro://',
            'https://affaredoro.com'
        ],
        config: {
            screens: {
                OnboardingSuccess: 'OnboardingSuccess',
                OnboardingFail: 'OnboardingFail',
                SettingsBankAccounts: 'SettingsBankAccounts',
                // …other routes
            },
        },
    };


    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                // replace the second onboaring1 with login in order to make the user not to see the onboarding 
                // when login the next time
                initialRouteName={isLogin ? '(tabs)' : isFirstLaunch ? 'onboarding1' : 'login'}>
                <Stack.Screen name="OnboardingSuccess" component={OnboardingSuccess} />
                <Stack.Screen name="OnboardingFail" component={OnboardingFail} />
                <Stack.Screen name="CustomerOrders" component={CustomerOrders} />
                <Stack.Screen name="ShippingAddress" component={ShippingAddress} />
                <Stack.Screen name="BillingAddress" component={BillingAddress} />
                <Stack.Screen name="addnewaddress" component={AddNewAddress} /> 
                <Stack.Screen name="AddBankScreen" component={AddBankScreen} />
                <Stack.Screen name="addnewcard" component={AddNewCard} />
                <Stack.Screen name="SettingsBankAccounts" component={SettingsBankAccounts} />
                <Stack.Screen name="addpromo" component={AddPromo} />
                <Stack.Screen name="address" component={Address} />
                <Stack.Screen name="call" component={Call} />
                <Stack.Screen name="cancelorder" component={CancelOrder} />
                <Stack.Screen name="Income" component={Income} />
                <Stack.Screen name="cancelorderpaymentmethods" component={CancelOrderPaymentMethods} />
                <Stack.Screen name="categories" component={Categories} />
                <Stack.Screen name="changeemail" component={ChangeEmail} />
                <Stack.Screen name="changepassword" component={ChangePassword} />
                <Stack.Screen name="changepin" component={ChangePIN} />
                <Stack.Screen name="chat" component={Chat} />
                <Stack.Screen name="checkout" component={Checkout} />
                <Stack.Screen name="checkoutsuccessful" component={CheckoutSuccessful} />
                <Stack.Screen name="chooseshippingmethods" component={ChooseShippingMethods} />
                <Stack.Screen name="ProductDetails" component={ProductDetails} />
                <Stack.Screen name="createnewpassword" component={CreateNewPassword} />
                <Stack.Screen name="createnewpin" component={CreateNewPIN} />
                <Stack.Screen name="customerservice" component={CustomerService} />
                <Stack.Screen name="editprofile" component={EditProfile} />
                <Stack.Screen name="enteryourpin" component={EnterYourPIN} />
                <Stack.Screen name="ereceipt" component={Ereceipt} />
                <Stack.Screen name="OrderDetails" component={OrderDetails} />
                <Stack.Screen name="fillyourprofile" component={FillYourProfile} />
                <Stack.Screen name="fingerprint" component={Fingerprint} />
                <Stack.Screen name="forgotpasswordemail" component={ForgotPasswordEmail} />
                <Stack.Screen name="forgotpasswordmethods" component={ForgotPasswordMethods} />
                <Stack.Screen name="forgotpasswordphonenumber" component={ForgotPasswordPhoneNumber} />
                <Stack.Screen name="inbox" component={Inbox} />
                <Stack.Screen name="viewprofile" component={ViewProfile} />
                <Stack.Screen name="UploadItem" component={UploadItem} />
                <Stack.Screen name="EditItem" component={EditItem} />
                <Stack.Screen name="login" component={Login} />
                <Stack.Screen name="mostpopularproducts" component={MostPopularProducts} />
                <Stack.Screen name="mywishlist" component={MyWishlist} />
                <Stack.Screen name="notifications" component={Notifications} />
                <Stack.Screen name="onboarding1" component={Onboarding1} />
                <Stack.Screen name="onboarding2" component={Onboarding2} />
                <Stack.Screen name="onboarding3" component={Onboarding3} />
                <Stack.Screen name="onboarding4" component={Onboarding4} />
                <Stack.Screen name="otpverification" component={OtpVerification} />
                <Stack.Screen name="paymentmethods" component={PaymentMethods} />
                <Stack.Screen name="productereceipt" component={ProductEreceipt} />
                <Stack.Screen name="productreviews" component={ProductReviews} />
                <Stack.Screen name="search" component={Search} />
                <Stack.Screen name="selectshippingaddress" component={SelectShippingAddress} />
                <Stack.Screen name="settingshelpcenter" component={SettingsHelpCenter} />
                <Stack.Screen name="settingsinvitefriends" component={SettingsInviteFriends} />
                <Stack.Screen name="Followers" component={Followers} />
                <Stack.Screen name="Following" component={Following} />
                <Stack.Screen name="settingslanguage" component={SettingsLanguage} />
                <Stack.Screen name="settingsnotifications" component={SettingsNotifications} />
                <Stack.Screen name="settingspayment" component={SettingsPayment} />
                <Stack.Screen name="SettingsTermsAndConditions" component={SettingsTermsAndConditions} />
                <Stack.Screen name="SettingsAbout" component={SettingsAbout} />
                <Stack.Screen name="settingssecurity" component={SettingsSecurity} />
                <Stack.Screen name="signup" component={Signup} />
                <Stack.Screen name="topreceipt" component={TopupEreceipt} />
                <Stack.Screen name="topupewalletamount" component={TopupEwalletAmount} />
                <Stack.Screen name="topupewalletmethods" component={TopupEwalletMethods} />
                <Stack.Screen name="trackorder" component={TrackOrder} />
                <Stack.Screen name="transactionhistory" component={TransactionHistory} />
                <Stack.Screen name="videocall" component={VideoCall} />
                <Stack.Screen name="welcome" component={Welcome} />
                <Stack.Screen name="(tabs)" component={BottomTabNavigation} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation