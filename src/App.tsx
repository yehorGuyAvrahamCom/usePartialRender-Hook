import { useRef } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { usePartialRender } from './usePartialRender';

const list = Array(30)
  .fill(0)
  .map((_, index) => index + 1);

const App = () => {
  const ref = useRef(null);
  const elementHeight = 62;
  const elementSize = 164;

  const vertical = usePartialRender({
    ref,
    elementSize: elementHeight,
  });

  const horizontal = usePartialRender({
    ref,
    elementSize,
    direction: 'horizontal',
  });

  const horizontalList = list.slice(horizontal.from, horizontal.to);
  const verticalList = list.slice(vertical.from, vertical.to);

  return (
    <Flex align="center" justify="center" w="100vw" h="100vh">
      <Box
        className="hide-scrollbar"
        ref={ref}
        h="600px"
        w="600px"
        overflow="auto"
        bg="gray.50"
      >
        {verticalList.map((row, rowIndex) => (
          <Flex key={rowIndex}>
            {horizontalList.map((column, columnIndex) => (
              <Flex
                key={columnIndex}
                minW={`${elementSize}px`}
                h={`${elementHeight}px`}
                border="1px"
                borderColor="gray.200"
                align="center"
                justify="center"
              >
                {`${row} - ${column}`}
              </Flex>
            ))}
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default App;
