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
import { useFocusEffect } from "@react-navigation/native";

const popAction = StackActions.pop(1);

export default function EditProfile({ navigation, route }) {
  const [image, setImagePath] = useState(null);
  const [bio, setBio] = useState("");
  const data = new FormData();
  AsyncStorage.getItem("user_id");
  AsyncStorage.getItem("bio");

  const onChangeBioHandler = (bio) => {
    setBio(bio);
  };

  // useEffect(() => {
  //   setProfile();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      setProfile();
      // console.log("naload");
      return () => {
        setProfile();
        // console.log("umalis");
      };
    }, [])
  );

  const setProfile = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${baseUrl}getBioProfile/${user_id}`,
        {}
      );
      if (response.status === 200) {
        console.log(response.data.payload[0]);
        setBio(response.data.payload[0].bio);
        setImagePath(imageseUrl + response.data.payload[0].profile_pic);
      } else {
        // setState(false);
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("Invalid Username or Email!");
    }
  };

  _pickDocument = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    let result = await DocumentPicker.getDocumentAsync({});

    setImagePath(result.uri);
    // console.log(result);

    data.append("file", {
      name: result.name,
      type: result.mimeType,
      uri: result.uri,
    });

    axios
      .post(`${baseUrl}editProfilePic/${user_id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => console.log(response.data));
  };

  const edit = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    if (!bio.trim()) {
      alert("Input new bio");
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}editBio/`, {
        id: user_id,
        bio: bio,
      });
      if (response.status === 200) {
        return navigation.navigate("Profile");
      } else {
        // setState(false);
        alert("d nagsave");
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("Invalid Username or Email!");
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
          <Text style={styles.createpost}>Edit Profile </Text>
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
          <TextArea
            style={styles.textarea}
            placeholder={"Add Bio Description"}
            underlineColorAndroid={"transparent"}
            value={bio}
            onChangeText={onChangeBioHandler}
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
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <SafeAreaView style={styles.changepass}>
                <Text style={styles.buttonText}>Change Password</Text>
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
