import React, { Component } from "react";
import Layout from "../../component/Layout";
import { Button, Form, Message } from "semantic-ui-react";
import root from "../../ethereum/root";
import web3 from "../../ethereum/web3";

class TransferReq extends Component {

    state = {
        from: '',
        to: '',
        tokenId: '',
        value: '',
        errorMessage: '',
        loading: false
    }

    static async getInitialProps(props) {
        const tokenId = props.query.tokenId;
        const from = props.query.address;

        return { tokenId, from };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({ tokenId: this.props.tokenId, from: this.props.from }); // this is not correct implementation
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await root.methods.tranferRequests(this.state.from, this.state.to, this.state.tokenId, this.state.value)
                .send({
                    from: accounts[0]
                });
        } catch (error) {
            this.setState({ errorMessage: error.message })
        }
        console.log("Tranfer Request Successfully Submitted.");

        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Tranfer Owndership</h3>
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <Form.Group widths='equal'>
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-to'
                                label='To'
                                placeholder='Recievers Address'
                                value={this.state.to}
                                onChange={event =>
                                    this.setState({ to: event.target.value })
                                }
                            />
                            <Form.Input
                                fluid
                                id='form-subcomponent-shorthand-input-value'
                                label='Valuation (Wei)'
                                placeholder='Value in Wei'
                                value={this.state.value}
                                onChange={event =>
                                    this.setState({ value: event.target.value })
                                }
                            />
                        </Form.Group>
                        <Message error header='Oops!!' content={this.state.errorMessage} />
                        <Button loading={this.state.loading} primary>Send Request</Button>
                    </Form>
                </div>
            </Layout>
        );
    }
}

export default TransferReq;