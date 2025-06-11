import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
  ToastAndroid,
  TouchableWithoutFeedback,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { SIZES, COLORS, icons } from '../constants';
import ButtonFilled from './ButtonFilled';
import Header from './Header';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import { useFocusEffect } from '@react-navigation/native';
import AddNewCardModal from './AddNewCardModal';
import NotFoundItem from './NotFoundItem';

interface Card {
  cardId: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}

const SettingsPaymentModal = ({ navigation, route, show, setShow, getData }: any) => {
  const [cards, setCards] = useState<Card[]>([]);
  const { colors, dark } = useTheme();
  const userEmail = 'user@example.com'; // Replace with actual logged-in user
  const [isLoading, setIsLoading] = useState(false);
  const [move, setMove] = useState(false);





  const fetchCards = async () => {

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


      fetch(`${baseUrl}/users/cards`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {
            setCards(resp?.data);
          }
          else if (resp.status === "TokenExpiredError") {
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






  const handleSetDefault = async (cardId: string) => {

    try {


      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token


      if (!token) {
        ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
        return;
      }

      const requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: JSON.stringify({
          cardId,
        }), // Convert formdata to JSON string
        redirect: "follow"
      };


      fetch(`${baseUrl}/users/set-default-card`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {

            ToastAndroid.show('Card added default successfully!', ToastAndroid.SHORT);
            fetchCards();
            getData();
            setShow(false)
          }
          else if (resp.status === "TokenExpiredError") {
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




  const handleDeleteCard = async (cardId: string) => {

    try {


      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token


      if (!token) {
        ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
        return;
      }

      const requestOptions: any = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass the token here
        },
        body: JSON.stringify({
          cardId,
        }), // Convert formdata to JSON string
        redirect: "follow"
      };


      fetch(`${baseUrl}/users/delete-card`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {

            ToastAndroid.show('Card deleted successfully!', ToastAndroid.SHORT);
            fetchCards();
          }
          else if (resp.status === "TokenExpiredError") {
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


  useFocusEffect(useCallback(() => {
    fetchCards();
  }, []));

  const renderCard = ({ item }: { item: Card }) => (
    <View style={[styles.cardContainer, { backgroundColor: dark ? '#222' : '#fff', margin: 2 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
          {item.brand} •••• {item.last4}
        </Text>
        {item.isDefault && (
          <Text style={{ color: dark ? COLORS.white : COLORS.greyscale900, fontWeight: 'bold' }}>Default</Text>
        )}
      </View>
      <Text style={{ color: dark ? COLORS.grayTie : COLORS.gray }}>
        Expires: {item.expMonth}/{item.expYear}
      </Text>
      <View style={styles.actions}>
        {!item.isDefault && (
          <TouchableOpacity onPress={() => handleSetDefault(item.cardId)}>
            <Text style={[styles.link, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDeleteCard(item.cardId)}>
          <Icon name="trash" size={20} color={COLORS.red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (

    <>
    <Modal visible={show}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShow(!show)}
    >
      <TouchableWithoutFeedback onPress={() => setShow(!show)}>

        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <TouchableWithoutFeedback>
            <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, width: '90%', paddingHorizontal: 10, paddingBottom: 20, }}>

              <TouchableOpacity style={{ flexDirection: 'row', zIndex: 99999999999, gap: 3, alignItems: 'center', position: 'absolute', top: 10, right: 10 }} onPress={() => {
                setShow(!show)
              }}>
                <Image
                  source={icons.cancelSquare}
                  resizeMode='contain'
                  style={[{
                    width: 24,
                    height: 24,
                    tintColor: COLORS.black
                  }, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                />
              </TouchableOpacity>


              <Text style={[{
                fontSize: 18,
                fontFamily: "Urbanist Bold",
                color: COLORS.greyscale900,
                marginVertical: 8, 
              }, {
                color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
              }]}>Manage Card Data</Text>
              {cards.length>0?<FlatList
                data={cards}
                keyExtractor={(item) => item.cardId}
                renderItem={renderCard}
                contentContainerStyle={{ paddingBottom: 100 }}
              />: <NotFoundItem title='No Payment Card Found!' />}
              
                <ButtonFilled
                  title="Add New Card"
                  onPress={() => {
                    // setShow(false)
                    // navigation.navigate('addnewcard')
                    setMove(true)
                  }}
                />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>


    {move?<AddNewCardModal show={move} setShow={setMove} navigation={navigation} getData={fetchCards} />:null}

    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  addBtn: {
    position: 'absolute',
    bottom: 16,
    width: SIZES.width - 32,
    alignSelf: 'center',
  },
});

export default SettingsPaymentModal;
