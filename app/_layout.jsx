import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export const Title = ({ text }) => (
  <Text style={styles.title}>{text}</Text>
);

export const Heading = ({ text }) => (
  <Text style={styles.heading}>{text}</Text>
);

export const Button = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

export const Container = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

export const styles = StyleSheet.create({
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
    fontSize: 52,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
    fontFamily: 'Powderfinger-Type',
  },
  button: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Powderfinger-Type',
  },
  input: {
    height: 40, 
    borderColor: 'white', 
    borderWidth: 2, 
    fontSize: 16,
    padding: 10, 
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
    borderRadius: 10,
    fontFamily: 'Powderfinger-Type',
    width: 200,
  },
  lobbyCode: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Powderfinger-Type',
  },
  playerCount: {
    color: 'white',
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Powderfinger-Type',
  },
  playerList: {
    maxHeight: 200,
    marginBottom: 10,
    width: 200,
  },
  playerItem: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    marginBottom: 5,
    fontFamily: 'Powderfinger-Type',
  },
  errorPrompt: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Powderfinger-Type',
  },
  picker: {
    width: 200,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Powderfinger-Type',
  },
});