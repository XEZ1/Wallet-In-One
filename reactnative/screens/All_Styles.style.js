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
  },
  bankingInput:{
    height: 40,
    width: '100%',
    borderWidth: 0.5,
    padding: 10,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    color: colors.text,
    backgroundColor: colors.background
  },
  bankingContainer: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: dark ? colors.background : '#ddd',
    overflow: 'hidden',
    backgroundColor: colors.background
  },
  bankingItem:{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  bankingImage:{
      width: 50, 
      height: 50,
      marginRight: 10,
      resizeMode: 'contain',
  },
});