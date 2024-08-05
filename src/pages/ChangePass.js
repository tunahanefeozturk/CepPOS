
import * as React from 'react';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmlakPosApiClient from '../services/EmlakPosApiClient';

ChangePass = ({ navigation }) => {
  const [pass, setPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [NewPass2, setNewPass2] = useState('');
  const apiClient = new EmlakPosApiClient();

  const handleChangePass = async () => {
    const checkPass = await AsyncStorage.getItem('password');
    if (pass.length !== 6) {
      Alert.alert("", 'Mevcut şifrenizi kontrol ediniz');
    }
    else if (pass !== checkPass) {
      Alert.alert("", "Şİfre yanlış");
    }
    else if (newPass.length !== 6) {
      Alert.alert("", 'Yeni şifrenizi kontrol ediniz');
    }
    else if (newPass !== NewPass2) {
      Alert.alert("", 'Yeni şifreler uyuşmuyor');
    }
    else if (newPass === pass) {
      Alert.alert("", 'Yeni şifre ile mevcut şifre aynı olamaz');
    } else {
      await apiClient.clearApiParams();
      apiClient.setRequestDataParam('current_password', pass);
      apiClient.setRequestDataParam('new_password', newPass);
      apiClient.setCallAction('user/resetpassword');
      try {
        const response = await apiClient.callApi();
        if(response.header.result_code===1){
          setPass("");
          setNewPass("");
          setNewPass2("");
          Alert.alert("","Şifre başarıyla değiştirildi.");
          navigation.navigate('Users');
        }
        console.log(response);
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <View style={styles.container}>

      <Icon name="lock-reset" size={100} color="#3b5998" />
      <View style={styles.form}>
        <Text style={styles.title}>Şifre Değiştirme</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#3b5998" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mevcut Şifre"
            value={pass}
            onChangeText={setPass}
            
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-plus" size={24} color="#3b5998" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Yeni Şifre"
            value={newPass}
            onChangeText={setNewPass}
         
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock-plus" size={24} color="#3b5998" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Yeni Şifre Tekrar"
            value={NewPass2}
            onChangeText={setNewPass2}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleChangePass}>
          <Text style={styles.buttonText}>Şifremi Değiştir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.goBack()}>
          <Icon name="logout" size={30} color="#3b5998" />
          <Text style={styles.logoutButtonText}>Geri - Kullanıcı Menüsü</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
    width: '90%',
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3b5998'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#1CAF60',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    height: 'auto',
    width: "100%",
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#3b5998",
    fontSize: 18,
  }
});
export default ChangePass