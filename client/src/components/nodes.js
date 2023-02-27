// import { Contract } from "near-api-js";
import React,{useState,useEffect} from "react";

const Nodes=({state,address})=>{
    const [account,setAccount]=useState("");
    const [networkNodes,setnetworkNodes]=useState([]);
    const [victimNodes,setVictimNodes]=useState([]);

    const [helpedNode,setHelpedNode]=useState("");
    const [victimAddress, setVictimAddress] = useState("");
    const [helperAddress,setHelperAddress] = useState("");
    const [byteSize, setByteSize]= useState(null)
    const [reload,setReload]=useState(false);
    const [nodeAssetAddress,setNodeAssetAddress]=useState("");
    const [nodesAsset,setNodesAsset]=useState(0);

    const reloadEffect=()=>{
      setReload(!reload);
    }
    const handlenodeAsset=(e)=>{
      e.preventDefault()
      let data=e.target.value
      setNodeAssetAddress(data)

    }

    const handleOnSubmit2= async(e)=>{
      e.preventDefault()
      //console.log(state);
      const {contract}=state;
      const nodeAsset=await contract.methods.nodeAssets(nodeAssetAddress).call();
      console.log(nodeAsset)
      setNodesAsset(nodeAsset);
      // console.log("testing",contract);
    }

    const setAccountListener = (provider) => {
        provider.on("accountsChanged", (accounts) => {

          setAccount(accounts[0]);
        });
    };
    const handleOnSubmit = async () => {
        const {contract}=state;
        const helpedFunction=await contract.methods.helped(helperAddress,victimAddress, byteSize).send({from:account});
        setHelpedNode(helpedFunction);
    }
    const handleOnVictimAddressChange =(e)=>{
        e.preventDefault()
        let data = e.target.value.split(',')
        setHelperAddress(data[0])
        setVictimAddress(data[1])
        setByteSize(data[2])
    }

    useEffect(()=>{
        const getAccounts=async ()=>{

            const {web3}=state;
            const accounts=await web3.eth.getAccounts();
            setAccountListener(web3.givenProvider);
            setAccount(accounts[0]);

        }
        state.web3 && getAccounts();
    },[state,state.web3]);

    useEffect(()=>{
        const getNodes=async ()=>{

            const {contract}=state;
            const nodes= await contract.methods.allnodes().call();
            //console.log(nodes);
            const networkNodes= await Promise.all(
                nodes.map((node)=>{
                    return node;
                })
            )
            //console.log(networkNodes);
            setnetworkNodes(networkNodes);
            reloadEffect();
        }
        state.contract && getNodes();
    },[state,state.contract,reload])

    useEffect(()=>{
      const getVictimNodes=async ()=>{

          const {contract}=state;
          const Vnodes= await contract.methods.getVictimNodes().call();
          //console.log(Vnodes);
          const victimNodes= await Promise.all(
              Vnodes.map((node)=>{
                  return node;
              })
          )
          //console.log(victimNodes);
          setVictimNodes(victimNodes);
          reloadEffect();
      }
      state.contract && getVictimNodes();
  },[state,state.contract,reload])

    // const helped=async ()=>{

    //     const {contract}=state;
    //     const helpedFunction=await contract.methods.helped().send({from:account});
    //     setHelpedNode(helpedFunction);

    // }

    return (
        <>
      <ul className="list-group" id="list">
        <div className="center">
          <li className="list-group-item" aria-disabled="true">
            <b>Connected account :</b> {account}
          </li>
          <li>
            <form /*onSubmit={helped}*/>
                <label><b>Enter Helper Address, Victim Address, Bandwidth Size: </b>
                    <input type="text" onChange={handleOnVictimAddressChange}></input>
                    {/* <input type="text" value2={helpedNode} onChange={(e)=> setHelpedNode(e.target.value2)}></input> */}
                </label>
                <input type="submit"  onClick={handleOnSubmit}/>

            </form>
          </li>
          <li className="list-group-item">
            <b>Please pay network collatreral (Min. 2 Eth) : </b> {address}
          </li>
          <li className="list-group-item">
            <b>Network Nodes </b>:
            <br />
            <br />
            {networkNodes.length !== 0 &&
              networkNodes.map((name) => <p key={name}>{name}</p>)}
          </li>
          <li className="list-group-item">
            <b>Victim Nodes </b>:
            <br />
            <br />
            {victimNodes.length !== 0 &&
              victimNodes.map((name) => <p key={name}>{name}</p>)}
          </li>
          <li className="list-group-item">
            <b>Node Balnace : </b> {nodesAsset} ETH <br></br> 
            
              
                <b>Enter Node Address To Know Its Balance : </b>
                <input type="text" onChange={handlenodeAsset}/>

              <button type="submit" onClick={handleOnSubmit2}>Submit</button>
             
          </li>
          
        </div>
      </ul>
    </>
  );
    
}

export default Nodes;