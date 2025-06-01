import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCallback } from "react";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import TextCustom from "@/components/ui/TextCustom";

export default function Home() {
   const [fontsLoaded] = useFonts({
    RobotoRegular: require('@/assets/fonts/Roboto-Regular.ttf'),
  });

    return (
        <SafeAreaView style={styles.container}>
            <TextCustom style={styles.title}>Select an user from the tabs below</TextCustom>
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
        alignItems: 'center',
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