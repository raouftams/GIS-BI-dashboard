import React from 'react'

const Card = ({title, image, value}) => {
  return (  
    <div className="p-3 px-5">
    <div className="rounded overflow-hidden shadow-lg bg-dark-100 text-gray-300 w-full">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-5 text-center">{title}</div>
        <div className='flex justify-center'>
            {image}
            <p className="text-white font-bold text-xl mt-2 mx-5">
              {value}
            </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Card