import { StyleSheet, View } from "react-native";
import React from "react";
import AnimatedBars from "@/components/animatedBars";

const Main = () => {
  return (
    <View style={styles.container}>
      <AnimatedBars />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
