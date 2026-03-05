import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export const AppLogo = () => {
    return (
        <View style={styles.container}>
            <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="11" fill="#2563EB" />
                <Path d="M7 12.5L10.5 16L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.text}>TaskFlow</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    text: {
        color: '#1f2937',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    }
});
