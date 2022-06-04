import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
      text: 'Quantité de déchet par saison (moy/jour) kg',
    },
  },
};



const SeasonBarChart = ({code, type}) => {
    const [data, setData] = useState()
    const [labels, setLabels] = useState()
    const [currentTown, setCurrentTown] = useState()

    useEffect(() => {
      let url = ""
      if(code){
        if(type && type === 'unity'){
          url = `http://127.0.0.1:8000/stats/waste/season/unity/${code.code}`
        }else{
          url = `http://127.0.0.1:8000/stats/waste/season/town/${code.code}`
        }
      }else{
        url = 'http://127.0.0.1:8000/stats/waste/season'
      }

      const getData = async () => {
        const response = await axios.get(url, {
          headers: {"Access-Control-Allow-Origin": "*"}
        })

        const jsonData = JSON.parse(response.data)
        setLabels(jsonData.labels)

        setData({
          labels,
          datasets: [
            {
              label: 'Quantité déchet',
              data: jsonData.values,
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

    if(!data){
        return (
          <div>
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <p>
                    <Skeleton count={1} height={400} />
                </p>
            </SkeletonTheme>
          </div>
        )
    }   
    return <Bar options={options} data={data} />;
}

export default SeasonBarChart