import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { format, toZonedTime } from 'date-fns-tz';
import { RootState } from '../store';
import { removeTimeZone, setAddModalVisible } from '../store/clockSlice';
import AddTimeZoneModal from '../components/AddTimeZoneModal';
import type { TimeZoneItem } from '../store/clockSlice';
import { Swipeable } from 'react-native-gesture-handler';

function WorldClockScreen(): JSX.Element {
  const dispatch = useDispatch();
  const { timeZones, isAddModalVisible } = useSelector((state: RootState) => state.clock);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Keep track of currently open swipeable
  const swipeableRef = useRef<Swipeable | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddPress = () => {
    dispatch(setAddModalVisible(true));
  };

  const handleRemoveTimeZone = (id: string, cityName: string) => {
    Alert.alert(
      'Remove Time Zone',
      `Are you sure you want to remove ${cityName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeTimeZone(id));
            swipeableRef.current?.close();
          },
        },
      ]
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>,
    item: TimeZoneItem
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [64, 0],
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleRemoveTimeZone(item.id, item.cityName)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({ item }: { item: TimeZoneItem }) => {
    const zonedDate = toZonedTime(currentTime, item.timeZone);
    
    const timeInZone = format(zonedDate, 'HH:mm:ss', {
      timeZone: item.timeZone,
    });

    const today = format(zonedDate, 'EEE', {
      timeZone: item.timeZone,
    });

    const hourDiff = item.offset;
    const isYesterday = hourDiff < 0 && new Date().getUTCHours() + hourDiff < 0;
    const isTomorrow = hourDiff > 0 && new Date().getUTCHours() + hourDiff >= 24;
    const dayLabel = isYesterday ? 'Yesterday' : isTomorrow ? 'Tomorrow' : 'Today';

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        rightThreshold={40}
      >
        <View style={styles.itemContainer}>
          <View style={styles.leftContent}>
            <Text style={styles.cityName}>{item.cityName}</Text>
            <Text style={styles.dayInfo}>{`${dayLabel}, ${today}`}</Text>
          </View>
          <Text style={styles.time}>{timeInZone}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>World Clock</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddPress}
        >
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
      {isAddModalVisible && <AddTimeZoneModal />}
    </SafeAreaView>
  );
}

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
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000000',
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
  deleteAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    backgroundColor: '#FF3B30',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 12,
  },
});

export default WorldClockScreen;