import cfr from 'cosmos-fundraiser'
const { bitcoin } = cfr

const empty = {
  progress: 1,
  wallet: null,
  tx: null
}

const state = JSON.parse(JSON.stringify(empty))

const mutations = {
  resetBtcDonation (state) {
    state = JSON.parse(JSON.stringify(empty))
  },
  setBtcDonationWallet (state, wallet) {
    state.wallet = wallet
    console.log('SET btcDonation.wallet')
  },
  setBtcDonationEncryptedSeed (state, encryptedSeed) {
    state.encryptedSeed = encryptedSeed
    console.log('SET btcDonation.encryptedSeed')
  },
  setBtcDonationProgress (state, value) {
    state.progress = value
    console.log('SET btcDonation.progress', state.progress)
  },
  setBtcDonationTx (state, tx) {
    state.tx = tx
    console.log('SET btcDonation.tx', state.tx)
  }
}

const actions = {
  generateBtcDonationWallet ({ commit }, password) {
    let testnet = process.env.NODE_ENV === 'development'
    let seed = cfr.generateSeed()
    let wallet = cfr.deriveWallet(seed, testnet)
    commit('setBtcDonationWallet', wallet)
    let encryptedSeed = cfr.encryptSeed(seed, password)
    commit('setBtcDonationEncryptedSeed', encryptedSeed)
    commit('setBtcDonationProgress', 2)
  },
  finalizeBtcDonation ({ commit, dispatch, state, rootState }, cb) {
    let testnet = process.env.NODE_ENV === 'development'

    var pushTx
    if (testnet) {
      // push to API server if in dev mode
      pushTx = (tx, cb) => rootState.session.client.pushTx(tx, cb)
    } else {
      pushTx = (tx, cb) => bitcoin.pushTx(tx, { tesnet: false }, cb)
    }

    let { wallet, tx } = state
    let finalTx = bitcoin.createFinalTx(wallet, tx)
    pushTx(finalTx.tx, (err, txid) => {
      if (err) {
        console.error(err)
        commit('notifyError', {
          title: 'Bitcoin Error',
          body: 'Could not broadcast donation transaction.'
        })
        return cb(err)
      }
      console.log('sent final tx. txid=' + txid)
      commit('addDonation', {
        type: 'btc',
        time: Date.now(),
        price: rootState.config.COINS.BTC.EXCHANGE_RATE,
        atoms: finalTx.atomAmount
      })
      commit('resetBtcDonation')
      commit('notifyCustom', {
        title: 'Donation Successful',
        body: `You have succesfully donated ${finalTx.paidAmount / 1e8} BTC and will receive ${finalTx.atomAmount} ATOM.`
      })
      cb()
    })
  }
}

export default {
  state,
  mutations,
  actions
}
