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
  textBold: {
    fontWeight: "700",
    color: colors.text,
  },
  largeTextBold: {
    fontWeight: "800",
    fontSize: 40,
    color: colors.text,
  },
  backArrow: {
    fontWeight: "900",
    fontSize: 30,
    paddingVertical: 10,
    color: colors.primary,
  },
  smallButton: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: colors.primary,
  }
});