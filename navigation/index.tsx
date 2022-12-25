import { Animated, View, TouchableOpacity, Dimensions } from "react-native";
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
  const [widthsOfTabs, setWidthsOfTabs] = React.useState<{
    [key: number]: number;
  }>(
    state.routes
      .map((_: any, i: number) => i)
      .reduce((acc: any, curr: any) => ((acc[curr] = 0), acc), {})
  );

  const widthWindow = Dimensions.get("window").width;

  // this thing animates
  const inputRange = state.routes.map((_: any, i: number) => i);

  const left = position.interpolate({
    inputRange,
    outputRange: inputRange.map(
      (i) =>
        widthWindow / 2 -
        Object.values(widthsOfTabs)
          .slice(0, i)
          .reduce((pV, cV) => pV + cV, 0) -
        widthsOfTabs[i] / 2
      // - (i === 0 ? 0 : 20 * i)
      // If you have padding inbetween the headers you
      // would do something like the above
    ),
  });

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
          transform: [{ translateX: left }],
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
              onLayout={(event) => {
                var { width } = event.nativeEvent.layout;
                setWidthsOfTabs((state) => ({ ...state, [index]: width }));
              }}
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
