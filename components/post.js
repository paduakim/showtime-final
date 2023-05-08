import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Searchfilter from "../components/SearchFilter";

const pressHandler = (item) => {
  return console.log(item);
};

const Post = ({ data, navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Searchfilter data={data} navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F1F0",
  },
});

export default Post;
