import { useState } from "react";
import {
  AsyncStorage,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "black",
    borderWidth: 1,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 10,
    margin: 15,
    alignItems: "center",
    height: 40,
  },
  submitButtonText: {
    color: "white",
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (email: string, password: string) => {
    if (email && password) {
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({ email, password })
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Email"
        placeholderTextColor="black"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Password"
        placeholderTextColor="black"
        autoCapitalize="none"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => login(email, password)}
      >
        <Text style={styles.submitButtonText}> Submit </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
