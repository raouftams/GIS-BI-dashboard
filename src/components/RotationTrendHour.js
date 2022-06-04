import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import ZoomPlugin from  'chartjs-plugin-zoom'
import 'chartjs-plugin-zoom'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ZoomPlugin,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  scales: {
    y: {
      grid: {
        drawBorder: true,
        color: '#7c7e82'
      },
      ticks: {
        color: 'white',
      }
    },
    x: {
      ticks: {
        color: 'white',
      }
    },
  },
  plugins: {
    zoom:{
      pan:{
        enabled: true,
        mode: 'xy',
        speed: 10,
        threshold: 10
      },
      zoom: {
        wheel: {
          enabled: true // SET SCROOL ZOOM TO TRUE
        },
        pinch: {
          enabled: true
        },
        drag: true,
        mode: 'x'
      }
    },
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      color: '#d1d5db',
      bold: true,
      text: 'Evolution du nombre de rotations par heure',
    },
  },
};

const RotationTrendHour = ({code, type}) => {
  const [data, setData] = useState()
  const [labels, setLabels] = useState()
  const [currentTown, setCurrentTown] = useState()

  
  useEffect(() => {
    const getData = async () => {
      let url = ''
      if(code){
        if(type === 'unity'){
          url = `http://127.0.0.1:8000/stats/rotations/trend/hour/unity/${code.code}`
        }else{
          url = `http://127.0.0.1:8000/stats/rotations/trend/hour/town/${code.code}`
        }
      }else{
        url = `http://127.0.0.1:8000/stats/rotations/trend/all-towns/hour`
      }
      const response = await axios.get(url, {
        headers: {"Access-Control-Allow-Origin": "*"}
      })
      const jsonData = JSON.parse(response.data)
      setLabels(jsonData.rotations.labels)
      //turning data to x: y format
      const xyDataRotations = [] 
      const xyDataCompactRate = []
      for(var i=0; i<jsonData.rotations.labels.length; i++){
        xyDataRotations.push({
          x: jsonData.rotations.labels[i],
          y: jsonData.rotations.values[i]
        })
        xyDataCompactRate.push({
          x: jsonData.compact_rate.labels[i],
          y: jsonData.compact_rate.values[i]
        })

      }
      setData({
        labels: labels,
        datasets: [
          {
            label: 'Rotations/heure',
            data: xyDataRotations,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'Taux compactage moyen',
            data: xyDataCompactRate,
            borderColor: 'rgb(235, 53, 53)',
            backgroundColor: 'rgba(235, 53, 53, 0.5)',
          },
        ],
      })

    }
    if(currentTown !== code){
      setCurrentTown(code)
      getData()
    }
    
  }, [code, type, labels, currentTown]);

  
  if(data && labels){
    return(
      <div>
        <Line options={options} data={data} labels={labels} />
      </div>
    )
  }
  return (
    <div>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <p>
            <Skeleton count={1} height={30} />
            <Skeleton count={1} height={370} />
        </p>
      </SkeletonTheme>
    </div>
  )
  
}

export default RotationTrendHour