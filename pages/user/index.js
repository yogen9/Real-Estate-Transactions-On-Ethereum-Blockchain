import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import root from "../../ethereum/root";
import Layout from "../../component/Layout";
import { Link } from "../../routes";
import PaymentList from "../../component/paymentList";
import web3 from "../../ethereum/web3";

class UserIndex extends Component {

    state = {
        dataFrom: [],
        dataTo: []
    }

    static async getInitialProps(props) {
        const account = props.query.address;
        const balance = await root.methods.balanceOf(account).call();
        console.log("Account : ", account, "Balance : ", balance);

        let tokenDetailObjectList = []
        //let uris = [];
        for (let i = 0; i < balance; i++) {
            let temp = {
                ownedToken: '',
                value: ''
                //uri : ''
            }
            temp.ownedToken = await root.methods.tokenOfOwnerByIndex(account, i).call();
            //temp.uri = await root.methods.tokenURI(ownedTokens[i]); 
            tokenDetailObjectList.push(temp);
        }
        console.log('Owned Tokens : ', tokenDetailObjectList);

        const paymentRequestsCount = await root.methods.getPaymentRequestCount(account).call();
        console.log("Panding Payment: ", paymentRequestsCount);

        let paymentRequests = [];
        for (let i = 0; i < paymentRequestsCount; i++)
            paymentRequests.push(await root.methods.getPaymentRequests(account, i).call());
        console.log("Panding Payment Requests : ", paymentRequests);

        // paymentRequests = await Promise.all(
        //     Array(paymentRequestsCount).fill().map((oneRequest, index) => {
        //         return root.methods.getPaymentRequests(account, index).call()
        //     })
        // );

        return { account, balance, tokenDetailObjectList, paymentRequests }; //add uris
    }

    getFromData = () => {        
        let tempData = [];
        root.events.Transfer(
            {
                filter: { _from: this.props.account },
                fromBlock: 3187203,
                toBlock: 'latest'
            }, (error, data) => {
                tempData.push(data);
                console.log(tempData);
                console.log("Error :",error);
                this.setState({ dataFrom: tempData });
            });
    }
    getToData = () => {        
        let tempData = [];
        root.events.Transfer(
            {
                filter: { _to: this.props.account },
                fromBlock: 3187203,
                toBlock: 'latest'
            }, (error, data) => {
                tempData.push(data);
                console.log(tempData);
                console.log("Error :", error);
                this.setState({ dataTo: tempData });
            });
    }

    randerRows() {
        return this.props.tokenDetailObjectList.map((tokenDetailObject, index) => {
            const { Row, Cell } = Table;
            console.log("Token Detail : ", tokenDetailObject);
            return (
                <Row>
                    <Cell>{index}</Cell>
                    <Cell>{tokenDetailObject.ownedToken}</Cell>
                    <Cell>{tokenDetailObject.value}</Cell>
                    <Cell></Cell>
                    <Cell>
                        <Link route={`/user/${this.props.account}/transferRequest/${tokenDetailObject.ownedToken}`}>
                            <a><Button content='Tranfer Request' color='green' basic /></a>
                        </Link>
                    </Cell>
                </Row >
            );
        });
    }

    randerRequests() {
        return this.props.paymentRequests.map((request, uindex) => {
            return (
                <PaymentList
                    key={uindex}
                    uindex={uindex}
                    request={request}
                />
            );
        });
    }

    randerFromHistory() {
        return(
            this.state.dataFrom.map((data,index)=>{
                const { Row, Cell } = Table;
                console.log(data);
                return (
                    <Row>
                        <Cell>
                            <Link route={`https://rinkeby.etherscan.io/tx/${data.transactionHash}`}>
                                <a>{data.transactionHash}</a>
                            </Link>
                        </Cell>
                        <Cell>{data.returnValues._to}</Cell>
                        <Cell>{data.returnValues._tokenId}</Cell>
                        <Cell></Cell>
                    </Row>
                );
            })
        );
    }

    randerToHistory(){
        return(
            this.state.dataTo.map((data,index)=>{
                const { Row, Cell } = Table;
                console.log(data);
                return (
                    <Row>
                        <Cell>
                            <Link route={`https://rinkeby.etherscan.io/tx/${data.transactionHash}`}>
                                <a>{data.transactionHash}</a>
                            </Link>
                        </Cell>
                        <Cell>{data.returnValues._from}</Cell>
                        <Cell>{data.returnValues._tokenId}</Cell>
                        <Cell></Cell>
                    </Row>
                );

            })

        );
    }

    render() {
        return (
            <Layout>
                <div>
                    <h4>Balance : {this.props.balance}</h4>
                    <Link>
                        <a><Button content='Get Transaction (From You)' color='green' onClick={this.getFromData} basic /></a>
                    </Link>
                    <Link>
                        <a><Button content='Get Transaction (To You)' color='green' onClick={this.getToData} basic /></a>
                    </Link>

                    <h3>Your Properties</h3>
                    <Table celled fixed>

                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>No.</Table.HeaderCell>
                                <Table.HeaderCell>Property ID</Table.HeaderCell>
                                <Table.HeaderCell>Valuation (Wei)</Table.HeaderCell>
                                <Table.HeaderCell>URI</Table.HeaderCell>
                                <Table.HeaderCell>Ownship Transfer</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.randerRows()}
                        </Table.Body>

                    </Table>

                    <h3>Your Property Ownership Payment</h3>
                    <Table celled fixed>

                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>No.</Table.HeaderCell>
                                <Table.HeaderCell>From</Table.HeaderCell>
                                <Table.HeaderCell>Property ID</Table.HeaderCell>
                                <Table.HeaderCell>Valuation</Table.HeaderCell>
                                <Table.HeaderCell>Pay</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.randerRequests()}
                        </Table.Body>

                    </Table>

                    {this.state.dataTo.length == 0 ? null :
                        (<div>
                            <h3> Recieved </h3>
                            <Table celled fixed>

                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                                        <Table.HeaderCell>From</Table.HeaderCell>
                                        <Table.HeaderCell>Property ID</Table.HeaderCell>
                                        <Table.HeaderCell>Valuation</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.randerToHistory()}
                                </Table.Body>

                            </Table>
                            <h1>-</h1>  
                        </div>)
                    }
                    
                    {this.state.dataFrom.length == 0 ? null :
                        (<div>
                            <h3> Given </h3>
                            <Table celled fixed>

                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                                        <Table.HeaderCell>To</Table.HeaderCell>
                                        <Table.HeaderCell>Property ID</Table.HeaderCell>
                                        <Table.HeaderCell>Valuation</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.randerFromHistory()}
                                </Table.Body>

                            </Table>
                            <h1>-</h1>
                        </div>)
                    }

                </div>
            </Layout>
        );
    }
}

export default UserIndex;