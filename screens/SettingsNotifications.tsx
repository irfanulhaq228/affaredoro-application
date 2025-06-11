import { View, StyleSheet, StatusBar, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';
import GlobalSettingsItem from '../components/GlobalSettingsItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import { useFocusEffect } from '@react-navigation/native';

// Notifications for settings
const SettingsNotifications = ({ navigation }: { navigation: any }) => {
  const [emailNotification, setEmailNotification] = useState(false);
  const [newFollowerNotification, setNewFollowerNotification] = useState(false);
  const [newItemNotification, setNewItemNotification] = useState(false);
  const [newMessageNotification, setNewMessageNotification] = useState(false);
  const [newFeedbackNotification, setNewFeedbackNotification] = useState(false);
  const [favItemNotification, setFavItemNotification] = useState(false);
  const [discountItemNotification, setDiscountItemNotification] = useState(false);
  const [data, setData] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme()








  const submit = async () => {

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


      fetch(`${baseUrl}/users/get`, requestOptions)
        .then((response) => response.text())
        .then(async(result) => {
          const resp = JSON.parse(result);

          if (resp.status === "ok") {
            setData(resp?.data);
            setEmailNotification(resp?.data?.emailNotification);
            setNewFollowerNotification(resp?.data?.newFollowerNotification);
            setNewItemNotification(resp?.data?.newItemNotification);
            setNewMessageNotification(resp?.data?.newMessageNotification);
            setNewFeedbackNotification(resp?.data?.newFeedbackNotification);
            setFavItemNotification(resp?.data?.favItemNotification);
            setDiscountItemNotification(resp?.data?.discountItemNotification);


          } else if (resp.status === "fail") {
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else if (resp.status === "TokenExpiredError") {
            await AsyncStorage.clear();
            navigation.navigate('login')
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
      submit();
    }, []))




  const submitData = async ({ emailNotification, newFollowerNotification,
    newItemNotification,
    newMessageNotification,
    newFeedbackNotification,
    favItemNotification,
    discountItemNotification }: {
      emailNotification?: any,
      newFollowerNotification?: any,
      newItemNotification?: any,
      newMessageNotification?: any,
      newFeedbackNotification?: any,
      favItemNotification?: any,
      discountItemNotification?: any
    }) => {

    try {


      setIsLoading(true)


      var mydata: any = await AsyncStorage.getItem('data');

      mydata = JSON.parse(mydata);

      console.log(emailNotification, newFollowerNotification,
        newItemNotification,
        newMessageNotification,
        newFeedbackNotification,
        favItemNotification,
        discountItemNotification);

      const formdata = new FormData();

      if (emailNotification !== undefined) {
        formdata.append("emailNotification", emailNotification);
      }

      if (newFollowerNotification !== undefined) {
        formdata.append("newFollowerNotification", newFollowerNotification);
      }

      if (newItemNotification !== undefined) {
        formdata.append("newItemNotification", newItemNotification);
      }

      if (newMessageNotification !== undefined) {
        formdata.append("newMessageNotification", newMessageNotification);
      }

      if (newFeedbackNotification !== undefined) {
        formdata.append("newFeedbackNotification", newFeedbackNotification);
      }

      if (favItemNotification !== undefined) {
        formdata.append("favItemNotification", favItemNotification);
      }

      if (discountItemNotification !== undefined) {
        formdata.append("discountItemNotification", discountItemNotification);
      }




      const requestOptions: any = {
        method: "PUT",
        body: formdata,
        redirect: "follow"
      };




      fetch(`${baseUrl}/users/update/${mydata?._id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result)
          const resp = JSON.parse(result)

          if (resp.status === 'ok') {
            ToastAndroid.show('Notification updated successfully!', ToastAndroid.SHORT);
            submit()
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
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar hidden />
        <Header title="Notifications" navigation={navigation} />
        <ScrollView
          style={styles.settingsContainer}
          showsVerticalScrollIndicator={false}>
          {/* <GlobalSettingsItem
            title="Enable Email Notifications"
            isNotificationEnabled={emailNotification}
            toggleNotificationEnabled={() => { submitData({ emailNotification: !emailNotification }) }}
          /> */}
          <GlobalSettingsItem
            title="New Messages"
            isNotificationEnabled={newMessageNotification}
            toggleNotificationEnabled={() => { submitData({ newMessageNotification: !newMessageNotification }) }}
          />
          <GlobalSettingsItem
            title="New Feedback"
            isNotificationEnabled={newFeedbackNotification}
            toggleNotificationEnabled={() => { submitData({ newFeedbackNotification: !newFeedbackNotification }) }}
          />
          <GlobalSettingsItem
            title="Discounted Items"
            isNotificationEnabled={discountItemNotification}
            toggleNotificationEnabled={() => { submitData({ discountItemNotification: !discountItemNotification }) }}
          />
          <GlobalSettingsItem
            title="Favorited Items"
            isNotificationEnabled={favItemNotification}
            toggleNotificationEnabled={() => { submitData({ favItemNotification: !favItemNotification }) }}
          />
          <GlobalSettingsItem
            title="New Followers"
            isNotificationEnabled={newFollowerNotification}
            toggleNotificationEnabled={() => { submitData({ newFollowerNotification: !newFollowerNotification }) }}
          />
          <GlobalSettingsItem
            title="New Items"
            isNotificationEnabled={newItemNotification}
            toggleNotificationEnabled={() => { submitData({ newItemNotification: !newItemNotification }) }}
          />

        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

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
  settingsContainer: {
    marginVertical: 16
  }
})

export default SettingsNotifications