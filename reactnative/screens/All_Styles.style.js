import { StyleSheet } from 'react-native';

export const styles = (dark, colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontWeight: '900',
    fontSize: 50,
    alignSelf: 'center',
    paddingVertical: 10,
    color: colors.text,
  },
  button: {
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:  30,
    color: colors.text,
  },
  text: {
    color: colors.text,
  },
});