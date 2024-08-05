import * as React  from 'react';
import  { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet ,Image } from 'react-native';
import Header from '../../components/Header';

 

export default function HomeScreen({ navigation }) {
 
    return ( 
      
      <SafeAreaView style={styles.container}>
        <Icon name='account-cog' size={100} color="#3b5998"/>
        <Text style={styles.title}>Kullanıcı Ayarları</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={()=>{navigation.navigate('ChangePass')}}>
            <Icon name="lock" size={30} color="#3b5998" />
            <Text style={styles.buttonText}>Şifremi Değiştir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="account-multiple" size={30} color="#3b5998" />
            <Text style={styles.buttonText}> Alt Kullanıcılar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} >
            <Icon name="account-plus" size={30} color="#3b5998"  onPress={(()=>navigation.navigate("UserDetails"))}/>
            <Text style={styles.buttonText}>Yeni Kullanıcı</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={(()=>navigation.navigate("UserReg"))} >
            <Icon name="account-details" size={30} color="#3b5998" />
            <Text style={styles.buttonText}>Profil Bilgileri</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton}  onPress={() => navigation.goBack()}>
          <Icon name="logout" size={30} color="#3b5998" />
          <Text style={styles.buttonText}>Geri - Ana Menü</Text>
        </TouchableOpacity>
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
      justifyContent: 'center',
      width:300
    },
   
    menuButton: {
      width: 120,
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
    logoutButton: {
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
    },
  
  });