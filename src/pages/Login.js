import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

export default function Login({ navigation, route }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Eğer kullanıcı daha önce giriş yapmışsa, telefon numarasını ve adını al
    const loadUserData = async () => {
      const storedPhone = await AsyncStorage.getItem('user_info_login_phone');
      const storedFirstName = await AsyncStorage.getItem('user_info_firstname');
      if (storedPhone) setPhone(storedPhone);
      if (storedFirstName) setFirstName(storedFirstName);
    };

    loadUserData();
  }, []);


  const handleLogin = async () => {
    const apiClient = new EmlakPosApiClient();
    await apiClient.clearApiParams();
    apiClient.setHeadParam('phone', phone);
    apiClient.setHeadParam('password', password);
    apiClient.setCallAction('accesstoken/gettoken');

    try {
      const response = await apiClient.callApi();
      console.log("login: ", response);
      await AsyncStorage.setItem('token', response.header.token);
      apiClient.setHeadParam('token', response.header.token);

      if (response.data.user_info) {
        await AsyncStorage.setItem('user_info_firstname', response.data.user_info.firstname);
        await AsyncStorage.setItem('user_info_lastname', response.data.user_info.lastname);
        await AsyncStorage.setItem('user_level', response.data.user_info.user_level);
        await AsyncStorage.setItem('id_user', response.data.user_info.id_user);
        await AsyncStorage.setItem('phone', response.data.user_info.phone);
        await AsyncStorage.setItem('password', password);
        setFirstName(response.data.user_info.firstname);
        if (route.params) {
          navigation.navigate('CahangePass');
        } else {
          navigation.navigate("Home", response.data.user_info);
        }
      } else {
        navigation.navigate('Verification');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Oturum açma sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleForgetMe = () => {
    setPhone('');
    setFirstName('');
    setPassword('');
    try {
      AsyncStorage.clear();

    } catch (error) {
      console.error("Error clearing login info: ", error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../images/logo.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.userName}>Merhaba {firstName}</Text>
      <TouchableOpacity style={styles.forgetMeButton} onPress={ handleForgetMe}>
        <Text style={styles.forgetMeText}>Beni unut</Text>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="0 (5XX) XXX XX XX"
          value={phone}
          keyboardType='numeric'
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          keyboardType='numeric'
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Giriş</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Signin') }}>
        <Text style={styles.link}>Üye Ol</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('ForgotPass') }}>
        <Text style={styles.link}>Şifremi Unuttum</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.customerService} onPress={() => { navigation.navigate('Communication') }}>
        <Text style={styles.link}>Müşteri Hizmetleri</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerContainer: {
    width: '100%',
    height: 200, // Ekranın üst kısmını kaplayacak şekilde ayarlandı
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Metni doğru konumlandırmak için
  },
  headerImage: {
    width: '50%',
    height: '100%',

  },
  subHeaderText: {
    position: 'absolute', // Metni doğru konumlandırmak için
    color: 'white',
    fontSize: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Metin okunabilirliği için arka plan
    padding: 10,
    borderRadius: 5,
  },
  greeting: {
    fontSize: 18,
    marginVertical: 10,
    color: '#0065b3',
  },
  userName: {
    fontSize: 16,
    marginBottom: 10,
  },
  forgetMeButton: {
    marginBottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  forgetMeText: {
    color: '#0065b3',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    width: '80%',
    marginVertical: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: 'white',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
    marginVertical: 10,
    fontSize: 15
  },
  customerService: {
    marginTop: 10,
  },
});