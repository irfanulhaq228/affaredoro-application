import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

interface ButtonFilledProps {
    onPress: () => void;
    title: string;
    color?: string;
    style?: StyleProp<ViewStyle>;
    isLoading?: boolean;
    disabled?: boolean;
}

const ButtonFilled: React.FC<ButtonFilledProps> = ({
    onPress,
    title,
    color,
    style,
    isLoading = false,
    disabled = false,
}) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.filledButton,
                {
                    backgroundColor: dark ? COLORS.white : COLORS.primary,
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
                <Text
                    style={{
                        fontSize: 18,
                        fontFamily: "Urbanist SemiBold",
                        color: color?color:dark ? COLORS.black : COLORS.white,
                    }}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    filledButton: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        backgroundColor: COLORS.primary,
    },
});

export default ButtonFilled;
