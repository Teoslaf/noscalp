// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Script.sol";
import "../src/SimpleTicketFactory.sol";

contract DeployScript is Script {
    function run() external {
        // This will use the private key passed via --private-key
        vm.startBroadcast();
        
        // Deploy the SimpleTicketFactory contract
        SimpleTicketFactory ticketFactory = new SimpleTicketFactory();
        
        vm.stopBroadcast();
        
        console.log("SimpleTicketFactory deployed at:", address(ticketFactory));
    }
}