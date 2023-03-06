import { StyleSheet, Text, ScrollView,} from "react-native";
import { styles } from "reactnative/screens/All_Styles.style.js";

export default function NoWallets(colors) {
    return (<ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        backgroundColor: colors.background,
      }}
      style={styles.container}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Wallet-In-One
      </Text>
      <Text style={[styles.amountText, { color: colors.text }]}>
        Amount: £0
      </Text>
      <Text style={[styles.amountText, { color: colors.text }]}>
        Connect your Wallets to See your Funds!
      </Text>
    </ScrollView>);
  }