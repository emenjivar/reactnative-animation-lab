import { useRef, useState } from "react"
import { Animated, Dimensions, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native"

const SCALE_NORMAL = 1
const SCALE_TARGET = 1.4

type CircleProps = {
    center: { x: number, y : number },
    radius: number,
    scale: Animated.AnimatedValue,
    offsetX: Animated.AnimatedValue,
    offsetY: Animated.AnimatedValue
}

type Props = {
    id: string,
    style: ViewStyle,
    circle: CircleProps,
    onPress?: () => void
}
function Circle({ style, circle, id, onPress } : Props) {
    return (
        <Pressable onPress={onPress} id={id}>
            <Animated.View style={[
                styles.circle, 
                {
                    width: circle.radius * 2,
                    height: circle.radius * 2,
                    transform: [
                      { translateX: Animated.add(circle.center.x - circle.radius, circle.offsetX) },
                      { translateY: Animated.add(circle.center.y - circle.radius, circle.offsetY) },
                      { scale : circle.scale }, // Allows us to use the nativeDriver
                    ]
                }, 
                style
            ]} />
        </Pressable>
    )
}

function calculateTopNeighbor(
    centerScale: Animated.Value,
    distance: number
): Animated.Value {
    // Indicates the translation in PX of the centered circle
    const deltaRadius = Animated.subtract(Animated.multiply(centerScale, RADIUS), RADIUS)
    const translation = Animated.add(
        deltaRadius,
        DIAMETER * distance
    )

    // Convert to negative to pull up the circle
    return Animated.multiply(
        translation,
        -1
    ) as Animated.Value
}

function calculateBottomNeighbor(
    centerScale: Animated.Value,
    distance: number
): Animated.Value {
    // Indicates the translation in PX of the centered circle
    const deltaRadius = Animated.subtract(Animated.multiply(centerScale, RADIUS), RADIUS)
    const translation = Animated.add(
        deltaRadius,
        DIAMETER * distance
    )

    // Convert to negative to pull up the circle
    return translation as Animated.Value
}

export default function SimpleGridScreen() {
    const { width, height } = Dimensions.get('window')
    const centerX = width / 2
    const centerY = height / 2

    const scale = useRef(new Animated.Value(1)).current
    const leftScale = useRef(new Animated.Value(1)).current

    // This should represent the drag offset
    const pan = new Animated.ValueXY({ x: 0, y: 0 })

    const translateInward = Animated.multiply(
        Animated.subtract(scale, 1),
        -RADIUS
    );
    const translateOutward = Animated.multiply(
        Animated.subtract(scale, 1),
        RADIUS
    )

    const [toggle, setToggle] = useState(false)

    const leftCircleOffsetX = Animated.multiply(
        scale,
        -RADIUS * 2
    )

    const handleToggle = () => {
        console.log('clicked')
        setToggle(
            current => { 
                const target = !current
                Animated.spring(
                    scale, 
                    { toValue: target ? SCALE_TARGET : SCALE_NORMAL, useNativeDriver: true  }
                ).start()

                return!current
            }
        )
    }

    const topCircles = Array.from({ length: 5 }).map((_, index ) => (
        <Circle 
            id={`(-${index},0)`}
            onPress={handleToggle}
            circle={{
                center : { x: centerX, y: centerY - DIAMETER },
                radius: RADIUS,
                offsetX: new Animated.Value(0),
                offsetY: calculateTopNeighbor(scale, index),
                scale: leftScale
            }}
            style={{ backgroundColor: '#4caf50' }} />
    ))

    const bottomCircles = Array.from({ length: 5 }).map((_, index ) => (
        <Circle 
            id={`(${index},0)`}
            onPress={handleToggle}
            circle={{
                center : { x: centerX, y: centerY + DIAMETER },
                radius: RADIUS,
                offsetX: new Animated.Value(0),
                offsetY: calculateBottomNeighbor(scale, index),
                scale: leftScale
            }}
            style={{ backgroundColor: '#4caf50' }} />
    ))

    const leftCircles = Array.from({ length: 5 }).map((_, index) => (
        <Circle
            id={`(0,-${index})`}
            onPress={handleToggle}
            circle={{
                center: { x: centerX - DIAMETER, y: centerY},
                radius: RADIUS,
                offsetX : calculateTopNeighbor(scale, index),
                offsetY: new Animated.Value(0),
                scale: leftScale
            }}
            style={{ backgroundColor: '#4caf50'}} />
    ))

    const rightCircles = Array.from({ length: 5 }).map((_, index) => (
        <Circle
            id={`(0,${index})`}
            onPress={handleToggle}
            circle={{
                center: { x: centerX + DIAMETER, y: centerY},
                radius: RADIUS,
                offsetX : calculateBottomNeighbor(scale, index),
                offsetY: new Animated.Value(0),
                scale: leftScale
            }}
            style={{ backgroundColor: '#4caf50'}} />
    ))

    return (
        <View style={styles.container}>
            { /** center */}
            <Circle 
                id="(0,0)"
                onPress={handleToggle}
                circle={{
                    center : { x: centerX, y: centerY },
                    radius: RADIUS,
                    scale: scale,
                    offsetX: new Animated.Value(0),
                    offsetY: new Animated.Value(0)
                }}
                style={{ backgroundColor: '#4caf50' }} />

            {topCircles}
            {bottomCircles}
            {leftCircles}
            {rightCircles}
        </View>
    )
}

const RADIUS = 50
const DIAMETER = RADIUS * 2
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative'
    },
    circle: {
        width: DIAMETER,
        height: DIAMETER,
        backgroundColor: 'red',
        borderRadius: RADIUS,
        position: 'absolute'
    }
})
        