import React from 'react'

const Filter = ({ handleSearch, handleSearchStop }) => {
  return (
    <div>filter shown with
      <input onChange={handleSearch} onBlur={handleSearchStop}/>
    </div>
  )
}

export default Filter