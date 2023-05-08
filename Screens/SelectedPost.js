import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  SafeAreaView,
  FlatList,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BookmarkButton from "../components/bookmark";
import LikeButton from "../components/like";
import Header from "../components/header";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const baseUrl = "http://192.168.100.73/showtime/api/";

const imagesUrl = "http://192.168.100.73/showtime";

export default function SelectedPost({ route, navigation }) {
  AsyncStorage.getItem("user_id");
  const [comments, setComments] = useState([]);
  const [postData, setPostData] = useState([]);
  const [postid, setPostid] = useState("");
  const [u_id, setUid] = useState("");
  const [newcomment, setNewcomment] = useState("");

  const onChangeComment = (newcomment) => {
    setNewcomment(newcomment);
  };

  // useEffect(() => {
  //   setPostid(route.params.id);
  //   getPostData();
  //   getComments();
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      setPostid(route.params.id);
      getPostData();
      getComments();
      console.log("naload");
      // Do something when the screen is focused
      return () => {
        setPostid(route.params.id);
        getPostData();
        getComments();
        console.log("umalis");
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const getPostData = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    setUid(user_id);
    try {
      const response = await axios.get(
        `${baseUrl}getPostData/${route.params.id}`,
        {}
      );
      if (response.status === 200) {
        // alert("Login Successful!");
        setPostData(response.data.payload[0]);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("Cannot get post data!");
    }
  };

  const getComments = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    setUid(user_id);
    // console.log(route.params);
    try {
      const response = await axios.get(
        `${baseUrl}getComments/${route.params.id}`,
        {}
      );
      if (response.status === 200) {
        // alert("Login Successful!");
        setComments(response.data.payload);
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      // alert("Cannot get comments!");
    }
  };

  const addComment = async () => {
    user_id = await AsyncStorage.getItem("user_id");
    setUid(user_id);
    console.log(user_id, route.params.id, newcomment);

    if (!newcomment.trim()) {
      alert("Input anything in the comment section!");
      return;
    }
    try {
      const response = await axios.post(`${baseUrl}addComment`, {
        user_id: u_id,
        post_id: postData.id,
        comments: newcomment,
      });
      if (response.status === 200) {
        console.log("added new post!");
        getPostData();
        getComments();
        setNewcomment("");
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert("Invalid Username or Email!");
    }
  };

  const deleteComment = async (event) => {
    try {
      const response = await axios.get(`${baseUrl}deleteComment/${event}`, {});
      if (response.status === 200) {
        // alert("Delete Comment Success!")
        getPostData();
        getComments();
      } else {
        throw new Error("An error has occurred");
      }
    } catch (error) {
      alert(error);
    }
  };

  return [
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView>
        <SafeAreaView style={styles.recipeContainer} key={postData.id}>
          <View style={styles.top}>
            {/* GO TO THE SELECTED PROFILE OF THE USER WHO POST THE SHOWROOM */}
            <Pressable
              onPress={() => {
                navigation.navigate("SelectedProfile", postData.user_id);
              }}
            >
              <View style={styles.left}>
                <Image
                  style={styles.profile_pic}
                  source={{ uri: imagesUrl + postData.profile_pic }}
                />
                <Text style={styles.username}>{postData.username}</Text>
              </View>
            </Pressable>
            <View style={styles.right}>
              <BookmarkButton data={postData.id} />
            </View>
          </View>

          {/* GO TO THE SELECTED POST */}
          <View style={styles.mid}>
            <Image
              style={styles.room_pic}
              source={{ uri: imagesUrl + postData.room_picture }}
            />
          </View>

          <View style={styles.bottom}>
            <View style={styles.likespart}>
              <LikeButton style={styles.icon} data={postData.id} />

              {/* <Text style={styles.likes}>{postData.likes} Likes</Text> */}
            </View>
            <View style={styles.titlepart}>
              <Text style={styles.title}>{postData.title}</Text>
              <Text style={styles.description}>{postData.description}</Text>

              <Text style={styles.comments}>{postData.comments} Comments</Text>
              <FlatList
                scrollEnabled={false}
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.commentsection}>
                      <View style={styles.leftcommentsection}>
                        <Image
                          style={styles.commentpic}
                          source={require("../assets/profile.png")}
                        />
                      </View>
                      <View style={styles.midcomm}>
                        <View style={styles.midcommentsection}>
                          {u_id == item.user_id ? (
                            <Pressable
                              onPress={() => {
                                navigation.navigate("Profile");
                              }}
                            >
                              <Text style={styles.commentText}>
                                {item.username}
                              </Text>
                            </Pressable>
                          ) : (
                            <Pressable
                              onPress={() => {
                                navigation.navigate("SelectedProfile", item);
                              }}
                            >
                              <Text style={styles.commentText}>
                                {item.username}
                              </Text>
                            </Pressable>
                          )}

                          <Text style={styles.commentDate}>
                            {item.date_created}
                          </Text>
                        </View>
                        <ScrollView>
                          <View style={styles.commentscontent}>
                            <Text style={styles.textcontent}>
                              {item.comments}
                            </Text>
                          </View>
                        </ScrollView>
                      </View>
                      <View style={styles.rightcommentsection}>
                        {item.user_id == u_id ? (
                          <Icon
                            name={"trash"}
                            size={15}
                            color={"#F3484B"}
                            marginLeft={12}
                            onPress={() => deleteComment(item.id)}
                          />
                        ) : null}
                      </View>
                    </View>
                  );
                }}
              />
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
                  value={newcomment}
                  onChangeText={onChangeComment}
                />
                <Icon
                  name={"send"}
                  size={30}
                  color={"#F3484B"}
                  marginLeft={12}
                  onPress={() => addComment()}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <StatusBar style="auto" />
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
  commentsection: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  commentscontent: {
    flex: 1,
    alignItems: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  commentText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  textcontent: {
    fontSize: 10,
  },
  commentDate: {
    fontSize: 8,
    marginLeft: 20,
    color: "gray",
  },
  commentpic: {
    width: 30,
    height: 30,
    alignSelf: "flex-start",
  },
  leftcommentsection: {
    flex: 0.15,
    width: 30,
    height: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  midcommentsection: {
    flex: 0.7,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  midcomm: {
    flex: 0.7,
    // alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#d1d1d1",
    borderRadius: 20,
    padding: 5,
  },
  rightcommentsection: {
    flex: 0.2,
    width: 30,
    height: 30,
  },
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
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
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
    marginLeft: 10,
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
