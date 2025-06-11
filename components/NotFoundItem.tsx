import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { COLORS, illustrations } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const NotFoundItem = ({title, height, img}:{title:string, height?:any, img?:any}) => {
    const { dark } = useTheme();

    return (
        <View style={{ height: height?height:200, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* give image tag */}
            <Image source={{ uri: img?img:'https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-illustration-download-in-svg-png-gif-file-formats--available-product-tokostore-pack-e-commerce-shopping-illustrations-2809510.png?f=webp' }} style={{ width: 190, height: 190 }} resizeMode='contain' />

            <Text style={[styles.subtitle, {
                color: dark ? COLORS.grayscale400 : COLORS.grayscale400, fontSize: 16, marginBottom: 20, textAlign: 'center'
            }]}>{title}</Text>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 32,
        alignItems: "center",
        justifyContent: "center"
    },
    illustration: {
        width: 340,
        height: 250,
        marginVertical: 32
    },
    title: {
        fontSize: 24,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        marginVertical: 16
    },
    subtitle: {
        fontSize: 16,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        textAlign: "center"
    }
})

export default NotFoundItem