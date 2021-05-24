import { Table } from "antd";

function SearchResults(props) {
  if (props.locations === null) return null;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: "20%"
    }, 
    {
      title: "Address",
      dataIndex: "formatted_address",
      key: "address",
      render: address => {
        return <a href={"https://www.google.com/maps/dir/?api=1&destination=" + address} target="_blank" rel="noreferrer">{address}</a>
      }
    }, 
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      sorter: (a, b) => a.rating - b.rating,
      width: "10%"
    }, 
    {
      title: "Price",
      dataIndex: "price_level",
      key: "price",
      render: priceLevelStr => {
        const priceLevelNum = parseInt(priceLevelStr);
        let output = "";
        for (let i = 0; i < priceLevelNum; i++) {
          output += "$"
        }
        return output;
      },
      sorter: (a, b) => b.price_level - a.price_level,
      width: "10%"
    },
    {
      title: "Link",
      dataIndex: "website",
      key: "url",
      render: link => {
        if (link === undefined) return "";
        return <a href={link}>Website</a>;
      },
      width: "10%"
    }, 
    {
      title: "Phone",
      dataIndex: "formatted_phone_number",
      key: "phone",
      render: number => <a href={"tel:" + number}>{number}</a>,
      width: "15%"
    }
  ]

  return (
    <div style={{marginTop: "2vh"}}>
      <Table dataSource={props.locations} columns={columns} pagination={{pageSize: 20, position: ["none", "none"]}} scroll={{y: "38vh"}}/>
    </div>
  );
}

export default SearchResults;