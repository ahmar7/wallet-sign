import React from 'react';
import { Heading } from '@chakra-ui/react';
import GaugeChart from 'react-gauge-chart';

const TotalScore = (props) => (
  <>
    <Heading my={2} size={"lg"}>Overall Score</Heading>
    <GaugeChart
      id="gauge-chart5"
      nrOfLevels={4}
      colors={['#EA4228', '#FFA500', '#F5CD19', '#5BE12C']}
      percent={parseFloat(`.${props.combinedScore.percent}`)}
      textColor="#000"
      arcPadding={0.02}
      animate={false}
      style={{
        width: '37%', margin: '0 auto',
      }}
    />
  </>
);
export default TotalScore;
