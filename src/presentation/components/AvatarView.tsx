import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface AvatarViewProps {
    name: string;
    size?: number;
}

// Generates a consistent, unique color based on the name string
const getHashColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 50%)`;
};

// Extracts up to two initials from the name
const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const AvatarView: React.FC<AvatarViewProps> = ({ name, size = 44 }) => {
    const backgroundColor = useMemo(() => getHashColor(name), [name]);
    const initials = useMemo(() => getInitials(name), [name]);

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                },
            ]}
        >
            <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // Subtle shadow for modern look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    text: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
