// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/SimpleTicketFactory.sol";

// Mock contract to receive Ether
contract MockReceiver {
    // Function to receive Ether
    receive() external payable {}
}

contract SimpleTicketFactoryTest is Test {
    SimpleTicketFactory ticketFactory;
    address payable admin;
    address payable artist;
    address payable buyer;
    address payable anotherBuyer;

    // Events to test
    event EventCreated(
        uint256 indexed eventId,
        address indexed artist,
        string name
    );
    event TicketTypeCreated(
        uint256 indexed ticketTypeId,
        uint256 indexed eventId,
        string category,
        uint256 price,
        uint256 maxSupply
    );
    event TicketPurchased(
        uint256 indexed ticketTypeId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );
    event PlatformFeeCollectorChanged(address indexed newFeeCollector);

    function setUp() public {
        // Create mock receivers for admin and artist
        MockReceiver adminReceiver = new MockReceiver();
        MockReceiver artistReceiver = new MockReceiver();
        
        // Setup accounts
        admin = payable(address(adminReceiver));
        artist = payable(address(artistReceiver));
        buyer = payable(makeAddr("buyer"));
        anotherBuyer = payable(makeAddr("anotherBuyer"));

        // Deploy contract
        ticketFactory = new SimpleTicketFactory();
        
        // Set platform fee collector to our mock admin
        ticketFactory.setPlatformFeeCollector(admin);

        // Fund accounts
        vm.deal(buyer, 10 ether);
        vm.deal(anotherBuyer, 10 ether);
        vm.deal(artist, 1 ether);
    }

    function testInitialState() public view {
        // Check that deployer has admin role
        assertTrue(ticketFactory.hasRole(ticketFactory.ADMIN_ROLE(), address(this)));
        
        // Check that platform fee collector is set to our mock admin
        assertEq(ticketFactory.platformFeeCollector(), admin);
        
        // Check platform fee basis points
        assertEq(ticketFactory.PLATFORM_FEE_BASIS_POINTS(), 1000); // 10%
    }

    function testGrantArtistRole() public {
        // Grant artist role
        ticketFactory.grantArtistRole(artist);
        
        // Check that artist has artist role
        assertTrue(ticketFactory.hasRole(ticketFactory.ARTIST_ROLE(), artist));
    }

    function testRevokeArtistRole() public {
        // Grant artist role
        ticketFactory.grantArtistRole(artist);
        assertTrue(ticketFactory.hasRole(ticketFactory.ARTIST_ROLE(), artist));
        
        // Revoke artist role
        ticketFactory.revokeArtistRole(artist);
        
        // Check that artist no longer has artist role
        assertFalse(ticketFactory.hasRole(ticketFactory.ARTIST_ROLE(), artist));
    }

    function testSetPlatformFeeCollector() public {
        address newFeeCollector = makeAddr("newFeeCollector");
        
        // Expect event to be emitted
        vm.expectEmit(true, false, false, false);
        emit PlatformFeeCollectorChanged(newFeeCollector);
        
        // Set new fee collector
        ticketFactory.setPlatformFeeCollector(newFeeCollector);
        
        // Check that fee collector was updated
        assertEq(ticketFactory.platformFeeCollector(), newFeeCollector);
    }

    function testCreateEvent() public {
        // Grant artist role
        ticketFactory.grantArtistRole(artist);
        
        // Create event as artist
        vm.prank(artist);
        
        // Expect event to be emitted
        vm.expectEmit(true, true, false, false);
        emit EventCreated(0, artist, "Test Event");
        
        uint256 eventId = ticketFactory.createEvent("Test Event");
        
        // Check event ID
        assertEq(eventId, 0);
        
        // Check event details
        SimpleTicketFactory.Event memory event_ = ticketFactory.getEvent(eventId);
        assertEq(event_.eventId, eventId);
        assertEq(event_.artist, artist);
        assertEq(event_.name, "Test Event");
        assertTrue(event_.active);
        assertEq(event_.ticketTypeIds.length, 0);
    }

    function testAddTicketType() public {
        // Grant artist role and create event
        ticketFactory.grantArtistRole(artist);
        
        vm.startPrank(artist);
        uint256 eventId = ticketFactory.createEvent("Test Event");
        
        // Expect event to be emitted
        vm.expectEmit(true, true, false, false);
        emit TicketTypeCreated(0, eventId, "VIP", 0.1 ether, 100);
        
        // Add ticket type
        uint256 ticketTypeId = ticketFactory.addTicketType(
            eventId,
            "VIP",
            0.1 ether,
            100,
            "ipfs://QmTest"
        );
        vm.stopPrank();
        
        // Check ticket type ID
        assertEq(ticketTypeId, 0);
        
        // Check ticket type details
        SimpleTicketFactory.TicketType memory ticketType = ticketFactory.getTicketType(ticketTypeId);
        assertEq(ticketType.ticketTypeId, ticketTypeId);
        assertEq(ticketType.eventId, eventId);
        assertEq(ticketType.category, "VIP");
        assertEq(ticketType.price, 0.1 ether);
        assertEq(ticketType.maxSupply, 100);
        assertEq(ticketType.totalMinted, 0);
        assertEq(ticketType.ipfsHash, "ipfs://QmTest");
        
        // Check that ticket type was added to event
        SimpleTicketFactory.Event memory event_ = ticketFactory.getEvent(eventId);
        assertEq(event_.ticketTypeIds.length, 1);
        assertEq(event_.ticketTypeIds[0], ticketTypeId);
    }

    function testPurchaseTicket() public {
        // Setup: Grant artist role, create event, add ticket type
        ticketFactory.grantArtistRole(artist);
        
        vm.startPrank(artist);
        uint256 eventId = ticketFactory.createEvent("Test Event");
        uint256 ticketTypeId = ticketFactory.addTicketType(
            eventId,
            "VIP",
            0.1 ether,
            100,
            "ipfs://QmTest"
        );
        vm.stopPrank();
        
        // Initial balances
        uint256 initialArtistBalance = artist.balance;
        uint256 initialAdminBalance = admin.balance;
        
        // Purchase ticket as buyer
        vm.startPrank(buyer);
        
        // Expect event to be emitted
        vm.expectEmit(true, true, false, false);
        emit TicketPurchased(ticketTypeId, buyer, 1, 0.1 ether);
        
        ticketFactory.purchaseTicket{value: 0.1 ether}(eventId, 0, 1);
        vm.stopPrank();
        
        // Check ticket ownership
        assertEq(ticketFactory.balanceOf(buyer, ticketTypeId), 1);
        
        // Check that buyer is marked as having purchased a ticket
        assertTrue(ticketFactory.hasPurchasedTicket(buyer, eventId));
        
        // Check ticket type total minted
        SimpleTicketFactory.TicketType memory ticketType = ticketFactory.getTicketType(ticketTypeId);
        assertEq(ticketType.totalMinted, 1);
        
        // Check fee distribution (10% to platform, 90% to artist)
        uint256 platformFee = (0.1 ether * 1000) / 10000; // 0.01 ether
        uint256 artistPayment = 0.1 ether - platformFee; // 0.09 ether
        
        assertEq(admin.balance, initialAdminBalance + platformFee);
        assertEq(artist.balance, initialArtistBalance + artistPayment);
    }

    function testCannotPurchaseTwice() public {
        // Setup: Grant artist role, create event, add ticket type
        ticketFactory.grantArtistRole(artist);
        
        vm.startPrank(artist);
        uint256 eventId = ticketFactory.createEvent("Test Event");
        ticketFactory.addTicketType(
            eventId,
            "VIP",
            0.1 ether,
            100,
            "ipfs://QmTest"
        );
        vm.stopPrank();
        
        // First purchase should succeed
        vm.prank(buyer);
        ticketFactory.purchaseTicket{value: 0.1 ether}(eventId, 0, 1);
        
        // Second purchase should fail
        vm.prank(buyer);
        vm.expectRevert("Already purchased a ticket for this event");
        ticketFactory.purchaseTicket{value: 0.1 ether}(eventId, 0, 1);
    }

    function testToggleEventStatus() public {
        // Grant artist role and create event
        ticketFactory.grantArtistRole(artist);
        
        vm.startPrank(artist);
        uint256 eventId = ticketFactory.createEvent("Test Event");
        
        // Toggle event status
        ticketFactory.toggleEventStatus(eventId);
        vm.stopPrank();
        
        // Check that event is inactive
        SimpleTicketFactory.Event memory event_ = ticketFactory.getEvent(eventId);
        assertFalse(event_.active);
        
        // Toggle back to active
        vm.prank(artist);
        ticketFactory.toggleEventStatus(eventId);
        
        // Check that event is active again
        event_ = ticketFactory.getEvent(eventId);
        assertTrue(event_.active);
    }

    function testNonTransferableTickets() public {
        // Setup: Grant artist role, create event, add ticket type, purchase ticket
        ticketFactory.grantArtistRole(artist);
        
        vm.startPrank(artist);
        uint256 eventId = ticketFactory.createEvent("Test Event");
        uint256 ticketTypeId = ticketFactory.addTicketType(
            eventId,
            "VIP",
            0.1 ether,
            100,
            "ipfs://QmTest"
        );
        vm.stopPrank();
        
        vm.prank(buyer);
        ticketFactory.purchaseTicket{value: 0.1 ether}(eventId, 0, 1);
        
        // Attempt to transfer ticket should fail
        vm.prank(buyer);
        vm.expectRevert("Tickets are non-transferable");
        ticketFactory.safeTransferFrom(buyer, anotherBuyer, ticketTypeId, 1, "");
    }

    function testRefundExcessPayment() public {
        // Setup: Grant artist role, create event, add ticket type
        ticketFactory.grantArtistRole(artist);
        
        vm.startPrank(artist);
        uint256 eventId = ticketFactory.createEvent("Test Event");
        ticketFactory.addTicketType(
            eventId,
            "VIP",
            0.1 ether,
            100,
            "ipfs://QmTest"
        );
        vm.stopPrank();
        
        // Initial buyer balance
        uint256 initialBuyerBalance = buyer.balance;
        
        // Purchase ticket with excess payment
        vm.prank(buyer);
        ticketFactory.purchaseTicket{value: 0.15 ether}(eventId, 0, 1);
        
        // Check that excess was refunded (minus gas costs)
        uint256 expectedSpending = 0.1 ether;
        assertEq(buyer.balance, initialBuyerBalance - expectedSpending);
    }
}
