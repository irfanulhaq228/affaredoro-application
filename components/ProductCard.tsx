import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import React, { useCallback, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { baseUrl } from '../constants/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface ProductCardProps {
    id?: any;
    hidden?: any;
    like?: any;
    name: string;
    image: any; // Use 'require' for local images or 'ImageSourcePropType' for more robust typing
    inclPrice?: number;
    price: string;
    size?: string;
    onPress: () => void;
    button?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    like,
    name,
    image,
    inclPrice,
    price,
    size,
    onPress,
    button,
    hidden,
}) => {
    const [isFavourite, setIsFavourite] = useState<boolean>(false);
    const { dark } = useTheme();


    const [isLoading, setIsLoading] = useState<boolean>(false);


    useFocusEffect(
        useCallback(() => {

            const getLike = async () => {
                var mydata: any = await AsyncStorage.getItem('data');
                mydata = JSON.parse(mydata);

                if (like && like.includes(mydata?._id)) {
                    setIsFavourite(true);
                }
            }

            getLike();

        }, []))

    const submit = async (id: any) => {



        try {

            var mydata: any = await AsyncStorage.getItem('data');

            mydata = JSON.parse(mydata);


            if (mydata) {

                const formdata = {
                    productId: id,
                    userId: mydata._id,
                };


                const requestOptions: any = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formdata), // Convert formdata to JSON string
                    redirect: "follow"
                };

                fetch(`${baseUrl}/product/toggleLike`, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        const resp = JSON.parse(result)

                        if (resp.status === 'ok') {
                            setIsFavourite(!isFavourite)
                            ToastAndroid.show(resp.message, 2000)
                        } else if (resp.status === 'fail') {
                            ToastAndroid.show(resp.message, 2000)
                        }

                    })
                    .catch((error) => {
                        ToastAndroid.show(error.message, 2000)
                        console.error(error)
                    });


            }
        } catch (error: any) {
            ToastAndroid.show(error.message, 2000)
            console.error(error)
        };
    }







    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.silver
            }]}>
            <View style={[styles.imageContainer, {
                backgroundColor: dark ? COLORS.dark3 : COLORS.silver
            }]}>
                <Image
                    source={image}
                    resizeMode='cover'
                    style={styles.image}
                />
            </View>
            <View style={styles.favouriteContainer}>
                <TouchableOpacity onPress={() => { submit(id) }}>
                    <Image
                        source={isFavourite ? icons.heart5 : icons.heart3Outline}
                        resizeMode='contain'
                        style={styles.heartIcon}
                    />
                </TouchableOpacity>
            </View>
            {hidden}
            <Text style={[styles.name, {
                color: dark ? COLORS.secondaryWhite : COLORS.greyscale900,
            }]}>{name}</Text>
            <View style={styles.viewContainer}>
                <Text style={[styles.location, {
                    color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                }]}>Category: {" "}{inclPrice?inclPrice:'Other'}  {size?'|':null}   </Text>

                {size?<View style={[styles.soldContainer, {
                    backgroundColor: dark ? COLORS.dark3 : COLORS.silver
                }]}>
                    <Text style={[styles.soldText, {
                        color: dark ? COLORS.greyscale300 : COLORS.grayscale700,
                    }]}>Size: {size}</Text>
                </View>:null}
            </View>
            <View style={styles.bottomPriceContainer}>
                <View style={styles.priceContainer}>
                    <Text style={[styles.price, {
                        color: dark ? COLORS.white : COLORS.primary
                    }]}><Image
                            source={images.price}
                            resizeMode='contain'
                            style={{
                                width: 14, height: 14,
                                tintColor: dark ? COLORS.white : COLORS.primary
                            }}
                        />{price}</Text>
                </View>
            </View>

            {button}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width: (SIZES.width - 42) / 2,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 5,
        marginRight: 5
    },
    imageContainer: {
        width: "100%",
        height: 140,
        borderRadius: 16,
        backgroundColor: COLORS.silver
    },
    image: {
        width: "100%",
        height: 140,
        borderRadius: 16
    },
    name: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900,
        marginVertical: 4
    },
    location: {
        fontSize: 12,
        fontFamily: "Urbanist Regular",
        color: COLORS.grayscale700,
        marginVertical: 4
    },
    bottomPriceContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    price: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.primary,
        marginRight: 8
    },
    heartIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.white,
    },
    favouriteContainer: {
        position: "absolute",
        top: 16,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 9999,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    viewContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap:'wrap',
        marginTop: 4,
        marginBottom: 6
    },
    soldContainer: {
        minWidth: 46,
        height: 24,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        backgroundColor: COLORS.silver
    },
    soldText: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: COLORS.grayscale700,
        marginVertical: 4
    }
});

export default ProductCard;
