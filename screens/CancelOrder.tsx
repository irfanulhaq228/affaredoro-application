import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Modal, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-virtualized-view';
import { COLORS, SIZES } from "../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ReasonItem from '../components/ReasonItem';
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CancelOrder = ({navigation, route}:any) => {
    const { colors, dark } = useTheme();
    /***
     * Render content
    */

    const orderId= route.params?.orderId;


    
    const [isLoading, setIsLoading] = useState(false);
  

    const [comment, setComment] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);


    const renderContent = () => {
        

        const handleCheckboxPress = (itemTitle: any) => {
            if (selectedItem === itemTitle) {
                // If the clicked item is already selected, deselect it
                setSelectedItem(null);
            } else {
                // Otherwise, select the clicked item
                setSelectedItem(itemTitle);
            }
        };

        return (
            <View style={{ marginVertical: 12 }}>
                <Text style={[styles.inputLabel, {
                    color: dark ? COLORS.grayscale100 : COLORS.greyscale900
                }]}>Please select the reason for the cancellations</Text>
                <View style={{ marginVertical: 16 }}>
                    <ReasonItem
                        checked={selectedItem === 'Schedule change'}
                        onPress={() => handleCheckboxPress('Schedule change')}
                        title="Schedule change"
                    />
                    <ReasonItem
                        checked={selectedItem === 'Weather conditions'}
                        onPress={() => handleCheckboxPress('Weather conditions')}
                        title="Weather conditions"
                    />
                    <ReasonItem
                        checked={selectedItem === 'Unexpected Work'}
                        onPress={() => handleCheckboxPress('Unexpected Work')}
                        title="Unexpected Work"
                    />
                    <ReasonItem
                        checked={selectedItem === 'Childcare Issue'}
                        onPress={() => handleCheckboxPress('Childcare Issue')}
                        title="Childcare Issue"
                    />
                    <ReasonItem
                        checked={selectedItem === 'Travel Delays'}
                        onPress={() => handleCheckboxPress('Travel Delays')}
                        title="Travel Delays"
                    />
                    <ReasonItem
                        checked={selectedItem === 'Others'}
                        onPress={() => handleCheckboxPress('Others')}
                        title="Others"
                    />
                </View>
                {/* <Text style={[styles.inputLabel, {
                    color: dark ? COLORS.grayscale100 : COLORS.greyscale900
                }]}>Add detailed reason</Text>
                <TextInput
                    style={[styles.input, {
                        color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
                        borderColor: dark ? COLORS.grayscale100 : COLORS.greyscale900
                    }]}
                    onChangeText={(text) => setComment(text)}
                    defaultValue={comment}
                    placeholder="Write your reason here..."
                    placeholderTextColor={dark ? COLORS.secondaryWhite : COLORS.greyscale900}
                    multiline={true}
                    numberOfLines={4} // Set the number of lines you want to display initially
                /> */}
            </View>
        )
    }

    const [modalVisible, setModalVisible] = useState(false);





    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalSubContainer, {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.white
                        }]}>
                            <Text style={styles.sadEmoji}>😥</Text>
                            <Text style={[styles.modalTitle, {
                                color: dark ? COLORS.white : COLORS.greyscale900,
                            }]}>We're sad about your cancelllation</Text>
                            <Text style={[styles.modalSubtitle, {
                                color: dark ? COLORS.grayscale200 : COLORS.black,
                            }]}>
                                You have successfully canceled your order. 80% funds will returned to your account.
                            </Text>
                            <ButtonFilled
                                title="Okay"
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.goBack()
                                }}
                                style={styles.successBtn}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }



    const submit = async () => {
        const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
    
          if (!token) {
            ToastAndroid.show("Unauthorized: No token found", ToastAndroid.SHORT);
            return;
          }
        setIsLoading(true);
      
        
      
        try {
          const formdata = {
            canncelReason:selectedItem,
            // detailReason:comment,
            orderStatus:'cancelled',
          };
      
          const requestOptions: any = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass the token here
            },
            body: JSON.stringify(formdata), // Convert formdata to JSON string
          };
      
          fetch(`${baseUrl}/order/update/${orderId}`, requestOptions)
            .then((response) => response.text())
            .then(async(result) => {
              const resp = JSON.parse(result);
      
              if (resp.status === "ok") {
                setModalVisible(true)
                // ToastAndroid.show(resp.message, 2000) 
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
        * Render submit buttons
        */
    const renderSubmitButton = () => {
        return (
            <View style={[styles.btnContainer, {
                backgroundColor: colors.background
            }]}>
                <ButtonFilled
                    title="Submit"
                    style={styles.submitBtn}
                    onPress={() => submit()}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Cancel Order" navigation={navigation} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {renderContent()}
                    {renderSubmitButton()}
                    {renderModal()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sadEmoji: {
        fontSize: 160
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 12
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: "Urbanist Regular",
        color: COLORS.black,
        textAlign: "center",
        marginVertical: 12
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    modalSubContainer: {
        height: 460,
        width: SIZES.width * 0.85,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22
    },
    successBtn: {
        width: "100%",
        marginTop: 12,
        borderRadius: 32
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 12
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
        alignItems: "center"
    },
    headerIcon: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        backgroundColor: COLORS.gray
    },
    arrowLeft: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    moreIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    input: {
        borderColor: "gray",
        borderWidth: .3,
        borderRadius: 5,
        width: "100%",
        padding: 10,
        paddingBottom: 10,
        fontSize: 12,
        height: 150,
        textAlignVertical: "top"
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: "Urbanist Medium",
        color: COLORS.black,
        marginBottom: 6,
        marginTop: 16
    },
    btnContainer: {
        height: 72,
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        alignItems: "center",
        marginTop: 30
    },
    btn: {
        height: 48,
        width: SIZES.width - 32,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8
    },
    submitBtn: {
        width: SIZES.width - 32,
    },
    btnText: {
        fontSize: 16,
        fontFamily: "Urbanist Medium",
        color: COLORS.white
    },
})

export default CancelOrder