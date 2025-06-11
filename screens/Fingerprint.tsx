
import { View, Text, StyleSheet, ScrollView, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, SIZES, illustrations } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import ButtonFilled from '../components/ButtonFilled';
import { useNavigation } from '@react-navigation/native';

type Nav = {
    navigate: (value: string) => void
}

const Fingerprint = () => {
  const { dark, colors } = useTheme();
  const { navigate } = useNavigation<Nav>();
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkFingerprintStatus();
  }, []);

  const checkFingerprintStatus = async () => {
    try {
      const isAvailable = await FingerprintScanner.isSensorAvailable();
console.log(isAvailable);

      if (isAvailable) {
        setIsFingerprintEnabled(true);
        setModalVisible(true)
      } else {
        setIsFingerprintEnabled(false);
      }
    } catch (error) {
      console.error('Error checking fingerprint status:', error);
    }
  };

    // Render modal
    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}>
                    <View style={[styles.modalContainer]}>
                        <View style={[styles.modalSubContainer, {
                            backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite
                        }]}>
                            <Image
                                source={dark ? illustrations.userSuccessDark : illustrations.userSuccess}
                                resizeMode='contain'
                                style={styles.modalIllustration}
                            />
                            <Text style={[styles.modalTitle, {
                                color: dark ? COLORS.white : COLORS.greyscale900
                            }]}>Congratulations!</Text>
                            <Text style={[styles.modalSubtitle, {
                                color: dark ? COLORS.grayTie : COLORS.greyscale900
                            }]}>Your account is ready to use. You will be redirected to the Home page in a few seconds..</Text>
                            <ButtonFilled
                                title="Continue"
                                onPress={() => {
                                    setModalVisible(false)
                                    navigate("login")
                                }}
                                style={{
                                    width: "100%",
                                    marginTop: 12
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Set Your Fingerprint"  />
                <ScrollView
                    contentContainerStyle={{ alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Add a fingerprint to make your account
                        more secure. </Text>
                    <Image
                        source={dark ? illustrations.fingerprintDark : illustrations.fingerprint}
                        resizeMode='contain'
                        style={styles.fingerprint}
                    />
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.greyscale900
                    }]}>Please put your finger on the fingerprint
                        scanner to get started.</Text>
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Skip"
                    style={{
                        width: (SIZES.width - 32) / 2 - 8,
                        borderRadius: 32,
                        backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                        borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
                    }}
                    textColor={dark ? COLORS.white : COLORS.black}
                    onPress={() => navigate("login")}
                />
                <ButtonFilled
                    title="Continue"
                    style={styles.continueButton}
                    onPress={() => setModalVisible(true)}
                />
            </View>
            {renderModal()}
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
        backgroundColor: COLORS.white,
        padding: 16
    },
    title: {
        fontSize: 18,
        fontFamily: "Urbanist Medium",
        color: COLORS.greyscale900,
        textAlign: "center",
        marginVertical: 54
    },
    fingerprint: {
        width: 300,
        height: 300,
        marginVertical: 24
    },
    bottomContainer: {
        position: "absolute",
        bottom: 32,
        right: 16,
        left: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        width: SIZES.width - 32,
        alignItems: "center"
    },
    skipButton: {
        width: (SIZES.width - 32) / 2 - 8,
        borderRadius: 32,
        backgroundColor: "#F5E7FF",
        borderColor: "#F5E7FF"
    },
    continueButton: {
        width: (SIZES.width - 32) / 2 - 8,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary
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
        color: COLORS.black2,
        textAlign: "center",
        marginVertical: 12
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.6)"
    },
    modalSubContainer: {
        height: 494,
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
        marginVertical: 22,
    }
});

export default Fingerprint