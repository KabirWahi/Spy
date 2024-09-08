// _layout.jsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export const Title = ({ text }) => (
  <Text style={styles.title}>{text}</Text>
);

export const Button = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red', // Shade of red for the title
  },
  button: {
    backgroundColor: 'red', // Red button background
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff', // White text on the button
    fontSize: 16,
    fontWeight: 'bold',
  }
});
