import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, FlatList, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from '@react-navigation/stack';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import PosCart from '../services/posscreen';

const Stack = createStackNavigator();

class PosCartItem {
  constructor(name, price, quantity = 1) {
    this.name = name;
    this.price = parseFloat(price).toFixed(2);
    this.quantity = parseInt(quantity);
  }
}

function Settings({ route, navigation }) {
  const [mainProductName, setMainProductName] = useState(route.params.mainProductName);
  const [kdv, setKdv] = useState(route.params.kdv);
  const [speedProducts, setSpeedProducts] = useState(route.params.speedProducts);

  useEffect(() => {
    navigation.setParams({
      mainProductName,
      kdv,
      speedProducts,
    });
  }, [mainProductName, kdv, speedProducts]);

  const handleSave = () => {
    navigation.navigate('Orders', {
      mainProductName,
      kdv,
      speedProducts,
    });
    Alert.alert('Kaydedildi!', 'Ayarlar başarıyla kaydedildi.');
  };

  const handleSpeedProductChange = (index, field, value) => {
    const updatedProducts = [...speedProducts];
    updatedProducts[index][field] = value;
    setSpeedProducts(updatedProducts);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ana Ürün Adı</Text>
      <View style={[styles.inputContainer, styles.sameWidth]}>
        <MIcon name="pencil-box-outline" size={24} color="#3b5998" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ürün"
          value={mainProductName}
          onChangeText={setMainProductName}
        />
      </View>

      <Text style={styles.label}>KDV oranı</Text>
      <View style={[styles.inputContainer, styles.sameWidth]}>
        <Icon name="percent" size={24} color="#3b5998" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="%"
          value={kdv}
          onChangeText={setKdv}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.label}>Hızlı Ürünler</Text>
      <View style={[styles.table, styles.sameWidth]}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Ürün Adı</Text>
          <Text style={styles.tableHeaderText}>Birim Fiyatı</Text>
        </View>
        <FlatList
          data={speedProducts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.tableRow}>
              <TextInput
                style={styles.tableInput}
                placeholder="Ürün Adı"
                value={item.name}
                onChangeText={(text) => handleSpeedProductChange(index, 'name', text)}
              />
              <TextInput
                style={styles.tableInput}
                placeholder="Birim Fiyatı"
                keyboardType="numeric"
                value={item.price.toString()}
                onChangeText={(text) => handleSpeedProductChange(index, 'price', text)}
              />
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={[styles.paymentButton, styles.sameWidth]} onPress={handleSave}>
        <Text style={styles.paymentButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const Orders = ({ route, navigation }) => {
  const [installmentModalVisible, setInstallmentModalVisible] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [productList, setProductList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isPressedKDV, setisPressedKDV] = useState(false);
  const paramCart = new PosCart();
  const { mainProductName, kdv, speedProducts } = route.params || {
    mainProductName: 'Ürün',
    kdv: '18',
    speedProducts: [
      { name: 'Ürün A', price: '50.00' },
      { name: 'Ürün B', price: '100.00' },
      { name: 'Hizmet C', price: '200.00' },
      { name: 'Hizmet D', price: '500.00' },
    ],
  };

  const handleInstallmentSelect = (value) => {
    setSelectedInstallment(value);
    setInstallmentModalVisible(!installmentModalVisible);
  };

  const installmentOptions = Array.from({ length: 11 }, (_, i) => ({
    label: `${i + 2} Taksit`,
    value: i + 2,
  }));
  installmentOptions.push({ label: 'Taksitsiz', value: 1 });

  const handlePress = (value) => {
    if (value === '+') {
      if (selectedProductId) {
        handleIncreaseQuantity(selectedProductId);
      } else if (input != 0) {
        handleAddProduct();
      }
      calculateKDV(value, "+")
      setInput('');
    } else if (value === 'sil') {
      handleRemoveSelectedProduct();
    }
    else if (value === 'kdv') {
      addKDV({
        name: "KDV",
        price: ((kdv * parseFloat(result || '0')) / 100.0).toFixed(2),
        quantity: 1,
      });
    }
    else if (value === 'A') {
      addSpeedProduct(speedProducts[0]);
      calculateKDV(value, "+")
    }
    else if (value === 'B') {
      addSpeedProduct(speedProducts[1]);
      calculateKDV(value, "+")
    }
    else if (value === 'C') {
      addSpeedProduct(speedProducts[2]);
      calculateKDV(value, "+")
    }
    else if (value === 'D') {
      addSpeedProduct(speedProducts[3]);
      calculateKDV(value, "+")
    }
    else {
      setInput((prevInput) => prevInput + value);
    }
  };

  const updateResult = () => {
    const total = productList.reduce((sum, product) => sum + product.price * product.quantity, 0);
    setResult(total.toFixed(2));
  };

  useEffect(() => {
    updateResult();
  }, [productList]);

  function addSpeedProduct(value) {
    const existingProductIndex = productList.findIndex(
      (product) => product.name === value.name && product.price === value.price
    );

    if (existingProductIndex !== -1) {
      const updatedProductList = productList.map((product, index) =>
        index === existingProductIndex ? { ...product, quantity: product.quantity + 1 } : product
      );
      setProductList(updatedProductList);
    } else {
      const newProduct = {
        id: productList.length + 1,
        name: value.name,
        price: value.price,
        quantity: 1,
      };
      setProductList((prevList) => [...prevList, newProduct]);
    }
  }

  function addKDV(value) {
    const existingKDVIndex = productList.findIndex(
      (product) => product.name === value.name
    );

    if (existingKDVIndex !== -1) {
      setisPressedKDV(false);
      const kdvProduct = productList.find((product) => product.name === 'KDV');

      if (kdvProduct) {
        const updatedProductList = productList.filter((product) => product.id !== kdvProduct.id);
        setProductList(updatedProductList);
      }
    } else {
      const totalWithoutKDV = productList.reduce(
        (sum, product) => (product.name === 'KDV' ? sum : sum + product.price * product.quantity),
        0
      );
      const newProduct = {
        id: productList.length + 1,
        name: value.name,
        price: ((kdv * totalWithoutKDV) / 100.0).toFixed(2),
        quantity: 1,
      };
      setProductList((prevList) => [...prevList, newProduct]);
      setisPressedKDV(true);
    }
  }


  function calculateKDV(value, wd) {

    const existingKDVIndex = productList.findIndex(
      (product) => product.name === "KDV"
    );
    if (existingKDVIndex !== -1) {
      let addval;
      if (value === 'A') {
        addval = speedProducts[0].price
      }
      else if (value === 'B') {
        addval = speedProducts[1].price
      }
      else if (value === 'C') {
        addval = speedProducts[2].price
      }
      else if (value === 'D') {
        addval = speedProducts[3].price
      }
      else {
        addval = input
      }
      if (wd === '+') {

        resultWithoutKDV = productList.reduce((sum, product) => sum + product.price * product.quantity, 0) - productList[existingKDVIndex].price + parseFloat(addval)
      }
      else if (wd === '-') {
        addval = value
        resultWithoutKDV = productList.reduce((sum, product) => sum + product.price * product.quantity, 0) - productList[existingKDVIndex].price - parseFloat(addval)
      }

      productList[existingKDVIndex].price = ((kdv * resultWithoutKDV) / 100.0).toFixed(2);

    }

  }


  const handleAddProduct = () => {

    const existingProductIndex = productList.findIndex(
      (product) => product.name === mainProductName && product.price === parseFloat(input)
    );

    if (existingProductIndex !== -1) {
      const updatedProductList = productList.map((product, index) =>
        index === existingProductIndex ? { ...product, quantity: product.quantity + 1 } : product
      );
      setProductList(updatedProductList);
    } else {
      const newProduct = {
        id: productList.length + 1,
        name: mainProductName,
        price: parseFloat(input),
        quantity: 1,
      };
      setProductList((prevList) => [...prevList, newProduct]);
    }

    setInput('');

  };

  const handleIncreaseQuantity = (productId) => {
    const updatedProductList = productList.map((product) =>
      product.id === productId ? { ...product, quantity: product.quantity + 1 } : product
    );
    setProductList(updatedProductList);
    setSelectedProductId(null);
  };

  const handleRemoveSelectedProduct = () => {
    if (selectedProductId) {

      const index = productList.findIndex((product) => product.id === selectedProductId);

      calculateKDV(productList[index].price, "-")
      const updatedProductList = productList.filter((product) => product.id !== selectedProductId);
      setProductList(updatedProductList);

      setSelectedProductId(null);
    } else {
      setInput('');
      setResult('');
      setProductList([]);
      setisPressedKDV(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductId((prevSelected) => (prevSelected === productId ? null : productId));
  };

  const handlePayment = () => {
    if (parseFloat(result) < 5) {
      Alert.alert('', 'Tutar minumum 5TL olmalıdır.')
    }
    else if (500000.00 < parseFloat(result)) {
      Alert.alert('', 'Tutar maximum 500,000TL olmalıdır.')
    }
    else {
      paramCart.total_amount = result;
      paramCart.tax_rate = isPressedKDV ? kdv/100 : "0.00";
      paramCart.installment = selectedInstallment ? selectedInstallment : 1;
      for (let index = 0; index < productList.length; index++) {
        const element = productList[index];
        paramCart.add(new PosCartItem(element.name, element.price, element.quantity));
      }
      console.log("orders cart: ", paramCart);
      navigation.navigate('Pay', {paramCart,amo:result});
    }

  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={{ marginTop: 10 }}>
        <View style={styles.totalContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerColumn}>Adet</Text>
            <Text style={styles.headerColumn}>Ürün</Text>
            <Text style={styles.headerColumn}>Fiyat</Text>
          </View>
          <FlatList
            data={productList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.productItem,
                  item.id === selectedProductId && styles.selectedProductItem,
                ]}
                onPress={() => handleSelectProduct(item.id)}
              >
                <Text style={styles.productText}>{item.quantity}</Text>
                <Text style={styles.productText}>{item.name}</Text>
                <Text style={styles.productText}>{item.price} TL</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.resultBox}>
            <View padding={10} width={200} height={70} style={styles.amountBox} >
              <Text style={styles.totalText}>Tutar: </Text>
              <ScrollView>
                <Text style={styles.totalText}>{input || '0'}₺</Text>
              </ScrollView>

            </View>
            <View padding={10} alignItems={"center"} width={200} height={70} style={styles.amountBox} >
              <Text style={styles.totalText}>Toplam: </Text>
              <ScrollView>
                <Text style={styles.totalText}>{result || '0'}₺</Text>
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handlePress('sil')}>
              <Text style={styles.deleteButtonText}>SİL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings', { mainProductName, kdv, speedProducts })}>
              <Icon name="gear" size={24} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('1')}>
              <Text style={styles.buttonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('2')}>
              <Text style={styles.buttonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('3')}>
              <Text style={styles.buttonText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.productButton]} onPress={() => handlePress('A')}>
              <Text style={styles.productButtonText}>{speedProducts[0].name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.productButton]} onPress={() => handlePress('B')}>
              <Text style={styles.productButtonText}>{speedProducts[1].name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('4')}>
              <Text style={styles.buttonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('5')}>
              <Text style={styles.buttonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('6')}>
              <Text style={styles.buttonText}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.button, styles.productButton]} onPress={() => handlePress('C')}>
              <Text style={styles.productButtonText}>{speedProducts[2].name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.productButton]} onPress={() => handlePress('D')}>
              <Text style={styles.productButtonText}>{speedProducts[3].name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('7')}>
              <Text style={styles.buttonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('8')}>
              <Text style={styles.buttonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('9')}>
              <Text style={styles.buttonText}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={isPressedKDV ? styles.pressedKDV : styles.button} onPress={() => handlePress('kdv')}>
              <Text style={styles.buttonText}>+ KDV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={selectedInstallment ? styles.pressedKDV : styles.button} onPress={() => setInstallmentModalVisible(!installmentModalVisible)}>
              <Text style={styles.productButtonText}>
                {selectedInstallment !== 1 && selectedInstallment != null ? `${selectedInstallment} Taksit` : 'Taksitsiz'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('.')}>
              <Icon name="circle" size={10} color="#3b5998" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('0')}>
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => handlePress('+')}>
              <Icon name="plus" size={24} color="white" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.paymentButton, styles.sameWidth]} onPress={handlePayment}>
            <Text style={styles.paymentButtonText}>Ödeme</Text>
          </TouchableOpacity>
        </View>

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
    </SafeAreaView>
  );
};
function APP() {
  const defaultSettings = {
    mainProductName: 'Ürün',
    kdv: '18',
    speedProducts: [
      { name: 'Ürün A', price: '50.00' },
      { name: 'Ürün B', price: '100.00' },
      { name: 'Hizmet C', price: '200.00' },
      { name: 'Hizmet D', price: '500.00' },
    ],
  };

  return (
    <Stack.Navigator initialRouteName="Orders">
      <Stack.Screen name="Orders" component={Orders} initialParams={defaultSettings} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',

  },

  totalContainer: {
    backgroundColor: '#F5FCFF',
    padding: 10,
    borderRadius: 10,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '50%',
    borderRadius: 6,
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  resultBox: {
    width: '100%',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderBlockColor: "#ccc"
  },
  amountBox: {
    width: 150,
    height: 70,
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
  icon: {
    marginHorizontal: 10,
  },
  totalText: {
    color: "#3b5998",
    fontSize: 18,
    textAlign: 'center',
  },
  gridContainer: {
    margin: 10,
    color: '#F5FCFF',

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  pressedKDV: {
    flex: 1,
    backgroundColor: '#5cb85c',
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#3b5998',
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'white',
  },
  productButtonText: {
    fontSize: 10,
    color: '#3b5998',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    color: 'white',
  },
  productButton: {
    backgroundColor: '#ffeb3b',
  },
  addButton: {
    backgroundColor: '#5cb85c',
  },
  paymentButton: {
    backgroundColor: '#5cb85c',
    padding: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 18,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
  },
  headerColumn: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3b5998',
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3b5998",
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedProductItem: {
    backgroundColor: '#d9534f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  productText: {
    fontSize: 16,
    color: "#3b5998",
  },
  label: {
    fontSize: 20,
    marginBottom: 5,
    marginTop: 5,
    color: '#3b5998',
    justifyContent: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 15,
  },
  input: {
    color: '#3b5998',
    padding: 5,
    backgroundColor: '#fff',
    width: '80%',
    fontSize: 16
  },
  tableInput: {
    borderColor: '#ccc',
    color: '#3b5998',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '48%',
    marginBottom: 5,
  },
  table: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    height: 300,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    backgroundColor: '#3b5998'
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: 'white',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sameWidth: {
    width: '95%', // Table genişliği ile aynı genişlikte olacak şekilde ayarlanabilir
    marginHorizontal: '2.5%' // Ortalanmış görünüm
  },

});

export default APP;