import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
import { containerStyle } from "../styles";

const WelcomeImage = require("../../assets/img/Welcome.jpg");

const Welcome = ({ navigation }) => {
  return (
    <>
      <ImageBackground
        imageStyle={{ opacity: 0.7 }}
        source={WelcomeImage}
        style={[containerStyle.container, { width: "100%", height: "100%" }]}>
        <Text
          style={{
            fontSize: 100,
            fontWeight: "bold",
            color: "black",
            fontFamily: "Inter-Black",
            backgroundColor: "yellow",
            paddingHorizontal: 10,
          }}>
          RECIPE
        </Text>
        <Text
          style={{
            fontSize: 45,
            fontWeight: "bold",
            color: "black",
            fontFamily: "Inter-Black",
            borderColor: "yellow",
            borderWidth: 2,
            padding: 12,
          }}>
          FINDER APP
        </Text>

        <View style={{ marginTop: 200 }}>
          <CustomButton
            navigation={navigation}
            title={"Get Started"}></CustomButton>
        </View>
      </ImageBackground>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
