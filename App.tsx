// App.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { format, toZonedTime } from 'date-fns-tz';

const initialTimeZones: TimeZoneItem[] = [
  {
    id: '1',
    cityName: 'San Francisco',
    timeZone: 'America/Los_Angeles',
    offset: -7,
  },
  {
    id: '2',
    cityName: 'New York',
    timeZone: 'America/New_York',
    offset: -4,
  },
  {
    id: '3',
    cityName: 'London',
    timeZone: 'Europe/London',
    offset: 1,
  },
  {
    id: '4',
    cityName: 'Tokyo',
    timeZone: 'Asia/Tokyo',
    offset: 9,
  },
];

const WorldClockApp: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timeZones] = useState<TimeZoneItem[]>(initialTimeZones);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderItem = ({ item }: { item: TimeZoneItem }) => {
    const zonedDate = toZonedTime(currentTime, item.timeZone);
    
    const timeInZone = format(zonedDate, 'HH:mm:ss', {
      timeZone: item.timeZone,
    });

    const today = format(zonedDate, 'EEE', {
      timeZone: item.timeZone,
    });

    const isYesterday = item.offset < 0 && new Date().getUTCHours() + item.offset < 0;
    const isTomorrow = item.offset > 0 && new Date().getUTCHours() + item.offset >= 24;
    const dayLabel = isYesterday ? 'Yesterday' : isTomorrow ? 'Tomorrow' : 'Today';

    return (
      <TouchableOpacity style={styles.itemContainer}>
        <View style={styles.leftContent}>
          <Text style={styles.cityName}>{item.cityName}</Text>
          <Text style={styles.dayInfo}>{`${dayLabel}, ${today}`}</Text>
        </View>
        <Text style={styles.time}>{timeInZone}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World Clock</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={timeZones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    fontSize: 28,
    color: '#007AFF',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContent: {
    flex: 1,
  },
  cityName: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dayInfo: {
    fontSize: 15,
    color: '#666666',
  },
  time: {
    fontSize: 48,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#333333',
    marginLeft: 16,
  },
});

export default WorldClockApp;