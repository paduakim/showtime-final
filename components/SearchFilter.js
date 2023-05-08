import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  FlatList,
  TextInput,
} from "react-native";
import BookmarkButton from "../components/bookmark";
import LikeButton from "../components/like";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const baseUrl = "http://192.168.100.73/showtime";

const Searchfilter = ({ data, navigation }) => {
  const [id, setId] = useState();
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
    setId(user_id);
    // console.log(id);
  };

  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        return (
          <SafeAreaView style={styles.recipeContainer} key={item.id}>
            <View style={styles.top}>
              {/* GO TO THE SELECTED PROFILE OF THE USER WHO POST THE SHOWROOM */}
              {id == item.user_id ? (
                <Pressable
                  onPress={() => {
                    navigation.navigate("Profile");
                  }}
                >
                  <View style={styles.left}>
                    <Image
                      style={styles.profile_pic}
                      source={{ uri: baseUrl + item.profile_pic }}
                    />
                    <Text style={styles.username}>{item.username}</Text>
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    navigation.navigate("SelectedProfile", item);
                  }}
                >
                  <View style={styles.left}>
                    <Image
                      style={styles.profile_pic}
                      source={{ uri: baseUrl + item.profile_pic }}
                    />
                    <Text style={styles.username}>{item.username}</Text>
                  </View>
                </Pressable>
              )}

              <View style={styles.right}>
                <BookmarkButton data={item.id} />
              </View>
            </View>

            {/* GO TO THE SELECTED POST */}
            <Pressable
              onPress={() => navigation.navigate("SelectedPost", item)}
            >
              <View style={styles.mid}>
                <Image
                  style={styles.room_pic}
                  source={{ uri: baseUrl + item.room_picture }}
                />
              </View>
            </Pressable>

            <View style={styles.bottom}>
              <View style={styles.likespart}>
                <LikeButton style={styles.icon} data={item.id} />
                <Pressable
                  onPress={() => navigation.navigate("SelectedPost", item)}
                >
                  <Icon name={"comment-o"} size={28} color={"#F3484B"} />
                </Pressable>
                {/* <Text style={styles.likes}>{item.likes} Likes</Text> */}
              </View>
              <View style={styles.titlepart}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Pressable
                  onPress={() => navigation.navigate("SelectedPost", item)}
                >
                  <Text style={styles.comments}>{item.comments} Comments</Text>
                </Pressable>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    caretHidden={true}
                    style={styles.input}
                    placeholder="Add a comment..."
                    onFocus={() => navigation.navigate("SelectedPost", item)}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  recipeContainer: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    borderRadius: 10,
    margin: 5,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  input: {
    color: "black",
    maxWidth: "100%",
    textAlign: "left",
    width: "100%",
    backgroundColor: "#EAEAEA",
    height: 40,
    borderRadius: 10,
    paddingLeft: 15,
    borderColor: "gray",
    borderWidth: 2,
  },
  profile_pic: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  room_pic: {
    width: 340,
    height: 180,
  },
  username: {
    color: "#000000",
    fontSize: 20,
    maxWidth: 600,
  },
  title: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  description: {
    color: "#000000",
    fontSize: 12,
  },
  comments: {
    marginTop: 20,
    marginBottom: 20,
    color: "gray",
    fontSize: 12,
    fontWeight: "bold",
  },
  likes: {
    color: "#000000",
    fontFamily: "Roboto",
    fontWeight: "bold",
  },
  top: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
    marginTop: 20,
    width: "100%",
  },
  left: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    width: "80%",
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "20%",
  },
  likespart: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  titlepart: {
    flex: 1,
    justifyContent: "center",
  },
  mid: {
    width: "50%",
  },
  bottom: {
    padding: 20,
  },
});

export default Searchfilter;
