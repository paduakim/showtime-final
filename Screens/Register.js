import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { StackActions } from "@react-navigation/native";
import axios from "axios";
const baseUrl = "http://192.168.100.73/showtime/api/";

export default function Register({ navigation, route }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const onChangeNameHandler = (fullname) => {
    setFullname(fullname);
  };

  const onChangeEmailHandler = (email) => {
    setEmail(email);
  };

  const onChangeUsernameHandler = (username) => {
    setUsername(username);
  };

  const onChangePasswordHandler = (password) => {
    setPassword(password);
  };

  const onChangeConfirmPasswordHandler = (confirmpassword) => {
    setConfirmpassword(confirmpassword);
  };

  const onSubmitFormHandler = async (event) => {
    if (
      !fullname.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmpassword.trim()
    ) {
      alert("Please provide all information!");
      return;
    } else if (password.length < 8) {
      alert("Password should be at least 8 characters!");
      return;
    } else {
      if (password !== confirmpassword) {
        alert("Password doesn't match with Confirm Password!");
        return;
      }

      try {
        const response = await axios.post(`${baseUrl}register`, {
          fullname,
          email,
          username,
          password,
        });
        if (response.status === 200) {
          alert(` You have succesfully created an account!`);
          setFullname("");
          setEmail("");
          setUsername("");
          setPassword("");
          return navigation.navigate("Login");
        } else {
          throw new Error("An error has occurred");
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        {/* <SafeAreaView style={{ height: 150 }}></SafeAreaView> */}

        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Image style={styles.font} source={require("../assets/logofont.png")} />
        {/* Fullname */}

        <SafeAreaView style={styles.SectionStyle}>
          <Image
            source={require("../assets/loginprofile.png")} //Change your icon image here
            style={styles.ImageStyle}
          />

          <TextInput
            caretHidden={true}
            style={styles.input}
            placeholder="Fullname"
            value={fullname}
            onChangeText={onChangeNameHandler}
          />
          <Image
            source={{ uri: null }} //Change your icon image here
            style={styles.ImageStyle}
          />
        </SafeAreaView>
        {/* Email */}
        <SafeAreaView style={styles.SectionStyle}>
          <Image
            source={require("../assets/loginprofile.png")} //Change your icon image here
            style={styles.ImageStyle}
          />

          <TextInput
            caretHidden={true}
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={onChangeEmailHandler}
          />
          <Image
            source={{ uri: null }} //Change your icon image here
            style={styles.ImageStyle}
          />
        </SafeAreaView>
        {/* Username */}
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

        {/* Password */}
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
        {/* Confirm Password */}
        <SafeAreaView style={styles.SectionStyle}>
          <Image
            source={require("../assets/lock.png")} //Change your icon image here
            style={styles.ImageStyle}
          />

          <TextInput
            caretHidden={true}
            secureTextEntry={true}
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={onChangeConfirmPasswordHandler}
          />

          <Image
            source={{ uri: null }} //Change your icon image here
            style={styles.ImageStyle}
          />
        </SafeAreaView>
        <TouchableOpacity onPress={onSubmitFormHandler}>
          <SafeAreaView style={styles.button}>
            <Text style={styles.buttonText}>Sign Up!</Text>
          </SafeAreaView>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ScrollView>
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
    width: "60%",
    textAlign: "left",
  },
});
