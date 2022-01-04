import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import Score from "./Score";

const MainPage = () => {
  const [is808, setIs808] = React.useState(false);
  const [bgColor, setBgColor] = React.useState("#fff");
  const [isAddress, setIsAddress] = React.useState(false);

  const handleModeChange = () => {
    setIs808(!is808);
    setBgColor(is808 ? "#fff" : "#d4dcdc");
  };

  return (
    <Box textAlign="center" fontSize="lg" bg={bgColor}>
      <SimpleGrid minH={"100vh"}>
        <FormControl
          size="lg"
          display="flex"
          mt="5"
          px="2"
     
          justifyContent="right"
        >
          <FormLabel htmlFor="email-alerts">
            808s and Heartbreak Mode?
          </FormLabel>
          <Switch id="email-alerts" onChange={handleModeChange} />
        </FormControl>
        <Score isAddress={isAddress}setIsAddress={setIsAddress}is808={is808} />
      </SimpleGrid>
    </Box>
  );
};

export default MainPage;
