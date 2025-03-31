import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handleChangeText,
  containerStyles,
  TextStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handleChangeText}
      activeOpacity={0.7}
      style={[containerStyles, { opacity: isLoading ? 0.5 : 1 }]}
      disabled={isLoading}
    >
      <Text style={TextStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
