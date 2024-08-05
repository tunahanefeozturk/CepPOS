import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet  } from 'react-native';



 export default function Pay({ route,navigation }) {
 
    const {paramCart,amo}=route.params;
  return ( 
    
    <SafeAreaView style={styles.container}>
      
      <Icon name='contactless-payment' size={100} color="#3b5998"/>
      <Text style={styles.title}>Ödeme</Text>
      <Text style={styles.amountText}>{amo}₺</Text> 
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton}  onPress={() =>navigation.navigate('FastPay', {paramCart, amo })}>
          <Icon name="credit-card" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Kartla Ödeme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('PayMail', { paramCart, amo })}>
            <Icon name="email-send" size={30} color="#3b5998" />
              <Text style={styles.buttonText}>E-mail Gönder</Text>
            </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('PaySMS', { paramCart, amo  })}>
          <Icon name="cellphone-message" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>SMS Gönder</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('PayQR', { paramCart, amo  })}>
          <Icon name="line-scan" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>QR Kodu Oluştur</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center',
      backgroundColor: '#F5FCFF',
     
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    menuContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      width:350
    },
    menuButton: {
      width: 150,
      height: 100,
      margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    buttonText: {
      marginTop: 10,
      fontSize: 14,
      color: '#3b5998',
    },
    amountText: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
      fontSize:20,
      color:'green'
    },
  
  });