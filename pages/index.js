import React, { Component } from "react";
import { Card, Button, Table } from "semantic-ui-react";
import root from "../ethereum/root";
import Layout from "../component/Layout";
import { Link } from "../routes";
import PandingList from "../component/pandingList";
import web3 from "../ethereum/web3";

class registrationIndex extends Component {

    static async getInitialProps() {
        const coinName = await root.methods.name().call();
        const address = await root.options.address;
        const balance = await web3.eth.getBalance(address);
        console.log(coinName, address, balance);

        const propertyCount = await root.methods.totalSupply().call();
        const properties = [];
        for (let i = 0; i < propertyCount; i++) 
            properties.push(await root.methods.tokenByIndex(i).call());

        console.log("Properties : ", properties);

        const PandingRequestCount = await root.methods.getPandingRequestsCount().call();
        console.log("Panding : ", PandingRequestCount);

        let pandingRequests = [];
        for (let i = 0; i < PandingRequestCount; i++)
            pandingRequests.push(await root.methods.requests(i).call());
        console.log("Panding Request Objects : ", pandingRequests);
        
        // pandingRequests = await Promise.all(
        //     Array(PandingRequestCount).fill().map((oneRequest, index) => {
        //         return root.methods.requests(index).call()
        //     })
        // );

        return { coinName, address, balance, properties, pandingRequests, PandingRequestCount };
    }

    renderProperties() {
        console.log("Properties : ", this.props.properties);
        const listOfProperties = this.props.properties.map(address => {
            return {
                header: (<Link route={`/properties/${address}`}>{address}</Link>),
                //description : IPFS Link,
                fluid: true
            }
        });
        return <Card.Group items={listOfProperties} />;
    }

    randerRequests() {
        //console.log("Requests : ", this.props.pandingRequests);
        return this.props.pandingRequests.map((request, index) => {
            return (
                <PandingList
                    key={index}
                    index={index}
                    request={request}
                />
            );
        });
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>{this.props.coinName} : {this.props.address} : {this.props.balance}</h3>

                    <h3>Registered Properties</h3>
                    <Link route='properties/register'>
                        <a><Button floated='right' content='Registration' icon='add' primary /></a>
                    </Link>
                    <div>{this.renderProperties()}</div>

                    <h3>Panding Ownership Transfer Requests</h3>
                    <Table celled fixed singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>No.</Table.HeaderCell>
                                <Table.HeaderCell>From</Table.HeaderCell>
                                <Table.HeaderCell>To</Table.HeaderCell>
                                <Table.HeaderCell>Property Id</Table.HeaderCell>
                                <Table.HeaderCell>Valuation (Wei)</Table.HeaderCell>
                                <Table.HeaderCell>Payment Done ?</Table.HeaderCell>
                                <Table.HeaderCell>Transfer</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.randerRequests()}
                        </Table.Body>
                    </Table>

                </div>
            </Layout>
        );
    }
}

export default registrationIndex;