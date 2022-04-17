import React from 'react'

const Popup = ({ feature }) => {
    let name, code;
    if (feature.properties) {
      name = feature.properties.name
      code = feature.properties.code
    }
  
    return (
      <div>
        <p>Code: {code}</p>
        <p>Nom: {name}</p>
      </div>
    );
};

export default Popup