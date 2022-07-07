import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import Plot from 'react-plotly.js';


const SeasonalityChart = ({code, type}) => {
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
          url = `http://127.0.0.1:8000/stats/seasonality/unity/${code.code}/year`
        }else{
          url = `http://127.0.0.1:8000/stats/seasonality/town/${code.code}/year`
        }
      }else{
        url = 'http://127.0.0.1:8000/stats/all-towns/seasonality/year'
      }
      const response = await axios.get(url, {
        headers: {"Access-Control-Allow-Origin": "*"}
      })
      setIsSending(false)
      const jsonData = JSON.parse(response.data)
      const parsedLabels = []
      for(var i=0; i<jsonData.labels.length; i++){
        parsedLabels.push(new Date(jsonData.labels[i]))
      }
      console.log(jsonData.labels)
      setLabels(parsedLabels)
      setData(jsonData.values)
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
      const parsedLabels = []
      for(var i=0; i<jsonData.labels.length; i++){
        parsedLabels.push(new Date(jsonData.labels[i]))
      }
      setLabels(parsedLabels)
      setData(jsonData.values)
      // once the request is sent, update state again
      setIsSending(false)
    })  
  }, [isSending]);

  const getYearData = () => {
    if(code){
      if(type === 'unity'){
        sendRequest(`http://127.0.0.1:8000/stats/seasonality/unity/${code.code}/year/${selectedYear}`)
      }else{
        sendRequest(`http://127.0.0.1:8000/stats/seasonality/town/${code.code}/year/${selectedYear}`)
      }
    }
    else{
      sendRequest(`http://127.0.0.1:8000/stats/all-towns/seasonality/year/${selectedYear}`)
    }
  }
  const getMonthData = () => {
    if(code){
      if(type === 'unity'){
        sendRequest(`http://127.0.0.1:8000/stats/seasonality/unity/${code.code}/month/${selectedYear}`)
      }else{
        sendRequest(`http://127.0.0.1:8000/stats/seasonality/town/${code.code}/month/${selectedYear}`)
      }
    }else{
      sendRequest(`http://127.0.0.1:8000/stats/all-towns/seasonality/month/${selectedYear}`)
    }  
  }
  const getDayData = () => {
    if(code){
      if(type === 'unity'){
        sendRequest(`http://127.0.0.1:8000/stats/seasonality/unity/${code.code}/day/${selectedYear}`)
      }else{
        sendRequest(`http://127.0.0.1:8000/stats/seasonality/town/${code.code}/day/${selectedYear}`)
      }
    }else{
      sendRequest(`http://127.0.0.1:8000/stats/all-towns/seasonality/day/${selectedYear}`)
    }
    
  }

  const selectYear = (e) => {
    setSelecteYear(e.target.value)
  }

  if(labels){
    //extracting years from labels format (dd-mm-yy)
    const extractedYears = []
    for(var i=0; i<labels.length; i++){
      extractedYears.push(labels[i].getFullYear())
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
          <div className="font-bold text-base mt-1 text-gray-300">Fréquence: </div>
          <div>
            <button className='w-20 mt-1 mx-1 bg-dark-50 hover:bg-gray-700 text-white rounded-sm' onClick={getYearData}>Année</button>
            <button className='w-20 mt-1 mx-1 bg-dark-50 hover:bg-gray-700 text-white rounded-sm' onClick={getMonthData}>Mois</button>
            <button className='w-20 mt-1 mx-1 bg-dark-50 hover:bg-gray-700 text-white rounded-sm' onClick={getDayData}>Jour</button>
          </div>
        </div>
          <Plot
            data={[{
              type: 'scatter', 
              x: labels, 
              y: data
            }]}
            layout={{
              width: 890,
              title: {text:'Mouvement saisonier de l\'évolution de la quantité de déchets', font:{color:'#d1d5db'}},
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

export default SeasonalityChart