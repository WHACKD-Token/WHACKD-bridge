import { Response, Request } from "express";
import { ethers } from 'ethers';
import crypto from 'crypto';
import axios from 'axios';
import * as luxon from 'luxon';

import { generateMnemonic } from "../utils/utils";
import { SwapRequest } from '../models/swap_request';
import { WalletAddress } from '../models/wallet_address';
import BadRequestError from "../exceptions/BadRequestError";
import { http } from "./http";

// Ethereum YAY address
const YAY_ADDRESS = '0xCF8335727B776d190f9D15a54E6B9B9348439eEE'
const YAY_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (boolean)"
]

export const checkSwapRequest = async (req: Request, res: Response) => {
	try {
		const { swap_id } = req.body;
    let data = await SwapRequest.findById(swap_id);

    if (data) {
      switch (data.status) {
        case 'awaiting':
          return res.status(201).send({status: 'no_yay_received'});
        case 'expired':
          return res.status(201).send({status: 'expired'});
        case 'confirmed':
          return res.status(201).send({status: 'confirmed'});
      }
    } else {
      return res.status(201).send({status: 'no_swap_id'});
    }
	}
	catch (error) {
    console.log(error);
		if (error.code === 11000) {
			return res.status(400).send(new BadRequestError("ID and/or username already exist."));
		}
		else {
			return res.status(400).send(new BadRequestError("Bad Request."));
		}
	}
};

export const checkAndUpdateSwapRequest = async (req: Request, res: Response) => {
	try {
    const awaitingRequests = await SwapRequest.find({status: 'awaiting'});
    for (let i = 0; i < awaitingRequests.length; i ++) {
      const current_time = luxon.DateTime.utc();
      const expire_time = luxon.DateTime.fromISO(awaitingRequests[i].request_time, { zone: "UTC"}).plus({minute: 30});
      if (expire_time > current_time) {
        if (awaitingRequests[i].is_cardano) { // if bsc to eth
          // bsc balance check
          const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
          const yay = new ethers.Contract(YAY_ADDRESS, YAY_ABI, provider);
          let balance = await yay.balanceOf(awaitingRequests[i].eth_hot_wallet);
          balance = ethers.utils.formatEther(balance);
          console.log('balance: ', balance);

          if (balance >= parseFloat(awaitingRequests[i].amount)) {
            // send transaction on cardano
            try {
              const provider = new ethers.providers.JsonRpcProvider(`https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`);
              let wallet = new ethers.Wallet(process.env.ETHEREUM_WALLET_PRIVATE_KEY || '', provider)
              wallet = wallet.connect(provider)

              const yay = new ethers.Contract(YAY_ADDRESS, YAY_ABI, wallet);
              let balance = await yay.balanceOf(wallet.address);
              balance = ethers.utils.formatEther(balance);
              console.log('Balance before transfer');
              console.log(balance, 'YAY');
              const to = awaitingRequests[i].receiver_address // Add your 2nd wallet address here...
              const amount = ethers.utils.parseUnits((parseFloat(awaitingRequests[i].amount) - parseFloat(process.env.FEE || '1')).toString(), 18); // send YAY
              try {
                await yay.transfer(to, amount);
                console.log('Yay Transferred!');
              } catch (e) {
                console.log(e);
                // return res.status(201).send({status: 'no_enough_pYay_balance'});
              }
              awaitingRequests[i].status = "confirmed";
              console.log('data', awaitingRequests[i]);
              await awaitingRequests[i].save();
            } catch (e) {
              // return res.status(201).send({status: 'no_enough_yay_balance'});
            }

            awaitingRequests[i].status = "confirmed";
            await awaitingRequests[i].save();
            // return res.status(201).send({status: 'confirmed'});
          } else {
            // return res.status(201).send({status: 'no_yay_received'});
          }
        } else { // if ethereum to bsc
          // eth balance check
          const provider = ethers.getDefaultProvider('ropsten');
          const yay = new ethers.Contract(YAY_ADDRESS, YAY_ABI, provider);
          let balance = await yay.balanceOf(awaitingRequests[i].eth_hot_wallet);
          balance = ethers.utils.formatEther(balance);
          console.log('balance: ', balance);

          if (balance >= parseFloat(awaitingRequests[i].amount)) {
            // send transaction on cardano
            try {
              const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
              let wallet = new ethers.Wallet(process.env.BSC_WALLET_PRIVATE_KEY || '', provider)
              wallet = wallet.connect(provider)

              const yay = new ethers.Contract(YAY_ADDRESS, YAY_ABI, wallet);
              let balance = await yay.balanceOf(wallet.address);
              balance = ethers.utils.formatEther(balance);
              console.log('Balance before transfer');
              console.log(balance, 'YAY');
              const to = awaitingRequests[i].receiver_address // Add your 2nd wallet address here...
              const amount = ethers.utils.parseUnits((parseFloat(awaitingRequests[i].amount) - parseFloat(process.env.FEE || '1')).toString(), 18); // send YAY
              try {
                await yay.transfer(to, amount);
                console.log('Yay Transferred!');
              } catch (e) {
                console.log(e);
                // return res.status(201).send({status: 'no_enough_pYay_balance'});
              }
              awaitingRequests[i].status = "confirmed";
              console.log('data', awaitingRequests[i]);
              await awaitingRequests[i].save();
            } catch (e) {
              // return res.status(201).send({status: 'no_enough_yay_balance'});
            }

            awaitingRequests[i].status = "confirmed";
            await awaitingRequests[i].save();
            // return res.status(201).send({status: 'confirmed'});
          } else {
            // return res.status(201).send({status: 'no_yay_received'});
          }
        }
      } else {
        awaitingRequests[i].status = "expired";
        await awaitingRequests[i].save();
        // return res.status(201).send({status: 'expired'});
      }
    }
    return res.status(201).send({status: 'all_checked'});
	}

	catch (error) {
    console.log(error);
    return res.status(400).send(new BadRequestError("Bad Request."));
	}
};

export const createSwapRequest = async (req: Request, res: Response) => {
	try {
		const { amount, is_cardano, receiver_address } = req.body;
    if (amount > 10000) {
      return res.status(400).send(new BadRequestError("Amount is too large!"));
    }
    let data = new SwapRequest();
    data.amount = amount;
    data.is_cardano = is_cardano;
    data.receiver_address = receiver_address;
    data.status = 'awaiting';
    data.request_time = luxon.DateTime.utc().toString();
    const id = crypto.randomBytes(32).toString('hex');
    const privateKey = "0x"+id;
    const wallet = new ethers.Wallet(privateKey);
    if (is_cardano) { // if bsc
      data.cardano_hot_wallet = wallet.address;
      data.cardano_hot_wallet_private_key = privateKey;
    } else { // if ethereum
      data.eth_hot_wallet = wallet.address;
      data.eth_hot_wallet_private_key = privateKey;
    }
    await data.save();
    data.cardano_hot_wallet_private_key = ""
    data.eth_hot_wallet_private_key = ""
    return res.status(201).send(data);
	}
	catch (error) {
		if (error.code === 11000) {
			return res.status(400).send(new BadRequestError("ID and/or username already exist."));
		}
		else {
			console.error(error);
			return res.status(400).send(new BadRequestError("Bad Request."));
		}
	}
};
