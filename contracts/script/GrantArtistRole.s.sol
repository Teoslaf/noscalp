// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Script.sol";
import "../src/SimpleTicketFactory.sol";

contract GrantArtistRoleScript is Script {
    function run() external {
        // Get the deployed contract address from command line args
        address contractAddress = vm.envAddress("CONTRACT_ADDRESS");
        // Get the artist address from command line args
        address artistAddress = vm.envAddress("ARTIST_ADDRESS");
        
        // Connect to the deployed contract
        SimpleTicketFactory ticketFactory = SimpleTicketFactory(contractAddress);
        
        // Start broadcast to send transactions
        vm.startBroadcast();
        
        // Grant artist role
        ticketFactory.grantArtistRole(artistAddress);
        
        vm.stopBroadcast();
        
        console.log("Granted ARTIST_ROLE to:", artistAddress);
        console.log("On contract:", contractAddress);
    }
}
