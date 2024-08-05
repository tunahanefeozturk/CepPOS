import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Platform, Button, ScrollView } from 'react-native';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmlakPosApiClient from '../services/EmlakPosApiClient';


const Operations = ({ navigation }) => {
  const [filter, setFilter] = useState('Son İşlemler');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [finishDatePickerVisible, setFinishDatePickerVisible] = useState(false);
  const [startFilterDate, setStartFilterDate] = useState(new Date());
  const [finishFilterDate, setFinishFilterDate] = useState(new Date());
  const [isDateFilterApplied, setIsDateFilterApplied] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const apiClient = new EmlakPosApiClient();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    await apiClient.clearApiParams();
    apiClient.setCallAction('transaction/list');
    try {
      const response = await apiClient.callApi();
      const data = response.data;
      console.log("Data: ",data);
      setTransactions(Object.values(data));
      await AsyncStorage.setItem('token',response.header.token);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("İşlemler yüklenirken bir hata oluştu.");
    }
  };

  const filteredTransactions = filter === 'Son İşlemler'
    ? transactions.slice(0, 10)
    : isDateFilterApplied
      ? transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date_full);
        if (transactionDate <= finishFilterDate && transactionDate >= startFilterDate) {
          return transactionDate;
        }
      })
      : transactions;

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startFilterDate;
    setStartDatePickerVisible(Platform.OS === 'ios');
    setStartFilterDate(currentDate);
    setIsDateFilterApplied(true);
    if (Platform.OS === 'android') {
      setStartDatePickerVisible(false);
    }
    console.log("Transactions: ", transactions);
  };

  const handleFinishDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || finishFilterDate;
    setFinishDatePickerVisible(Platform.OS === 'ios');
    setFinishFilterDate(currentDate);
    setIsDateFilterApplied(true);
    if (Platform.OS === 'android') {
      setFinishDatePickerVisible(false);
    }
  };

  const resetDateFilter = () => {
    setStartFilterDate(new Date());
    setFinishFilterDate(new Date());
    setIsDateFilterApplied(false);
  };

  const renderTransaction = ({ item }) => (
    <TouchableOpacity
      style={styles.transaction}
      onPress={() => {
        setSelectedTransaction(item);
        setModalVisible(true);
      }}
    >
      <Text>{item.date}</Text>
      <Text>{item.status}</Text>
      <Text>{item.amount} {item.currency}</Text>
      <Text style={styles.detailButton}>Detay</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                filter === 'Son İşlemler' ? styles.activeTabButton : styles.inactiveTabButton,
              ]}
              onPress={() => setFilter('Son İşlemler')}
            >
              <Text
                style={[
                  styles.tabText,
                  filter === 'Son İşlemler' ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                Son İşlemler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                filter === 'Tüm İşlemler' ? styles.activeTabButton : styles.inactiveTabButton,
              ]}
              onPress={() => setFilter('Tüm İşlemler')}
            >
              <Text
                style={[
                  styles.tabText,
                  filter === 'Tüm İşlemler' ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                Tüm İşlemler
              </Text>
            </TouchableOpacity>
          </View>
          {filter === 'Tüm İşlemler' && (
            <View style={styles.filterContainer}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.filterLabel}>Tarihe Göre Filtrele:</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setStartDatePickerVisible(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {startFilterDate ? startFilterDate.toDateString() : "Tarih seçin"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setFinishDatePickerVisible(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {finishFilterDate.toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetDateFilter}
                >
                  <Text style={styles.resetButtonText}>Filtreyi Sıfırla</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <FlatList
            style={styles.card}
            data={filteredTransactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
          />
          {startDatePickerVisible && (
            <DateTimePicker
              value={startFilterDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
          {finishDatePickerVisible && (
            <DateTimePicker
              value={finishFilterDate}
              mode="date"
              display="default"
              onChange={handleFinishDateChange}
            />
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.goBack()}>
            <Icon name="logout" size={30} color="#3b5998" />
            <Text style={styles.buttonText}>Geri - Ana Menü</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedTransaction && (
                  <>
                    <View style={styles.rowLine}>
                      <View style={styles.row}>
                        <Text style={styles.infoText}>Tutar: </Text>
                        <Text style={styles.contText}>{selectedTransaction.amount} {selectedTransaction.currency}</Text>
                      </View>
                    </View>
                    <View style={styles.rowLine}>
                      <View style={styles.row}>
                        <Text style={styles.infoText}>Durum: </Text>
                        <Text style={styles.contText}>{selectedTransaction.status}</Text>
                      </View>
                    </View>
                    <View style={styles.rowLine}>
                      <View style={styles.row}>
                        <Text style={styles.infoText}>Ödeme Yöntemi: </Text>
                        <Text style={styles.contText}>{selectedTransaction.link_method}</Text>
                      </View>
                    </View>
                    <View style={styles.rowLine}>
                      <View style={styles.row}>
                        <Text style={styles.infoText}>İşlem No: </Text>
                        <Text style={styles.contText}>{selectedTransaction.id}</Text>
                      </View>
                    </View>
                    <View style={styles.rowLine}>
                      <View style={styles.row}>
                        <Text style={styles.infoText}>Tarih: </Text>
                        <Text style={styles.contText}> {selectedTransaction.date_full}</Text>
                      </View>
                    </View>
                    <View style={styles.rowLine}>
                      <View style={styles.row}>
                        <Text style={styles.infoText}>POS: </Text>
                        <Text style={styles.contText}>{selectedTransaction.pos}</Text>
                      </View>
                    </View>

                    <Button title="Kapat" onPress={() => setModalVisible(false)} />
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    margin: 10,
    width: "100%",
    backgroundColor: '#e0ffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#3b5998',
  },
  inactiveTabButton: {
    backgroundColor: 'lightgray',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
  },
  inactiveTabText: {
    color: 'black',
  },
  filterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%'
  },
  filterLabel: {
    fontSize: 16,
    width: 100
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#3b5998',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  datePickerButtonText: {
    color: 'white',
    fontSize: 14,
  },
  resetButton: {
    padding: 10,
    backgroundColor: '#FF0047',
    borderRadius: 5,
    alignItems: 'center',

  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  detailButton: {
    color: '#3b5998',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
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
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#3b5998",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    width: 110
  },
  contText: {
    fontSize: 16,
    marginRight: 5,
    maxWidth: '70%',
    color: "#3b5998",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 5
  },
  row: {
    justifyContent: 'flex-start',
    alignItems: "center",
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    borderColor: "#3b5998",

    marginVertical: 5,
    height: 50,
    width: '97%',
  },
  rowLine: {
    borderRadius: 50,
    color: "#3b5998",
    backgroundColor: "#3b5998",
    alignItems: "center",
    marginVertical: 10,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  }
});

export default Operations;
