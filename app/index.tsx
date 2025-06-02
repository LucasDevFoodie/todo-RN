import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import { TextCustom } from "@/components/ui/TextCustom";
import { ScheduleTab } from "@/components/ui/ScheduleTab";
import Users from "@/assets/users";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.schedules}>
                <TextCustom style={styles.title}>{Users.User1}</TextCustom>
                <ScheduleTab user={Users.User1} isEditable={false}></ScheduleTab>
                <TextCustom style={styles.title}>{Users.User2}</TextCustom>
                <ScheduleTab user={Users.User2} isEditable={false}></ScheduleTab>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: 'auto',
        paddingTop: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        alignSelf: 'center'
    },
    schedules: {
        flex: 1,
        padding: 2
    }
})