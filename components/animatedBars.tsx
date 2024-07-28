import {
  LayoutChangeEvent,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const WIDTH = 25;
const GAP = 2;
const TOTAL = 15;

const ACTIVE_HEIGHT = 250;
const SUB_ACTIVE_HEIGHT = 225;
const SUB_SUB_ACTIVE_HEIGHT = 200;
const IN_ACTIVE_HEIGHT = 150;
const HEIGHT = 200;

const RenderItem = ({
  item,
  index,
  onLayout,
  activeBar,
}: {
  item: string;
  index: number;
  onLayout: (event: LayoutChangeEvent, index: number) => void;
  activeBar: SharedValue<number | null>;
}) => {
  const theme = useTheme();

  const animatedBarStyle = useAnimatedStyle(() => {
    const interpolatedHeight = interpolate(
      activeBar.value === null ? -1 : activeBar.value,
      [index - 3, index - 2, index - 1, index, index + 1, index + 2, index + 3],
      [
        IN_ACTIVE_HEIGHT,
        SUB_SUB_ACTIVE_HEIGHT,
        SUB_ACTIVE_HEIGHT,
        ACTIVE_HEIGHT,
        SUB_ACTIVE_HEIGHT,
        SUB_SUB_ACTIVE_HEIGHT,
        IN_ACTIVE_HEIGHT,
      ],
      Extrapolation.CLAMP
    );

    let backgroundColor = interpolateColor(
      interpolatedHeight,
      [0, ACTIVE_HEIGHT, 0],
      ["rgba(0,0,255,0.3)", theme.colors.primary, "rgba(0,0,255,0.3)"]
    );
    return {
      height: activeBar.value === null ? HEIGHT : interpolatedHeight,
      backgroundColor:
        activeBar.value === null ? theme.colors.primary : backgroundColor,
    };
  });

  return (
    <Animated.View
      layout={LinearTransition.springify().duration(1500)}
      onLayout={(event) => onLayout(event, index)}
      key={item}
      style={[
        { backgroundColor: theme.colors.text },
        styles.bars,
        animatedBarStyle,
      ]}
    />
  );
};

const AnimatedBars = ({
  barsWrapperStyle,
}: {
  barsWrapperStyle?: StyleProp<ViewStyle>;
}) => {
  const activeBar = useSharedValue<number | null>(null);
  const firstBarStartingPos = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {})
    .onUpdate((e) => {
      const relativeX = e.absoluteX - firstBarStartingPos.value;
      const barPlusGap = WIDTH + GAP;
      let barIndex = Math.floor(relativeX / barPlusGap);
      if (barIndex < 0) {
        barIndex = 0;
      } else if (barIndex >= TOTAL) {
        barIndex = TOTAL - 1;
      }
      activeBar.value = barIndex;
    })
    .onEnd(() => {
      activeBar.value = null;
    });

  const onLayout = (event: LayoutChangeEvent, index: number): void => {
    if (index === 0) {
      event.target.measure((_, __, ___, ____, pageX) => {
        firstBarStartingPos.value = pageX;
      });
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureWrapper}>
      <SafeAreaView style={styles.container}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.barsWrapper, barsWrapperStyle]}>
            {new Array(TOTAL)
              .fill(1)
              .map((_, i) => `${i}`)
              .map((item, index) => {
                return (
                  <RenderItem
                    key={item}
                    item={item}
                    index={index}
                    onLayout={onLayout}
                    activeBar={activeBar}
                  />
                );
              })}
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default AnimatedBars;

const styles = StyleSheet.create({
  gestureWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  barsWrapper: {
    flexDirection: "row",
    gap: GAP,
    height: ACTIVE_HEIGHT,
    // alignItems: "flex-end",
    alignItems: "center",
  },
  bars: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius: WIDTH,
  },
});
