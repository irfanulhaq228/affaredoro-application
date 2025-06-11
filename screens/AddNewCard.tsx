import { View, Text, StyleSheet, Alert, ScrollView, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { commonStyles } from '../styles/CommonStyles';
import { COLORS, SIZES } from '../constants';
import Input from '../components/Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';
import Header from '../components/Header';
import Card from '../components/Card';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from '../components/LoaderScreen';

const initialState = {
  inputValues: {
    creditCardHolderName: '',
  },
  inputValidities: {
    creditCardHolderName: false,
  },
  formIsValid: false,
};

const AddNewCard = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [error, setError] = useState(null);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const { colors, dark } = useTheme();
  const [cardDetails, setCardDetails] = useState<any>(null);
  const { createPaymentMethod } = useStripe();



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

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    fetchData();
  }, []);




  const handleAddCard = async () => {

    setIsLoading(true);

    if (!cardDetails?.complete) {
      setIsLoading(false);
      ToastAndroid.show('Please fill all fields and card details correctly.', ToastAndroid.SHORT);
      return;
    }

    try {

      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: { name: formState.inputValues.creditCardHolderName?formState.inputValues.creditCardHolderName : data?.fullName },
        },
      });

      if (error) {
        setIsLoading(false);
        console.log('Payment Method Error:', error);
        ToastAndroid.show(error.message || 'Failed to add card', ToastAndroid.SHORT);
        return;
      }

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
          paymentMethodId: paymentMethod.id,
        }), // Convert formdata to JSON string
        redirect: "follow"
      };


      fetch(`${baseUrl}/users/add-card`, requestOptions)
        .then((response) => response.text())
        .then(async (result) => {
          const resp = JSON.parse(result);


          if (resp.status === "ok") {
            setIsLoading(false);
            ToastAndroid.show('Card added successfully!', ToastAndroid.SHORT);
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

  const renderPaymentForm = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 22, }}>
        <Card
          containerStyle={styles.card}
          number="•••• •••• •••• ••••"
          balance="10000"
          date="11/2029"
          onPress={() => console.log('...')}
        />
        <View style={{ marginTop: 12 }}>
          <Text
            style={[
              commonStyles.inputHeader,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Card Holder Name
          </Text>
          <Input
            id="creditCardHolderName"
            onInputChanged={inputChangedHandler}
            errorText={formState.inputValidities['creditCardHolderName']}
            placeholder="Vishal Khadok"
            defaultValue={data?.fullName}
            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
          />
        </View>

        <View style={{ marginVertical: 20, marginBottom: 40 }}>
          <Text
            style={[
              commonStyles.inputHeader,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
            Card Details
          </Text>
          <CardField
            postalCodeEnabled={true}
            placeholders={{ number: '4242 4242 4242 4242' }}
            cardStyle={{
              backgroundColor: dark ? COLORS.dark1 : COLORS.gray3,
              textColor: dark ? COLORS.white : COLORS.black,
              borderColor: COLORS.gray,
              borderWidth: 1,
              borderRadius: 8,
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 10,
            }}
            onCardChange={(details) => {
              setCardDetails(details);
            }}
          />
        </View>
      </ScrollView>
    );
  };

  return (

    <>

    {isLoading && <LoaderScreen />}
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, margin: 16 }}>
        <Header title="Add New Card" navigation={navigation} />
        {renderPaymentForm()}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: SIZES.width - 32,
          }}
        >
          <ButtonFilled
            title="Add New Card"
            onPress={handleAddCard}
            style={styles.addBtn}
          />
        </View>
      </View>
    </SafeAreaView>

    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SIZES.width - 32,
    borderRadius: 16,
    marginVertical: 6,
  },
  addBtn: {
    borderRadius: 32,
  },
});

export default AddNewCard;
