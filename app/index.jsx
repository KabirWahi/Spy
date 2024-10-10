import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Title, Button, Container } from './_layout';
import LobbyPage from './LobbyPage';
import * as Font from 'expo-font';

export default function App() {
  const [page, setPage] = useState('home');
  const [lobbyMode, setLobbyMode] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Powderfinger-Type': require('../assets/fonts/powderfinger.type.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const handleHost = () => {
    setLobbyMode('host');
    setPage('lobby');
  };

  const handleJoin = () => {
    setLobbyMode('join');
    setPage('lobby');
  };

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  if (page === 'home') {
    return (
      <Container>
        <Title text="SPY" />
        <Button label="Host Game" onPress={handleHost} />
        <Button label="Join Game" onPress={handleJoin} />
      </Container>
    );
  } else if (page === 'lobby') {
    return <LobbyPage initialMode={lobbyMode} onBack={() => setPage('home')} fontsLoaded={fontsLoaded} />;
  }
}

const styles = StyleSheet.create({
  // You can add any additional styles here if needed
});