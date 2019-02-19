/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

#!/usr/bin/env node
const path = require('path')
const { Ipfs, createDefaultRuntime, } = require('blockchain-core')
const IpfsApi = require('ipfs-api')
const Web3 = require('web3')
const exec = require('child_process').exec

async function deployIPFSFolder(folderPath) {
  return new Promise((resolve, reject) => {
    exec(`ipfs add -r ${folderPath}`, {

    }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        let folderHash = stdout.split('\n');

        folderHash = folderHash[folderHash.length - 2].split(' ')[1];

        resolve(folderHash);
      }
    })
  })
}

async function createRuntime() {
  const runtimeConfig = {
    accountMap: {
      '0x001De828935e8c7e4cb56Fe610495cAe63fb2612':
        '01734663843202e2245e5796cb120510506343c67915eb4f9348ac0d8c2cf22a',
    },
    ipfs: { host: 'ipfs.test.evan.network', port: '443', protocol: 'https' },
    web3Provider: 'wss://testcore.evan.network/ws',
  };

  // initialize dependencies
  const web3 = new Web3();
  web3.setProvider(new web3.providers.WebsocketProvider(runtimeConfig.web3Provider));
  const dfs = new Ipfs({ remoteNode: new IpfsApi(runtimeConfig.ipfs), });

  // create runtime
  const runtime = await createDefaultRuntime(web3, dfs, { accountMap: runtimeConfig.accountMap, });

  return runtime;
}

async function deployContract() {
  const dappToDeploy = process.argv[process.argv.indexOf('--dapp') + 1];
  const pathToDApp = path.resolve(`${ __dirname }/../dapps/${ dappToDeploy }`);
  let definition;

  try {
    definition = require(`${ pathToDApp }/dbcp.json`)
  } catch (ex) {
    return console.error(`Could not find definition file for "${ dappToDeploy }"`);
  }

  const runtime = await createRuntime();
  const folderHash = await deployIPFSFolder(`${ pathToDApp }/dist`);

  definition.public.dapp.origin = folderHash;

  // we'll use this account for our transactions
  const from = '0x001De828935e8c7e4cb56Fe610495cAe63fb2612';
  // add abi for a described greeter, see /contracts/Greeter.sol, for the contract code
  runtime.contractLoader.contracts['Greeter'] = {
    "interface": "[{\"constant\":true,\"inputs\":[],\"name\":\"contractDefinition\",\"outputs\":[{\"name\":\"\",\"type\":\"bytes32\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"owner_\",\"type\":\"address\"}],\"name\":\"setOwner\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"sealDescription\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"data\",\"outputs\":[{\"name\":\"\",\"type\":\"uint8\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"authority_\",\"type\":\"address\"}],\"name\":\"setAuthority\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_contractDescription\",\"type\":\"bytes32\"}],\"name\":\"setDescription\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_data\",\"type\":\"uint8\"}],\"name\":\"setData\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"authority\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"greet\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"name\":\"_greeting\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"authority\",\"type\":\"address\"}],\"name\":\"LogSetAuthority\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"LogSetOwner\",\"type\":\"event\"}]",
    "bytecode": "6060604052341561000f57600080fd5b6040516107603803806107608339810160405280805160018054600160a060020a03191633600160a060020a031690811790915592019190507fce241d7ca1f669fee44b6fc00b8eba2df3bb514eed0f6f668f8f89096e81ed9460405160405180910390a2600481805161008792916020019061008e565b5050610129565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100cf57805160ff19168380011785556100fc565b828001600101855582156100fc579182015b828111156100fc5782518255916020019190600101906100e1565b5061010892915061010c565b5090565b61012691905b808211156101085760008155600101610112565b90565b610628806101386000396000f3006060604052600436106100a35763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663081ce28881146100a857806313af4035146100cd57806363789a0b146100ee57806373d4a13a146101015780637a9e5e4b1461012a57806389f5df5d146101495780638da5cb5b1461015f5780638f7554791461018e578063bf7e214f146101a7578063cfae3217146101ba575b600080fd5b34156100b357600080fd5b6100bb610244565b60405190815260200160405180910390f35b34156100d857600080fd5b6100ec600160a060020a036004351661024a565b005b34156100f957600080fd5b6100ec6102de565b341561010c57600080fd5b610114610305565b60405160ff909116815260200160405180910390f35b341561013557600080fd5b6100ec600160a060020a036004351661030e565b341561015457600080fd5b6100ec6004356103a2565b341561016a57600080fd5b6101726103d0565b604051600160a060020a03909116815260200160405180910390f35b341561019957600080fd5b6100ec60ff600435166103df565b34156101b257600080fd5b61017261040d565b34156101c557600080fd5b6101cd61041c565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156102095780820151838201526020016101f1565b50505050905090810190601f1680156102365780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60025481565b610275336000357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166104c4565b151561028057600080fd5b6001805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038381169190911791829055167fce241d7ca1f669fee44b6fc00b8eba2df3bb514eed0f6f668f8f89096e81ed9460405160405180910390a250565b60015433600160a060020a039081169116146102f657fe5b6005805460ff19166001179055565b60035460ff1681565b610339336000357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166104c4565b151561034457600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038381169190911791829055167f1abebea81bfa2637f28358c371278fb15ede7ea8dd28d2e03b112ff6d936ada460405160405180910390a250565b60015433600160a060020a0390811691161480156103c3575060055460ff16155b15156103cb57fe5b600255565b600154600160a060020a031681565b60015433600160a060020a039081169116146103f757fe5b6003805460ff191660ff92909216919091179055565b600054600160a060020a031681565b6104246105ea565b60048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104ba5780601f1061048f576101008083540402835291602001916104ba565b820191906000526020600020905b81548152906001019060200180831161049d57829003601f168201915b5050505050905090565b600030600160a060020a031683600160a060020a031614156104e8575060016105e4565b600154600160a060020a0384811691161415610506575060016105e4565b600054600160a060020a03161515610520575060006105e4565b60008054600160a060020a03169063b700961390859030908690604051602001526040517c010000000000000000000000000000000000000000000000000000000063ffffffff8616028152600160a060020a0393841660048201529190921660248201527bffffffffffffffffffffffffffffffffffffffffffffffffffffffff199091166044820152606401602060405180830381600087803b15156105c757600080fd5b6102c65a03f115156105d857600080fd5b50505060405180519150505b92915050565b602060405190810160405260008152905600a165627a7a72305820874f74e0da4323668237a70ceba993171de81ac9a6e37ae12b552544722819cf0029"
  };

  // create contract example
  console.log('start creating contract')
  // create a new greeter contract
  const greeter = await runtime.executor.createContract('Greeter', [`Hello evan.network! ${Math.random()}`], { from, gas: 1000000, });
  console.log(`created contract: "${greeter.options.address}"`);
  // interface can be added from running contract instance (or kept as static abi in default value)
  definition.public.abis = { own: greeter.options.jsonInterface, };
  await runtime.definition.setDefinitionToContract(greeter.options.address, definition, from);
  const greeterAddress = greeter.options.address;

  // now load contract via dbcp and start working with it
  // load contract and work with it
  const contract = await runtime.definition.loadContract(greeterAddress);

  // contract object is a web3 (1.0) contract object, abi is provided via dbcp
  console.log('contract methods:');
  console.dir(Object.keys(contract.methods));

  // you can call the functions web3 style:
  console.log(`contract response: ${await contract.methods.greet().call()}`);
  // or via internal executor wrapper:
  console.log(`contract response: ${await runtime.executor.executeContractCall(contract, 'greet')}`);
}

deployContract();

