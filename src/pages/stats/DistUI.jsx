import React from 'react';
import * as ENV from '../../Constants'
import BarGraph from '../../components/BarGraph';

const DistUI = ({ data, labels }) => {
    return (
        <BarGraph data={data} labels={labels}
          pivotIdx={Infinity} posBarColor={ENV.COLORS.DIST_BAR} 
          negBarColor={'white'}/>
    );
};

export default DistUI;
