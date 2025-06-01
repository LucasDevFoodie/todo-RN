
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { db, updateSchedule } from '@/firebase'
import { useFirestoreDocument } from '@/hooks/useFirestoreCollection';
import TextCustom from '@/components/ui/TextCustom'
type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
type Schedule = Record<Weekday, string[]>;

const _user = 'ani';
const weekDays: Weekday[] = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday',
];

export function ScheduleTab(user: string) {
  const [selectedDay, setSelectedDay] = useState<Weekday | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>()
  const [startTime, setStartTime] = useState<string>('')
  const [isEndTime, setIsEndTime] = useState<boolean>(false)
  const { data, loading, error } = useFirestoreDocument<Schedule>(db, "schedules", user)


  useEffect(
    () => {
      if (data) {
        console.log(loading)
        setSchedule(data);
      }
    }, [data])

  const handleReset = () => {
    const emptySchedule = weekDays.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {} as Schedule)
    updateSchedule(db, emptySchedule, user).then(() => setSchedule(emptySchedule))
  };

  const handleConfirm = async (date: Date) => {
    if (!selectedDay || !schedule) return;

    const formattedTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    if (isEndTime) {
      const newSchedule = { ...schedule, [selectedDay]: [...schedule[selectedDay], `${startTime} - ${formattedTime}`] }
      updateSchedule(db, newSchedule, user)
        .then(() => setSchedule(newSchedule))
        .finally(() => setIsEndTime(false));
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
    updateSchedule(db, updated, user)
      .then(() => setSchedule(updated))

  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextCustom style={styles.deleteInstruction}>Hold time to delete</TextCustom>
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
          <TextCustom style={styles.resetInstruction}>Reset</TextCustom>
        </TouchableOpacity>
        {weekDays.map((day: Weekday) => {
          return (
            <View style={styles.row} key={day}>
              <TextCustom style={styles.textDay}>{day}</TextCustom>
              <TouchableOpacity onPress={() => {
                setSelectedDay(day);
                setPickerVisible(true);
              }}>
                <TextCustom style={styles.addButton}>+ Add</TextCustom>
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
                      <TextCustom style={styles.timeCell}>{time}</TextCustom>
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  }
})