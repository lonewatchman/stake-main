import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core";
import creditstakeAbi from '../json/creditstake.json';
import tokenAbi from '../json/token.json';
import { contract } from "./constant";
import { MulticallContractWeb3 } from "./useContracts";
import { getWeb3 } from "./connectors";
import { CREDIT_CHAIN_ID } from "./constant";
import { toast } from "react-toastify";


export const useCommonStats = (updater) => {
    let { chainId } = useWeb3React();
    let web3 = getWeb3(CREDIT_CHAIN_ID);


    const [stats, setStats] = useState({
        maxStakeableToken: 0,
        minimumStakeToken: 0,
        totalClaimedRewardToken: 0,
        totalStakedToken: 0,
        totalStakers: 0,
        totalUnStakedToken: 0,
        rewardTokenAddress: '',
        rewardTokenSymbol: '',
        stakeTokenSymbol: 'CREDIT',
        rewardTokenDecimals: 0,
        stakeTokenDecimals: 18,

    });

    const mc = MulticallContractWeb3(CREDIT_CHAIN_ID);
    let stakeContract = new web3.eth.Contract(creditstakeAbi, contract[CREDIT_CHAIN_ID].STAKE_ADDRESS);



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
                ]);

                let rewardTokenContract = new web3.eth.Contract(tokenAbi, data[6]);


                const tokenData = await mc.aggregate([
                    rewardTokenContract.methods.symbol(),
                    rewardTokenContract.methods.decimals()
                ]);



                setStats({
                    maxStakeableToken: data[0] / Math.pow(10, 18),
                    minimumStakeToken: data[1] / Math.pow(10, 18),
                    totalClaimedRewardToken: data[2] / Math.pow(10, tokenData[1]),
                    totalStakedToken: data[3] / Math.pow(10, 18),
                    totalStakers: data[4],
                    totalUnStakedToken: data[5] / Math.pow(10, 18),
                    rewardTokenAddress: data[6],
                    rewardTokenSymbol: tokenData[0],
                    stakeTokenSymbol: 'CREDIT',
                    rewardTokenDecimals: tokenData[1],
                    stakeTokenDecimals: 18,
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
                rewardTokenSymbol: '',
                stakeTokenSymbol: 'CREDIT',
                rewardTokenDecimals: 0,
                stakeTokenDecimals: 18,
            })
        }
        // eslint-disable-next-line
    }, [updater, chainId]);

    return stats;
}
