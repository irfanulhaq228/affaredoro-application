import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

let toastCallback;

const NotificationToast = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({ title: '', message: '' });
  const translateY = new Animated.Value(-100);

  toastCallback = ({ title, message }) => {
    setContent({ title, message });
    setVisible(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 3000); // Hide after 3s
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY }] }]}>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.message}>{content.message}</Text>
    </Animated.View>
  );
};

export const showCustomNotification = (data) => {
  if (toastCallback) toastCallback(data);
};

export default NotificationToast;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    zIndex: 9999,
    elevation: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  message: {
    color: '#eee',
    fontSize: 14,
    marginTop: 5,
  },
});
