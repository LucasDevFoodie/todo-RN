
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { db } from '@/firebase'

type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type Schedule = Record<Weekday, string[]>;

const weekDays: Weekday[] = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const scheduleHardcoded: Schedule = {
  'Monday': ['06:00 - 13:00'],
  'Tuesday': [],
  'Wednesday': [],
  'Thursday': [],
  'Friday': ['06:00 - 13:00', '18:00 - 22:00'],
  'Saturday': ['06:00 - 13:00'],
  'Sunday': ['06:0 - 13:00'],
}

export default function Ani() {
  const [selectedDay, setSelectedDay] = useState<Weekday | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(scheduleHardcoded)
  const [startTime, setStartTime] = useState<string>('')
  const [isEndTime, setIsEndTime] = useState<boolean>(false)

  useEffect(
    () => {
// alert('carlos')
    }, [])

const handleReset = () => {
  const emptySchedule = weekDays.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {} as Schedule)
  setSchedule(emptySchedule);
};

  const handleConfirm = async (date: Date) => {
    if (!selectedDay || !schedule) return;

    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if(isEndTime) {
      setSchedule({ ...schedule, [selectedDay]: [...schedule[selectedDay], `${startTime} - ${formattedTime}`] })
      setIsEndTime(false);
    }
    else {
      setStartTime(formattedTime);
      setIsEndTime(true);
      setTimeout(() => setPickerVisible(true), 100);
    }

    setPickerVisible(false);
  }

  const handleDelete = (index: number, day: Weekday) => {
    if (!schedule) return;

    const updated: Schedule = {
      ...schedule,
      [day]: schedule[day].filter((_, i) => i !== index),
    };

    setSchedule(updated);
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.deleteInstruction}>Hold time to delete</Text>
         <TouchableOpacity onPress={
                      () => {
                        Alert.alert('Reset', `Every record will be deleted`, [
                          {
                            text: 'OK',
                            onPress: () => handleReset(),
                            style: 'default'
                          },
                          {
                            text: 'CANCEL',
                            style: 'cancel'
                          }
                        ])
                      }
                    }>
                    <Text style={styles.resetInstruction}>Reset</Text>
                    </TouchableOpacity>
        {weekDays.map((day: Weekday) => {
          return (
            <View style={styles.row} key={day}>
              <Text style={styles.textDay}>{day}</Text>
              <TouchableOpacity onPress={() => {
                setSelectedDay(day);
                setPickerVisible(true);
              }}>
                <Text style={styles.addButton}>+ Add</Text>
              </TouchableOpacity>
              <View style={styles.timeColumn}>
                {schedule && schedule[day]?.map((time, index) => {
                  return (
                    <TouchableOpacity key={day + time + index} onLongPress={
                      () => {
                        Alert.alert('Delete', `${time} from ${day} will be deleted.`, [
                          {
                            text: 'OK',
                            onPress: () => handleDelete(index, day),
                            style: 'default'
                          },
                          {
                            text: 'CANCEL',
                            style: 'cancel'
                          }
                        ])
                      }
                    }>
                      <Text style={styles.timeCell}>{time}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          );
        })}
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode='time'
          onConfirm={handleConfirm}
          onCancel={() => {
            setPickerVisible(false);
            setIsEndTime(false);
          }}
          is24Hour={true}
          display={Platform.OS == 'ios' ? 'spinner' : 'clock'}
        ></DateTimePickerModal>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 4,
    padding: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'green'
  },
  row: {
    flex: 1,
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    borderBottomLeftRadius: 8,
    borderColor: 'green'
  },
  textDay: {
    fontWeight: 'bold',
    fontSize: 18
  },
  timeColumn: {
    flex: 1,
    gap: 4,
    alignItems: 'flex-end',
  },
  timeCell: {
    fontSize: 18
  },
  addButton: {
    color: '#007bff'
  },
  deleteInstruction: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  resetInstruction: {
    flex: 1,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'red'
  }
})