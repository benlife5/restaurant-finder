import { Table } from "antd";

function SearchResults(props) {
  if (props.locations === null) return null;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    }, 
    {
      title: "Address",
      dataIndex: "formatted_address",
      key: "address"
    }, 
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating"
    }, 
    {
      title: "Price",
      dataIndex: "price_level",
      key: "price"
    },
    {
      title: "Link",
      dataIndex: "website",
      key: "url"
    }, 
    {
      title: "Phone",
      dataIndex: "formatted_phone_number",
      key: "phone"
    }
  ]

  return (
    <div>
      {/* SearchResults
      {props.locations.map((l) => <p key={l.place_id}>{l.name}</p>)} */}

      <Table dataSource={props.locations} columns={columns} />
    </div>
  );
}

export default SearchResults;