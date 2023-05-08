import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Home from "../Screens/Home";
import Top from "../Screens/Top";
import MyPost from "../Screens/MyPost";
import Profile from "../Screens/Profile";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon5 from "react-native-vector-icons/FontAwesome5";

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 2,
          borderTopColor: "gray",
          height: 58,
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name={"Home"}
        component={Home}
        options={{
          headerShown: false,
          tabBarActiveBackgroundColor: "#F79489",

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === "ios" ? 10 : 0,
              }}
            >
              <Icon5
                name="home"
                size={20}
                color={focused ? "#D2176E" : "#C4C4C4"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={"Top"}
        component={Top}
        options={{
          headerShown: false,
          tabBarActiveBackgroundColor: "#F79489",

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === "ios" ? 10 : 0,
              }}
            >
              <Icon5
                name="star"
                size={20}
                color={focused ? "#D2176E" : "#C4C4C4"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={"MyPost"}
        component={MyPost}
        options={{
          headerShown: false,
          tabBarActiveBackgroundColor: "#F79489",

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === "ios" ? 10 : 0,
              }}
            >
              <Icon5
                name="clipboard-list"
                size={20}
                color={focused ? "#D2176E" : "#C4C4C4"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={"Profile"}
        component={Profile}
        options={{
          headerShown: false,
          tabBarActiveBackgroundColor: "#F79489",

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                top: Platform.OS === "ios" ? 10 : 0,
              }}
            >
              <Icon
                name="user"
                size={20}
                color={focused ? "#D2176E" : "#C4C4C4"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
