import { Text, TextProps } from 'react-native';

export default function TextCustom(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'RobotoRegular' }, props.style]} />;
}