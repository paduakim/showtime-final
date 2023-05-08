import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import Header from "../components/header";
import Favoritespic from "../components/favoritespic";
const baseUrl = "http://192.168.100.73/showtime/api/";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StackActions } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
const imageseUrl = "http://192.168.100.73/showtime";
import { useFocusEffect } from "@react-navigation/native";

export default function SelectedProfile({ route, navigation }) {
  AsyncStorage.getItem("user_id");
  AsyncStorage.getItem("username");
  const [username, setUsername] = useState("");
  const [profile_picture, setProfile_picture] = useState("");
  const [bioDesc, setBioDesc] = useState("");
  const [favorites, setFavorites] = useState([]);

  // useEffect(() => {
  //   setProfile();
  //   getFavorites();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      setProfile();
      getFavorites();
      return () => {
        setProfile();
        getFavorites();
      };
    }, [])
  );

  const setProfile = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}getBioProfile/${route.params.user_id}`,
        {}
      );
      if (response.status === 200) {
        // console.log(response.data.payload[0]);
        setBioDesc(response.data.payload[0].bio);
        setProfile_picture(response.data.payload[0].profile_pic);
        setUsername(response.data.payload[0].username);
      } else {
        // setState(false);
        throw new Error("An error has occurred");
      }
    } catch (error) {
      // alert("Invalid Username or Email!");
    }
  };

  const getFavorites = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}getSelectedUserPost/${route.params.user_id}`,
        {}
      );
      if (response.status === 200) {
        setFavorites(response.data.payload);
        // console.log(favorites);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      // alert("Invalid Username or Email!");
    }
  };

  return [
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView>
        <SafeAreaView style={styles.top}>
          <Image
            style={styles.profile_pic}
            source={{ uri: imageseUrl + profile_picture }}
          />
          <Text style={styles.username}>{username}</Text>
          <View style={styles.bio}>
            <Text style={{ color: "#D2176E" }}>Bio: </Text>
            <Text>{bioDesc}</Text>
          </View>
          <View style={styles.numbers}>
            <View style={styles.numbers_content}>
              <Text style={{ color: "#D2176E", fontSize: 24 }}>{2} </Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.numbers_content}>
              <Text style={{ color: "#D2176E", fontSize: 24 }}>{100} </Text>
              <Text>Followers</Text>
            </View>
            <View style={styles.numbers_content}>
              <Text style={{ color: "#D2176E", fontSize: 24 }}>{250} </Text>
              <Text>Following</Text>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.bookmarks}>
          {/* <Pressable onPress={() => navigation.navigate("")}>
            <Image
              style={styles.rooms}
              source={require("../assets/room1.jpg")}
            />
          </Pressable> */}
          {favorites.length > 0 ? (
            <Favoritespic data={favorites} navigation={navigation} />
          ) : (
            <View style={styles.blank}>
              <Text style={{ fontSize: 20 }}>No posts listed!</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>,
  ];
}

const styles = StyleSheet.create({
  blank: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F1F0",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F1F0",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    paddingTop: 50,
  },
  bio: {
    justifyContent: "center",
    flexDirection: "row",
  },
  button: {
    backgroundColor: "#D2176E",
    width: 220,
    padding: 15,
    marginBottom: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  numbers: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  numbers_content: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    color: "#D2176E",
    fontWeight: "bold",
  },
  bookmarks: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
  top: {
    flex: 0.8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  rooms: {
    width: 117,
    height: 134,
    margin: 6,
    flex: 1,
  },
  profile_pic: {
    width: 120,
    height: 120,
    borderRadius: 80,
  },
});
