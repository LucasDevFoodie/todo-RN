import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Select an user from the tabs below</Text>
            <View style={styles.icons}>
                <IconSymbol size={50} name="arrow.down" color={'green'} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
    },
    icons: {
        justifyContent: 'flex-end'
    }
})