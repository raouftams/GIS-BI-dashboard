import React from 'react'
import Card from '../components/Card'
import Map from '../components/Map'
import NavBar from '../components/NavBar'
import VehicleIcon from '../images/VehicleIcon'

import './main.css'

const Main = () => {
  return (
    <div className='body'>
        <NavBar/>
        <div className='flex justify-between'>
          <div className='w-2/3 h-full'>
              <Map/>
          </div>
          <div className='w-2/6 h-full'>
            <Card title={'Rotations effectuées'} image={<VehicleIcon/>} value={'2000'}/>
            <Card title={'Rotations effectuées'} image={<VehicleIcon/>} value={'2000'}/>
            <Card title={'Rotations effectuées'} image={<VehicleIcon/>} value={'2000'}/>
            <Card title={'Rotations effectuées'} image={<VehicleIcon/>} value={'2000'}/>
          </div>
        </div>
    </div>
  )
}

export default Main