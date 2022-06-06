import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
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
    legend: {
      position: 'top',
    },
    title: {
      color: '#d1d5db',
      bold: true,
      display: true,
      text: 'Quantité de déchet',
    },
  },
};



const StatsTrendWaste = ({code, type, year, month}) => {
    const [data, setData] = useState()
    const [labels, setLabels] = useState()
    const [currentTown, setCurrentTown] = useState()
    const [currentYear, setCurrentYear] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        var url = `http://127.0.0.1:8000/statistics/all-towns/waste-trend-hour/${year}/${month}`
        if(code){
          if(type && type === 'unity'){
            url = `http://127.0.0.1:8000/stats/waste/holidays/unity/${code.code}`  
          }else{
            url = `http://127.0.0.1:8000/stats/waste/holidays/town/${code.code}`
          }
        }
        const getData = async () => {
            const response = await axios.get(url, {
            headers: {"Access-Control-Allow-Origin": "*"}
            })

            const jsonData = JSON.parse(response.data)
            setLabels(jsonData.labels)
            setData(jsonData.values)
        }

        if(currentMonth !== month || currentYear !== year){
            getData()
            setCurrentMonth(month)
            setCurrentYear(year)
        }
    },[currentMonth, currentYear, year, month])

    return (
      <Plot
        data={[{
          type: 'scatter', 
          x: labels, 
          y: data,
          marker: {
            color: '#F03423'  
          }
        }]}
        layout={{
          title: {text:'Quantity de déchets par heure (T/H)', font:{color:'#d1d5db'}},
          xaxis:{
            color: '#d1d5db'
          },
          yaxis:{
            color: '#d1d5db'
          }, 
          plot_bgcolor:"#0F0E0E", 
          paper_bgcolor:"#0F0E0E",
        }}
        
      />
    )
}

export default StatsTrendWaste