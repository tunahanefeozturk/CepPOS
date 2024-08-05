import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Checkbox from 'expo-checkbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

const apiClient = new EmlakPosApiClient();

const Register = ({ navigation }) => {
 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isKVKKChecked, setIsKVKKChecked] = useState(false);
  const [isConsentChecked, setIsConsentChecked] = useState(false);

  const handleRegister = async () => {
    if (!isKVKKChecked || !isConsentChecked)
      return;

    if (!email || !phone || !password || !password2) {
      Alert.alert("UYARI!", "Bilgiler eksik.Lütfen tüm alanları doldurun.")
    }
    else if(phone.length!=11){
      Alert.alert("UYARI!", "Telefon numarası 11 haneli olmalıdır.")
    }
    else if( password.length!=6){
      Alert.alert("UYARI!", "Şifre 6 haneli olmalıdır")
    }else if( password !==password2){
      Alert.alert("UYARI!", "Şifreler uyuşmuyor.")
    }
    else{
         // API parametrelerini temizle ve gerekli bilgileri ekle
    apiClient.clearApiParams();
    apiClient.setRequestDataParam('email', email);
    apiClient.setRequestDataParam('phone', phone);
    apiClient.setRequestDataParam('password', phone);

    // Kayıt API çağrısını yap
    apiClient.setCallAction('user/register');
    apiClient.callApi('actionHandleRegister');
      
      try {
        const response = await apiClient.callApi();
        if (response.header.result_code === 1) {
          Alert.alert('Success', 'Registration successful');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', response.header.result_message);
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong');
      }
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

      <Text style={styles.greeting}>Kayıt</Text>

  
      <View style={styles.inputContainer}>
        <Icon name="phone" size={24} color="#3b5998" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="0 (5XX) XXX XX XX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="#3b5998" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>

        <Icon name="lock" size={24} color="#3b5998" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock-check" size={24} color="#3b5998" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Şifre tekrar"
          value={password2}
          onChangeText={setPassword2}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={isKVKKChecked} onValueChange={setIsKVKKChecked} />

        <Text style={styles.paragraph}>
          <TouchableOpacity onPress={() => { Alert.alert("","TÜRKİYE EMLAK KATILIM BANKASI A.Ş. KİŞİSEL VERİLERİN KORUNMASI KANUNUNU AYDINLATMA METNİ") }}>
            <Text style={styles.link}>KVKK Aydınlatma Metni</Text>
          </TouchableOpacity>
          'ni Okudum, onaylıyorum.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={isConsentChecked} onValueChange={setIsConsentChecked} />
        <Text style={styles.paragraph}>
          <TouchableOpacity onPress={() => { Alert.alert("","KİŞİSEL VERİ AÇIK RIZA") }}>
            <Text style={styles.link}>KVKK Açık Rıza Sözleşmesi</Text>
          </TouchableOpacity>'ni Okudum, onaylıyorum.
        </Text>
      </View>


      <TouchableOpacity style={isKVKKChecked && isConsentChecked ? styles.activeButton : styles.Button} onPress={handleRegister}>
        <Text style={styles.ButtonText}>Kayıt ol</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  greeting: {
    fontSize: 30,
    marginVertical: 10,
    color: '#0065b3',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 10,
    width: '80%',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  Button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  ButtonText: {
    color: 'white',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
    marginVertical: 10,
    fontSize: 15,
  },
  customerService: {
    marginTop: 10,
  },
  section: {
    width: '80%',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
    flex: 1,
  },
  checkbox: {
    margin: 8,
    alignSelf: 'flex-start',
  },
});

export default Register;
