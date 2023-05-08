import * as React from "react";
import {
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const imageseUrl = "http://192.168.100.73/showtime";

const Favoritespic = ({ data, navigation }) => {
  //   console.log(data);
  return (
    <FlatList
      contentContainerStyle={styles.bookmarks}
      scrollEnabled={false}
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        return (
          <Pressable onPress={() => navigation.navigate("SelectedPost", item)}>
            <Image
              style={styles.rooms}
              source={{ uri: imageseUrl + item.room_picture }}
            />
          </Pressable>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 107,
    height: 27,
  },

  rooms: {
    width: 117,
    height: 134,
    margin: 6,
    flex: 1,
  },
  bookmarks: {
    flex: 1,
    backgroundColor: "#F9F1F0",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default Favoritespic;
