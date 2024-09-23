import React, { useState } from 'react';
import { View, Text, TextInput, Platform, ScrollView, StyleSheet, Animated } from 'react-native';
import { Title, Button, Container } from './_layout';
import Constants from 'expo-constants';

const LobbyPage = ({ isHost, onBack, fontsLoaded }) => {
  const [lobbyCode, setLobbyCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAnim] = useState(new Animated.Value(0));

  const getWebSocketUrl = () => {
    if (Platform.OS === 'web') {
      return 'ws://localhost:3000';
    }
    if (Platform.OS === 'android') {
      return 'ws://10.0.2.2:3000';
    }
    return `ws://${Constants.manifest.debuggerHost.split(':').shift()}:3000`;
  };

  const connectToServer = (code = '') => {
    const wsUrl = getWebSocketUrl();
    const newSocket = new WebSocket(`${wsUrl}${code ? `?partyCode=${code}&playerName=${playerName}` : `?playerName=${playerName}`}`);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleSocketMessage(data);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      showError('Failed to connect to the game server');
      setIsConnected(false);
    };

    newSocket.onclose = () => {
      setIsConnected(false);
    };

    setSocket(newSocket);
  };

  const handleSocketMessage = (data) => {
    switch (data.type) {
      case 'playerList':
        setLobbyCode(data.partyCode);
        setPlayers(data.players);
        break;
      case 'error':
        showError(data.message);
        setIsConnected(false);
        break;
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    Animated.sequence([
      Animated.timing(errorAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(3000),
      Animated.timing(errorAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => setErrorMessage(''));
  };

  const handleJoin = () => {
    if (joinCode.length !== 4 || !/^[A-Z]+$/.test(joinCode)) {
      showError('Please enter a valid 4-letter code');
      return;
    }
    if (!playerName) {
      showError('Please enter your name');
      return;
    }
    connectToServer(joinCode);
  };

  const handleHost = () => {
    if (!playerName) {
      showError('Please enter your name');
      return;
    }
    connectToServer();
  };

  const handleLeave = () => {
    if (socket) {
      socket.close();
    }
    setIsConnected(false);
    setLobbyCode('');
    setPlayers([]);
    onBack();
  };

  if (!fontsLoaded) {
    return null; // or a loading indicator
  }

  if (!isConnected) {
    return (
      <Container>
        <Title text={isHost ? "Host Game" : "Join Game"} />
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="gray"
          value={playerName}
          onChangeText={setPlayerName}
        />
        {!isHost && (
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="Enter game code"
            placeholderTextColor="gray"
            value={joinCode}
            onChangeText={(text) => {
              const alphabeticText = text.replace(/[^A-Za-z]/g, '').toUpperCase();
              setJoinCode(alphabeticText.slice(0, 4));
            }}
            maxLength={4}
            autoCapitalize="characters"
          />
        )}
        <Button label={isHost ? "Host" : "Join"} onPress={isHost ? handleHost : handleJoin} />
        <Button label="Back" onPress={onBack} />
        <ErrorPrompt message={errorMessage} animValue={errorAnim} />
      </Container>
    );
  }

  return (
    <Container>
      <Title text={isHost ? 'Hosting Game' : 'Joined Game'} />
      {lobbyCode && (
        <Text style={styles.lobbyCode}>
          Lobby Code: {lobbyCode}
        </Text>
      )}
      <Text style={styles.playerCount}>
        Players in lobby: {players.length}/8
      </Text>
      <ScrollView style={styles.playerList}>
        {players.map((player, index) => (
          <Text key={index} style={styles.playerItem}>
            {player} {index === 0 ? "(Host)" : ""}
          </Text>
        ))}
      </ScrollView>
      <Button label="Leave Lobby" onPress={handleLeave} />
      <ErrorPrompt message={errorMessage} animValue={errorAnim} />
    </Container>
  );
};

const ErrorPrompt = ({ message, animValue }) => (
  <Animated.View style={[styles.errorPrompt, { opacity: animValue }]}>
    <Text style={styles.errorText}>{message}</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Powderfinger-Type',
  },
  codeInput: {
    textTransform: 'uppercase'
  },
  lobbyCode: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'Powderfinger-Type',
  },
  playerCount: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Powderfinger-Type',
  },
  playerList: {
    maxHeight: 200,
    marginBottom: 20
  },
  playerItem: {
    color: 'white',
    fontSize: 16,
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
  }
});

export default LobbyPage;