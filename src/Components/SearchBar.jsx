import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


export default function SearchBar(props) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  function handleSearchClick() {
    props.searchCallback(searchTerm);
  }

  return (
    <div>
      <input
        onChange={handleChange}
        type="search"
        placeholder="Search by description..."
        value={searchTerm}
        style={{ borderColor: "white" }}
        size = "37"
      />

      
      {/* <button type="submit"><i class="fa fa-search"></i></button> */}
      <Button variant="link" onClick={handleSearchClick} style={{ borderColor: "white" }}>
        <img
          src="images/icons/Icontexto-Search-Search-green-dark.24.png"
          alt="Search"
          title="Search Tasks"
        />
      </Button>
    </div>
  );
}
