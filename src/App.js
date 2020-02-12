import React, { Component } from "react";
import "./App.css";
import Modal from 'react-modal';
import LoadingOverlay from 'react-loading-overlay';
import nearcat from './assets/nearcat.png';
import SquareLoader from 'react-spinners/SquareLoader'

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-47%',
    transform             : 'translate(-50%, -50%)'
  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: false,
      speech: null,
      modalIsOpen: false,
      isLoading: false,
      completedFinalStep: false
    };
    this.signedInFlow = this.signedInFlow.bind(this);
    this.requestSignIn = this.requestSignIn.bind(this);
    this.requestSignOut = this.requestSignOut.bind(this);
    this.signedOutFlow = this.signedOutFlow.bind(this);
    this.joinNear = this.joinNear.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);    
  }

  componentDidMount() {
    let loggedIn = this.props.wallet.isSignedIn();
    if (loggedIn) {
      this.signedInFlow();
    } else {
      this.signedOutFlow();
    }
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
      isLoading: false
    });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }  

  async signedInFlow() {
    console.log("come in sign in flow");
    this.setState({
      login: true
    });
    const accountId = await this.props.wallet.getAccountId();
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
  }

  async requestSignIn() {
    const appTitle = "NEAR Protocol Booth";
    await this.props.wallet.requestSignIn(
      window.nearConfig.contractName,
      appTitle
    );
  }

  requestSignOut() {
    this.props.wallet.signOut();
    setTimeout(this.signedOutFlow, 500);
    console.log("after sign out", this.props.wallet.isSignedIn());
  }

  signedOutFlow() {
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
    localStorage.clear();
    this.setState({
      login: false,
      speech: null
    });
  }

  async joinNear() {
    this.setState({
      isLoading: true,
      completedFinalStep: true
    });
    
    await this.props.contract.incrementParticipation();
    this.openModal();
  }

  // AdjustIframeHeightOnLoad() {
  //   document.getElementById("gform-iframe").style.height = document.getElementById("gform-iframe").contentWindow.document.body.scrollHeight + "px";
  // }

  render() {
    return (
      <div className="App-header">
        <div className="image-wrapper">
          <div className={"hackathon-text"}>
            <LoadingOverlay
              wrapper={"#root"}
              active={this.state.isLoading}
              spinner={<SquareLoader color={"#FF585D"}/>}
              text="Calling smart contract…"
              classNamePrefix={"near-booth-"}
            >
            {this.state.login ? (
              <div className={"logged-in"}>
                <p>
                  Welcome back! Now we're going to interact with the blockchain calling a simple smart contract.
                </p>
                <p>
                  <strong>How was this smart contract written?</strong>
                </p>
                <p>
                  For this demonstration we used AssemblyScript, but you can also use Rust. We generally prefer Rust, actually.
                </p>
                <p>
                  <strong>Tell me more!</strong>
                </p>
                <p className={"nearcat-adjacent"}>Sure, grab one of us with a NEAR shirt. We'd love to chat!</p>
                <p className={"nearcat-adjacent"}>But first, use the button below and see our booth update live.</p>
              </div>
            ) : (
              <div className={"logged-out"}>
                <p>
                  NEAR Protocol is a new blockchain focused on developer
                  productivity and usability. In this demonstration we're going to
                  interact with the blockchain and see a live change on the
                  projector at our booth.
                </p>
                <p>
                  <b>So what's going to happen?</b>
                </p>
                <p>
                  You will create a new NEAR account at our Wallet website. After the final step, you'll be redirected back here. There will be a new button where you'll call a smart contract from your new account.
                </p>
                <p className={"nearcat-adjacent"}>
                  You may continue using the button below.
                </p>
              </div>
            )}
            <img className={"nearcat"} src={nearcat} />
            </LoadingOverlay>
          </div>
            {/*{this.state.completedFinalStep && !this.state.login ? (*/}
            {this.state.login && !this.state.completedFinalStep && <div id="raffle"><iframe id="gform-iframe" src="https://docs.google.com/forms/d/e/1FAIpQLSeBnedgR2zUCBku2mKnCk27apT-QrusZIuTAiu8l7L83dPjlQ/viewform?embedded=true" width="100%" height="500" frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe></div>}
          <div className={"action-buttons"}>
            {this.state.login ? (
              <button onClick={this.joinNear}>Interact with NEAR</button>
            ) : null}{" "}
            {this.state.login ? (
              <button onClick={this.requestSignOut}>Log out</button>
            ) : (
              <button onClick={this.requestSignIn}>Create an account with NEAR</button>
            )}
          </div>

          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            // overlayClassName={"final-overlay"}
            contentLabel="You've connected with the NEAR blockchain"
          >
            <button onClick={this.closeModal} className={"modal-close-button"}>&times;</button>
            <h2>You've interacted with NEAR</h2>
            <p>
              Look for our NEAR Explorer at the booth showing the latest blocks and transactions.
            </p>
            <p>See if you can spot your account name. 🙂</p>
            <p>Our projector live updates upon state change from the contract you just called.</p>
            <p>Come build projects on NEAR. We're here to help.</p>
          </Modal>
        
        </div>
      </div>
    );
  }
}

export default App;
