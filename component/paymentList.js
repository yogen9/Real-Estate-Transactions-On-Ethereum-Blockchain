import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import root from "../ethereum/root";
import web3 from "../ethereum/web3";
import { Link } from "../routes";

class PaymentList extends Component {

    state = {
        loading : false
    }

    payment = async () => {
        this.setState({ loading: true });

        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        console.log("req :", this.props.request);
        const  _value  = this.props.request[3];

        await root.methods.pay(this.props.uindex)
            .send({
                from: accounts[0],
                value: _value
            });
        
        this.setState({ loading: false });
            
    }
    render() {
        const { Row, Cell } = Table;
        const { uindex, request } = this.props;
        const req = {
            _from : request[0],
            _tokenId : request[2],
            _value : request[3],
            _done : request[4]
        }
        return (
            <Row>
                <Cell>{uindex}</Cell>
                <Cell>{req._from}</Cell>
                <Cell>{req._tokenId}</Cell>
                <Cell>{req._value}</Cell>
                <Cell>{req._done ? <p>Done</p> :
                    <Link>
                        <a><Button loading={this.state.loading} content='Pay' color='green' onClick={this.payment} basic /></a>
                    </Link>
                }
                </Cell>

            </Row >
        );
    }
}
export default PaymentList;