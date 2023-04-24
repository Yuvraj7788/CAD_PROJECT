import React from 'react'
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

export default function ProgressBar({
    completed
}){
  return (
    <div className='progress-bar'>
        <Progress percent={completed}  />
    </div>
  )
}

