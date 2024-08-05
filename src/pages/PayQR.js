import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking ,Image,TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from 'react-native-paper';
import EmlakPosApiClient from '../services/EmlakPosApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QrGeneratePage = ({ route ,navigation}) => {
    const [link, setLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const { paramCart, amo } = route.params;
    const apiClient = new EmlakPosApiClient();
    useEffect(() => {
        fetchTransactionLink();
    }, []);

    const fetchTransactionLink = async () => {

        try {
            await apiClient.clearApiParams();
            apiClient.setRequestDataParam('cart', paramCart);
            apiClient.setRequestDataParam('callback', 'createqr');
            apiClient.setCallAction('transaction/registerTransaction');
            const response = await apiClient.callApi();
            console.log(response);
            if (response.data.link) {
                setLink(response.data.link);
            }
            await AsyncStorage.setItem('token', response.header.token);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkPress = () => {
        if (link) {
            Linking.openURL(link);
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
            <Text style={styles.amountText}>{amo}₺</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : link ? (
                <>
                    <Text style={styles.text}>
                        Bağlantıyı <Text style={styles.link} onPress={handleLinkPress}>buraya tıklayarak</Text> veya aşağıdaki QR kodunu okutarak açabilirsiniz.
                    </Text>
                    <QRCode value={link} size={200} />
                </>
            ) : (
                <Text style={styles.error}>Bir hata oluştu. Lütfen tekrar deneyin</Text>
            )}
             <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.goBack()}>
            <Icon name="logout" size={30} color="#3b5998" />
            <Text style={styles.buttonText}>Geri - Ana Menü</Text>
          </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5FCFF',
    },
    headerContainer: {
        width: '100%',
        height: 200, 
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', 
        marginBottom:30,
        marginTop:0
      },
      headerImage: {
        width: '50%',
        height: '100%',
    
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
        fontSize: 20,
        color: 'green'
    },
    text: {
        textAlign: 'center',
        marginBottom: 16,
        marginTop:16,
        fontSize:16
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize:20
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
      buttonText: {
        marginLeft: 10,
        fontSize: 20,
        color: "#3b5998"
      },
});

export default QrGeneratePage;
