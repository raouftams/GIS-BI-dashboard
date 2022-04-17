import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../components/Card'
import Maps from '../components/Map'
import NavBar from '../components/NavBar'
import RotationIcon from '../images/RotationIcon'
import WasteBinIcon from '../images/WasteBinIcon'
import SeasonalityChart from '../components/SeasonalityChart'
import SeasonBarChart from '../components/SeasonBarChart'
import TrendChart from '../components/TrendChart'
import HolidayBarChart from '../components/HolidayBarChart'

import './main.css'
import VehicleIcon from '../images/VehicleIcon'

const Main = () => {
  const [info, setinfo] = useState()
  useEffect(() => {
      const url = `http://127.0.0.1:8000/stats/info/all-towns`
      const getData = async () =>{
          const response = await axios.get(url, {
              headers: {"Access-Control-Allow-Origin": "*"}
          });
          setinfo(JSON.parse(response.data))
      }
      getData()
      
  }, [])

  return (
    <div className='body'>
        <NavBar/>
        <div className='flex justify-between'>
          <div className='w-1/5 h-full'>
            <Card title={'Rotations'} image={<RotationIcon/>} value={info ? info.rotations : 0}/>
            <Card title={'Quantité déchets (T)'} image={<WasteBinIcon/>} value={info ? Math.floor(info.waste_qte/1000) : 0}/>
            <Card title={'Véhicules'} image={<VehicleIcon/>} value={info ? info.vehicles : 0}/>
          </div>
          <div className='w-11/12 mt-3 mr-4'>
              <Maps/>
          </div>
        </div>
        <div className='flex justify-around mt-2 mx-4'>
          <div className='w-3/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
            <TrendChart code={null}/>
          </div>
          <div className='w-2/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
            <HolidayBarChart code={null}/>
          </div>
        </div>
          <div className='flex justify-around mt-2 mx-4'>
            <div className='w-2/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
              <SeasonBarChart code={null}/>
            </div>
            <div className='w-4/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
              <SeasonalityChart code={null}/>
            </div>
          </div>
    </div>
  )
}

export default Main