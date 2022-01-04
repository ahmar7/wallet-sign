import {
  Box,
  Button,
  Heading,
  Image,
  Input,
  Text,
  Center,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { erf } from "mathjs";
import InfoScore from "./InfoScore";
import TotalScore from "./TotalScore";
import heart from "./heart.png";
import brokenheart from "./brokenheart.png";

let iterationNum = 0;

const Score = ({isAddress,setIsAddress,...props}) => {
  const [isLargerThan736] = useMediaQuery('(min-width: 736px)')
  async function scoreStarter(walletAddress) {
    // const url = process.env.REACT_APP_ALCH_URL;
    const url =
      "https://eth-mainnet.alchemyapi.io/v2/y4FtG9jOR-Vu2mHo_zYcSdDGOuLu45dc";
    const method = "alchemy_getAssetTransfers";
    const body = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params: [
          {
            fromBlock: "0x0",
            fromAddress: walletAddress,
            excludeZeroValue: false,
            category: ["external", "internal", "token"],
          },
        ],
      }),
    };
    const data = await fetchAsync(url, body, method, walletAddress);
    return data;
  }

  async function fetchAsync(url, payload, method, walletAddress) {
    let response = await fetch(url, payload);
    let data = await response.json();
    let oldestTransac = 0;
    if (method === "alchemy_getAssetTransfers") {
      if (
        iterationNum === 0 &&
        typeof data?.result !== undefined &&
        data?.result?.transfers[0] !== undefined
      ) {
        iterationNum += 1;
        const oldestBlock = await data.result.transfers[0].blockNum;
        oldestTransac = await oldestTransaction(url, oldestBlock);
        const numTransactions = data.result.transfers.length;
        const body3 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [walletAddress, "latest"],
            id: 0,
          }),
        };
        response = await fetch(url, body3);
        data = await response.json();
        const ethAmtHex = data.result;
        const ethAmount = parseInt(ethAmtHex, 16) / Math.pow(10, 18);
        data = metrics(numTransactions, ethAmount, oldestTransac);
      }
    }
    return data;
  }

  function metrics(numTransactions, ethAmount, oldestTransac) {
    const avgTranNum = 17.741;
    const stddevTranNum = 11.824;
    const avgEthAmt = 0.723;
    const stddevEthAmt = 89.319;
    const avgWalHistory = 1599244082.813;
    const stddevWalHistory = 10960560.356;
    let tPercent = Math.round(
      cdfNormal(numTransactions, avgTranNum, stddevTranNum) * 1000
    );
    let hPercent = Math.round(
      (1 - cdfNormal(oldestTransac, avgWalHistory, stddevWalHistory)) * 1000
    );
    let ePercent = 1;
    if (ethAmount !== 0) {
      ePercent = Math.round(
        cdfNormal(ethAmount, avgEthAmt, stddevEthAmt) * 1000
      );
    }
    let cPercent = Math.round((ePercent + hPercent + tPercent) / 3);
    hPercent = percentHelper(hPercent);
    tPercent = percentHelper(tPercent);
    cPercent = percentHelper(cPercent);
    ePercent = percentHelper(ePercent);
    return [
      { percent: ePercent },
      { percent: hPercent },
      { percent: tPercent },
      { percent: cPercent },
    ];
  }

  function percentHelper(percent) {
    if (percent === 0) {
      percent = 1;
    }
    if (percent === 1000) {
      percent = 999;
    }
    return `${getNumberWithOrdinal(percent)} percentile`;
  }

  function getNumberWithOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n / 10 + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function cdfNormal(x, mean, standardDeviation) {
    return (1 - erf((mean - x) / (Math.sqrt(2) * standardDeviation))) / 2;
  }

  async function oldestTransaction(url, oldestBlock) {
    const body2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [oldestBlock, true],
        id: 0,
      }),
    };
    const response = await fetch(url, body2);
    const data = await response.json();
    const oldestTimestamp = data.result.timestamp;
    const tsSec = parseInt(oldestTimestamp, 16);
    return tsSec;
  }

  // let isAddress = false;
  setIsAddress(false)
  let isLoading = false;
  let isScore = false;
  let addVal = "Address is not valid";
  const [ethScore, setEthScore] = useState({ percent: "" });
  const [historyScore, setHistoryScore] = useState({ percent: "" });
  const [transactionScore, setTransactionScore] = useState({ percent: "" });
  const [combinedScore, setCombinedScore] = useState({ percent: "" });
  const [address, setAddress] = React.useState("");

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  function walletScoreDiv() {
    return (
      <Box >
        <Heading size={isLargerThan736 ? "2xl":"xl"} color={props.is808 === true ? "#829294" : null}>
          Wallet Score
        </Heading>{" "}
        <Text
          fontSize={isLargerThan736 ? "xl":"lg"}
          my={isLargerThan736?2:0}
          color={props.is808 === true ? "#f9f7f7" : null}
        >
          A credit score for ETH wallets{" "}
        </Text>
      </Box>
    );
  }
  function brokenHeartDiv() {
    if (props.is808) {
      return (
        <Center verticalAlign={"center"} >
     <Image
            src={brokenheart}
            boxSize={isLargerThan736?'120px':"80px"}
            align="right"
            alt="808s Heart"
            loading="lazy"
          />
        </Center>
      );
    }
    return null;
  }
  function heartDiv() {
    if (props.is808) {
      return (
       
        <Center  verticalAlign={"center"}>
          <Image
            src={heart}
            boxSize={isLargerThan736?'120px':"80px"}
            align="right"
            alt="808s Heart"
            loading="lazy"
          />
        </Center>
      );
    }
    return null;
  }
  function valDiv() {
   
    return (
      <Text   
      color={props.is808?"#c9312f":null}fontSize={isLargerThan736?"2xl":"xl"}>
        {addVal}
      </Text>
    );
  }
  function resetEverything() {
    iterationNum = 0;
    // isAddress = false;
    setIsAddress(false)
    isLoading = false;
    isScore = false;
    addVal = "Address is not valid";
    setAddress("");
    setEthScore({ percent: "" });
    setHistoryScore({ percent: "" });
    setTransactionScore({ percent: "" });
    setCombinedScore({ percent: "" });
  }
 

  function walDiv() {
    if (props.is808) {
      return (
        <Flex align={"center"} justify={"center"} flexDirection={"column"}>
          <Input
            value={address}
            onChange={handleChange}
            placeholder="Wallet Address (no contracts, starts with 0x, 42 characters long)"
            size="lg"
            mb={4}
            isInvalid={!isAddress.length}
          />{" "}
          <Button
            colorScheme="whiteAlpha"
            variant="link"
            onClick={() =>
              setAddress("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B")
            }
          >
            <Text fontSize="lg" mb={6}   _hover={{color:"#4e5bb7"}} color="#e1e8e8">
              {" "}
              Try it with Vitalik's wallet
            </Text>
          </Button>{" "}
        </Flex>
      );
    }
    return (
      <Flex align={"center"} justify={"center"} flexDirection={"column"}>
        <Input
          value={address}
          onChange={handleChange}
          placeholder="Wallet Address (no contracts, starts with 0x, 42 characters long)"
          size="lg"
          mb={4}
          isInvalid={!isAddress}
        />{" "}
        <Button
          colorScheme="black"
          variant="link"
          my="3"
          _hover={{color:"#4e5bb7"}}
          onClick={() =>
            setAddress("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B")
          }
        >
          Try it with Vitalik's wallet
        </Button>{" "}
      </Flex>
    );
  }
  useEffect(() => {
    if (address?.startsWith("0x") && address.length == 42) {
      async function fetchMyAPI() {
        const answer = await scoreStarter(address);
        const ans = await answer;
        if (typeof ans !== undefined && ans.length > 0) {
          setEthScore((ethScore) => ({
            ...ethScore,
            percent: ans[0].percent,
          }));
          setHistoryScore((historyScore) => ({
            ...historyScore,
            percent: ans[1].percent,
          }));
          setTransactionScore((transactionScore) => ({
            ...transactionScore,
            percent: ans[2].percent,
          }));
          setCombinedScore((combinedScore) => ({
            ...combinedScore,
            percent: ans[3].percent,
          }));
        }
      }
      fetchMyAPI();
    }
  }, [
    address,
    scoreStarter,
    ethScore,
    historyScore,
    transactionScore,
    combinedScore,
  ]);

  if (address?.startsWith("0x") && address.length === 42) {
    addVal = address;
    // isAddress = true;
    setIsAddress(true)
    isLoading = true;
    if (
      combinedScore !== undefined &&
      combinedScore.percent !== undefined &&
      combinedScore.percent !== ""
    ) {
      isLoading = false;
    }
  }
  if (isAddress && !isLoading) {
    isScore = true;
  }
  return (
    <Box
      maxW={"95vw"}
      minW={"75vw"}
      mt={"39px"}
      mx="auto"
    
      alignItems="center"
    >
      {walletScoreDiv()}
      {!isAddress && <>{walDiv()}</>}
      {!isAddress && <>{brokenHeartDiv()}</>}
      {isScore && <>{heartDiv()}</>}
      {isAddress && <Heading>Address</Heading>}
      {valDiv()}
      {isLoading && (
        <Button
          isLoading
          loadingText="Loading"
          colorScheme="black"
          variant="outline"
          spinnerPlacement="start"
        />
      )}
      {isScore && (
        <Box alignItems="center">
          <TotalScore combinedScore={combinedScore} />
          <InfoScore
          resetEverything={resetEverything}
            is808={props.is808}
            ethScore={ethScore}
            historyScore={historyScore}
            transactionScore={transactionScore}
          />
        </Box>
      )}
    </Box>
  );
};

export default Score;
