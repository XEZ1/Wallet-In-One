import React from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ConditionalModal({ headerText, bodyText, visible, onEvent, onClose, continueButtonName, cancelButtonName }) {

    let closeButtonLabel = 'No'
    let continueButtonLabel = 'Yes'

    let buttonColor = '#f44336'
    
    if(continueButtonName){
        continueButtonLabel = continueButtonName;
    }

    if(cancelButtonName){
        closeButtonLabel = cancelButtonName;
    }

    if( continueButtonName && cancelButtonName){
        buttonColor = '#1E90FF';
    }


  return (
    <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                onClose();
            }}>
            <View style={styles.modalView}>
                <Text style={styles.headerText}>{headerText}</Text>
                <View style={styles.divider} />

                <Text style={styles.bodyText}>{bodyText}</Text>
                <View style={styles.divider} />

                <View style={styles.buttonsContainer}>
                    <Pressable style={[styles.button, { backgroundColor: buttonColor }]} onPress={onEvent}>
                        <Text style={styles.buttonText}>{continueButtonLabel}</Text>
                    </Pressable>

                    <Pressable style={[styles.button, { backgroundColor: '#1E90FF' }]} onPress={onClose}>
                        <Text style={styles.buttonText}>{closeButtonLabel}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginVertical: '20%',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 15,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
