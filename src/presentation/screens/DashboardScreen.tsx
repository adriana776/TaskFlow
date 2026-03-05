import React, { useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, ActivityIndicator,
    RefreshControl, TouchableOpacity, SafeAreaView
} from 'react-native';
import { useTaskStore, FilterType } from '../store/useTaskStore';
import { TaskItem } from '../components/TaskItem';
import { syncService } from '../../infrastructure/sync/SyncService';
import { TaskLocalRepository } from '../../data/local/TaskLocalRepository';
import { Task } from '../../domain/models/Task';
import { NativeAvatarView } from '../components/NativeAvatarView';
import { AppLogo } from '../components/AppLogo';

const localRepo = new TaskLocalRepository();

export const DashboardScreen = () => {
    const { tasks, isLoading, filter, setTasks, setLoading, setFilter } = useTaskStore();

    const loadLocalTasks = useCallback(async () => {
        const data = await localRepo.getAllTasks();
        setTasks(data);
    }, [setTasks]);

    const initApp = useCallback(async () => {
        setLoading(true);
        await syncService.init();
        await loadLocalTasks();
        setLoading(false);
    }, [loadLocalTasks, setLoading]);

    useEffect(() => {
        initApp();
    }, [initApp]);

    const onRefresh = async () => {
        setLoading(true);
        await syncService.syncNow();
        await loadLocalTasks();
        setLoading(false);
    };

    const handleToggle = async (id: string) => {
        // Optimistic UI update
        const previousTasks = [...tasks];
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

        try {
            await localRepo.toggleComplete(id);
        } catch (e) {
            // Revert if error
            setTasks(previousTasks);
            console.error('Failed to toggle task', e);
        }
    };

    const filteredTasks = tasks.filter((t) => {
        if (filter === 'completed') return t.completed;
        if (filter === 'pending') return !t.completed;
        return true;
    });

    const FilterButton = ({ type, label }: { type: FilterType, label: string }) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
        >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <AppLogo />
                    <View style={styles.userSection}>
                        <View style={styles.greetingContainer}>
                            <Text style={styles.greeting}>Hola,</Text>
                            <Text style={styles.userName}>Usuario TaskFlow</Text>
                        </View>
                        <NativeAvatarView name="Usuario TaskFlow" size={44} />
                    </View>
                </View>

                <View style={styles.filterContainer}>
                    <FilterButton type="all" label="Todas" />
                    <FilterButton type="pending" label="Pendientes" />
                    <FilterButton type="completed" label="Completadas" />
                </View>

                {isLoading && tasks.length === 0 ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color="#2563EB" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TaskItem task={item} onToggle={handleToggle} onAttachmentSaved={loadLocalTasks} />
                        )}
                        refreshControl={
                            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={['#2563EB']} />
                        }
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No hay tareas disponibles</Text>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#ffffff',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingContainer: {
        marginRight: 12,
        alignItems: 'flex-end',
    },
    greeting: {
        fontSize: 14,
        color: '#6b7280',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
    },
    filterButtonActive: {
        backgroundColor: '#2563EB',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
    },
    filterTextActive: {
        color: '#ffffff',
    },
    listContent: {
        paddingVertical: 12,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 32,
        color: '#6b7280',
        fontSize: 16,
    },
});
