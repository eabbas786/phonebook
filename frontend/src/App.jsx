


import personServices from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Persons'
import SuccessNotification from './components/SuccessNotification'


import { useState, useEffect } from 'react'
import ErrorNotification from './components/ErrorNotification'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // fetches all names stored in database from the server
  useEffect(() => {
    personServices
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  // console.log(persons.length, 'persons rendered')

  const addPerson = (event) => {
    event.preventDefault()

    const original = persons.find(person => person.name === newName)
    if (original) {
      const warning = `${newName} is already added to phonebook, replace the old number with a new one?`
      window.confirm(warning)
      personServices
        .replace(original.id, { ...original, "number": newNumber })
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id === original.id ? returnedPerson : p))
        })
        .then(() => {
          setSuccessMessage(
            `Replaced number of ${newName} successfully.`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setErrorMessage(
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })



    }
    else {
      // id: String(persons.length + 1)
      // 
      const personObject = {
        name: newName,
        number: newNumber
      }
      personServices
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        .then(() => {
          setSuccessMessage(
            `Added ${newName} successfully.`
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
    }

    setNewName('') // restore state of newName
    setNewNumber('')

  }

  const deletePerson = (id, name) => {
    window.confirm(`Delete ${name}?`)
    personServices
      .remove(id)
      .then(() => setPersons(persons.filter(p => p.id != id)))
      .catch((error) => {
        setErrorMessage(
          `Information of ${name} has already been removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })


  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchVal(event.target.value)
  }

  // console.log(persons)
  const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(searchVal.toLowerCase()))

  const displayed = searchVal ? filtered : persons

  return (
    <div>
      <h1>Phonebook</h1>

      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      <Filter value={searchVal} onChange={handleSearchChange} />

      <h2>Add a new person</h2>

      <PersonForm
        onSubmit={addPerson}
        name={newName} onNameChange={handleNameChange}
        number={newNumber} onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Person persons={displayed} handleDelete={deletePerson} />

    </div>
  )
}

export default App