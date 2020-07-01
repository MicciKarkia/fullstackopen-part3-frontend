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
        name: toUpdate[0].name,
        number: personObject.number,
      };
      console.log("changedNumber: ", changeNumberObject);

      if (
        window.confirm(
          `${changeNumberObject.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const idForUpdate = toUpdate[0].id;
        personService
          .update(idForUpdate, changeNumberObject)
          .then((returnedPerson) => {
            console.log("returned person: ", returnedPerson);
            setPersons(
              persons.map((person) => {
                //console.log("person: ", person);
                return person.id !== returnedPerson.id
                  ? person
                  : returnedPerson;
              })
            );
            showMessage({
              type: "success",
              content: `Changed ${returnedPerson.name}'s number`,
            });
          })
          .catch((error) => {
            console.log("error: ", error.response.data.error);
            const errorMessage = error.response.data
              ? error.response.data.error
              : "something went wrong";
            showMessage({
              type: "error",
              content: errorMessage,
            });
          });
      }
    };

    const addPersonObject = () => {
      console.log("personObject: ", personObject);

      personService
        .create(personObject)
        .then((returnedPerson) => {
          console.log("returned person:", returnedPerson);
          setPersons(persons.concat(returnedPerson));
          showMessage({
            type: "success",
            content: `Added ${returnedPerson.name}`,
          });
        })
        .catch((error) => {
          console.log("error: ", error.response.data.error);
          const errorMessage = error.response.data
            ? error.response.data.error
            : "something went wrong";
          showMessage({
            type: "error",
            content: errorMessage,
          });
          setPersons(persons.filter((person) => person.id !== personObject.id));
        });
    };

    isFound ? addNewNumber() : addPersonObject();

    //console.log("persons: ", persons);
    //console.log("message is: ", message);

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
    //console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    //console.log(event.target.value);
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
          console.log("error: ", error.response.data.error);
          const errorMessage = error.response.data
            ? error.response.data.error
            : "something went wrong";
          showMessage({
            type: "error",
            content: errorMessage,
          });
          setPersons(
            persons.filter((person) => person.id !== personToDelete.id)
          );
        });
    }
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

/*

const showPopup = () =>
      window.alert(`No duplicates! \n${newName} is already added to phonebook`);


    */
