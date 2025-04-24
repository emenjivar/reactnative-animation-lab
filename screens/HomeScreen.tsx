import { useRef, useState } from "react"
import { Animated, Pressable, StyleSheet, Text, View } from "react-native"

export default function HomeScreen() {
    const scale = useRef(new Animated.Value(1)).current
    const progress = useRef(new Animated.Value(0)).current
    const [toggle, setToggle] = useState(false)

    const handleToggle = () => {
        setToggle(current => {
            const target = !current
            
            Animated.parallel([
                Animated.sequence([
                    Animated.spring(progress, { toValue: target ? 1 : 0, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.spring(scale, { toValue: target ? 2 : 1, useNativeDriver: true }),
                ])
            ]).start()

            return target
        })
    }

    return(
        <View style={styles.container}>
            <Pressable onPress={handleToggle}>
                <Animated.View style={[
                    styles.square,
                    {
                        borderRadius: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [SIZE / 2, SIZE / 4]
                        }),
                        transform: [ 
                            { scale },
                            { rotate: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [ "0deg", "90deg"]
                            }) }
                        ],
                    }
                ]} />
            </Pressable>
        </View>
    )
}

const SIZE = 100.0
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    square: {
        width: SIZE,
        height: SIZE,
        backgroundColor: 'rgb(163, 87, 200)'
    }
})