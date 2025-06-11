import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from "react-native-virtualized-view";
import { COLORS, SIZES, icons, illustrations } from '../constants';
import { OtpInput } from "react-native-otp-entry";
import Button from "../components/Button";
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// Enter your pin before each transaction
const OnboardingSuccess = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, dark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  // Render modal
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
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
              <View style={styles.backgroundIllustration}>
                <Image
                  source={illustrations.background}
                  resizeMode='contain'
                  style={[styles.modalIllustration, {
                    tintColor: dark ? COLORS.white : COLORS.primary,
                  }]}
                />
                <Image
                  source={icons.cart2}
                  resizeMode='contain'
                  style={[styles.editPencilIcon, {
                    tintColor: dark ? COLORS.dark3 : COLORS.white,
                  }]}
                />
              </View>
              <Text style={[styles.modalTitle, {
                color: dark ? COLORS.white : COLORS.greyscale900,
              }]}>Order Successful!</Text>
              <Text style={[styles.modalSubtitle, {
                color: dark ? COLORS.white : COLORS.black,
              }]}>
                You have successfully made order.
              </Text>
              <ButtonFilled
                title="View Order"
                onPress={() => {
                  setModalVisible(false)
                  navigation.navigate("orders")
                }}
                style={styles.successBtn}
              />
              <Button
                title="View E-Receipt"
                onPress={() => {
                  setModalVisible(false)
                  navigation.navigate("productereceipt")
                }}
                textColor={dark ? COLORS.white : COLORS.primary}
                style={{
                  width: "100%",
                  marginTop: 12,
                  borderRadius: 32,
                  backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                  borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={styles.modalContainer}>
            <View style={[styles.modalSubContainer, {
                      backgroundColor: dark ? COLORS.dark2 : COLORS.white
                    }]}>
                      <Text style={{
                        fontSize: 160
                      }}>😍</Text>
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
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white
  },
  title: {
    fontSize: 18,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 64
  },
  OTPStyle: {
    borderRadius: 8,
    height: 58,
    width: 58,
    backgroundColor: COLORS.secondaryWhite,
    borderBottomColor: "gray",
    borderBottomWidth: .4,
    borderWidth: .4,
    borderColor: "gray"
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    justifyContent: "center"
  },
  code: {
    fontSize: 18,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyscale900,
    textAlign: "center"
  },
  time: {
    fontFamily: "Urbanist Medium",
    fontSize: 18,
    color: COLORS.primary
  },
  button: {
    borderRadius: 32,
    marginVertical: 72
  },
  center: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 144
  },
  modalTitle: {
    fontSize: 24,
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
    height: 520,
    width: SIZES.width * 0.9,
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
  receiptBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  editPencilIcon: {
    width: 52,
    height: 52,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 54,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999
  },
})

export default OnboardingSuccess