import React from "react";

const Persons = ({ persons, searchResult, handleDeletePerson }) => {
  const rows = () => {
    if (searchResult) {
      if (searchResult.length) {
        return searchResult.map((person) => (
          <li key={person.name}>
            {person.name} {person.number}
          </li>
        ));
      } else {
        return <li>No matching search results</li>;
      }
    } else {
      return persons.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => handleDeletePerson(person)}>delete</button>
        </li>
      ));
    }
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>{rows()}</ul>
    </div>
  );
};

export default Persons;
