import { useEffect, useRef } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { usePartialRender } from './usePartialRender';

const list = Array(10000)
  .fill(0)
  .map((_, index) => index + 1);

const Grid = ({ left, top }: any) => {
  const ref = useRef(null);
  const elementHeight = 62;
  const elementSize = 164;

  const vertical = usePartialRender({
    ref,
    elementSize: elementHeight,
    verticalRef: left,
  });

  const horizontal = usePartialRender({
    ref,
    elementSize,
    direction: 'horizontal',
    horizontalRef: top,
  });

  const horizontalList = list.slice(horizontal.from, horizontal.to);
  const verticalList = list.slice(vertical.from, vertical.to);

  // console.log(vertical, horizontal);

  return (
    <Box
      className="hide-scrollbar"
      ref={ref}
      h="full"
      w="full"
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
              boxSizing="border-box"
              align="center"
              justify="center"
            >
              {`${row} - ${column}`}
            </Flex>
          ))}
        </Flex>
      ))}
    </Box>
  );
};

const App = () => {
  const refLeft = useRef(null);
  const refHeader = useRef(null);
  const elementHeight = 62;
  const elementSize = 164;

  // const vertical = usePartialRender({
  //   ref: refLeft,
  //   elementSize: elementHeight,
  // });
  // const horizontal = usePartialRender({
  //   ref: refLeft,
  //   elementSize: elementHeight,
  // });

  // const verticalList = list.slice(vertical.from, vertical.to);

  return (
    <Box id="PARENT" h="100vh" padding="10">
      <Box id="calendar" h="full">
        <Flex id="header" ml="55px" overflowX="hidden" ref={refHeader}>
          {list.map((item) => (
            <Box
              key={item}
              bg="gray.100"
              height="40px"
              minW="164px"
              boxSizing="border-box"
              border="1px"
              borderColor="gray.300"
            >
              {item}
            </Box>
          ))}
        </Flex>
        <Flex id="body" h="90%">
          <Box id="left" ref={refLeft} minW="55px" overflowY="hidden" h="full">
            {list.map((item) => (
              <Box
                key={item}
                bg="red.100"
                height="62px"
                minW="55px"
                boxSizing="border-box"
                border="1px"
                borderColor="red.300"
              >
                {item}
              </Box>
            ))}
          </Box>
          <Grid left={refLeft} top={refHeader} />
        </Flex>
      </Box>
    </Box>
  );
};

export default App;
