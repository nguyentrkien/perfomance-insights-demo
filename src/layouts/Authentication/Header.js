import React from 'react'
import Logo from '../../assets/img/ThanhThienlogo.png'

export default function Header() {
  const style = {
    display: 'flex',
    padding: '0 10px',
    columnGap: '80px',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#00f2c32e',
    alignItems: 'center',
    position: 'relative',
    minHeight: '65px',
  }
  return (
    <>
        <img src={Logo} alt='logo' style={{width: '100px', position: 'absolute', zIndex: '2', left: '40px'}}></img>
        <div className='header' style={style}>
            <h2 style={{ margin: '0'}}>THANH THIEN TECHNOLOGY JSC</h2>
        </div>
    </>
  )
}
