import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react'
import { Line } from 'react-chartjs-2';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
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
      text: 'Evolution de la quantité de déchets',
    },
  },
};

const TrendChart = ({code, type}) => {
  const [data, setData] = useState()
  const [labels, setLabels] = useState()
  const [years, setYears] = useState()
  const [currentTown, setCurrentTown] = useState()
  const [selectedYear, setSelecteYear] = useState('')
  const [isSending, setIsSending] = useState(false)

  
  useEffect(() => {
    const getData = async () => {
      setIsSending(true)
      let url = ''
      if(code){
        if(type === 'unity'){
          url = `http://127.0.0.1:8000/stats/trend/unity/${code.code}/year`
        }else{
          url = `http://127.0.0.1:8000/stats/trend/town/${code.code}/year`
        }
      }else{
        url = 'http://127.0.0.1:8000/stats/all-towns/trend/year'
      }
      const response = await axios.get(url, {
        headers: {"Access-Control-Allow-Origin": "*"}
      })
      setIsSending(false)
      const jsonData = JSON.parse(response.data)
      setLabels(jsonData.labels)
      //turning data to x: y format
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


  const sendRequest = useCallback(async (url) => {
    // don't send again while we are sending
    if (isSending) return
    // update state
    setIsSending(true)
    // send the actual request
    await axios.get(url, {
      headers: {"Access-Control-Allow-Origin": "*"}
    }).then((response) => {
      const jsonData = JSON.parse(response.data)
      const xyData = []
      for(var i=0; i<jsonData.labels.length; i++){
        xyData.push({
          x: jsonData.labels[i],
          y: jsonData.values[i]
        })
      }
      setLabels(jsonData.labels)
      setData({
        labels: jsonData.labels,
        datasets: [
          {
            label: 'Quantité déchet',
            data: xyData,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      })
      // once the request is sent, update state again
      setIsSending(false)
    })  
  }, [isSending]);

  const getYearData = () => {
    if(code){
      if(type === 'unity'){
        sendRequest(`http://127.0.0.1:8000/stats/trend/unity/${code.code}/year/${selectedYear}`)
      }else{
        sendRequest(`http://127.0.0.1:8000/stats/trend/town/${code.code}/year/${selectedYear}`)
      }
    }
    else{
      sendRequest(`http://127.0.0.1:8000/stats/all-towns/trend/year/${selectedYear}`)
    }
  }
  const getMonthData = () => {
    if(code){
      if(type === 'unity'){
        sendRequest(`http://127.0.0.1:8000/stats/trend/unity/${code.code}/month/${selectedYear}`)
      }else{
        sendRequest(`http://127.0.0.1:8000/stats/trend/town/${code.code}/month/${selectedYear}`)
      }
    }else{
      sendRequest(`http://127.0.0.1:8000/stats/all-towns/trend/month/${selectedYear}`)
    }  
  }
  const getDayData = () => {
    if(code){
      if(type === 'unity'){
        sendRequest(`http://127.0.0.1:8000/stats/trend/unity/${code.code}/day/${selectedYear}`)
      }else{
        sendRequest(`http://127.0.0.1:8000/stats/trend/town/${code.code}/day/${selectedYear}`)
      }
    }else{
      sendRequest(`http://127.0.0.1:8000/stats/all-towns/trend/day/${selectedYear}`)
    }
    
  }

  const selectYear = (e) => {
    setSelecteYear(e.target.value)
  }

  if(labels){
    //extracting years from labels format (dd-mm-yy)
    const extractedYears = []
    for(var i=0; i<labels.length; i++){
      extractedYears.push("20".concat(labels[i].substring(6, 8)))
    }
    if(!years){
      setYears(Array.from(new Set(extractedYears)))
    }
  }
  
  if(data && labels && years){
    return(
      <div>
        <div className='flex justify-between mx-10'>
          <div className="font-bold text-base mt-1 text-gray-300">Filtres: </div>
          <select className='w-1/5 bg-dark-50 text-white rounded-sm mt-1' onChange={selectYear}>
            <option defaultChecked value={''}>Sélectionner</option>
            {years.map((date) =>(
              <option value={date} key={date}>{date}</option>
            ))}
          </select>
          <div className="font-bold text-base mt-1 text-gray-300">Décomposition: </div>
          <div>
            <button className='w-20 mt-1 mx-1 bg-dark-50 hover:bg-gray-700 text-white rounded-sm' onClick={getYearData}>Année</button>
            <button className='w-20 mt-1 mx-1 bg-dark-50 hover:bg-gray-700 text-white rounded-sm' onClick={getMonthData}>Mois</button>
            <button className='w-20 mt-1 mx-1 bg-dark-50 hover:bg-gray-700 text-white rounded-sm' onClick={getDayData}>Jour</button>
          </div>
        </div>
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

export default TrendChart