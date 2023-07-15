import { TrashIcon } from '@heroicons/react/24/outline';
import React from 'react'

const Message = ({item, classs, DateTime, DeleteEachMessage}) => {
    const newdate = item.date;
    const dates = new Date(newdate);
    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}} className=''>
            <div className={`${classs}`} >
                <h6>{item?.message}</h6>
                <h6>{item?.userName}</h6>
            </div>
            <div className={`${DateTime}`}>
                <p className=''>{dates.toLocaleString()}</p> 
                <span onClick={() =>DeleteEachMessage(item._id)}> <TrashIcon style={{height:'20px', color:'red', marginLeft:'20px'}}/> </span>
            </div>
        </div>
    )
}

export default Message