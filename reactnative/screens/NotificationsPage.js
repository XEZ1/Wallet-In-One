import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme} from "../src/theme/ThemeProvider"

export default function NotificationsPage({ navigation }) {
    const { dark, colors, setScheme } = useTheme();

    const notifications = [
        {
        id: '1',
        title: 'Notification 1',
        description: 'This is a description for notification 1',
        date: '2020-10-01',
        },
        {
        id: '2',
        title: 'Notification 2',
        description: 'This is a description for notification 2',
        date: '2020-10-02',
        },
        {
        id: '3',
        title: 'Notification 3',
        description: 'This is a description for notification 3',
        date: '2020-10-03',
        },
        {
        id: '4',
        title: 'Notification 4',
        description: 'This is a description for notification 4',
        date: '2020-10-04',
        },
        {
        id: '5',
        title: 'Notification 5',
        description: 'This is a description for notification 5',
        date: '2020-10-05',
        },
        {
        id: '6',
        title: 'Notification 6',
        description: 'This is a description for notification 6',
        date: '2020-10-06',
        },
        {
        id: '7',
        title: 'Notification 7',
        description: 'This is a description for notification 7',
        date: '2020-10-07',
        }];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        item: {
            backgroundColor: colors.card,
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
        },
        title: {
            fontSize: 32,
        },
        date: {
            fontSize: 16,
        },
        description: {
            fontSize: 16,
        },
    });

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Notification', { notification: item })}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
}