import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core";
import bscstakeAbi from '../json/bscstake.json';
import tokenAbi from '../json/token.json';
import { contract } from "./constant";
import { MulticallContractWeb3 } from "./useContracts";
import { getWeb3 } from "./connectors";
import { BSC_CHAIN_ID } from "./constant";
import { toast } from "react-toastify";


export const useCommonStats = (updater) => {
    let { chainId } = useWeb3React();
    let web3 = getWeb3(BSC_CHAIN_ID);


    const [stats, setStats] = useState({
        maxStakeableToken: 0,
        minimumStakeToken: 0,
        totalClaimedRewardToken: 0,
        totalStakedToken: 0,
        totalStakers: 0,
        totalUnStakedToken: 0,
        rewardTokenAddress: '',
        stakeTokenAddress: '',
        rewardTokenSymbol: '',
        stakeTokenSymbol: '',
        rewardTokenDecimals: 0,
        stakeTokenDecimals: 0,

    });

    const mc = MulticallContractWeb3(BSC_CHAIN_ID);
    let stakeContract = new web3.eth.Contract(bscstakeAbi, contract[BSC_CHAIN_ID].STAKE_ADDRESS);



    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await mc.aggregate([
                    stakeContract.methods.maxStakeableToken(), //0
                    stakeContract.methods.minimumStakeToken(), //1
                    stakeContract.methods.totalClaimedRewardToken(), //2
                    stakeContract.methods.totalStakedToken(), //3
                    stakeContract.methods.totalStakers(), //4
                    stakeContract.methods.totalUnStakedToken(), //5
                    stakeContract.methods.rewardToken(), //6
                    stakeContract.methods.stakeToken() //7
                ]);

                let rewardTokenContract = new web3.eth.Contract(tokenAbi, data[6]);
                let stakeTokenContract = new web3.eth.Contract(tokenAbi, data[7]);

                const tokenData = await mc.aggregate([
                    rewardTokenContract.methods.symbol(),
                    rewardTokenContract.methods.decimals(),
                    stakeTokenContract.methods.symbol(),
                    stakeTokenContract.methods.decimals()
                ]);



                setStats({
                    maxStakeableToken: data[0] / Math.pow(10,tokenData[3]),
                    minimumStakeToken: data[1] / Math.pow(10,tokenData[3]),
                    totalClaimedRewardToken: data[2] / Math.pow(10,tokenData[1]),
                    totalStakedToken: data[3] / Math.pow(10,tokenData[3]),
                    totalStakers: data[4],
                    totalUnStakedToken: data[5] / Math.pow(10,tokenData[3]),
                    rewardTokenAddress: data[6],
                    stakeTokenAddress: data[7],
                    rewardTokenSymbol: tokenData[0],
                    stakeTokenSymbol: tokenData[2],
                    rewardTokenDecimals: tokenData[1],
                    stakeTokenDecimals: tokenData[3],
                })
            }
            catch (err) {
                console.log(err.message);
                toast.error(err.reason)
            }
        }

        if (mc) {
            fetch();
        }
        else {
            setStats({
                maxStakeableToken: 0,
                minimumStakeToken: 0,
                totalClaimedRewardToken: 0,
                totalStakedToken: 0,
                totalStakers: 0,
                totalUnStakedToken: 0,
                rewardTokenAddress: '',
                stakeTokenAddress: '',
                rewardTokenSymbol: '',
                stakeTokenSymbol: '',
                rewardTokenDecimals: 0,
                stakeTokenDecimals: 0,
            })
        }
        // eslint-disable-next-line
    }, [updater, chainId]);

    return stats;
}
