import _ from 'lodash';


export class UpdateReducer {
  reduce(json, state) {
    console.log('update', json);
    if (json.providerStatus) {
      this.reduceProviderStatus(json.providerStatus, state);
    }
    if (json["change-provider"]) {
      this.reduceChangeProvider(json["change-provider"], state);
    }
    if (json["change-wallet"]) {
      this.changeWallet(json["change-wallet"], state);
    }
    if (json.psbt) {
      this.reducePsbt(json.psbt, state);
    }
    if (json["btc-state"]) {
      this.reduceBtcState(json["btc-state"], state);
    }
    if (json["new-tx"]) {
      this.reduceNewTx(json["new-tx"], state);
    }
    if (json["cancel-tx"]) {
      this.reduceCancelTx(json["cancel-tx"], state);
    }
  }

  reduceProviderStatus(json, state) {
    state.providerPerms[json.provider] = json.permitted;
  }

  reduceChangeProvider(json, state) {
    state.provider = json;
  }

  reduceChangeWallet(json, state) {
    state.wallet = json;
  }

  reducePsbt(json, state) {
    state.psbt = json;
  }

  reduceBtcState(json, state) {
    state.btcState = json;
  }

  reduceNewTx(json, state) {
    console.log("new-tx.....", json);
    let old = _.findIndex(state.history, (h) => {
      return ( h.txid.dat === json.txid.dat &&
               h.txid.wid === json.txid.wid );
    });
    if (old !== -1) {
      delete state.history[old];
    }
    if (json.recvd === null) {
      state.history.unshift(json);
    }
    // we expect history to have null recvd values first, and the rest in
    // descending order
    let insertionIndex = _.findIndex(state.history, (h) => {
      console.log("h", h);
      return ((h.recvd < json.recvd) && (h.recvd !== null));
    });
    state.history.splice(insertionIndex, 0, json);
  }

  reduceCancelTx(json, state) {
    let entryIndex = _.findIndex(state.history, (h) => {
      return ((json.wid === h.txid.wid) && (json.dat === h.txid.dat));
    });
    state.history[entryIndex].failure = true;
  }
}
