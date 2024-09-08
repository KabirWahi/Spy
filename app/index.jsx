// index.jsx
import React from 'react';
import { Title, Button, Container } from './_layout';

export default function App() {
  return (
    <Container>
      <Title text="Spy" />
      <Button label="Host" onPress={() => {}} />
      <Button label="Join" onPress={() => {}} />
    </Container>
  );
}
