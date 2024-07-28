import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AnimatedBars from "@/components/animatedBars";

const Main = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setInterval(() => setActive((prev) => !prev), 5000);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <AnimatedBars barsWrapperStyle={{ alignItems: "flex-start" }} /> */}
      {active ? (
        <AnimatedBars />
      ) : (
        <AnimatedBars barsWrapperStyle={{ alignItems: "flex-end" }} />
      )}
      {/* <AnimatedBars barsWrapperStyle={{ alignItems: "flex-end" }} /> */}
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({});
