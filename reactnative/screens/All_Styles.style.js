import { StyleSheet } from 'react-native';

export const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
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
    color: colors.text
  },
  victoryLabelSmall: {
    fontSize: 17,
    fill: colors.text,
  },
  victoryLabelBig: {
    fontSize: 27,
    fontWeight: '700',
    fill: colors.text,
  },
  victoryLabelBar: {
    fontSize: 22,
    fontWeight: '900',
    fill: colors.text,
  }
});