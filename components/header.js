import * as React from "react";
import { Image, StyleSheet, SafeAreaView, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = (props) => {
  const logout = async () => {
    AsyncStorage.clear().then(() => console.log("Cleared"));
    return props.navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.loadingScreen}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        <Image style={styles.logo} source={require("../assets/logofont.png")} />
        <View style={(style = { width: 104 })}></View>
        <Image style={styles.icons} source={require("../assets/search.png")} />
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
  },
  icons: {
    width: 32,
    height: 32,
    marginRight: 11,
  },
  loadingScreen: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FFF",
  },
});

export default Header;
