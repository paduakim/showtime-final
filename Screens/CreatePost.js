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

const popAction = StackActions.pop(1);

export default function CreatePost({ navigation, route }) {
  const [image, setImagePath] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const data = new FormData();

  AsyncStorage.getItem("user_id");

  const onChangeTitleHandler = (title) => {
    setTitle(title);
  };
  const onChangeDescriptionHandler = (description) => {
    setDescription(description);
  };

  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    setImagePath(result.uri);
    // console.log(result);

    data.append("file", {
      name: result.name,
      type: result.mimeType,
      uri: result.uri,
    });

    axios.post(`${baseUrl}addImagefile`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const addShowroom = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    if (!title.trim() || !description.trim()) {
      alert("Input title and Description");
      return;
    }
    if (image) {
      try {
        const response = await axios.post(`${baseUrl}addShowroomWithPic`, {
          user_id: user_id,
          title: title,
          description: description,
        });
        if (response.status === 200) {
          return navigation.navigate("Home");
        } else {
          // setState(false);
          alert("d nagsave");
          throw new Error("An error has occurred");
        }
      } catch (error) {
        alert("Invalid Username or Email!");
      }
    } else {
      try {
        const response = await axios.post(`${baseUrl}addShowroom`, {
          user_id: user_id,
          title: title,
          description: description,
          room_picture: "../assets/addimage.png",
        });
        if (response.status === 200) {
          return navigation.navigate("Home");
        } else {
          // setState(false);
          alert("d nagsave");
          throw new Error("An error has occurred");
        }
      } catch (error) {
        alert("Invalid Username or Email!");
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
          {/* Logout */}

          {/* <View style={{ flex: 0.1 }}>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Image
                style={styles.icons}
                source={require("../assets/logout.png")}
              />
            </Pressable>
          </View> */}
        </View>
        <SafeAreaView style={{ flex: 0.1, paddingLeft: 20, paddingTop: 20 }}>
          <Text style={styles.createpost}>Create Post </Text>
        </SafeAreaView>
        <View style={styles.image}>
          <View style={styles.addimagebackground}>
            {/* <Image
              style={styles.addimage}
              source={require("../assets/addimage.png")}
            /> */}
            {/* *********************************************************** */}
            <View style={imageUploaderStyles.container}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              )}
              <View style={imageUploaderStyles.uploadBtnContainer}>
                <TouchableOpacity
                  onPress={_pickDocument}
                  style={imageUploaderStyles.uploadBtn}
                >
                  <Text>{image ? "Edit" : "Upload"} Image</Text>
                  <AntDesign name="camera" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {/* *********************************************************** */}
          </View>
          <TextInput
            caretHidden={true}
            style={styles.input}
            placeholder="Add Title"
            value={title}
            onChangeText={onChangeTitleHandler}
          />
          <TextArea
            style={styles.textarea}
            placeholder={"Add Description"}
            underlineColorAndroid={"transparent"}
            value={description}
            onChangeText={onChangeDescriptionHandler}
          />
          <View style={styles.buttons}>
            <TouchableOpacity onPress={() => addShowroom()}>
              <SafeAreaView style={styles.button}>
                <Text style={styles.buttonText}>Create Post</Text>
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
    height: "100%",
    width: "100%",
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
    marginTop: 50,
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
    marginTop: 50,
  },
  buttonTextcancel: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
