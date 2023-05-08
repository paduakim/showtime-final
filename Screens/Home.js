import {
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/header";
import Post from "../components/post";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://192.168.100.73/showtime/api/";

export default function Home({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [item, setRecipe] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getPosts();
      console.log("naload");
      // Do something when the screen is focused
      return () => {
        getPosts();
        console.log("umalis");
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  // useEffect(() => {
  //   getPosts();
  // }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}getPosts`, {});
      if (response.status === 200) {
        // alert("Login Successful!");
        setPosts(response.data.payload);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("Invalid Username or Email!");
    }
  };

  return [
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView>
        <View style={styles.searchBar}>
          <Icon
            style={styles.searchIcon}
            name="search"
            size={20}
            color={"gray"}
          />
          <TextInput
            style={styles.input}
            placeholder="Search Here..."
            value={item}
            onChangeText={(text) => setRecipe(text)}
          />
        </View>

        <Post data={posts} navigation={navigation} input={item} />
      </ScrollView>
    </SafeAreaView>,
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F1F0",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    paddingTop: 50,
  },

  input: {
    color: "black",
    textAlign: "left",
    width: "90%",
    height: 30,
    borderRadius: 10,
    paddingLeft: 0,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAEAEA",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "gray",
    // marginTop: 20,
    marginRight: 10,
  },
  searchIcon: {
    padding: 10,
  },
});
