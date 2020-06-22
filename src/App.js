import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const isFound = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const toUpdate = persons.filter(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const addNewNumber = () => {
      const changeNumberObject = {
        ...toUpdate[0],
        number: personObject.number,
      };
      console.log("changedNumber: ", changeNumberObject);
      console.log("message is: ", message);

      if (
        window.confirm(
          `${changeNumberObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const id = changeNumberObject.id;
        personService
          .update(id, changeNumberObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            showMessage({
              type: "success",
              content: `Changed ${returnedPerson.name}'s number`,
            });
          })
          .catch((error) => {
            showMessage({
              type: "error",
              content: `Information of ${changeNumberObject.name} has already been removed from server`,
            });
            setPersons(
              persons.filter((person) => person.id !== changeNumberObject.id)
            );
          });
      }
    };

    const addPersonObject = () => {
      personService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          showMessage({
            type: "success",
            content: `Added ${returnedPerson.name}`,
          });
        })
        .catch((error) => {
          showMessage({
            type: "error",
            content: `Information of ${personObject.name} has already been added from server`,
          });
          setPersons(persons.filter((person) => person.id !== personObject.id));
        });
    };

    isFound ? addNewNumber() : addPersonObject();

    console.log("persons: ", persons);
    console.log("message is: ", message);

    setNewName("");
    setNewNumber("");
  };

  const handleSearch = (event) => {
    console.log("Searching for:", event.target.value);
    const searchTerm = event.target.value;
    setSearchResult(
      persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleSearchStop = (event) => {
    console.log("searching stopped");
    setSearchResult(null);
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleDeletePerson = (personToDelete) => {
    console.log("delete button pressed", personToDelete);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService
        .remove(personToDelete.id)
        .then((deletedPerson) => {
          console.log("person deleted", deletedPerson);
          setPersons(
            persons.filter((person) => person.name !== personToDelete.name)
          );
          showMessage({
            type: "success",
            content: `Deleted ${personToDelete.name}`,
          });
        })
        .catch((error) => {
          showMessage({
            type: "error",
            content: `Information of ${personToDelete.name} has already been removed from server`,
          });
          setPersons(
            persons.filter((person) => person.id !== personToDelete.id)
          );
        });
    }

    console.log("message is: ", message);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleSearch={handleSearch} handleSearchStop={handleSearchStop} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchResult={searchResult}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
