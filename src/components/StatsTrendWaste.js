import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';


const StatsTrendWaste = ({code, type, year, month}) => {
    const [data, setData] = useState()
    const [labels, setLabels] = useState()
    const [currentTown, setCurrentTown] = useState()
    const [currentYear, setCurrentYear] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)

    useEffect(() => {
        var url = `http://127.0.0.1:8000/statistics/all-towns/waste-trend-hour/${year}/${month}`
        if(code){
          if(type && type === 'unity'){
            url = `http://127.0.0.1:8000/statistics/unity/${code}/waste-trend-hour/${year}/${month}`  
          }else{
            url = `http://127.0.0.1:8000/statistics/town/${code}/waste-trend-hour/${year}/${month}`
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

        if(currentMonth !== month || currentYear !== year || currentTown !== code){
            getData()
            setCurrentMonth(month)
            setCurrentYear(year)
            setCurrentTown(code)
        }
    },[currentMonth, currentYear, currentTown, year, month, code, type])

    
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