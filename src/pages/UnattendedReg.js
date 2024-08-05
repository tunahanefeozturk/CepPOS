import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, CheckBox,StatusBar } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function UnattendedReg({ navigation }) { 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isKVKKChecked, setIsKVKKChecked] = useState(false);
    const [isConsentChecked, setIsConsentChecked] = useState(false);

    function conti(){ 
          if (!phoneNumber) {
            Alert.alert('Uyarı', 'Lütfen telefon numaranızı giriniz.');
            return;
          }

          if (!isKVKKChecked) {
            Alert.alert('Uyarı', 'Lütfen KVKK Aydınlatma Metni\'ni onaylayın.');
            return;
          }
      
          if (!isConsentChecked) {
            Alert.alert('Uyarı', 'Lütfen KVKK Açık Rıza Sözleşmesi\'ni onaylayın.');
            return;
          }
      
          Alert.alert('Başarılı', 'Form başarıyla gönderildi.');
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

            <Text style={styles.greeting}>Cep Telefonu Numaranızı Giriniz</Text>

            <View style={styles.inputContainer}>
                
                <TextInput
                    style={styles.input}
                    placeholder="0 (5XX) XXX XX XX"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />

                <View style={styles.section}>
                    <Checkbox style={styles.checkbox} value={isKVKKChecked} onValueChange={setIsKVKKChecked} />               
                    <Text style={styles.paragraph}>
                    <TouchableOpacity onPress={() => { alert("TÜRKİYE EMLAK KATILIM BANKASI A.Ş. KİŞİSEL VERİLERİN KORUNMASI KANUNUNU AYDINLATMA METNİ")}}>
                            <Text style={styles.link}>KVKK Aydınlatma Metni</Text>
                        </TouchableOpacity>
                        'ni Okudum, onaylıyorum.
                    </Text>
                </View> 

                <View style={styles.section}>
                    <Checkbox style={styles.checkbox} value={isConsentChecked} onValueChange={setIsConsentChecked} />
                    <Text style={styles.paragraph}>
                        <TouchableOpacity onPress={() => {alert("KİŞİSEL VERİ AÇIK RIZA") }}>
                            <Text style={styles.link}>KVKK Açık Rıza Sözleşmesi</Text>
                        </TouchableOpacity>'ni Okudum, onaylıyorum.
                    </Text>
                </View>

            </View>
            <TouchableOpacity style={styles.Button} onPress={conti}>
                <Text style={styles.ButtonText}>Devam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.customerService} onPress={() => { navigation.navigate('Signin') }}>
                <Text style={{ color: '#007bff', fontSize: 20 }}>Geri</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
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
    Button: {
        backgroundColor: '#28a745',
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
        width: '100%',
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
