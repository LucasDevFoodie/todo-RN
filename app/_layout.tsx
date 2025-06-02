import { IconSymbol } from "@/components/ui/IconSymbol";
import { Tabs } from "expo-router";
import Users from '@/assets/users';

export default function RootLayout() {

  
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
      <Tabs.Screen name="index" options={{
        headerShown: false,
        title: "HOME",
        tabBarIcon: ({color}) => <IconSymbol size={20} name="house.fill" color={color} />
      }}/>
      <Tabs.Screen name="ani" options={{
        title: "ANI",
        headerShadowVisible: true,
        headerTitleAlign: 'center',
        headerTintColor: '#FF9B45',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera" color={color} />,
      }}/>
      <Tabs.Screen name="lucas" options={{
        title: "LUCAS",
        headerShadowVisible: true,
        headerTitleAlign: 'center',
        headerTintColor: '#27548A',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />,
      }}/>
      <Tabs.Screen name="+not-found" options={{
        href: null,
      }}/>
    </Tabs>
  )
}
