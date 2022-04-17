import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import ZoomPlugin from  'chartjs-plugin-zoom'
import 'chartjs-plugin-zoom'
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

const SeasonalityChart = ({code, type}) => {
  const [data, setData] = useState()
  const [labels, setLabels] = useState()
  const [currentTown, setCurrentTown] = useState()

  useEffect(() => {
    let url = ""
    if(code){
      if(type && type === 'unity'){
        url = `http://127.0.0.1:8000/stats/seasonality/unity/${code.code}/year`
      }else{
        url = `http://127.0.0.1:8000/stats/seasonality/town/${code.code}/year`
      }
    }else{
      url = 'http://127.0.0.1:8000/stats/all-towns/seasonality/year'
    }
    
    const getData = async () => {
      const response = await axios.get(url, {
        headers: {"Access-Control-Allow-Origin": "*"}
      })
      
      const jsonData = JSON.parse(response.data)
      setLabels(jsonData.labels)
      const xyData = []
      for(var i=0; i<jsonData.labels.length; i++){
        xyData.push({
          x: jsonData.labels[i],
          y: jsonData.values[i]
        })
      }
      setData({
        labels: labels,
        datasets: [
          {
            label: 'Quantité déchet',
            data: xyData,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      })

    }
    if(currentTown !== code){
      setCurrentTown(code)
      getData()
    }
    
  }, [code, type, labels, currentTown]);

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
      }
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
        text: 'Saisonalité de la quantité de déchets',
      },
    }
  };

  if(data && labels){
    return (
      <Line options={options} data={data} labels={labels} />
    )
  }
  return null
  
}

export default SeasonalityChart