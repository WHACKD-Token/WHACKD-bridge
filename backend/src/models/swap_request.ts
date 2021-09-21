import mongoose from 'mongoose'

interface Dictionary<T> {
  [key: string]: T;
}

interface ISwapRequest {
  amount: string,
  is_cardano: boolean,
  receiver_address: string,
  cardano_hot_wallet: string,
  cardano_hot_wallet_private_key: string,
  eth_hot_wallet: string,
  eth_hot_wallet_private_key: string,
  status: string,
  request_time: string
}

interface swapRequestModelInterface extends mongoose.Model<SwapRequestDoc> {
  build(attr: ISwapRequest): SwapRequestDoc
}

interface SwapRequestDoc extends mongoose.Document {
  amount: string,
  is_cardano: boolean,
  receiver_address: string,
  cardano_hot_wallet: string,
  cardano_hot_wallet_private_key: string,
  eth_hot_wallet: string,
  eth_hot_wallet_private_key: string,
  status: string,
  request_time: string
}

const SwapRequestSchema = new mongoose.Schema({
  amount: {
    type: String,
    required: true
  },
  is_cardano: {
    type: Boolean,
    required: true
  },
  receiver_address: {
    type: String,
    required: true
  },
  cardano_hot_wallet: {
    type: String,
    required: false
  },
  cardano_hot_wallet_private_key: {
    type: String,
    required: false
  },
  eth_hot_wallet: {
    type: String,
    required: false
  },
  eth_hot_wallet_private_key: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  request_time: {
    type: String,
    required: true
  },
})

SwapRequestSchema.statics.build = (attr: ISwapRequest) => {
  return new SwapRequest(attr)
}

const SwapRequest = mongoose.model<SwapRequestDoc, swapRequestModelInterface>('SwapRequest', SwapRequestSchema)

export { SwapRequest }



