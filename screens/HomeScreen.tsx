import { Link } from "expo-router"
import { useRef, useState } from "react"
import { Animated, Pressable, StyleSheet, Text, View } from "react-native"

export default function HomeScreen() {
    return(
        <View style={styles.container}>
            <Link href={'/simple'}>Simple animation</Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})