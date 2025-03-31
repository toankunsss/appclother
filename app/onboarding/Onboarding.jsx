import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, { useState, useRef } from "react";
import slides from "./slides";
import OnboardingItem from "./onboardingItems";
import Paginator from "./Paginator";
import { useRouter } from "expo-router";

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const router = useRouter();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("sign-in"); // Điều hướng khi nhấn Get Started
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {currentIndex + 1}
          <Text style={{ color: "#A0A0A1" }}>/{slides.length}</Text>
        </Text>
        <TouchableOpacity onPress={() => router.push("sign-in")}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={flatListRef}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {currentIndex > 0 ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.button}
            accessibilityLabel="Go to previous slide"
          >
            <Text style={[styles.buttonText, styles.backButtonText]}>Prev</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} /> // Placeholder for layout consistency
        )}

        <View style={styles.paginatorContainer}>
          <Paginator data={slides} scrollX={scrollX} />
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={styles.button}
          accessibilityLabel={
            currentIndex === slides.length - 1
              ? "Get Started"
              : "Go to next slide"
          }
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  skipText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paginatorContainer: {
    flex: 1, // Adjusted to take available space
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    borderRadius: 5,
    minWidth: 60, // Ensures buttons have consistent width
    alignItems: "center",
  },
  buttonText: {
    color: "#F83758",
    fontWeight: "600",
    fontSize: 18,
  },
  backButtonText: {
    color: "#C4C4C4",
  },
});
