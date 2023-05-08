import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://192.168.100.73/showtime/api/";
import { useFocusEffect } from "@react-navigation/native";
const BookmarkButton = (data) => {
  const [state, setState] = useState(false);
  // const [user_id, setUserID] = useState();

  AsyncStorage.getItem("user_id");
  // user_id = "";

  const post_id = data.data;

  // useEffect(() => {
  //   checkBookmark();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      checkBookmark();
      // console.log("naload");
      return () => {
        checkBookmark();
        // console.log("umalis");
      };
    }, [])
  );

  const checkBookmark = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${baseUrl}checkBookmark/${post_id}/${user_id}`,
        {}
      );
      if (response.status === 200) {
        setState(true);
      } else {
        setState(false);
        throw new Error("An error has occurred");
      }
    } catch (error) {
      // alert("Invalid Username or Email!");
    }
  };

  const click = () => {
    setState(!state);

    if (!state) {
      onSubmitFormHandler();
      console.log(post_id);
      console.log(user_id);
    } else {
      unSave();
      console.log(post_id);
      console.log(user_id);
    }
  };

  const onSubmitFormHandler = async (event) => {
    user_id = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.post(`${baseUrl}addtobookmark`, {
        user_id,
        post_id,
      });
      if (response.status === 200) {
        // alert(` Succesfully saved!`);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert(error);
    }
  };

  const unSave = async (event) => {
    user_id = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${baseUrl}deletebookmark/${post_id}/${user_id}`,
        {}
      );
      if (response.status === 200) {
        console.log(response.status);
        // alert(` Succesfully Removed!`);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => click()}>
        <Icon
          name={state ? "bookmark" : "bookmark-o"}
          size={28}
          color={"#F3484B"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BookmarkButton;
