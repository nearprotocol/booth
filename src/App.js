import React, { useEffect, useState } from "react";
import "./App.css";
import Modal from "react-modal";
import LoadingOverlay from "react-loading-overlay";
import nearcat from "./assets/nearcat.png";
import SquareLoader from "react-spinners/SquareLoader";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-47%",
    transform: "translate(-50%, -50%)",
  },
};

const App = (props) => {
  const [state, setState] = useState({
    login: false,
    speech: null,
    modalIsOpen: false,
    isLoading: false,
    completedFinalStep: false,
  });

  useEffect(() => {
    const loggedIn = props.wallet.isSignedIn();
    if (loggedIn) {
      signedInFlow();
    } else {
    }
  });

  openModal = () => {
    setState((prevState) => ({
      ...prevState,
      modalIsOpen: true,
      isLoading: false,
    }));
  };

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  };

  closeModal = () => {
    setState((prevState) => ({
      ...prevState,
      modalIsOpen: false,
    }));
  };

  signedInFlow = async () => {
    console.log("come in sign in flow");
    setState((prevState) => ({
      ...prevState,
      login: true,
    }));
    const accountId = await props.wallet.getAccountId();
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
  };

  requestSignIn = async () => {
    const appTitle = "NEAR Protocol Booth";
    await props.wallet.requestSignIn(window.nearConfig.contractName, appTitle);
  };

  requestSignOut = () => {
    props.wallet.signOut();
    setTimeout(signedOutFlow, 500);
    console.log("after sign out", props.wallet.isSignedIn());
  };

  signedOutFlow = () => {
    if (window.location.search.includes("account_id")) {
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    }
    localStorage.clear();
    setState((prevState) => ({
      ...prevState,
      login: false,
      speech: null,
    }));
  };

  joinNear = async () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      completedFinalStep: true,
    }));
    await props.contract.incrementParticipation();
    openModal();
  };

  return (
    <div className="App-header">
      <div className="image-wrapper">
        <div className={"hackathon-text"}>
          <LoadingOverlay
            wrapper={"#root"}
            active={state.isLoading}
            spinner={<SquareLoader color={"#FF585D"} />}
            text="Calling smart contract…"
            classNamePrefix={"near-booth-"}
          >
            {state.login ? (
              <div className={"logged-in"}>
                <p>
                  Welcome back! Now we're going to interact with the blockchain
                  calling a simple smart contract.
                </p>
                <p>
                  <strong>How was this smart contract written?</strong>
                </p>
                <p>
                  For this demonstration we used AssemblyScript, but you can
                  also use Rust. We generally prefer Rust, actually.
                </p>
                <p>
                  <strong>Tell me more!</strong>
                </p>
                <p className={"nearcat-adjacent"}>
                  Sure, grab one of us with a NEAR shirt. We'd love to chat!
                </p>
                <p className={"nearcat-adjacent"}>
                  But first, use the button below and see our booth update live.
                </p>
              </div>
            ) : (
              <div className={"logged-out"}>
                <p>
                  NEAR Protocol is a new blockchain focused on developer
                  productivity and usability. In this demonstration we're going
                  to interact with the blockchain and see a live change on the
                  projector at our booth.
                </p>
                <p>
                  <b>So what's going to happen?</b>
                </p>
                <p>
                  You will create a new NEAR account at our Wallet website.
                  After the final step, you'll be redirected back here. There
                  will be a new button where you'll call a smart contract from
                  your new account.
                </p>
                <p className={"nearcat-adjacent"}>
                  You may continue using the button below.
                </p>
              </div>
            )}
            <img className={"nearcat"} src={nearcat} />
          </LoadingOverlay>
        </div>
        {/*{state.completedFinalStep && !state.login ? (*/}
        {state.login && !state.completedFinalStep && (
          <div id="raffle">
            <iframe
              id="gform-iframe"
              src="https://docs.google.com/forms/d/e/1FAIpQLSeBnedgR2zUCBku2mKnCk27apT-QrusZIuTAiu8l7L83dPjlQ/viewform?embedded=true"
              width="100%"
              height="500"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
            >
              Loading…
            </iframe>
          </div>
        )}
        <div className={"action-buttons"}>
          {state.login ? (
            <button onClick={joinNear}>Interact with NEAR</button>
          ) : null}{" "}
          {state.login ? (
            <button onClick={requestSignOut}>Log out</button>
          ) : (
            <button onClick={requestSignIn}>Create an account with NEAR</button>
          )}
        </div>

        <Modal
          isOpen={state.modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          // overlayClassName={"final-overlay"}
          contentLabel="You've connected with the NEAR blockchain"
        >
          <button onClick={closeModal} className={"modal-close-button"}>
            &times;
          </button>
          <h2>You've interacted with NEAR</h2>
          <p>
            Look for our NEAR Explorer at the booth showing the latest blocks
            and transactions.
          </p>
          <p>See if you can spot your account name. 🙂</p>
          <p>
            Our projector live updates upon state change from the contract you
            just called.
          </p>
          <p>Come build projects on NEAR. We're here to help.</p>
        </Modal>
      </div>
    </div>
  );
};

export default App;
