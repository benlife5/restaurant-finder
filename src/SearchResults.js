

function SearchResults(props) {
  if (props.locations === null) return null;
  return (
    <div>
      SearchResults
      {props.locations.map((l) => <p>{l.name}</p>)}
    </div>
  );
}

export default SearchResults;