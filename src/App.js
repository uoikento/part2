import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable';
import Footer from './components/Footer'
import noteService from './services/notes'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

// dbからデータを取得する
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  console.log('render', notes.length, 'notes')

// ノートを追加して、dbにpostする
  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

// importanceの値を切り替える
  const toggleImportanceOf = (pushId) => {
    const note = notes.find(n => n.id === pushId)
    const changedNote = { ...note, important: !note.important }
    
    noteService
    .update(pushId, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== pushId ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
    console.log('idが' + pushId + 'の重要度を変えるで〜')
  }
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })
    window.localStorage.setItem(
      'loggedNoteappUser', JSON.stringify(user)
    )
    noteService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    setErrorMessage('Wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}
  
  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? '重要なやつ' : '全部' }
        </button>
      </div>
      <ul>
        {/* notesToShowを実行 */}
        {notesToShow.map((note, index) => 
          <Note
            key={index}
            note={note}
            toggleImportance= {() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default App 
