// screens/SettingsBankAccounts.tsx

import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { SIZES, COLORS } from '../constants';
import ButtonFilled from '../components/ButtonFilled';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import { useFocusEffect } from '@react-navigation/native';
import NotFoundItem from '../components/NotFoundItem';
import LinkStripe from '../components/LinkStripe';

interface BankAccount {
  bankId: string;
  bankName: string;
  last4: string;
  isDefault?: boolean;
}

const SettingsBankAccounts = ({ navigation }: { navigation: any }) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const { colors, dark } = useTheme();

  const fetchBankAccounts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return ToastAndroid.show("Unauthorized", ToastAndroid.SHORT);

      const res = await fetch(`${baseUrl}/users/banks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.status === 'ok') setAccounts(result.data);
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const handleSetDefault = async (bankId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return ToastAndroid.show("Unauthorized", ToastAndroid.SHORT);

      const res = await fetch(`${baseUrl}/users/set-default-bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bankId }),
      });
      const result = await res.json();
      if (result.status === 'ok') {
        ToastAndroid.show("Default account set!", ToastAndroid.SHORT);
        fetchBankAccounts();
      }
      else if (result.status === "fail") {
                  ToastAndroid.show(result.message, ToastAndroid.SHORT);
                }
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return ToastAndroid.show("Unauthorized", ToastAndroid.SHORT);

      const res = await fetch(`${baseUrl}/users/delete-bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bankId }),
      });
      const result = await res.json();
      if (result.status === 'ok') {
        ToastAndroid.show("Bank deleted", ToastAndroid.SHORT);
        fetchBankAccounts();
      }
      else if (result.status === "fail") {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };


  
    const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);


    const userSubmit = async () => {
        setIsLoading(true)
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



  useFocusEffect(useCallback(() => {
    fetchBankAccounts();
     userSubmit()
  }, []));

  const renderItem = ({ item }: { item: BankAccount }) => (
    <View style={[styles.cardContainer, { backgroundColor: dark ? '#222' : '#fff' }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: dark ? COLORS.white : COLORS.black }}>
          {item.bankName} •••• {item.last4}
        </Text>
        {item.isDefault && <Text style={{ color: dark ? COLORS.white : COLORS.greyscale900, fontWeight: 'bold' }}>Default</Text>}
      </View>
      <View style={styles.actions}>
        {!item.isDefault && (
          <TouchableOpacity onPress={() => handleSetDefault(item.bankId)}>
            <Text style={[styles.link, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handleDeleteBank(item.bankId)}>
          <Icon name="trash" size={20} color={COLORS.red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
    {data?.connectAccount ? <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, margin: 16 }}>
        <Header title="Bank Accounts" navigation={navigation} />
        {accounts?.length>0?<FlatList
          data={accounts}
          keyExtractor={(item) => item.bankId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        /> : <NotFoundItem title='No Bank Accounts Found!' />}
        <View style={styles.addBtn}>
          <ButtonFilled
            title="Add New Bank Account"
            onPress={() => navigation.navigate('AddBankScreen')}
          />
        </View>
      </View>
    </SafeAreaView>:<LinkStripe navigation={navigation}/>}

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
    fontWeight: '500',
  },
  addBtn: {
    position: 'absolute',
    bottom: 16,
    width: SIZES.width - 32,
    alignSelf: 'center',
  },
});

export default SettingsBankAccounts;
