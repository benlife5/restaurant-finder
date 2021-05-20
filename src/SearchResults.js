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
      key: "price",
      render: priceLevelStr => {
        const priceLevelNum = parseInt(priceLevelStr);
        let output = "";
        for (let i = 0; i < priceLevelNum; i++) {
          output += "$"
        }
        return output;
      },
    },
    {
      title: "Link",
      dataIndex: "website",
      key: "url",
      render: link => {
        if (link === undefined) return "";
        return <a href={link}>Website</a>;
      }
    }, 
    {
      title: "Phone",
      dataIndex: "formatted_phone_number",
      key: "phone",
      render: number => <a href={"tel:" + number}>{number}</a>,
    }
  ]

  return (
    <div>
      <Table dataSource={props.locations} columns={columns} pagination={{pageSize: 20, position: ["none", "none"]}} scroll={{y: "40vh"}}/>
    </div>
  );
}

export default SearchResults;