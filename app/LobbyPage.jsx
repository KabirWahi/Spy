import React, { useState, useEffect } from 'react';
import { Text, TextInput, ScrollView, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Heading, Button, Container, styles } from './_layout';

const LobbyPage = ({ initialMode, onBack, fontsLoaded }) => {
  const [lobbyCode, setLobbyCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAnim] = useState(new Animated.Value(0));
  const [selectedDeck, setSelectedDeck] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [decks, setDecks] = useState({});
  const [isHost, setIsHost] = useState(initialMode === 'host');

  useEffect(() => {
    fetch('../assets/decks.json')
      .then(response => response.json())
      .then(data => setDecks(data))
      .catch(error => console.error('Error loading decks:', error));
  }, []);

  const getWebSocketUrl = () => {
    return 'ws://localhost:3000';
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
        setSelectedDeck(data.selectedDeck || '');
        setSelectedMode(data.selectedMode || '');
        setIsHost(data.players.find(p => p.name === playerName)?.isHost || false);
        break;
      case 'newHost':
        if (data.hostName === playerName) {
          setIsHost(true);
          showError('You are now the host!');
        }
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

  const handleDeckChange = (deck) => {
    setSelectedDeck(deck);
    if (socket) {
      socket.send(JSON.stringify({ type: 'updateDeck', deck }));
    }
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    if (socket) {
      socket.send(JSON.stringify({ type: 'updateMode', mode }));
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!isConnected) {
    return (
      <Container>
        <Heading text={isHost ? "Host Game" : "Join Game"} />
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="white"
          value={playerName}
          onChangeText={setPlayerName}
        />
        {!isHost && (
          <TextInput
            style={styles.input}
            placeholder="Enter game code"
            placeholderTextColor="white"
            value={joinCode}
            onChangeText={(text) => {
              const alphabeticText = text.replace(/[^A-Za-z]/g, '').toUpperCase();
              setJoinCode(alphabeticText.slice(0, 4));
            }}
            maxLength={4}
            autoCapitalize="characters"
          />
        )}
        <Button label={isHost ? "Host Game" : "Join Game"} onPress={isHost ? handleHost : handleJoin} />
        <Button label="Back" onPress={onBack} />
        <ErrorPrompt message={errorMessage} animValue={errorAnim} />
      </Container>
    );
  }

  return (
    <Container>
      {lobbyCode && (
        <Text style={styles.heading}>
          Lobby Code: {lobbyCode}
        </Text>
      )}
      <Text style={styles.playerCount}>
        Players in lobby: {players.length}/8
      </Text>
      <ScrollView style={styles.playerList}>
        {players.map((player, index) => (
          <Text key={index} style={styles.playerItem}>
            {player.name} {player.isHost ? "(Host)" : ""}
          </Text>
        ))}
      </ScrollView>
      {isHost && (
        <>
          <Picker
            selectedValue={selectedDeck}
            style={styles.picker}
            onValueChange={handleDeckChange}
          >
            <Picker.Item label="Select a deck" value="" />
            {Object.keys(decks).map((deckKey) => (
              <Picker.Item key={deckKey} label={decks[deckKey].name} value={deckKey} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedMode}
            style={styles.picker}
            onValueChange={handleModeChange}
          >
            <Picker.Item label="Select a mode" value="" />
            <Picker.Item label="Test 1" value="test1" />
            <Picker.Item label="Test 2" value="test2" />
          </Picker>
        </>
      )}
      {!isHost && (
        <>
          <Text style={styles.infoText}>Selected Deck: {selectedDeck ? decks[selectedDeck]?.name : 'Not selected'}</Text>
          <Text style={styles.infoText}>Selected Mode: {selectedMode || 'Not selected'}</Text>
        </>
      )}
      <Button label="Leave" onPress={handleLeave} />
      <ErrorPrompt message={errorMessage} animValue={errorAnim} />
    </Container>
  );
};

const ErrorPrompt = ({ message, animValue }) => (
  <Animated.View style={[styles.errorPrompt, { opacity: animValue }]}>
    <Text style={styles.errorText}>{message}</Text>
  </Animated.View>
);

export default LobbyPage;