import React from 'react'

const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? '価値をなくすで〜' : '重要にするで〜'
  
  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note