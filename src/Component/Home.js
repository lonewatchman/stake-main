import { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { BSC_CHAIN_ID, BSC_STAKE_APY, contract } from "../hooks/constant";
import { formatPrice, getContract } from "../hooks/contractHelper";
import { useCommonStats } from "../hooks/useBscCommon";
import { useAccountStats } from "../hooks/useBscAccount";
import { useWeb3React } from "@web3-react/core";
import { toast } from 'react-toastify';
import tokenAbi from '../json/token.json';
import stakeAbi from '../json/bscstake.json';
import { ethers } from "ethers";
import { getWeb3 } from "../hooks/connectors";

function Home() {
    const { account, chainId, library } = useWeb3React();
    const [updater, setUpdater] = useState(new Date());
    const commonStats = useCommonStats(updater);
    const accStats = useAccountStats(updater);
    const [selectedAPY, setSelectedAPY] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const timeElapsed = Date.now();
    const [endtime, setEndtime] = useState(new Date(parseInt(timeElapsed) + parseInt(BSC_STAKE_APY[0].time * 86400 * 1000)));

    const handleChangeAPY = (e, index) => {
        e.preventDefault();
        setSelectedAPY(index);
        setEndtime(new Date(parseInt(timeElapsed) + parseInt(BSC_STAKE_APY[index].time * 86400 * 1000)))
    }

    const handleApprove = async () => {
        // Code for handleApprove function
        // ...
    }

    const handleChangeAmount = (e) => {
        // Code for handleChangeAmount function
        // ...
    }

    const handleMaxAmount = () => {
        // Code for handleMaxAmount function
        // ...
    }

    const handleStake = async () => {
        // Code for handleStake function
        // ...
    }

    const handleUnStake = async (index) => {
        // Code for handleUnStake function
        // ...
    }

    const handleHarvest = async (index) => {
        // Code for handleHarvest function
        // ...
    }

    return (
        <>
            <section className="banner-section">
                {/* Banner section JSX code */}
            </section>

            <section className="details-section">
                {/* Details section JSX code */}
            </section>
        </>
    );
}

export default Home;
