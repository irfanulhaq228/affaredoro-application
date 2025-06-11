import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { COLORS, SIZES } from '../constants';
import Input from '../components/Input';
import { commonStyles } from '../styles/CommonStyles';
import Header from '../components/Header';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

const initialState = {
  accountHolderName: '',
  routingNumber: '',
  accountNumber: '',
};

const AddBankScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { dark, colors } = useTheme();
  const [form, setForm] = useState(initialState);
  

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);





  const fetchData = async () => {

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

    useEffect(() => {
      fetchData();
    }, []);
  

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };


  

  const handleSubmit = async () => {

    setIsLoading(true);

    if (!form.accountNumber || !form.routingNumber) {
      setIsLoading(false);
      ToastAndroid.show('Please fill all fields and bank details correctly.', ToastAndroid.SHORT);
      return;
    }

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
          accountNumber: form.accountNumber,
          routingNumber: form.routingNumber,
        }), // Convert formdata to JSON string
        redirect: "follow"
      };


      fetch(`${baseUrl}/users/add-bank`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);
console.log(resp);


          if (resp.status === "ok") {
            setIsLoading(false);
            ToastAndroid.show('Bank added successfully!', ToastAndroid.SHORT);
            navigation.goBack();
          }
          else if (resp.status === "TokenExpiredError") {
            setIsLoading(false);
            await AsyncStorage.clear();
            navigation.navigate('login')
            ToastAndroid.show(resp.message, ToastAndroid.SHORT);
          }
          else if (resp.status === "fail") {
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

  return (
    <>
    {isLoading && <LoaderScreen/>}
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, margin: 16 }}>
        <Header title="Add Bank Account" navigation={navigation} />
        <View style={{ marginTop: 16 }}>
          <Text style={[commonStyles.inputHeader, { color: dark ? COLORS.white : COLORS.black }]}>
            Account Holder Name
          </Text>
          <Input
            placeholder="John Doe"
            onInputChanged={(id, val) => handleChange('accountHolderName', val)}
            defaultValue={data?.name}
            id="accountHolderName"
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <Text style={[commonStyles.inputHeader, { color: dark ? COLORS.white : COLORS.black }]}>
            Routing Number
          </Text>
          <Input
            placeholder="110000000"
            onInputChanged={(id, val) => handleChange('routingNumber', val)}
            id="routingNumber"
          />
        </View>
        <View style={{ marginTop: 16 }}>
          <Text style={[commonStyles.inputHeader, { color: dark ? COLORS.white : COLORS.black }]}>
            Account Number
          </Text>
          <Input
            placeholder="000123456789"
            onInputChanged={(id, val) => handleChange('accountNumber', val)}
            id="accountNumber"
          />
        </View>
        <View style={{ position: 'absolute', bottom: 0, width: SIZES.width - 32 }}>
          <ButtonFilled
            title={isLoading ? 'Adding...' : 'Add Bank'}
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.addBtn}
          />
        </View>
      </View>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  addBtn: {
    borderRadius: 32,
    marginBottom: 12,
  },
});

export default AddBankScreen;
