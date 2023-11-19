import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function CustomSwitch({
    selectionMode,
    option1,
    option2,
    onSelectSwitch,
}: any) {
    const [getSelectionMode, setSelectionMode] = useState(selectionMode);
    const { colors } = useTheme();
    const updateSwitchData = (value: number) => {
        setSelectionMode(value);
        onSelectSwitch(value);
    };

    return (
        <View
            style={{
                margin: 20,
                backgroundColor: colors.border,
                borderRadius: 10,
                borderColor: '#fff',
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => updateSwitchData(1)}
                style={{
                    flex: 1,
                    backgroundColor:
                        getSelectionMode == 1 ? colors.primary : colors.border,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: getSelectionMode == 1 ? colors.text : colors.text,
                        fontSize: 14,
                        fontFamily: "Roboto-Medium",
                    }}
                >
                    {option1}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => updateSwitchData(2)}
                style={{
                    flex: 1,
                    backgroundColor:
                        getSelectionMode == 2 ? colors.primary : colors.border,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        color: getSelectionMode == 2 ? colors.text : colors.text,
                        fontSize: 14,
                        fontFamily: "Roboto-Medium",
                    }}
                >
                    {option2}
                </Text>
            </TouchableOpacity>
        </View>
    );
}