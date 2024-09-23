import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Title, Button, Container } from './_layout';
import LobbyPage from './LobbyPage';
import * as Font from 'expo-font';

export default function App() {
  const [page, setPage] = useState('home');
  const [isHost, setIsHost] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        //'ITC-Busorama': require('../assets/fonts/ITC Busorama Bold.otf'),
        //'ITC-Busorama': require('../assets/fonts/gruesome.regular.ttf'),
        'ITC-Busorama': require('../assets/fonts/powderfinger.type.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  const handleHost = () => {
    setIsHost(true);
    setPage('lobby');
  };

  const handleJoin = () => {
    setIsHost(false);
    setPage('lobby');
  };

  if (!fontLoaded) {
    return null; // or a loading indicator
  }

  if (page === 'home') {
    return (
      <Container>
        <Title text="Spy Game" />
        <Button label="Host Game" onPress={handleHost} />
        <Button label="Join Game" onPress={handleJoin} />
      </Container>
    );
  } else if (page === 'lobby') {
    return <LobbyPage isHost={isHost} onBack={() => setPage('home')} fontLoaded={fontLoaded} />;
  }
}

const styles = StyleSheet.create({
  // You can add any additional styles here if needed
});