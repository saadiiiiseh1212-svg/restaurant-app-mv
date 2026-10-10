// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert, Platform } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { CartProvider } from './src/context/CartContext';
import MenuScreen from './src/screens/MenuScreen';
import LoginScreen from './src/screens/LoginScreen';
import { placeDummyOrder } from './src/services/api';

// LoginScreen agar navigation use kare to crash na ho
const fakeNavigation = {
  navigate: () => {},
  replace: () => {},
  goBack: () => {},
};

function AppContent() {
  const { user, login, logout } = useAuth();
  const [status, setStatus] = useState('');

  const showMessage = (title, msg) => {
    if (Platform.OS === 'web') window.alert(title + ': ' + msg);
    else Alert.alert(title, msg);
  };

  const handleDummyOrder = async () => {
    setStatus('Order bheja ja raha hai...');
    try {
      const order = await placeDummyOrder();
      setStatus('✅ Order placed! ID: ' + order._id);
      showMessage('Success', 'Order ID: ' + order._id);
    } catch (e) {
      setStatus('❌ Error: ' + e.message);
      showMessage('Error', e.message);
    }
  };

  // Login nahi hua to pehle Login screen
  if (!user) {
    return <LoginScreen onLogin={login} navigation={fakeNavigation} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.btn}>
        <Text style={styles.welcome}>Welcome, {user.name || user.email}</Text>
        <Button title="Place Dummy Order" onPress={handleDummyOrder} />
        {status !== '' && <Text style={styles.status}>{status}</Text>}
        <Button title="Logout" color="#888" onPress={logout} />
      </View>
      <MenuScreen />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  btn: { marginTop: 40, marginHorizontal: 16 },
  welcome: { fontWeight: '700', marginBottom: 6, color: '#000' },
  status: { marginVertical: 8, color: '#000', fontWeight: '600' },
});