import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const PieChart = ({code, type, year, month}) => {
    const [data, setData] = useState()
    const [labels, setLabels] = useState()
    const [currentTown, setCurrentTown] = useState()
    const [currentYear, setCurrentYear] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)

    useEffect(() => {
        var url = `http://127.0.0.1:8000/statistics/all-towns/vehicle-efficiency-volume/${year}/${month}`
        if(code){
          if(type && type === 'unity'){
            url = `http://127.0.0.1:8000/statistics/unity/${code}/vehicle-efficiency-volume/${year}/${month}`  
          }else{
            url = `http://127.0.0.1:8000/statistics/town/${code}/vehicle-efficiency-volume/${year}/${month}`
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
    },[currentMonth, currentYear, currentTown, type, code, year, month])
 
    return (
      <Plot
        data={[{
            type: 'pie', 
            labels: labels, 
            values: data,
            marker: {
                colors: ["#800026",'#9F0026', "#BD0026", "#D00D21", "#E31A1C", "#FC4E2A", "#FD6E33", "#FD8D3C", "#FEB24C", "#FEC661", "#FED976", "#FFEDA0", '#FFF3C0', '#FFF9DF', "#FFFFFF"]  
            }
        }]}
        layout={{
            width: 600,
            title: {text:'Taux de compactage par volume de véhicule', font:{color: '#d1d5db'}},
            plot_bgcolor:"#0F0E0E", 
            paper_bgcolor:"#0F0E0E", 
            showlegend: true,
            legend: {
              x: 1,
              xanchor: 'left',
              y: 1,
              font:{
                color: '#d1d5db'
              }
            }
        }}
      />
    )
}

export default PieChart