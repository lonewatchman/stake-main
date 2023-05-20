import React from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
    NoEthereumProviderError
} from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { injected, walletconnect } from "../hooks/connectors";
import Modal from 'react-bootstrap/Modal';
import { trimAddress } from '../hooks/constant';
import useEagerConnect from '../hooks/useWeb3';
import metamaskIcon from '../Assets/img/metamask.svg';
import walletconnectIcon from '../Assets/img/walletconnect.svg';
import localStorage from "local-storage";




export const Connect = function () {
    const context = useWeb3React();
    const { connector, account, activate, deactivate, active, error } = context;
    const [show, setShow] = useState(false);

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState();
    useEagerConnect();
    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    useEffect(()=>{
        if(account){
            localStorage.set('address' , account);
        }
    },[account])


    function getErrorMessage(error) {

        if (error instanceof NoEthereumProviderError) {
            const dappUrl = window.location.href; // TODO enter your dapp URL. 
            let metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
            window.open(metamaskAppDeepLink)
        }
        if (error instanceof UnsupportedChainIdError) {
            return <span className="btn-text" onClick={(e) => switchNetwork(56)}>Switch Network</span>;
        }

        deactivate(injected);
    }

    const activating = (connection) => connection === activatingConnector;
    const connected = (connection) => connection === connector;

    const switchNetwork = (networkid) => {
        try {
            // @ts-ignore
            window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${networkid.toString(16)}` }]
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <React.Fragment>
            {
                error &&
                <button type="button" className="theme-btn" onClick={() => {
                    setActivatingConnector();
                }}>
                    {getErrorMessage(error)}
                </button>
            }
            {!error &&
                <>
                    {active && (connected(injected) || connected(walletconnect)) &&

                        <button type="button" className="theme-btn" onClick={() => {
                            setActivatingConnector();
                            deactivate(injected);
                            deactivate(walletconnect);
                            localStorage.remove('address');
                        }}>{account && trimAddress(account)}
                        </button>
                    }
                    {!active && (!connected(injected) || !connected(walletconnect)) &&
                        <button type="button" className="theme-btn" onClick={() => {
                            setShow(!show);
                        }}>
                            {(activating(injected) || activating(walletconnect)) && <span className="btn-text">Connecting...</span>}
                            {(!activating(injected) || !activating(walletconnect)) && <span className="btn-text"><i className="icon-wallet mr-md-2"></i>Connect Wallet</span>}

                        </button>
                    }
                </>
            }


            <Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Connect Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="btn-connect" onClick={() => {
                        activate(injected);
                        setShow(false);
                    }}>
                        <h1 className="connect">Metamask</h1>
                        <img src={metamaskIcon} alt="metamask" />
                    </div>
                    <div className="btn-connect" onClick={() => {
                        activate(walletconnect);
                        setShow(false);
                    }}>
                        <h1 className="connect">Connect Wallet</h1>
                        <img src={walletconnectIcon} alt="connectwallet" />
                    </div>
                </Modal.Body>
            </Modal>




        </React.Fragment >
    );
};

export default Connect;