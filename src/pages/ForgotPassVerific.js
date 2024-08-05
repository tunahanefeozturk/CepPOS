import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Image, Alert } from 'react-native';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

export default function Verification({ navigation, route }) {
  const [verificationCode, setVerificationCode] = useState('');
  const apiClient = new EmlakPosApiClient();
  const { af, as } = route.params || {};


  async function handleVerification() {
    if (!verificationCode && verificationCode.length !== 6) {
      Alert.alert('Uyarı', 'Lütfen doğrulama kodunu giriniz.');
      return;
    }

    try {
      apiClient.clearApiParams();
      apiClient.setRequestDataParam('validation_code', verificationCode);
      apiClient.setRequestDataParam('af', af);
      apiClient.setRequestDataParam('as', as);
      apiClient.setCallAction('user/forgotpasswordotp');
      const response = await apiClient.callApi();
      console.log("verification", response);
      Alert.alert("İşlem başarılı.", "Yeni şifreniz kayıtlı e-posta adresinize gönderildi");
      navigation.navigate('Login', { isit: true });
    } catch (error) {
      Alert.alert('Hata', 'Doğrulama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }



  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <Image
          source={require('../images/logo.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.instructionText}>Cep telefonunuza gönderilen doğrulama kodunu giriniz.</Text>

      <Text style={styles.verificationText}>Doğrulama Kodu</Text>
      <TextInput
        style={styles.input}
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
        placeholder="Kodunuzu giriniz"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.buttonText}>Devam</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 20,
    width: "100%"
  },
  headerContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  headerImage: {
    width: '50%',
    height: '100%',
  },
  instructionText: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 16,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  verificationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },

});

