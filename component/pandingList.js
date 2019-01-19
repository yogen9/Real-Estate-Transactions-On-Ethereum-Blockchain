import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import root from "../ethereum/root";
import web3 from "../ethereum/web3";
import { Link } from "../routes";

class PandingList extends Component {

    state = {
        loading : false
    }

    transfer = async () => {
        this.setState({loading : true});
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        console.log("req :", this.props.request);
        console.log("Index : ", this.props.index);
        console.log("Contract Balance : ", web3.eth.getBalance(root.options.address));
                
        const { _to } = this.props.request;

        await root.methods.transferOwnership(_to, this.props.index)
            .send({
                from: accounts[0]
            });

        this.setState({ loading : false});
    }
    render() {
        const { Row, Cell } = Table;
        const { index, request } = this.props;
        return (
            <Row>
                <Cell>{index}</Cell>
                <Cell>{request._from}</Cell>
                <Cell>{request._to}</Cell>
                <Cell>{request._tokenId}</Cell>
                <Cell>{request._value}</Cell>
                <Cell>{String(request._done)}</Cell>
                <Cell>
                    <Link>
                        <a><Button  loading={this.state.loading} content='Approve' color='green' onClick={this.transfer} basic /></a>
                    </Link>
                </Cell>
            </Row >
        );
    }
}
export default PandingList;