import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from "./web3"
import lottery from "./lottery";

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { manager: "" };
  // }
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message:""
  };

  async componentDidMount() {
    let manager = await lottery.methods.manager().call(); // from need not be specified.
    let players = await lottery.methods.getPlayers().call();
    let balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    let accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting for transaction succcess..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    let players = await lottery.methods.getPlayers().call();
    let balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ players, balance, message: "You have been entered!"});
  };

  pickWinner = async () => {
    let accounts = await web3.eth.getAccounts();
    this.setState({ message: "Picking winner..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    let winner = await lottery.methods.getWinner().call();
    let players = await lottery.methods.getPlayers().call();
    let balanceFromContract = await lottery.methods.getBalance().call();
    let balance = await web3.eth.getBalance(lottery.options.address);
    balanceFromContract = await web3.utils.fromWei(balanceFromContract, "ether");
    balance = await web3.utils.fromWei(balance, "ether");
    this.setState({ players, balance, message: "Winner picked and balance " + balanceFromContract + " is transferred to " + winner });
  };

  render() {
      // web3.eth.getAccounts()
      //   .then(console.log);
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
        <h2> Lottery Contract </h2>
        <p> This contract is managed by: {this.state.manager}.<br />
        There are currently {this.state.players.length} people entered
        competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4> Want to try luck? </h4>
          <div>
            <label>Amount to enter: </label>
            <input id="amount" name="amount" value={this.state.value} onChange={event => this.setState({ value: event.target.value })} />
          </div>
          <br />
          <button>Enter</button>
        </form>
        <hr />

        <h4> Time to pick winner? </h4>
        <button onClick={this.pickWinner}>Pick Winner</button>

        <hr />
        <h4>{this.state.message}</h4>
      </div>
    );
  }
}

export default App;
