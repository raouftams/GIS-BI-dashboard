import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import './map.css'


const { BaseLayer } = LayersControl

function Map() {
  return (
    <div className='map-container'>
        <MapContainer className='map' center={[51.505, -0.09]} zoom={13}>
            <LayersControl>
                <BaseLayer name='OSM'>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </BaseLayer>
                <BaseLayer checked name='test'>
                <TileLayer
                    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
                />
                </BaseLayer>
            </LayersControl>
        </MapContainer>
    </div>
  )
}

export default Map