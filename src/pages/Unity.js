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
import RotationTrend from '../components/RotationTrend'
import './main.css'


const Unity = () => {
    const unityCode = useParams()
    const [unityInfo, setUnityInfo] = useState()
    useEffect(() => {
        const url = `http://127.0.0.1:8000/stats/info/unity/${unityCode.code}`
        const getData = async () =>{
            const response = await axios.get(url, {
                headers: {"Access-Control-Allow-Origin": "*"}
            });
            setUnityInfo(JSON.parse(response.data))
        }

        getData()
        
    }, [unityCode])

    return (
        <div className='body'>
            <NavBar/>
            <div className='flex justify-between'>
              <div className='h-full w-1/5'>
                <Card title={'Rotations'} image={<RotationIcon/>} value={unityInfo ? unityInfo.rotations : 0}/>
                <Card title={'Quantité déchets (T)'} image={<WasteBinIcon/>} value={unityInfo ? Math.floor(unityInfo.waste_qte/1000) : 0}/>
                <Card title={'Véhicules utilisés'} image={<VehicleIcon/>} value={unityInfo ? unityInfo.used_vehicles : 0}/>
              </div>
        
              <div className='w-2/3 h-2/4 mt-3'>
                  <Maps selected={unityCode} type={'unity'}/>
              </div>
              <div className='h-full w-1/5'>
                <Card title={'Rotations/Jour'} image={<RotationIcon/>} value={unityInfo ? unityInfo.rotations_by_day : 0}/>
                <Card title={'Ratio'} image={<WasteBinIcon/>} value={unityInfo ? parseFloat(unityInfo.ratio).toFixed(5) : 0}/>
                <Card title={'Population'} image={<UserIcon/>} value={unityInfo ? unityInfo.population : 0}/>
              </div>
            </div>
            
            <div className='h-auto mx-4 bg-dark-100 rounded overflow-hidden shadow-lg'>
                <TrendChart code={unityCode} type={'unity'}/>
            </div>
            <div className='flex justify-around mt-2 mx-4'>
                <div className='w-2/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                    <SeasonBarChart code={unityCode} type={'unity'}/>
                </div>
                <div className='w-4/5 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                    <SeasonalityChart code={unityCode} type={'unity'} />
                </div>
            </div>
            <div className='flex justify-around mt-2 mx-4'>
              <div className='w-3/6 h-auto mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                <RotationTrend code={unityCode} type={'unity'}/>
              </div>
              <div className='w-3/6 h-auto ml-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                <HolidayBarChart code={unityCode} type={'unity'}/>
              </div>
            </div>
        </div>
    )
}   

export default Unity