import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Image, Alert } from 'react-native';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

export default function ForgotPass({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const apiClient = new EmlakPosApiClient();

  async function rememberPass() {

    if (!phoneNumber && phoneNumber.length!==11) {
      Alert.alert('Uyarı', 'Lütfen telefon numaranızı giriniz.');
      return;
    }

    if (!email && email.includes("@")) {
      Alert.alert('Uyarı', 'Lütfen e-posta adresinizi giriniz.');
      return;
    }

    try {
      await apiClient.clearApiParams();
      apiClient.setRequestDataParam('email', email);
      apiClient.setRequestDataParam('phone', phoneNumber);
      apiClient.setCallAction('user/forgotpasswordrequest');
      const response = await apiClient.callApi();
      console.log(response)
      const af = response.data.af;
      const as = response.data.as;
      navigation.navigate('ForgotPassVerific', { af, as });
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <Image
          source={require('../images/logo.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />

      </View>

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔒</Text>
      </View>
      <Text style={styles.forgotText}>Şifremi Unuttum</Text>
      <Text style={styles.instruction}>Şifrenizi unuttuysanız aşağıdaki alanlara telefon ve e-posta adreslerinizi girip sonraki adımları izleyerek geçici şifre oluşturabilirsiniz.</Text>
      <TextInput
        style={styles.input}
        placeholder="0 (5XX) XXX XX XX"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta Adresinizi Giriniz"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={rememberPass}>
        <Text style={styles.buttonText}>Şifremi Hatırlat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => { navigation.navigate('Login') }}>
        <Text style={styles.backButtonText}>← Geri - Giriş</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerImage: {
    width: '50%',
    height: '100%',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    color: '#007AFF',
  },
  forgotText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});


