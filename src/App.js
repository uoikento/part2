import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import './index.css'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened')

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  

// dbからデータを取得する
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  // console.log('render', notes.length, 'notes')

// ノートを追加して、dbにpostする
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

// importanceの値を切り替える
  const toggleImportanceOf = (pushId) => {
    const note = notes.find(n => n.id === pushId)
    const changedNote = { ...note, important: !note.important }
    
    noteService
    .update(pushId, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== pushId))
    })
    console.log('idが' + pushId + 'の重要度を変えるで〜')
  }
  
  
// form中身の変更内容を取得
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? '重要なやつ' : '全部' }
        </button>
      </div>
      <ul>
        {/* notesToShowを実行 */}
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note}
            toggleImportance= {() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      {/* submitをクリックするとaddNoteを実行する */}
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App 
