import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  Pressable,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

const Header = (props) => {
  const [item, setRecipe] = useState("");
  const logout = async () => {
    AsyncStorage.clear().then(() => console.log("Cleared"));
    return props.navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.loadingScreen}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Image style={styles.logo} source={require("../assets/logofont.png")} />
        <View style={(style = { width: 170 })}></View>
        {/* <Image style={styles.icons} source={require("../assets/search.png")} /> */}

        {/* Create Post */}
        <Pressable onPress={() => props.navigation.navigate("Create")}>
          <Image style={styles.icons} source={require("../assets/plus.png")} />
        </Pressable>

        {/* Logout */}
        <Pressable onPress={() => logout()}>
          <Image
            style={styles.icons}
            source={require("../assets/logout.png")}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 107,
    height: 27,
    marginLeft: 30,
  },
  icons: {
    width: 25,
    height: 25,
    marginRight: 6,
  },
  loadingScreen: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFF",
  },
  input: {
    color: "black",
    textAlign: "left",
    width: "80%",
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

export default Header;
