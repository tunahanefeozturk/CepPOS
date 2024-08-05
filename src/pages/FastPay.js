import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EmlakPosApiClient from '../services/EmlakPosApiClient';
import PosCart from '../services/posscreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PosCartItem {
  constructor(name, price, quantity = 1) {
    this.name = name;
    this.price = parseFloat(price).toFixed(2);
    this.quantity = parseInt(quantity);
  }
}

const PaymentForm = ({ route, navigation }) => {
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [installmentModalVisible, setInstallmentModalVisible] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const { paramCart, amo } = route.params || {};
  const apiClient = new EmlakPosApiClient();
  const cart = new PosCart();
  useEffect(() => {
    if (amo) {
      setAmount(amo);
    }
    if (paramCart) {
      setSelectedInstallment(paramCart.installment);
    }

  }, [amo, paramCart]);

  const handlePayment = async () => {

    if (!name || !cardNumber || !expiryDate || !cvv || !amount) {
      Alert.alert("Bilgiler eksik!");
      return;
    }


    const cardType = getCardType(cardNumber);

    if(cardType==='Unknown'){
      Alert.alert('Kart numarasını kontrol ediniz.');
    }
 
    const minAmount = 5;
    const maxAmount = 500000;
    const parsedAmount = parseFloat(amount);

    if (parsedAmount < minAmount) {
      Alert.alert(`Toplam tutar en az ${minAmount} TL değerinde olmalıdır.`);
      return;
    }

    if (parsedAmount > maxAmount) {
      Alert.alert(`Toplam tutar en fazla ${maxAmount} TL değerinde olabilir.`);
      return;
    }


    if (!validateExpiryDate(expiryDate)) {
      Alert.alert('Kart son kullanım tarihini kontrol ediniz.');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Kart güvenlik kodunu kontrol ediniz.');
      return;
    }

    if (name.length < 5) {
      Alert.alert('Kart üzerindeki ismi kontrol ediniz.');
      return;
    }

    if (!paramCart) {
      cart.total_amount = amount;
      cart.tax_rate = "0.18";
      cart.add(new PosCartItem('Ürün-Hizmet', amount, 1));
      cart.installment = selectedInstallment ? selectedInstallment : 1;
    }


    try {
      await apiClient.clearApiParams();
      apiClient.setRequestDataParam('cart', paramCart ? paramCart : cart);
      apiClient.setRequestDataParam('amount', parsedAmount.toFixed(2));
      apiClient.setRequestDataParam('installment', selectedInstallment ? selectedInstallment : 1);
      apiClient.setRequestDataParam('cc', {
        holder: name,
        number: cardNumber,
        cvv: cvv,
        expire: formatExpiryDate(expiryDate)
      });
      apiClient.setCallAction('transaction/paycc');

      const response = await apiClient.callApi();
      handlePayCc(response)
      await AsyncStorage.setItem('token', response.header.token);
    } catch (error) {

      Alert.alert('Ödeme başarısız', error.message);
    }

  };
  const handlePayCc = (data) => {
    if (typeof data.data.tds_url !== 'undefined') {
      if (data.header.token) {
        apiClient.setToken(data.header.token);
      }
      console.log("frame: " + data.data.tds_url);
      Alert.alert('İşlem yönlendiriliyor. Lütfen bekleyiniz.',);
      navigation.navigate('WebViewScreen', { url: data.data.tds_url });
      return;
    }
    if (data.header.result_code === 1) {
      cart.clear();
    }
  };

  const getCardType = (number) => {
    const re = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
     
    };

    if (re.visa.test(number)) return 'Visa';
    if (re.mastercard.test(number)) return 'MasterCard';
    if (re.amex.test(number)) return 'American Express';
    return 'Unknown';
  };

  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) return false;
    const expiry = new Date(`20${year}`, month - 1);
    const now = new Date();
    return expiry > now;
  };

  const formatExpiryDate = (date) => {
    const [month, year] = date.split('/');
    return `${month}${year}`;
  };


  const handleInstallmentSelect = (value) => {
    setSelectedInstallment(value);
    setInstallmentModalVisible(!installmentModalVisible);
  };

  const handleExpiryDateChange = (value) => {
    if (value.length === 2 && !value.includes('/')) {
      setExpiryDate(value + '/');
    } else {
      setExpiryDate(value);
    }
  };

  const installmentOptions = Array.from({ length: 11 }, (_, i) => ({
    label: `${i + 2} Taksit`,
    value: i + 2
  }));
  installmentOptions.push({ label: 'Taksitsiz', value: 1 });

  return (
    <View style={styles.container}>

      <Icon name='credit-card-fast' size={100} color="#3b5998" />
      <Text style={styles.title}>Hızlı Ödeme</Text>
      <View style={styles.form}>

        <View style={styles.inputContainer}>
          <Icon name="wallet" size={24} color="#3b5998" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tutar"
            value={amount}
            onChangeText={setAmount}
            keyboardType='numeric'
          />
          <TouchableOpacity style={styles.installmentButton} onPress={() => setInstallmentModalVisible(!installmentModalVisible)}>
            <Text style={styles.installmentText}>
              {selectedInstallment !== 1 && selectedInstallment != null ? `${selectedInstallment} Taksit` : 'Taksitsiz'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="account" size={24} color="#3b5998" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Kart Üzerindeki İsim"
            value={name}
            onChangeText={setName}
            keyboardType='default'
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="credit-card" size={24} color="#3b5998" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Kart No"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Icon name="calendar" size={24} color="#3b5998" style={styles.icon} />
            <TextInput
                 style={styles.input}
                 placeholder="AA/YY"
                 value={expiryDate}
                 onChangeText={handleExpiryDateChange}
                 keyboardType="numeric"
                 maxLength={5}
            />
          </View>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Icon name="lock" size={24} color="#3b5998" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Kart CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Ödeme</Text>
        </TouchableOpacity>

        <Modal
          visible={installmentModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Taksit Seçimi</Text>
              <FlatList
                data={installmentOptions}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalOption} onPress={() => handleInstallmentSelect(item.value)}>
                    <Text style={styles.modalOptionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setInstallmentModalVisible(!installmentModalVisible)}>
                <Text style={styles.modalCloseButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: "center"
  },
  form: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
    width: '100%',
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
    marginTop: 15
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    height: 'auto',
    marginTop: 20
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  installmentButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  installmentText: {
    fontSize: 16,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOptionText: {
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default PaymentForm;
