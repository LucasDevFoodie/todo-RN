import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";

export default function RootLayout() {

  
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerShown: false,
        title: "HOME",
        href: null,
        tabBarIcon: ({color}) => <IconSymbol size={20} name="calendar.and.person" color={color} />
      }}/>
      <Tabs.Screen name="ani" options={{
        title: "ANI",
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera" color={color} />,
      }}/>
      <Tabs.Screen name="lucas" options={{
        title: "LUCAS",
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
      }}/>
      <Tabs.Screen name="+not-found" options={{
        href: null,
      }}/>
    </Tabs>
  )
}
