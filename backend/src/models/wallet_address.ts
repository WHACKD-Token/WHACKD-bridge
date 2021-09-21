import mongoose from 'mongoose'

interface Dictionary<T> {
  [key: string]: T;
}

interface IWalletAddress {
  address: string,
  used: boolean,
}

interface walletAddressModelInterface extends mongoose.Model<WalletAddressDoc> {
  build(attr: IWalletAddress): WalletAddressDoc
}

interface WalletAddressDoc extends mongoose.Document {
  address: string,
  used: boolean,
}

const WalletAddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  used: {
    type: Boolean,
    required: false,
    default: false
  }
})

WalletAddressSchema.statics.build = (attr: IWalletAddress) => {
  return new WalletAddress(attr)
}

const WalletAddress = mongoose.model<WalletAddressDoc, walletAddressModelInterface>('WalletAddress', WalletAddressSchema)

export { WalletAddress }




