import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View, Text, TextInput, ScrollView } from "react-native";
import socket from "./socket";

export default function App() {
  const [room, setRoom] = useState('default');
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage1 = () => {
    if (message1.trim()) {
      const msg = { room, message: message1, from: 'form1' };
      socket.emit('send_message', msg);
      setMessages([...messages, msg]);
      setMessage1('');
    }
  };

  const sendMessage2 = () => {
    if (message2.trim()) {
      const msg = { room, message: message2, from: 'form2' };
      socket.emit('send_message', msg);
      setMessages([...messages, msg]);
      setMessage2('');
    }
  };

  const handleKeyPress1 = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      sendMessage1();
    }
  };

  const handleKeyPress2 = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      sendMessage2();
    }
  };

  useEffect(() => {
    socket.emit('join_room', room);

    socket.on('receive_message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canal: {room}</Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <Text key={index} style={msg.from === 'form1' ? styles.messageForm1 : styles.messageForm2}>
            {msg.message}
          </Text>
        ))}
      </ScrollView>

      {/* Form 1 */}
      <TextInput
        placeholder='Digite sua mensagem (Formulário 1)'
        value={message1}
        onChangeText={setMessage1}
        onKeyPress={handleKeyPress1}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={sendMessage1}>
        <Text style={styles.buttonText}>Enviar mensagem</Text>
      </Pressable>

      {/* Form 2 */}
      <TextInput
        placeholder='Digite sua mensagem (Formulário 2)'
        value={message2}
        onChangeText={setMessage2}
        onKeyPress={handleKeyPress2}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={sendMessage2}>
        <Text style={styles.buttonText}>Enviar mensagem</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa', // Alterado para um tom de azul claro
    padding: 20,
  },
  title: {
    fontSize: 24, // Aumentado o tamanho da fonte
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796b', // Alterado para uma cor verde escura
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageForm1: {
    backgroundColor: '#b2ebf2', // Alterado para um tom de azul mais claro
    padding: 15, // Aumentado o padding
    borderRadius: 10, // Aumentado o raio da borda
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  messageForm2: {
    backgroundColor: '#ffe082', // Alterado para um tom de amarelo
    padding: 15, // Aumentado o padding
    borderRadius: 10, // Aumentado o raio da borda
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  input: {
    height: 60, // Aumentado a altura
    borderColor: '#80deea', // Alterado para um tom de azul
    borderWidth: 2, // Aumentado a largura da borda
    borderRadius: 10, // Aumentado o raio da borda
    paddingHorizontal: 15, // Aumentado o padding
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00897b', // Alterado para um tom de verde
    paddingVertical: 20, // Aumentado o padding vertical
    borderRadius: 10, // Aumentado o raio da borda
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, // Aumentado o tamanho da fonte
    fontWeight: 'bold',
  },
});
