import React from 'react';
import * as ENV from '../../Constants'
import BarGraph from '../../components/BarGraph';

const DistUI = ({ data, labels, w=79, h=50 }) => {
    return (
        <BarGraph data={data} labels={labels}
          pivotIdx={Infinity} posBarColor={ENV.COLORS.DIST_BAR} 
          negBarColor={'white'} width={w} height={h}/>
    );
};

export default DistUI;
