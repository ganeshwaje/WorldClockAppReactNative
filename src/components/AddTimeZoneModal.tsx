import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addTimeZone, setAddModalVisible } from '../store/clockSlice';

const timeZonesList = [
  { cityName: 'London', timeZone: 'Europe/London', offset: 1 },
  { cityName: 'Paris', timeZone: 'Europe/Paris', offset: 2 },
  { cityName: 'Tokyo', timeZone: 'Asia/Tokyo', offset: 9 },
  { cityName: 'Sydney', timeZone: 'Australia/Sydney', offset: 10 },
];

function AddTimeZoneModal(): JSX.Element {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimeZones = timeZonesList.filter(tz =>
    tz.cityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTimeZone = (timeZone: typeof timeZonesList[0]) => {
    dispatch(
      addTimeZone({
        id: Date.now().toString(),
        ...timeZone,
      })
    );
    dispatch(setAddModalVisible(false));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => dispatch(setAddModalVisible(false))}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose a City</Text>
            <TouchableOpacity
              onPress={() => dispatch(setAddModalVisible(false))}
            >
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a city..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            data={filteredTimeZones}
            keyExtractor={(item) => item.timeZone}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.timeZoneItem}
                onPress={() => handleSelectTimeZone(item)}
              >
                <Text style={styles.cityName}>{item.cityName}</Text>
                <Text style={styles.timeZoneName}>{item.timeZone}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000000',
    marginTop: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  searchInput: {
    margin: 16,
    padding: 8,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 17,
  },
  timeZoneItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  cityName: {
    fontSize: 17,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timeZoneName: {
    fontSize: 15,
    color: '#666666',
  },
});

export default AddTimeZoneModal;