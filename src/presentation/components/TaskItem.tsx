import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { Task } from '../../domain/models/Task';
import { CameraModule } from '../../infrastructure/camera/CameraModule';
import { TaskLocalRepository } from '../../data/local/TaskLocalRepository';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onAttachmentSaved?: () => void;
}

const localRepo = new TaskLocalRepository();

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onAttachmentSaved }) => {
    const handleAttachPhoto = async () => {
        try {
            const photo = await CameraModule.takePhoto();
            if (photo) {
                await localRepo.saveAttachment(task.id, photo.uri);
                if (onAttachmentSaved) {
                    onAttachmentSaved();
                }
            }
        } catch (error) {
            console.error('Failed to attach photo', error);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.container}>
                <Text style={[styles.title, task.completed && styles.completed]}>
                    {task.title}
                </Text>
                <Switch
                    value={task.completed}
                    onValueChange={() => onToggle(task.id)}
                    trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                    thumbColor={task.completed ? '#2563EB' : '#f3f4f6'}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleAttachPhoto}>
                    <Text style={styles.buttonText}>📷 Adjuntar foto</Text>
                </TouchableOpacity>
                {task.attachmentUri && (
                    <Image source={{ uri: task.attachmentUri }} style={styles.thumbnail} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 6,
        marginHorizontal: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    container: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1f2937',
        flex: 1,
        marginRight: 12,
    },
    completed: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#4b5563',
        fontWeight: '500',
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#e5e7eb',
    },
});
