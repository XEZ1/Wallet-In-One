import { StyleSheet, Text, ScrollView,} from "react-native";
import { styles } from "reactnative/screens/All_Styles.style.js";
import { useTheme } from "reactnative/src/theme/ThemeProvider";

export default function NoWallets() {

  const {dark, colors, setScheme } = useTheme();

    return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        backgroundColor: colors.background,
      }}
      style={styles.container}
    >
      <Text style={[styles(dark, colors).text, {textAlign: "center"}]}>
        Wallet-In-One
        {'\n'}Amount: £0
        {'\n'}Connect your Wallets to See your Funds!
      </Text>
    </ScrollView>);
  }