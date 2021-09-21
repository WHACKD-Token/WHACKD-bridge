import React, { useState } from "react";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import axios from "axios";
import QRCode from "qrcode.react";
import EthereumQRPlugin from 'ethereum-qr-code'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import web3 from 'web3';

import ada from "./ada.png";
import "./App.css";


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const fee = parseFloat(process.env.REACT_APP_FEE || 1);

function App() {
  var interval = null;

  const [page, setPage] = useState(1);
  const [amount, setAmount] = useState('0.0');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [targetWallet, setTargeWallet] = useState('');
  const [ethHotWallet, setEthHotWallet] = useState('');
  const [isCardano, setIsCardano] = useState(true);
  const [timer, setTimer] = useState(null);
  const [swapId, setSwapId] = useState('');
  const [page3Message, setPage3Message] = useState('Successfully done!');
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Successfully done!');

  const openPage1 = () => {
    setAmount('0.0');
    setReceiverAddress('');
    setIsCardano(true);
    setTimer(null);
    setSwapId('');
    setTargeWallet('');
    setEthHotWallet('');
    setPage(1);
  }

  const startCountingSwapRequest = async (id) => {
    try {
      console.log("check");
      const response = await axios.post(`${baseURL}/check-swap`, {
        swap_id: id,
      });

      switch (response.data.status) {
        case 'confirmed':
          clearInterval(interval);
          openPage3('confirmed');
          break;
        case 'expired':
          clearInterval(interval);
          openPage3('expired');
          break;
        default: 
          console.log(response);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const openPage3 = async (status) => {
    if (status === 'confirmed') {
      setPage3Message('Successfully done!');
    } else {
      setPage3Message('Your request is expired!');
    }
    setPage(3);
  }

  const openPage2 = async () => {
    if (amount - fee <= 0) {
      setErrorAlert(true);
      setErrorMessage('Please input valid amount!');
      return;
    }
    if (receiverAddress == '') {
      setErrorAlert(true);
      setErrorMessage('Please input receiver address!');
      return;
    }
    if (!web3.utils.isAddress(receiverAddress)) {
      setErrorAlert(true);
      setErrorMessage('Please input valid ethereum address!');
      return;
    }
    if (amount > 10000) {
      setErrorAlert(true);
      setErrorMessage('Amount is too large!');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/create-swap`, {
        amount: amount,
        is_cardano: isCardano,
        receiver_address: receiverAddress
      });
      setPage(2);
      if (isCardano) {
        setTargeWallet(response.data.cardano_hot_wallet);
      } else {
        // const qr = new EthereumQRPlugin();
        // const sendDetails = {
        //   to: response.data.eth_hot_wallet,
        //   value: response.data.amount,
        //   gas: 420000
        // };
        // const configDetails = {
        //   size:180,
        //   selector: '#ethereum-qr-code-simple',
        //   options: {
        //     margin: 2
        //   }
        // };
        // qr.toCanvas(sendDetails, configDetails);
        setTargeWallet(response.data.eth_hot_wallet);
      }
      setSwapId(response.data._id);
      console.log('create_swap', response);
      interval = setInterval(async () => {
        await startCountingSwapRequest(response.data._id);
      }, 20000);
    } catch (e) {
      console.log(e);
    }
  }

  const switchNetwork = () => {
    setIsCardano(!isCardano);
  }

  const handleAlertClose = () => {
    setErrorAlert(false);
  }

  return (
    <div className="app">
      <Snackbar open={errorAlert} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error">
          { errorMessage }
        </Alert>
      </Snackbar>
      {page === 1 &&
        <div className="modal">
          <p className="title1">From</p>
          <div className="inputFrom">
            <input type="number" placeholder="0.0" className="inputFromNumber" onChange={e => setAmount(e.target.value)} ></input>
            {isCardano && <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" className="tokenIcon" />}
            {!isCardano && <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" className="tokenIcon" />}
            <span className="unitText">WHACKD</span>
          </div>
          <div className="arrowSection">
            <FontAwesomeIcon icon={faArrowDown} onClick={switchNetwork}/>
          </div>
          <p className="title1">To</p>
          <div className="inputFrom">
            <input type="number" placeholder="0.0" className="inputFromNumber" disabled value={amount - fee > 0 ? amount - fee : 0}></input>
            {isCardano && <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" className="tokenIcon" />}
            {!isCardano && <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" className="tokenIcon" />}
            <span className="unitText">WHACKD</span>
          </div>
          <input type="text" placeholder="Receiver Address" className="inputToAddress" onChange={e => setReceiverAddress(e.target.value)}></input>
          <div className="feeInfo">
            <p className="title1">Fee</p>
            <p className="unitText">{ fee } WHACKD</p>
          </div>
          <button className="swapButton" onClick={openPage2}>Swap</button>
        </div>
      }
      {page === 2 &&
        <div className="modal">
          <p className="sendDescription">SEND THE WHACKD ({isCardano ? 'BSC' : 'ETHEREUM'}) TO THIS ADDRESS: </p>
          <div className="copyAddress">
            <p>{targetWallet}</p>
            <CopyToClipboard text={targetWallet}
              onCopy={() => setTargeWallet(targetWallet)}>
              <span className="copyButton">Copy</span>
            </CopyToClipboard>
          </div>
          {/* <div className="qrCode">
            {isCardano && 
              <QRCode
                value={`web+cardano:${targetWallet}?amount=${amount}?`}
                size={200}
                imageSettings={{
                  src: ada,
                  excavate: true,
                }}
              />
            }
            {!isCardano && <div id="ethereum-qr-code-simple"></div>}
          </div> */}
          <p className="sendDescription">You have 20 minutes...</p>
        </div>
      }
      {page === 3 &&
        <div className="modal d-flex">
          <div className='d-flex-col'>
            <p className="sendDescription">{ page3Message }</p>
            <button className="copyButton" onClick={openPage1}>Go Back</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
