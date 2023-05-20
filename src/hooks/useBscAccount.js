import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core";
import bscstakeAbi from '../json/bscstake.json';
import tokenAbi from '../json/token.json';
import { contract } from "./constant";
import { MulticallContractWeb3 } from "./useContracts";
import { getWeb3 } from "./connectors";
import { BSC_CHAIN_ID } from "./constant";
import { toast } from "react-toastify";


export const useAccountStats = (updater) => {
    let { chainId, account } = useWeb3React();
    let web3 = getWeb3(BSC_CHAIN_ID);


    const [stats, setStats] = useState({
        totalStakedTokenUser: 0,
        totalUnstakedTokenUser: 0,
        totalClaimedRewardTokenUser: 0,
        stakeCount: 0,
        alreadyExists: false,
        totalStakeHistory: [],
        stakeTokenDecimals: 0,
        rewardTokenDecimals: 0,
        stakeTokenBalance : 0,
        currentStake : 0,
        isApproved : false,
        rewardHistory : []
    });

    const mc = MulticallContractWeb3(BSC_CHAIN_ID);
    let stakeContract = new web3.eth.Contract(bscstakeAbi, contract[BSC_CHAIN_ID].STAKE_ADDRESS);



    useEffect(() => {
        const fetch = async () => {
            try {
                let stakeInfoArray = [];
                let rewardArray = [];
                const data = await mc.aggregate([
                    stakeContract.methods.Stakers(account), //0
                    stakeContract.methods.stakeToken(), //2
                    stakeContract.methods.rewardToken() //1
                ]);

                let stakeTokenContract = new web3.eth.Contract(tokenAbi, data[1]);
                let rewardTokenContract = new web3.eth.Contract(tokenAbi, data[2]);

                const tokenData = await mc.aggregate([
                    stakeTokenContract.methods.decimals(),
                    rewardTokenContract.methods.decimals(),
                    stakeTokenContract.methods.balanceOf(account),
                    stakeTokenContract.methods.allowance(account , contract[BSC_CHAIN_ID].STAKE_ADDRESS )
                ]);

                if (parseInt(data[0][3]) > 0) {

                    let callArray = [];
                    let rcallArray = [];
                    for (let i = 0; i < data[0][3]; i++) {
                        callArray[i] = stakeContract.methods.stakersRecord(account, i);
                        rcallArray[i] = stakeContract.methods.realtimeRewardPerBlock (account, i);
                    }

                    stakeInfoArray = await mc.aggregate(callArray);
                    rewardArray = await mc.aggregate(rcallArray);
                }

                setStats({
                    totalStakedTokenUser: data[0][0] / Math.pow(10, tokenData[0]),
                    totalUnstakedTokenUser: data[0][1] / Math.pow(10, tokenData[0]),
                    totalClaimedRewardTokenUser: data[0][2] / Math.pow(10, tokenData[1]),
                    stakeCount: data[0][3],
                    alreadyExists: data[0][4],
                    totalStakeHistory: stakeInfoArray,
                    rewardHistory : rewardArray,
                    stakeTokenDecimals: tokenData[0],
                    rewardTokenDecimals: tokenData[1],
                    stakeTokenBalance : tokenData[2] / Math.pow(10, tokenData[0]),
                    currentStake : (parseFloat(data[0][0]) - parseFloat(data[0][1])) / Math.pow(10, tokenData[0]),
                    isApproved : (tokenData[3] / Math.pow(10, tokenData[0])) > 10000000 ? true : false
                })
            }
            catch (err) {
                console.log(err.message);
                toast.error(err.reason)
            }
        }

        if (mc && account) {
            fetch();
        }
        else {
            setStats({
                totalStakedTokenUser: 0,
                totalUnstakedTokenUser: 0,
                totalClaimedRewardTokenUser: 0,
                stakeCount: 0,
                alreadyExists: false,
                totalStakeHistory: [],
                stakeTokenDecimals: 0,
                rewardTokenDecimals: 0,
                stakeTokenBalance : 0,
                currentStake : 0,
                isApproved : false,
                rewardHistory : []
            })
        }
        // eslint-disable-next-line
    }, [updater, chainId, account]);

    return stats;
}
