import { Text, TextProps } from 'react-native';

export function TextCustom(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'RobotoRegular' }, props.style]} />;
}