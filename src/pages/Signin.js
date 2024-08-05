import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';

export default function Signin({ navigation }) {
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
      <View style={styles.contentContainer}>
        <Text style={styles.instruction}>
          İstediğiniz yerden CepPOS'a başvurun, cep telefonunuzdan kolay tahsilat yapmanın keyfini yaşayın!
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={()=>{navigation.navigate('AttendedReg')}}>Emlak Katılımlıyım</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}  onPress={()=>{navigation.navigate('UnattendedReg')}}>Emlak Katılımlı Olmak İstiyorum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={{color: '#007bff',fontSize:20}}>Geri</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    backgroundColor: '#F5FCFF',
  },
  headerContainer: {
    width: '100%',
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop:100
  },
  headerImage: {
    width: '50%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 10,
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
