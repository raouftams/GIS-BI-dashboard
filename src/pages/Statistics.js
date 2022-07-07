import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import StatsMap from '../components/StatsMap'
import Card from '../components/Card'
import RotationIcon from '../images/RotationIcon'
import WasteBinIcon from '../images/WasteBinIcon'
import VehicleIcon from '../images/VehicleIcon'
import axios from 'axios'
import BarChart from '../components/BarChart'
import PieChart from '../components/PieChart'
import StatsTrendWaste from '../components/StatsTrendWaste'
import DaysBarChart from '../components/DaysBarChart'

const Statistics = () => {
    const parameters = useParams()
    const navigate = useNavigate()
    const [cardsData, setCardsData] = useState()
    const [months, setMonths] = useState()
    const [years, setYears] = useState()
    const [selectedYear, setSelectedYear] = useState()
    const [selectedMonth, setSelectedMonth] = useState()


    const loadTowns = () => {
      navigate("/stats/town/".concat([parameters.dataType, parameters.year, parameters.month].join('/')))
    }

    const loadUnities = () => {
      navigate("/stats/unity/".concat([parameters.dataType, parameters.year, parameters.month].join('/')))
    }

    const loadQuantityData = () => {
      if(parameters.code){
        navigate(`/stats/${parameters.type}/quantity/${parameters.year}/${parameters.month}/${parameters.code}`)
      }else{

      navigate(`/stats/${parameters.type}/quantity/${parameters.year}/${parameters.month}`)
      }
    }

    const loadEfficiencyData = () => {
      if(parameters.code){
        navigate(`/stats/${parameters.type}/efficiency/${parameters.year}/${parameters.month}/${parameters.code}`)
      }
      else{
        navigate(`/stats/${parameters.type}/efficiency/${parameters.year}/${parameters.month}`)
      }
    }

    const changeYear = (e) => {
      setSelectedYear(e.target.value)
    }
    const changeMonth = (e) => {
      setSelectedMonth(e.target.value)
    }
    const filterData = () => {
      if(parameters.code){
        navigate(`/stats/${parameters.type}/${parameters.dataType}/${selectedYear}/${selectedMonth}/${parameters.code}`)
      }else{
        navigate(`/stats/${parameters.type}/${parameters.dataType}/${selectedYear}/${selectedMonth}`)
      }
    }

    useEffect(() => {
      const getTimeData = async () =>{
        const response = await axios.get('http://127.0.0.1:8000/statistics/temporel/years-months', {
          headers: {"Access-Control-Allow-Origin": "*"}
        })
        const data = response.data
        const keys = Object.keys(data)
        setYears(keys)
        const values = Object.values(data)
        setMonths(values[values.length - 1])
      }
      if(!months || !years){
        getTimeData()
      }
  
      //get general Informations 
      const getCardsData = async () => {
        var url = `http://127.0.0.1:8000/statistics/all-towns/info/${parameters.year}/${parameters.month}`
        if(parameters.code){
          url = `http://127.0.0.1:8000/statistics/${parameters.type}/${parameters.code}/info/${parameters.year}/${parameters.month}`
        }
        const response = await axios.get(url, {
            headers: {"Access-Control-Allow-Origin": "*"}
        })
        setCardsData(JSON.parse(response.data))
      }
      getCardsData()
        
    }, [parameters, months, years])

    return (
        <div>
            <NavBar/>
            <div className='flex justify-between'>
                <div className='w-1/4 h-full'>
                    <Card title={'Rotations'} image={<RotationIcon/>} value={cardsData? cardsData.nb_rotations: 0}/>
                    <Card title={'Quantité déchets (T)'} image={<WasteBinIcon/>} value={cardsData? parseFloat(cardsData.waste_qte).toFixed(2): 0}/>
                    <Card title={'Véhicules utilisés'} image={<VehicleIcon/>} value={cardsData? cardsData.nb_vehicles: 0}/>
                </div>
                <div className='w-2/3 h-2/4 mt-3'>
                    {parameters ?
                        <StatsMap selected={parameters.code} type={parameters.type} dataName={parameters.dataType} filter={{"year": parameters.year, "month": parameters.month}}/>
                    :
                        null
                    }  
                </div>
                <div className='w-1/4 h-80 mt-5 mx-5 bg-dark-100 rounded shadow-lg overflow-hidden'>
                    <p className='text-gray-300 font-bold text-center pt-3'>Filtres</p>
                    <div className='flex-col justify-center ml-7 mt-2'>
                        <div className='flex-col justify-center'>
                            <div className='flex justify-between mr-5'>
                                <label className='text-white mt-1'>Année:</label>
                                {years != null ?
                                <select className='w-28 h-6 mt-2 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onChange={changeYear}>
                                  <option value="" defaultChecked>année</option>
                                  {years.map((year) =>(
                                    <option value={year} key={year}>{year}</option>
                                  ))}
                                </select>
                                : 
                                <select className='w-28 h-6 mt-2 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm'>
                                  <option value={""}>Loading</option>
                                </select> 
                                }
                          </div>
                          <div className='flex justify-between mr-5'>
                            <label className='text-white mt-1'>Mois:</label>
                            {months != null ?
                            <select className='w-28 h-6 mt-2 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onChange={changeMonth}>
                              <option value="" defaultChecked>mois</option>
                              {months.map((month) =>(
                                <option value={month} key={month}>{month}</option>
                              ))}
                            </select>
                            : 
                            <select className='w-28 h-6 mt-2 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm'>
                              <option value={""}>Loading</option>
                            </select> 
                            }
                          </div>
                        </div>
                    <div className='flex justify-around'>
                      <button className='w-28 h-6 mt-2 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={filterData}>Filtrer</button>
                    </div>
                  </div>
                  <p className='text-gray-300 font-bold text-center pt-4 mt-2'>Données géographiques</p>
                  <div className='flex justify-center mt-2'>
                    <button className='w-24 mx-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={loadTowns}>communes</button>
                    <button className='w-20 mx-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={loadUnities}>unités</button>
                  </div>
                  <p className='text-gray-300 font-bold text-center pt-4 mt-2'>Maps</p>
                  <div className='flex justify-center mt-2'>
                    <button className='w-24 mx-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={loadQuantityData}>Quantité</button>
                    <button className='w-20 mx-1 bg-dark-50 hover:bg-gray-700 text-gray-300 rounded-sm' onClick={loadEfficiencyData}>Efficacité</button>
                  </div>
                </div>
            </div>
            <div className='flex justify-between'>
              <div className='w-1/3'>
                <Card title={'Rotations par jour'} image={<RotationIcon/>} value={cardsData? cardsData.nb_rotations_day: 0}/>
              </div>
              <div className='w-1/3'>
                <Card title={'Quantité déchets par jour (T)'} image={<WasteBinIcon/>} value={cardsData? parseFloat(cardsData.waste_qte_day).toFixed(2): 0}/>
              </div>
              <div className='w-1/3'>
                <Card title={'Taux compactage moyen'} image={<VehicleIcon/>} value={cardsData? parseFloat(cardsData.compact_rate).toFixed(2): 0}/>                  
              </div>
              <div className='w-1/3'>
                <Card title={'Ratio (kg/hab/jour)'} image={<WasteBinIcon/>} value={cardsData? parseFloat(cardsData.ratio).toFixed(2): 0}/>                  
              </div>
            </div>
            <div className='flex justify-around mt-2 mx-4'>
              <div className='w-auto h-full mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                {parameters ?
                  <BarChart code={parameters.code} type={parameters.type} year={parameters.year} month={parameters.month} />
                :
                  null
                }
              </div>
              <div className='w-auto h-full mx-1 bg-dark-100 rounded overflow-hidden shadow-lg'>
                {parameters ?
                  <PieChart code={parameters.code} type={parameters.type} year={parameters.year} month={parameters.month} />
                :
                  null
                }
              </div>
            </div>
            <div className='flex justify-around mt-2 mx-4'>
              <div className='w-auto h-full mx-1 bg-dark-100 rounded overflow-hidden shadow-lg mb-5'>
                  {parameters ?
                    <StatsTrendWaste code={parameters.code} type={parameters.type} year={parameters.year} month={parameters.month} />
                  :
                    null
                  }
              </div>
              <div className='w-auto h-full mx-1 bg-dark-100 rounded overflow-hidden shadow-lg mb-5'>
                  {parameters ?
                    <DaysBarChart code={parameters.code} type={parameters.type} year={parameters.year} month={parameters.month} />
                  :
                    null
                  }
              </div>
            </div>
        </div>
    ) 
}

export default Statistics