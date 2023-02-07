import React, { useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function WalletModal(props) {
  const [address, setAddress] = useState("");

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={props.visible}
    >
      <View style={{ paddingTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Pressable onPress={() => props.setVisible(false)}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>Connect Wallet</Text>
            <Text style={{ alignSelf: "center" }}>(Bitcoin Wallet)</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={(text) => setAddress(text)}
          placeholder="Wallet Address"
        />

        <Button
          title="Connect Bitcoin Wallet"
          onPress={() =>
            props.connect(address).then(() => props.setVisible(false))
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "900",
    fontSize: 40,
    alignSelf: "center",
  },
  backArrow: {
    fontWeight: "900",
    fontSize: 40,
    position: "absolute",
    paddingLeft: 10,
  },
  input: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    margin: 30,
    padding: 10,
  },
});
