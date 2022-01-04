import React from 'react';
import { Box, Button, Grid, GridItem, Heading, useMediaQuery } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const InfoScore = (props) =>{ 
  const [isLargerThan700H] = useMediaQuery('(min-height: 700px)')
  const [isLargerThan450W] = useMediaQuery('(min-width: 450px)')

  function retryDiv() {
    return (
      <Button
        colorScheme={props.is808 ? "white" : "black"}
        variant="link"
         mt="4"
        onClick={() => props.resetEverything()}
      >
        <ArrowBackIcon />
        Try with different wallet
      </Button>
    );
  }
  return (
  <Box  mx="auto">
    <Heading my={1} fontSize={"2xl"}>Score Breakdown</Heading>
    <Grid templateColumns="repeat(3, 1fr)" gap={2}>
      <GridItem bg="#f9f9f7" py={isLargerThan700H ?"3":"1"} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size={isLargerThan450W?"md":"sm"} mb={4} pt={2}>ETH Score</Heading>
        {props.ethScore.percent}
      </GridItem >
      <GridItem  py={isLargerThan700H ?"3":"1"} bg="#f9f9f7"  borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size={isLargerThan450W?"md":"sm"} mb={4} pt={2}>History Score</Heading>
        {props.historyScore.percent}
      </GridItem >
      <GridItem bg="#f9f9f7"  py={isLargerThan700H ?"3":"1"} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size={isLargerThan450W?"md":"sm"} mb={4} pt={2}>Transaction Score</Heading>
        {props.transactionScore.percent}       </GridItem >
    </Grid>
    {retryDiv()}
  </Box>
);}
export default InfoScore;
