import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import HolidayBarChart from '../components/HolidayBarChart'
import Maps from '../components/Map'
import NavBar from '../components/NavBar'
import SeasonalityChart from '../components/SeasonalityChart'
import SeasonBarChart from '../components/SeasonBarChart'
import TrendChart from '../components/TrendChart'
import RotationIcon from '../images/RotationIcon'
import VehicleIcon from '../images/VehicleIcon'
import WasteBinIcon from '../images/WasteBinIcon'
import UserIcon from '../images/UserIcon'

import './main.css'


const Town = () => {
    const townCode = useParams()
    const [townInfo, setTownInfo] = useState()
    useEffect(() => {
        const url = `http://127.0.0.1:8000/stats/info/town/${townCode.code}`
        const getData = async () =>{
            const response = await axios.get(url, {
                headers: {"Access-Control-Allow-Origin": "*"}
            });
            setTownInfo(JSON.parse(response.data))
        }

        getData()
        
    }, [townCode])

    return (
        <div className='body'>
            <NavBar/>
            <div className='flex justify-between'>
              <div className='h-full w-1/5'>
                <Card title={'Rotations'} image={<RotationIcon/>} value={townInfo ? townInfo.rotations : 0}/>
                <Card title={'Quantité déchets (T)'} image={<WasteBinIcon/>} value={townInfo ? Math.floor(townInfo.waste_qte/1000) : 0}/>
                <Card title={'Véhicules utilisés'} image={<VehicleIcon/>} value={townInfo ? townInfo.used_vehicles : 0}/>
              </div>
        
              <div className='w-2/3 h-2/4 mt-3'>
                  <Maps selected={townCode}/>
              </div>
              <div className='h-full w-1/5'>
                <Card title={'Rotations/Jour'} image={<RotationIcon/>} value={townInfo ? townInfo.rotations_by_day : 0}/>
                <Card title={'Ratio'} image={<WasteBinIcon/>} value={townInfo ? townInfo.ratio : 0}/>
                <Card title={'Population'} image={<UserIcon/>} value={townInfo ? townInfo.population : 0}/>
              </div>
            </div>
            <div className='flex justify-around mt-2 mx-4'>
                <div className='w-3/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                    <TrendChart code={townCode} />
                </div>
                <div className='w-2/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                    <HolidayBarChart code={townCode} />
                </div>
            </div>
            <div className='flex justify-around mt-2 mx-4'>
                <div className='w-2/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                    <SeasonBarChart code={townCode} />
                </div>
                <div className='w-4/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                    <SeasonalityChart code={townCode} />
                </div>
            </div>
        </div>
    )
}   

export default Town