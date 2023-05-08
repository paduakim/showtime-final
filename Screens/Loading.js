import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
// import { Color } from "../GlobalStyles";

const LoadingScreen = () => {
  return (
    <View style={styles.loadingScreen}>
      <Image
        style={styles.text16779468667191Icon}
        source={require("../assets/logo.png")}
      />
      <Image
        style={styles.imageRemovebgPreview11}
        source={require("../assets/logofont.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text16779468667191Icon: {
    width: 96,
    height: 106,
  },
  imageRemovebgPreview11: {
    top: 200,
    width: 126,
    height: 34,
  },
  loadingScreen: {
    backgroundColor: "white",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingScreen;
