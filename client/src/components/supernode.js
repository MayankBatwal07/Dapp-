import React ,{useState,useEffect} from "react";
import "./supernode.css";

const Supernode=({state})=>{
    const [account,setAccount]=useState("");
    const [cbalance,setCbalance]=useState(0);
    const [helper,setHelper]=useState("No helper yet");
    const [rewardedNodes,setRewardedNodes]=useState([]);
    const [noOfNodes,setNoOfNodes]=useState(0);
    const [reload,setReload]=useState(false);
    const [nodeAssetAddress,setNodeAssetAddress]=useState("");
    const [nodesAsset,setNodesAsset]=useState(0);

    const reloadEffect=()=>{
      setReload(!reload);
    }

    const setAccountListener = (provider) => {
        provider.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
        });
    };

    const handlenodeAsset=(e)=>{
      e.preventDefault()
      let data=e.target.value
      setNodeAssetAddress(data)

    }

    const handleOnSubmit= async(e)=>{
      e.preventDefault()
      //console.log(state);
      const {contract}=state;
      const nodeAsset=await contract.methods.nodeAssets(nodeAssetAddress).call();
      console.log(nodeAsset)
      setNodesAsset(nodeAsset);
      // console.log("testing",contract);
    }

    useEffect(()=>{
        const getAccount =async()=>{
            const {web3}=state;
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            setAccountListener(web3.givenProvider);
            setAccount(accounts[0]);
        }
        state.web3 && getAccount();
    },[state,state.web3]);
    
    useEffect(()=>{
      const getRewardedNodes=async ()=>{

          const {contract}=state;
          const Rnodes= await contract.methods.getRewardedNodes().call();
          //console.log(Rnodes);
          const rewardedNodes= await Promise.all(
              Rnodes.map((node)=>{
                  return node;
              })
          )
          //console.log(rewardedNodes);
          setRewardedNodes(rewardedNodes);
          reloadEffect();
      }
      state.contract && getRewardedNodes();
  },[state,state.contract,reload])

    const contractBalance =async ()=>{

        const {contract}=state;
        try{
            const balance= await contract.methods.getBalance().call({from:account});
            console.log(balance);
            setCbalance(balance);
        }
        catch(e){
            setCbalance("You are not supernode");
            
        }
    }
    const getNoOfNodes=async()=>{
      const {contract}=state;
      const totalNodes=await contract.methods.numberOfNodes().call();
      console.log(totalNodes);
      setNoOfNodes(totalNodes);
    }

    const reward = async ()=>{
        const {contract}=state;
        try{
          
            await contract.methods.retrieve_bsize().call();
            const helpernode=await contract.methods.helperAddress().call();
            await contract.methods.victimAddress().call();
            await contract.methods.reward().send({from:account});
            console.log(helpernode);
            setHelper(helpernode); 
        }catch(e){
            if(e.message.includes("You are not supernode")){
                setHelper("You are not supernode");
            }
            else if(e.message.includes("Nodes less than 1")){
                setHelper("Nodes less than 1");
            }else if(e.message.includes("Victim node don't have funds for protection.")){
                setHelper("Victim node don't have funds for protection.");

            }
            else{
                setHelper("No helper yet");
            }
        }
    }

    return (
        
        <ul className="list-group" id="list">
        <div className="center">
          <li className="list-group-item" aria-disabled="true">
            <b>Connected account :</b> {account}
          </li>
          <li className="list-group-item">
            <b> Rewarded Node : </b>
            {helper}
            <button className="button1" onClick={reward}>
              Click For Reward
            </button>
          </li>
          <li className="list-group-item">
            <b>Rewarded Nodes </b>:
            <br />
            <br />
            {rewardedNodes.length !== 0 &&
              rewardedNodes.map((name) => <p key={name}>{name}</p>)}
          </li>
          <li className="list-group-item">
            <b>Total Nodes : </b> {noOfNodes}
            <button className="button1" onClick={getNoOfNodes}>
              Number Of Nodes
            </button>
          </li>
          <li className="list-group-item">
            <b>Contract Balnace : </b> {cbalance} ETH
            <button className="button1" onClick={contractBalance}>
              Click For Balance
            </button>
          </li>
          <li className="list-group-item">
            <b>Node Balnace : </b> {nodesAsset} ETH <br></br> 
            
              
                <b>Enter Node Address To Know Its Balance : </b>
                <input type="text" onChange={handlenodeAsset}/>

              <button type="submit" onClick={handleOnSubmit}>Submit</button>
             
          </li>
        </div>
      </ul>
    );

};

export default Supernode;