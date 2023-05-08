import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://192.168.100.73/showtime/api/";
import { useFocusEffect } from "@react-navigation/native";

const LikeButton = (data) => {
  const [state, setState] = useState(false);
  const [numlikes, setNumlikes] = useState(0);
  // const [user_id, setUserID] = useState();

  AsyncStorage.getItem("user_id");
  // user_id = "";

  const post_id = data.data;

  // useEffect(() => {
  //   checkLiked();
  //   getLikesNumber();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkLiked();
      getLikesNumber();
      // console.log("naload");
      // Do something when the screen is focused
      return () => {
        checkLiked();
        getLikesNumber();
        // console.log("umalis");
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const checkLiked = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${baseUrl}checkLiked/${post_id}/${user_id}`,
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

  const getLikesNumber = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    try {
      const response = await axios.get(
        `${baseUrl}getLikesNumber/${post_id}/${user_id}`,
        {}
      );
      if (response.status === 200) {
        setNumlikes(response.data.payload[0].id);
      } else {
        // setState(false);
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
    } else {
      unSave();
    }
  };

  const onSubmitFormHandler = async (event) => {
    try {
      const response = await axios.post(`${baseUrl}likePost`, {
        user_id,
        post_id,
      });
      if (response.status === 200) {
        console.log(` Liked!`);
        getLikesNumber();
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert(error);
    }
  };

  const unSave = async (event) => {
    try {
      const response = await axios.get(
        `${baseUrl}unlikePost/${post_id}/${user_id}`,
        {}
      );
      if (response.status === 200) {
        getLikesNumber();
        console.log(` Unliked!`);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <View styles={styles.container}>
      <View>
        <TouchableOpacity onPress={() => click()}>
          <Icon
            name={state ? "heart" : "heart-o"}
            size={28}
            color={"#F3484B"}
          />
        </TouchableOpacity>

        <Text style={styles.likes}>{numlikes}</Text>
      </View>
      <View>
        {/* <Pressable onPress={() => navigation.navigate("SelectedPost", item)}>
          <Icon name={"comment-o"} size={28} color={"#F3484B"} />
        </Pressable> */}
      </View>
    </View>
  );
};

export default LikeButton;

const styles = StyleSheet.create({
  likes: {
    marginLeft: 10,
    color: "#000000",
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginRight: 20,
  },
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});
