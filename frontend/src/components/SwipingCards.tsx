import React, {useEffect, useRef, useState} from 'react';
import {Animated, PanResponder, Dimensions, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');

type Card = {
  id: string;
  image: string;
};

type SwipingCardsProps = {
  cards: Card[];
  renderCard: (card: Card) => JSX.Element;
  onSwipedRight?: (card: Card) => void;
  onSwipedLeft?: (card: Card) => void;
  onSwiping?: (dx: number) => void;
};

const SwipingCards: React.FC<SwipingCardsProps> = ({
  cards,
  renderCard,
  onSwipedRight,
  onSwipedLeft,
  onSwiping,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    FastImage.preload(cards.map(card => ({uri: card.image})));
  }, [cards]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({x: gesture.dx, y: gesture.dy});
        onSwiping && onSwiping(gesture.dx);
      },
      onPanResponderRelease: (event, gesture) => {
        const currentCard = cards[currentIndex]; // cache the current card

        if (gesture.dx > width * 0.25) {
          Animated.spring(position, {
            toValue: {x: width + 100, y: gesture.dy},
            useNativeDriver: false,
          }).start(() => {
            onSwipedRight && onSwipedRight(currentCard);
            setCurrentIndex(prev => prev + 1);
            position.setValue({x: 0, y: 0});
          });
        } else if (gesture.dx < -width * 0.25) {
          Animated.spring(position, {
            toValue: {x: -width - 100, y: gesture.dy},
            useNativeDriver: false,
          }).start(() => {
            onSwipedLeft && onSwipedLeft(currentCard);
            setCurrentIndex(prev => prev + 1);
            position.setValue({x: 0, y: 0});
          });
        } else {
          Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const renderCards = () => {
    return cards
      .slice(0, currentIndex + 2)
      .map((card, index) => {
        // If it's the next card (after the current one)
        if (index === currentIndex + 1) {
          return (
            <View
              key={card.id}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: -1,
              }}>
              {renderCard(card)}
            </View>
          );
        }

        // If it's the current card or any previous card
        if (index >= currentIndex) {
          return (
            <Animated.View
              key={card.id}
              {...(index === currentIndex ? panResponder.panHandlers : {})}
              style={[
                {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: index,
                },
                {
                  transform: [
                    {translateX: position.x},
                    {translateY: position.y},
                    {
                      rotate: position.x.interpolate({
                        inputRange: [-width / 2, 0, width / 2],
                        outputRange: ['-10deg', '0deg', '10deg'],
                      }),
                    },
                  ],
                },
              ]}>
              {renderCard(card)}
            </Animated.View>
          );
        }

        return null;
      })
      .reverse();
  };

  return <View style={{flex: 1}}>{renderCards()}</View>;
};

export default SwipingCards;
