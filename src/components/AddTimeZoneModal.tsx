import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SectionList,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addTimeZone, setAddModalVisible } from '../store/clockSlice';
import { loadTimeZones } from '../resources/timeZoneLoader';

// Simple ID generator function
const generateId = (cityName: string) => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${cityName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-${random}`;
};

function AddTimeZoneModal(): JSX.Element {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const timeZones = useMemo(() => loadTimeZones(), []);

  const filteredTimeZones = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return timeZones.filter(tz =>
      tz.cityName.toLowerCase().includes(query) ||
      tz.timeZone.toLowerCase().includes(query) ||
      tz.country.toLowerCase().includes(query)
    );
  }, [searchQuery, timeZones]);

  const groupedTimeZones = useMemo(() => {
    const grouped = filteredTimeZones.reduce((acc, tz) => {
      const continent = tz.timeZone.split('/')[0];
      if (!acc[continent]) {
        acc[continent] = [];
      }
      acc[continent].push(tz);
      return acc;
    }, {} as Record<string, typeof timeZones>);

    return Object.entries(grouped)
      .map(([continent, zones]) => ({
        title: continent,
        data: zones.sort((a, b) => a.cityName.localeCompare(b.cityName))
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredTimeZones]);

  const handleSelectTimeZone = (timeZone: typeof timeZones[0]) => {
    dispatch(
      addTimeZone({
        ...timeZone,
        id: generateId(timeZone.cityName)
      })
    );
    dispatch(setAddModalVisible(false));
  };

  const renderItem = ({ item }: { item: typeof timeZones[0] }) => (
    <TouchableOpacity
      style={styles.timeZoneItem}
      onPress={() => handleSelectTimeZone(item)}
    >
      <View style={styles.timeZoneItemContent}>
        <View style={styles.cityInfo}>
          <Text style={styles.cityName}>{item.cityName}</Text>
          <Text style={styles.countryName}>{item.country}</Text>
        </View>
        <Text style={styles.timeZoneName}>
          {`UTC${item.offset >= 0 ? '+' : ''}${item.offset}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

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
            placeholder="Search for a city, country..."
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <SectionList
            sections={groupedTimeZones}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => `${item.cityName}-${item.timeZone}-${item.country}`}
            stickySectionHeadersEnabled={true}
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
  timeZoneItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 17,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
    color: '#666666',
  },
  timeZoneName: {
    fontSize: 15,
    color: '#666666',
  },
  sectionHeader: {
    backgroundColor: '#1C1C1E',
    padding: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    color: '#666666',
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default AddTimeZoneModal;