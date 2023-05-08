import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, SafeAreaView, ScrollView } from "react-native";
import Header from "../components/header";
import Post from "../components/post";
import React, { useState, useEffect } from "react";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://192.168.100.73/showtime/api/";
import { useFocusEffect } from "@react-navigation/native";

export default function Top({ navigation, route }) {
  const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   getTopPosts();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getTopPosts();
      // console.log("naload");
      return () => {
        getTopPosts();
        // console.log("umalis");
      };
    }, [])
  );

  const getTopPosts = async () => {
    try {
      const response = await axios.get(`${baseUrl}getTopPosts`, {});
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
        <Post data={posts} navigation={navigation} />
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
});
