import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Image, FlatList, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { COLORS, icons } from '../constants'
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect } from '@react-navigation/native';

const ShowCategoryModal = ({ show, setShow, onPress, title, data, name, value = "value", sel, setSel, allow, selParentCategoryData, setSelParentCategoryData, moreSel = false, showSearch = false }: any) => {
    const { dark } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        // Filter data based on search text
        if (searchText) {
            const filtered = data.filter((item: any) => 
                item[name].toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [searchText, data, name]);

    useFocusEffect(
        useCallback(() => {
            // Reset search when modal is shown
            if (show) {
                setSearchText('');
                setFilteredData(data);
            }
        }, [show, data])
    );

    return (
        <>
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
                            <View style={{ backgroundColor: dark ? COLORS.dark2 : COLORS.white, borderRadius: 10, padding: 10, width: '90%', paddingHorizontal: 0, maxHeight: 510, paddingBottom: 0, }}>
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
                                    marginVertical: 8
                                }, {
                                    color: dark ? COLORS.white : COLORS.greyscale900, textAlign: 'center'
                                }]}>{title}</Text>

                                {showSearch ? (
                                    <View style={[{
                                        flexDirection: "row",
                                        borderColor: COLORS.greyscale500,
                                        borderWidth: .4,
                                        borderRadius: 10,
                                        height: 52,
                                        width: '93%',
                                        alignItems: 'center',
                                        marginTop: 10,
                                        backgroundColor: COLORS.greyscale500,
                                        marginHorizontal: 10
                                    }, {
                                        backgroundColor: dark ? COLORS.transparentTertiary : COLORS.greyscale500,
                                        borderColor: dark ? COLORS.dark2 : COLORS.greyscale500,  marginBottom:5
                                    }]}>
                                        <TextInput
                                            style={[{
                                                flex: 1,
                                                height: 40,
                                                fontSize: 14,
                                            }, { width: '100%', paddingLeft: 10, borderRadius: 10, color: dark ? COLORS.white : COLORS.black }]}
                                            placeholder="Search here..."
                                            placeholderTextColor={dark ? COLORS.grayTie : COLORS.black}
                                            selectionColor="#111"
                                            keyboardType='default'
                                            value={searchText}
                                            onChangeText={(text) => setSearchText(text)}
                                        />
                                    </View>
                                ) : null}

                                <View style={{ paddingBottom: showSearch ? 110 : 30 }}>
                                    <FlatList
                                        data={filteredData}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 0, paddingHorizontal: 0, paddingBottom: 10, marginBottom: index === filteredData.length - 1 ? 50 : 10, }}
                                                    onPress={() => {
                                                        if (item?.subCategoryCount > 0) {
                                                            onPress(item);
                                                            if (moreSel) {
                                                                setSelParentCategoryData(item);
                                                            }
                                                        } else {
                                                            if (moreSel) {
                                                                setSelParentCategoryData(null);
                                                            }
                                                            if (!allow) {
                                                                setSel(item);
                                                            } else {
                                                                setSel((prevSel: any) => {
                                                                    const exists = prevSel?.some((selected: any) => selected[`${value}`] === item[`${value}`]);
                                                                    if (exists) {
                                                                        return prevSel.filter((selected: any) => selected[`${value}`] !== item[`${value}`]);
                                                                    } else {
                                                                        if (prevSel?.length >= allow) {
                                                                            return [...prevSel.slice(1), item];
                                                                        } else {
                                                                            return [...prevSel, item];
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            setShow(false);
                                                            onPress(item?.value)
                                                        }
                                                    }}
                                                >
                                                    <View style={{ width: '87%' }}>
                                                        <Text style={[{
                                                            fontSize: 15,
                                                            fontFamily: "Urbanist Medium",
                                                            color: COLORS.greyScale800
                                                        }, {
                                                            color: dark ? COLORS.white : COLORS.greyscale900,
                                                        }]}>{item[`${name}`]}</Text>

                                                        {item?.subTitle ? (
                                                            <Text style={[{
                                                                fontSize: 12,
                                                                fontFamily: "Urbanist Medium",
                                                                color: COLORS.greyScale800
                                                            }, {
                                                                color: dark ? COLORS.white : COLORS.greyscale900,
                                                            }]}>{item?.subTitle}</Text>
                                                        ) : null}
                                                    </View>

                                                    {item?.subCategoryCount > 0 ? (
                                                        <Image
                                                            source={icons.arrowRight}
                                                            resizeMode='contain'
                                                            style={[{
                                                                width: 20,
                                                                height: 20,
                                                            }, { tintColor: dark ? COLORS?.white : COLORS?.black }]}
                                                        />
                                                    ) : null}

                                                    {!allow && sel ? sel[`${value}`] === item[`${value}`] ? (
                                                        <Image
                                                            source={icons.check}
                                                            resizeMode='contain'
                                                            style={[{
                                                                width: 20,
                                                                height: 20,
                                                                tintColor: COLORS.black
                                                            }, { tintColor: dark ? COLORS?.success : COLORS?.success }]}
                                                        />
                                                    ) : null : sel?.some((selected: any) => selected[`${value}`] === item[`${value}`]) ? (
                                                        <Image
                                                            source={icons.check}
                                                            resizeMode='contain'
                                                            style={[{
                                                                width: 20,
                                                                height: 20,
                                                                tintColor: COLORS.black
                                                            }, { tintColor: dark ? COLORS?.success : COLORS?.success }]}
                                                        />
                                                    ) : null}
                                                </TouchableOpacity>
                                            )
                                        }}
                                        horizontal={false}
                                        keyExtractor={(item) => item.code}
                                        style={{
                                            padding: 20,
                                            marginBottom: 20
                                        }}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

export default ShowCategoryModal