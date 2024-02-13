import React from "react";
import "./App.css";
import { useLazyQuery, gql } from "@apollo/client";

const QUERY = gql`
  query Restaurants($description: Boolean!, $active: Boolean!) {
    restaurants {
      data {
        id
        attributes {
          Name
          Description @include(if: $description)
          active @include(if: $active)
        }
      }
    }
  }
`;

function App() {
  const [descriptionChecked, setDescriptionChecked] = React.useState(false);
  const [activeChecked, setActiveChecked] = React.useState(false);
  const [loadRestaurants, { loading, data }] = useLazyQuery(QUERY, {
    fetchPolicy: "no-cache"
  });

  const handleDescriptionChange = () => {
    setDescriptionChecked(!descriptionChecked);
  };

  const handleActiveChange = () => {
    setActiveChecked(!activeChecked);
  };

  const handleOnClick = () => {
    loadRestaurants({
      variables: { description: descriptionChecked, active: activeChecked }
    });
  };

  return (
    <div className="App">
      <h3>Restaurant details</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
          marginLeft: "20%",
          gap: "12px"
        }}
      >
        <label>
          <input type="checkbox" defaultChecked={true} />
          Name
        </label>
        <label>
          <input
            type="checkbox"
            defaultChecked={descriptionChecked}
            onChange={handleDescriptionChange}
          />
          Description
        </label>
        <label>
          <input
            type="checkbox"
            defaultChecked={activeChecked}
            onChange={handleActiveChange}
          />
          Active
        </label>

        <button
          style={{
            background: "#6d46e4",
            color: "white",
            border: 0,
            padding: "12px",
            fontSize: "16px",
            fontWeight: "bold"
          }}
          type="button"
          onClick={handleOnClick}
        >
          Fetch data
        </button>
      </div>
      <div>
        {loading && <div>Loading</div>}
        {data && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "30px"
            }}
          >
            {data?.restaurants?.data?.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  alignItems: "baseline",
                  marginLeft: "20%"
                }}
              >
                <div>Name: {r.attributes.Name}</div>
                {r.attributes?.Description && (
                  <div>Description: {r.attributes?.Description}</div>
                )}
                {r.attributes?.active !== undefined && (
                  <div>Active: {r.attributes?.active ? "true" : "false"}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
