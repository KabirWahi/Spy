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

export const Container = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 84,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    fontFamily: 'Powderfinger-Type',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    fontFamily: 'Powderfinger-Type',
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Powderfinger-Type',
  }
});