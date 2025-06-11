import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';

const SettingsAbout = ({ navigation }: { navigation: any }) => {
    const { colors, dark } = useTheme();

    const textColor = dark ? COLORS.secondaryWhite : COLORS.greyscale900;
    const titleColor = dark ? COLORS.white : COLORS.black;

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="About Us" navigation={navigation} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={[styles.settingsTitle, { color: titleColor }]}>Welcome to Affare Doro – your trusted marketplace for second-hand treasures.</Text>
                        <Text style={[styles.body, { color: textColor }]}>
                            Born from a passion for sustainable shopping and community-driven commerce, Affare Doro connects people who love giving pre-loved items a new life.
                            Whether you're decluttering your wardrobe, hunting for unique finds, or simply shopping smart, our platform makes it easy, secure, and rewarding.
                        </Text>
                        <Text style={[styles.body, { color: textColor }]}>
                            At Affare Doro, we believe that great style doesn’t have to come at a high price—or cost the planet. That’s why we’ve created a space where users can buy and sell fashion,
                            accessories, and more, all in just a few taps.
                        </Text>
                        <Text style={[styles.body, { color: textColor }]}>
                            We’re here to make second-hand the first choice.
                        </Text>

                        <Text style={[styles.settingsTitle, { color: titleColor }]}>Why Affare Doro?</Text>
                        <Text style={[styles.body, { color: textColor }]}>• Simple and intuitive platform</Text>
                        <Text style={[styles.body, { color: textColor }]}>• Safe and secure transactions</Text>
                        <Text style={[styles.body, { color: textColor }]}>• Buyer and seller protection</Text>
                        <Text style={[styles.body, { color: textColor }]}>• A vibrant and conscious community</Text>

                        <Text style={[styles.body, { color: textColor, marginTop: 24 }]}>
                            Join us today and become part of a movement that values affordability, sustainability, and smart style.
                        </Text>
                        <Text style={[styles.settingsTitle, { color: titleColor }]}>
                            Affare Doro – Every item has a story. Let’s give it a new one.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    settingsTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist Bold',
        color: COLORS.black,
        marginVertical: 26,
    },
    body: {
        fontSize: 14,
        fontFamily: 'Urbanist Regular',
        color: COLORS.black,
        marginTop: 8,
        lineHeight: 22,
    },
});

export default SettingsAbout;
