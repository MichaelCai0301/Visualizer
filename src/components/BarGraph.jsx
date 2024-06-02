import React from 'react';

const BarGraph = ({ data, labels, pivotIdx, negBarColor, posBarColor,
  width=79, height=50}) => {
  const posMax = Math.max(...data);
  const negMax = Math.min(...data);
  const maxVal = Math.max(Math.abs(negMax), posMax);

  return (
    <div 
      className="bar-graph"
      style={{
        width: `${width}%`,
        height: `${height}%`
      }}
    >
      {data.map((value, index) => (
        <div key={index} className="bar-container">
          <div
            className="bar"
            style={{
              width: '100%',
              backgroundColor: 
                `${pivotIdx == index ? 'red' : 
                  value < 0 ? negBarColor : posBarColor}`,
              display: 'flex',
              justifyContent: 'center',
              height: `${value == 0 ? 0.2 : Math.abs(value)/maxVal*10}vh`,
              color: 'white',
              fontWeight: 'bold',
              transition: 'height 0.3s ease',
              position: 'relative',
              top: `${value < 0 ? Math.abs(value)/maxVal*10 : 0}vh`,
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div>{pivotIdx == index && '(PIVOT)'}</div>
            <div>{labels[index]}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarGraph;
