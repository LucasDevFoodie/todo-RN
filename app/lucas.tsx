import { db } from '@/firebase';
import { format, subWeeks } from 'date-fns';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type Schedule = Record<Weekday, string[]>;

const weekDays: Weekday[] = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday',
];

// Get week ID like: week_2025_21
const getLastWeekId = (): string => {
  const lastWeek = subWeeks(new Date(), 1);
  const year = format(lastWeek, 'yyyy');
  const week = format(lastWeek, 'I'); // ISO week number
  return `week_${year}_${week}`;
};

export default function lucas() {
  const userId = 'LUCAS';
  const weekId = getLastWeekId();
  const [schedule, setSchedule] = useState<Schedule>({} as Schedule);
  const [selectedDay, setSelectedDay] = useState<Weekday | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const scheduleDocRef = doc(db, 'schedules', userId, 'weeks', weekId);

  // Load from Firestore
  useEffect(() => {
    const fetchSchedule = async () => {
      const snap = await getDoc(scheduleDocRef);
      if (snap.exists()) {
        setSchedule(snap.data() as Schedule);
      } else {
        const blank: Schedule = weekDays.reduce((acc, day) => {
          acc[day] = [];
          return acc;
        }, {} as Schedule);
        await setDoc(scheduleDocRef, blank);
        setSchedule(blank);
      }
    };

    fetchSchedule();
  }, [userId, weekId]);

  const handleConfirm = async (date: Date) => {
    if (!selectedDay) return;

    const formatted = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated: Schedule = {
      ...schedule,
      [selectedDay]: [...schedule[selectedDay], formatted],
    };

    setSchedule(updated);
    setPickerVisible(false);
    await updateDoc(scheduleDocRef, { [selectedDay]: updated[selectedDay] });
  };

  const removeTime = async (day: Weekday, index: number) => {
    const updated: Schedule = {
      ...schedule,
      [day]: schedule[day].filter((_, i) => i !== index),
    };

    setSchedule(updated);
    await updateDoc(scheduleDocRef, { [day]: updated[day] });
  };

  const renderDay = (day: Weekday) => (
    <View style={styles.dayRow} key={day}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{day}</Text>
        <TouchableOpacity onPress={() => {
          setSelectedDay(day);
          setPickerVisible(true);
        }}>
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {schedule[day]?.map((time, index) => (
        <View style={styles.timeRow} key={index}>
          <Text style={styles.timeText}>{time}</Text>
          <TouchableOpacity onPress={() => removeTime(day, index)}>
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {weekDays.map(renderDay)}

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        is24Hour={false}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  dayRow: { marginBottom: 16 },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 6,
  },
  dayText: { fontWeight: 'bold', fontSize: 16 },
  addButton: { color: '#007bff' },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  timeText: { fontSize: 15 },
  deleteText: { color: '#ff4444' },
});

