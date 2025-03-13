import React, { useEffect, useRef } from 'react'; 
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';

// Конфиг 3×3 мигающих квадратов
const squaresConfig = [
  { top: 0, left: 0, delay: 0 },
  { top: 0, left: 10, delay: 75 },
  { top: 0, left: 20, delay: 150 },
  { top: 10, left: 0, delay: 225 },
  { top: 10, left: 10, delay: 300 },
  { top: 10, left: 20, delay: 375 },
  { top: 20, left: 0, delay: 450 },
  { top: 20, left: 10, delay: 525 },
  { top: 20, left: 20, delay: 600 },
];

/**
 * Loader с мигающими квадратами и последовательным появлением логотипов.
 *
 * @param {Object} props
 * @param {number} [props.duration=6000] - через сколько мс начать исчезновение лоадера (квадраты).
 * @param {function} [props.onEnd]       - колбэк, вызывается после окончания анимации логотипов.
 */
const Loader = ({ duration = 6000, onEnd }) => {
  // Анимации для каждого квадрата
  const animations = useRef(squaresConfig.map(() => new Animated.Value(0))).current;
  // Анимация для плавного исчезновения квадратов
  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  // Анимация для появления первого логотипа
  const logoOpacity = useRef(new Animated.Value(0)).current;
  // Анимация для появления второго логотипа (Sanremo)
  const sanremoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Запускаем мигание квадратов
    animations.forEach((animValue, i) => {
      const { delay } = squaresConfig[i];
      const loopAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 675,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 675,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loopAnimation.start();
    });

    // Через duration мс начинаем скрывать квадраты
    const fadeTimer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // После исчезновения квадратов запускаем последовательную анимацию логотипов:
        Animated.sequence([
          // Появление первого логотипа
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.delay(3000), // логотип остается 3 секунды
          // Исчезновение первого логотипа
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.delay(500), // небольшая пауза между логотипами
          // Появление второго логотипа (Sanremo)
          Animated.timing(sanremoOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.delay(3000), // второй логотип остается 3 секунды
          // Исчезновение второго логотипа
          Animated.timing(sanremoOpacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onEnd) onEnd();
        });
      });
    }, duration);

    // Очистка при размонтировании
    return () => {
      clearTimeout(fadeTimer);
      animations.forEach((animValue) => {
        animValue.stopAnimation();
      });
    };
  }, [animations, duration, fadeOutAnim, logoOpacity, sanremoOpacity, onEnd]);return (
    <View style={styles.container}>
      {/* Контейнер квадратов */}
      <Animated.View style={[styles.loaderContainer, { opacity: fadeOutAnim }]}>
        <View style={styles.loader}>
          {squaresConfig.map((item, index) => {
            const animatedStyle = {
              opacity: animations[index],
              transform: [
                { translateX: item.left },
                { translateY: item.top },
              ],
            };
            return <Animated.View key={index} style={[styles.square, animatedStyle]} />;
          })}
        </View>
      </Animated.View>

      {/* Первый логотип */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Image
          source={require('../assets/LogoSanremo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Второй логотип (Sanremo) */}
      <Animated.View style={[styles.sanremoContainer, { opacity: sanremoOpacity }]}>
        <Image
          source={require('../assets/sanremo.png')}
          style={styles.sanremoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default Loader;

// ---------- Стили ----------
const BOX_SIZE = 10;
const WRAPPER_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    // контейнер квадратов
  },
  loader: {
    width: WRAPPER_SIZE,
    height: WRAPPER_SIZE,
    position: 'relative',
  },
  square: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: '#ddd',
    position: 'absolute',
  },
  // Позиционирование первого логотипа
  logoContainer: {
    position: 'absolute',
    top: 200, // задаем фиксированное значение, чтобы точно видеть логотип
    alignSelf: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  // Позиционирование второго логотипа
  sanremoContainer: {
    position: 'absolute',
    top: 200, // фиксированное значение для второго логотипа
    alignSelf: 'center',
  },
  sanremoImage: {
    width: 400,
    height: 220,
  },
});