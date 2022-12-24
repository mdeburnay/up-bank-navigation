import { Animated, View, TouchableOpacity } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import TabThreeScreen from "../screens/TabThreeScreen";
import TabFourScreen from "../screens/TabFourScreen";
import TabFiveScreen from "../screens/TabFiveScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const Tab = createMaterialTopTabNavigator();

export const TabNavBar = ({
  state,
  navigation,
  position,
  layout,
}: MaterialTopTabBarProps): JSX.Element => {
  const [tabPostion, setTabPosition] = React.useState(0);

  const routes = state.routes.length;

  const { width } = layout;

  const tabDifference = width / routes;

  const inputRange = [state.index - 1, state.index, state.index + 1];

  const translateXPosition = position.interpolate({
    inputRange,
    outputRange: [tabDifference, 0, -tabDifference],
  });

  React.useEffect(() => {
    setTabPosition(translateXPosition);
  }, []);

  return (
    <View
      style={{
        paddingTop: 50,
        flexDirection: "row",
        height: 80,
        backgroundColor: "white",
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ translateX: tabPostion }],
        }}
      >
        {state.routes.map((route, index) => {
          const label = route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={route.name}
              testID={`tab-${index}`}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ position: "relative", paddingHorizontal: 20 }}
            >
              <Animated.Text
                style={{ fontSize: 14, fontWeight: isFocused ? "bold" : "400" }}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="TabThree"
      tabBar={(props) => <TabNavBar {...props} />}
    >
      <Tab.Screen name="TabOne" component={TabOneScreen} />
      <Tab.Screen name="TabTwo" component={TabTwoScreen} />
      <Tab.Screen name="TabThree" component={TabThreeScreen} />
      <Tab.Screen name="TabFour" component={TabFourScreen} />
      <Tab.Screen name="TabFive" component={TabFiveScreen} />
    </Tab.Navigator>
  );
}
