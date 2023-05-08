import LoadingScreen from "../Screens/Loading";
import Login from "../Screens/Login";
import Register from "../Screens/Register";
import CreatePost from "../Screens/CreatePost";
import SelectedProfile from "../Screens/SelectedProfile";
import SelectedPost from "../Screens/SelectedPost";
import EditProfile from "../Screens/EditProfile";
import ChangePassword from "../Screens/ChangePassword";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "../components/navbar";

import * as React from "react";
const Stack = createNativeStackNavigator();

const Main = () => {
  const [hideSplashScreen, setHideSplashScreen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHideSplashScreen(true);
    }, 3000);
  }, []);

  return (
    <>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeBottomTab"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ title: "Sign Up" }}
            />
            <Stack.Screen
              name="Showtime!"
              component={LoadingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectedPost"
              component={SelectedPost}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SelectedProfile"
              component={SelectedProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Create"
              component={CreatePost}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : (
          <LoadingScreen />
        )}
      </NavigationContainer>
    </>
  );
};
export default Main;
