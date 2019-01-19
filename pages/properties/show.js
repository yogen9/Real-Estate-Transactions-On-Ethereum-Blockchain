import React, { Component } from "react";
import Layout from "../../component/Layout";
import web3 from "../../ethereum/web3";
import root from "../../ethereum/root";
import { Link } from "../../routes";
import { Button, Table } from "semantic-ui-react";

class PropertyShow extends Component {

    state = {
        allData: [],
        showData: false
    }

    static async getInitialProps(props) {
        const tokenId = props.query.address;
        console.log(tokenId);

        return { tokenId };
    }
    getData = () => {
        let tempData = [];
        root.events.Transfer(
            {
                filter: { _tokenId: this.props.tokenId },
                fromBlock: 3187203,
                toBlock: 'latest'
            }, (error, data) => {
                tempData.push(data);
                this.setState({ allData: tempData });
            });
    }
    // fetchBlock = async (blockNumber) =>{
    //     const blockInfo = await web3.eth.getBlock(blockNumber);
    //     return blockInfo;
    // }

    renderHistory() {
        return this.state.allData.map((data, index) => {
            const {Row,Cell } = Table;
            console.log(data);
            // const blockInfo= this.fetchBlock(data.blockNumber);
            // const timestamp = blockInfo.timestamp;
            return (
                <Row>
                    <Cell>{index}</Cell>
                    <Cell>
                        <Link route={`https://rinkeby.etherscan.io/tx/${data.transactionHash}`}>
                            <a>{data.transactionHash}</a>
                        </Link>
                    </Cell>
                    <Cell>{data.returnValues._from}</Cell>
                    <Cell>{data.returnValues._to}</Cell>
                    <Cell></Cell>
                </Row>
            );
        });
    }

    render() {
        return (
            <Layout>
                <h2>{this.props._tokenId}</h2>
                <Link>
                    <a><Button content='Get Data' color='green' onClick={this.getData} basic /></a>
                </Link>
                <Table celled singleLine fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width="1">No.</Table.HeaderCell>
                            <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                            <Table.HeaderCell>From</Table.HeaderCell>
                            <Table.HeaderCell>To</Table.HeaderCell>
                            <Table.HeaderCell width="2">Valuation (Wei)</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderHistory()}
                    </Table.Body>
                </Table>
            </Layout>
        );
    }
}
export default PropertyShow;