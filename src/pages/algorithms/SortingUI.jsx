import React from 'react';
import * as ENV from '../../Constants'
import BarGraph from '../../components/BarGraph';

const SortingUI = ({ data, pivotIdx }) => {
  return (
    <BarGraph data={data} labels={data}
      pivotIdx={pivotIdx} negBarColor={ENV.COLORS.SORT_NEG_BAR} 
      posBarColor={ENV.COLORS.SORT_POS_BAR}/>
  );
};

export default SortingUI;
