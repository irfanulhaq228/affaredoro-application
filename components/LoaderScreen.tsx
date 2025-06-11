// FullScreenLoader.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS } from '../constants';

const LoaderScreen = ({ message = 'Loading...' }) => {

      const { dark, colors } = useTheme();
    
  return (
    <View style={styles.overlay}>
      <View style={[styles.loaderBox,{
        backgroundColor: dark ? COLORS.white : COLORS.greyscale900
      }]}>
        <ActivityIndicator size="large" color={dark ? COLORS.greyscale900 : COLORS.white} />
        <Text style={[styles.message,{
            color: dark ? COLORS.greyscale900 : COLORS.white,
        }]}>{message}</Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderBox: {
    padding: 30,
    backgroundColor: '#111',
    borderRadius: 12,
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default LoaderScreen;
