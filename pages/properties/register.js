import React, { Component } from "react";
import Layout from "../../component/Layout";
import { Button, Form, Message } from "semantic-ui-react";
import root from "../../ethereum/root";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";


class register extends Component {

    state = {
        address: '',
        name: '',
        val: '',
        uri: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        //console.log(this.state);
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("Register From : ",accounts);

            await root.methods
                .registerProperty(this.state.address, this.state.name,this.state.val)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        } catch (error) {
            this.setState({ errorMessage: error.message })
        }
        console.log("Registered For Payment Request");
        
        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h1>Register New Property</h1>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Group widths='equal'>
                        <Form.Input
                            fluid
                            id='form-subcomponent-shorthand-input-address'
                            label='Address'
                            placeholder="Recipient's Address"
                            value={this.state.address}
                            onChange={event =>
                                this.setState({ address: event.target.value })
                            }
                        />
                        <Form.Input
                            fluid
                            id='form-subcomponent-shorthand-input-name'
                            label='Name'
                            placeholder='Name Of Property'
                            value={this.state.name}
                            onChange={event =>
                                this.setState({ name: event.target.value })
                            }
                        />
                        <Form.Input
                            fluid
                            id='form-subcomponent-shorthand-input-val'
                            label='Valuation (in Wei)'
                            placeholder='Value in Wei'
                            value={this.state.val}
                            onChange={event =>
                                this.setState({ val: event.target.value })
                            }
                        />
                        <Form.Input
                            fluid
                            id='form-subcomponent-shorthand-uri'
                            label='URI Link'
                            placeholder='IPFS Link'
                            value={this.state.uri}
                            onChange={event =>
                                this.setState({ uri: event.target.value })
                            }
                        />
                    </Form.Group>
                    <Message error header='Oops!!' content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Issue Propery</Button>
                </Form>
            </Layout>
        );
    };
}
export default register;