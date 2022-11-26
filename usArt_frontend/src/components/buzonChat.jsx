import React from 'react'
import Sidebar from '../components/SidebarChat'
import MainChat from '../components/mainChat'
import styles from '../components/buzonGeneralStyle.css'

const buzonChat = () => {
  return (
        <div className='containerC d-flex shadow-lg rounded d-flex  justify-content-center border'>
            <Sidebar/>
            <MainChat/>
        </div>
    
  )
}

export default buzonChat