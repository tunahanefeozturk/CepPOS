import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Image, Alert } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

export default function Verification({ navigation }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [seconds, setSeconds] = useState(180);
  const apiClient = new EmlakPosApiClient();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

 async function handleVerification() {
    if (!verificationCode) {
      Alert.alert('Uyarı', 'Lütfen doğrulama kodunu giriniz.');
      return;
    }

    // Doğrulama kodunu kontrol etmek için API çağrısı yapın
    apiClient.setCallAction('accesstoken/loginotpvalidate');
    apiClient.setRequestDataParam('otp_code', verificationCode);

    try {
      const response = await apiClient.callApi();
      console.log("verification",response);
      if (response.success) {
        Alert.alert('Başarılı', 'Doğrulama başarılı! Giriş yapılıyor...');
        navigation.navigate('Home'); // Kullanıcıyı ana sayfaya yönlendirin
      } else {
        Alert.alert('Hata', 'Doğrulama kodu hatalı. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      Alert.alert('Hata', 'Doğrulama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  async function handleResendCode() {
    // Kod tekrar gönderme işlemi için API çağrısı yapın
    apiClient.setCallAction('user/resendotp');

   await  apiClient.callApi()
      .then(response => {
        if (response && response.success) {
          Alert.alert('Bilgi', 'Yeni doğrulama kodu gönderildi.');
          setSeconds(180); // Sayacı yeniden başlatın
        } else {
          Alert.alert('Hata', 'Kod gönderme işlemi başarısız. Lütfen tekrar deneyin.');
        }
      })
      .catch(error => {
        Alert.alert('Hata', 'Kod gönderme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      });
  }

  if(seconds==0){
    navigation.goBack()
    Alert.alert("Kod Alınamadı","Telfonunuza gönderilen giriş kodunu 3 dakika içerisinde girmelisiniz.Spam kutunuzu kontrol etmeyi unutmayın lütfen.")
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
      
      <Text style={styles.instructionText}>Cep telefonunuza gönderilen tek kullanımlık giriş kodunu giriniz.</Text>
      
      <Text style={styles.verificationText}>Doğrulama Kodu</Text>
      <TextInput
        style={styles.input}
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
        placeholder="Kodunuzu giriniz"
        placeholderTextColor="#999"
      />

      <View style={styles.timerContainer}>
        <AnimatedCircularProgress
          size={150}
          width={15}
          fill={(seconds / 180) * 100}
          tintColor= {seconds>30 ? "#007FFF":"red"}
          backgroundColor='#C5CCCC'
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.timerInnerContainer}>
              <Text style={styles.timerText}>{seconds}</Text>
              <Text style={styles.timerLabel}>SANİYE</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <Text style={styles.buttonText}>Devam</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resendButton} onPress={() => { handleResendCode }}>
        <Text style={styles.buttonText}>Tekrar Gönder</Text>
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
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  timerText: {
    fontSize: 48,
    color: '#007AFF',
  },
  timerLabel: {
    fontSize: 16,
    color: '#007AFF',
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
  resendButton: {
    backgroundColor: 'grey',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});

