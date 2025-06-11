import { View, Text, StyleSheet, Alert, ScrollView, ToastAndroid, Modal, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { commonStyles } from '../styles/CommonStyles';
import { COLORS, icons, SIZES } from '../constants';
import Input from './Input';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../utils/reducers/formReducers';
import Header from './Header';
import Card from './Card';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from './ButtonFilled';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/baseUrl';
import LoaderScreen from './LoaderScreen';

const initialState = {
  inputValues: {
    creditCardHolderName: '',
  },
  inputValidities: {
    creditCardHolderName: false,
  },
  formIsValid: false,
};

const AddNewCardModal = ({ show, setShow,getData }: any) => {
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
          billingDetails: { name: formState.inputValues.creditCardHolderName ? formState.inputValues.creditCardHolderName : data?.fullName },
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
        setIsLoading(false);
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
            setShow(false)
            getData()
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
            }]}>Add New Card</Text>
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
                  backgroundColor: dark ? COLORS.dark1 : COLORS.grayscale100,
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
            <ButtonFilled
        title="Add New Card"
        onPress={handleAddCard}
        style={styles.addBtn}
        disabled={isLoading}
      />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>

  </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    marginVertical: 6,
  },
  addBtn: {
    borderRadius: 32,
  },
});

export default AddNewCardModal;
