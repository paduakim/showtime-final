import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TextArea from "react-native-textarea";
const Stack = createNativeStackNavigator();
import { StackActions } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
const baseUrl = "http://192.168.100.73/showtime/api/";
const imageseUrl = "http://192.168.100.73/showtime";

const popAction = StackActions.pop(1);

export default function ChangePassword({ navigation, route }) {
  AsyncStorage.getItem("user_id");

  const [oldpass, setOldpass] = useState("");
  const [newpass, setNewpass] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

  const onChangeOldpassHandler = (oldpass) => {
    setOldpass(oldpass);
  };
  const onChangeNewPassHandler = (newpass) => {
    setNewpass(newpass);
  };
  const onChangeConfirmPassHandler = (confirmpass) => {
    setConfirmpass(confirmpass);
  };

  const edit = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    if (!oldpass.trim() || !newpass.trim() || !confirmpass.trim()) {
      alert("Input all fields!");
      return;
    } else if (newpass.length < 8) {
      alert("New Password must be at least 8 characters long!");
      return;
    } else {
      if (newpass !== confirmpass) {
        alert("New Password doesn't match with Confirm Password!");
        return;
      }
      try {
        console.log(oldpass, newpass, user_id);
        const response = await axios.post(`${baseUrl}editPassword`, {
          password: oldpass,
          newpassword: newpass,
          id: user_id,
        });
        if (response.status === 200) {
          alert("Password Changed!");
          setNewpass("");
          setConfirmpass("");
          setOldpass("");
          return navigation.navigate("Profile");
        } else {
          // setState(false);
          alert("Old Password is incorrect!");
          throw new Error("An error has occurred");
        }
      } catch (error) {
        alert("Old Password is incorrect!");
      }
    }
  };

  return [
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.loadingScreen}>
        <View style={styles.navbar}>
          <View style={{ flex: 1 }}>
            <Image
              style={styles.logo}
              source={require("../assets/logofont.png")}
            />
          </View>
        </View>
        <SafeAreaView style={{ flex: 0.1, paddingLeft: 20, paddingTop: 20 }}>
          <Text style={styles.createpost}>Change Password </Text>
        </SafeAreaView>
        <View style={styles.image}>
          <View style={styles.addimagebackground}></View>
          <TextInput
            style={styles.textarea}
            placeholder={"Old Password"}
            underlineColorAndroid={"transparent"}
            caretHidden={true}
            secureTextEntry={true}
            value={oldpass}
            onChangeText={onChangeOldpassHandler}
          />
          <TextInput
            style={styles.textarea}
            placeholder={"New Password"}
            underlineColorAndroid={"transparent"}
            caretHidden={true}
            secureTextEntry={true}
            value={newpass}
            onChangeText={onChangeNewPassHandler}
          />
          <TextInput
            style={styles.textarea}
            placeholder={"Confirm New Password"}
            underlineColorAndroid={"transparent"}
            caretHidden={true}
            secureTextEntry={true}
            value={confirmpass}
            onChangeText={onChangeConfirmPassHandler}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => edit()}>
              <SafeAreaView style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </SafeAreaView>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.dispatch(popAction)}>
              <SafeAreaView style={styles.buttoncancel}>
                <Text style={styles.buttonTextcancel}>Cancel</Text>
              </SafeAreaView>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>,
  ];
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-evenly",
  },
  navbar: {
    backgroundColor: "#FFF",
    flex: 0.1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    height: 60,
  },
  input: {
    color: "black",
    width: "100%",
    textAlign: "left",
    backgroundColor: "#EAEAEA",
    height: 40,
    borderRadius: 10,
    paddingLeft: 15,
    marginTop: 20,
    borderColor: "gray",
    borderWidth: 2,
  },
  textarea: {
    color: "black",
    backgroundColor: "#EAEAEA",
    width: "80%",
    borderRadius: 10,
    paddingLeft: 15,
    marginTop: 20,
    textAlignVertical: "top",
    borderColor: "gray",
    borderWidth: 2,
  },
  logo: {
    width: 107,
    height: 27,
  },
  addimage: {
    width: 120,
    height: 120,
  },
  addimagebackground: {
    // backgroundColor: "white",
    paddingHorizontal: 40,
  },
  image: {
    alignItems: "center",
    flex: 0.6,
    width: "100%",
    paddingHorizontal: 20,
    color: "white",
  },
  createpost: {
    fontSize: 36,
    color: "#D2176E",
  },
  icons: {
    width: 32,
    height: 32,
    marginRight: 11,
    justifyContent: "flex-end",
  },
  loadingScreen: {
    flex: 1,
    height: 700,
    alignItems: "flex-start",
    backgroundColor: "#F9F1F0",
    marginTop: 50,
  },
  button: {
    backgroundColor: "#D2176E",
    width: 150,
    borderRadius: 6,
    padding: 15,
    marginTop: 30,
  },
  changepass: {
    backgroundColor: "#F79489",
    width: 150,
    borderRadius: 6,
    padding: 15,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  buttoncancel: {
    backgroundColor: "#C4C4C4",
    width: 150,
    borderRadius: 6,
    padding: 15,
    marginTop: 30,
  },
  buttonTextcancel: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
