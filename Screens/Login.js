import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";

import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://192.168.100.73/showtime/api/";

export default function Login({ navigation, route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsernameHandler = (username) => {
    setUsername(username);
  };

  const onChangePasswordHandler = (password) => {
    setPassword(password);
  };

  const onSubmitFormHandler = async (event) => {
    if (!username.trim() || !password.trim()) {
      alert("Input your Username and Password!");
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}login`, {
        username,
        password,
      });
      if (response.status === 200) {
        // console.log(response.data.payload);
        alert("Login Successful!");

        storeData = async () => {
          try {
            await AsyncStorage.setItem("bio", response.data.payload.bio);
            await AsyncStorage.setItem(
              "user_id",
              JSON.stringify(response.data.payload.user_id)
            );
            await AsyncStorage.setItem(
              "username",
              response.data.payload.username
            );
            await AsyncStorage.setItem("token", response.data.payload.token);
            await AsyncStorage.setItem(
              "profile_pic",
              response.data.payload.profile_pic
            );
          } catch (error) {
            // Error saving data
          }
        };
        storeData();
        return navigation.navigate("HomeBottomTab");
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("Invalid Username or Email!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <SafeAreaView style={{ height: 150 }}></SafeAreaView> */}
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Image style={styles.font} source={require("../assets/logofont.png")} />
      <SafeAreaView style={styles.SectionStyle}>
        <Image
          source={require("../assets/loginprofile.png")} //Change your icon image here
          style={styles.ImageStyle}
        />

        <TextInput
          caretHidden={true}
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={onChangeUsernameHandler}
        />
        <Image
          source={{ uri: null }} //Change your icon image here
          style={styles.ImageStyle}
        />
      </SafeAreaView>

      <SafeAreaView style={styles.SectionStyle}>
        <Image
          source={require("../assets/lock.png")} //Change your icon image here
          style={styles.ImageStyle}
        />

        <TextInput
          caretHidden={true}
          secureTextEntry={true}
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={onChangePasswordHandler}
        />

        <Image
          source={{ uri: null }} //Change your icon image here
          style={styles.ImageStyle}
        />
      </SafeAreaView>

      <TouchableOpacity onPress={onSubmitFormHandler}>
        <SafeAreaView style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </SafeAreaView>
      </TouchableOpacity>

      <Text style={{ marginTop: 37, color: "#B8B8B8" }}>
        Don’t have an account?
      </Text>

      <Text
        style={{
          marginTop: 19,
          color: "#D2176E",
          fontWeight: "bold",
        }}
        onPress={() => navigation.navigate("Register")}
      >
        Register Now!
      </Text>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 96,
    height: 110,
  },
  font: {
    width: 126,
    height: 34,
    marginBottom: 77,
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 40,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 30,
    width: 284,
  },
  ImageStyle: {
    height: 30,
    width: 30,
  },
  button: {
    backgroundColor: "#D2176E",
    width: 220,
    borderRadius: 6,
    padding: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  input: {
    color: "black",
    maxWidth: "40%",
    textAlign: "left",
  },
});
