// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SimpleTicketFactory is ERC1155, AccessControl {
    // World ID verification
    uint256 public immutable worldIdGroupId = 0; // The group ID for your application
    mapping(uint256 => bool) public nullifierHashes; // Track used nullifier hashes to prevent double-minting

    // Roles
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Fee Configuration
    address public platformFeeCollector;
    uint256 public constant PLATFORM_FEE_BASIS_POINTS = 1000; // 10.00% (1000 out of 10000)

    // Counters and tracking
    uint256 private _eventIdCounter = 0; // Start at 0
    uint256 private _ticketTypeIdCounter = 0; // ticketTypeId will be the ERC1155 token ID
    mapping(address => mapping(uint256 => bool)) public hasPurchasedTicket; // Track if an address has purchased a ticket for a specific event

    // Structs
    struct Event {
        uint256 eventId;
        address artist;
        string name;
        uint256[] ticketTypeIds; // Stores ticketTypeIds (which are token IDs)
        bool active;
    }

    struct TicketType {
        uint256 ticketTypeId; // This is the ERC1155 token ID
        uint256 eventId;
        string category;
        uint256 price; // in wei
        uint256 maxSupply;
        uint256 totalMinted;
        string ipfsHash; // For metadata -> uri()
    }

    // Mappings
    mapping(uint256 => Event) public events;
    mapping(uint256 => TicketType) public ticketTypes; // ticketTypeId (token ID) => TicketType
    mapping(uint256 => mapping(uint256 => TicketType)) public eventTicketTypes; // eventId => ticketTypeId => TicketType

    // Solidity Events
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

    constructor() ERC1155("") {
        // ERC1155 URI can be set per-token via uri() override
        _grantRole(ADMIN_ROLE, msg.sender);
        platformFeeCollector = msg.sender; // Initialize fee collector to deployer
    }

    // Admin functions
    function grantArtistRole(address artist) external onlyRole(ADMIN_ROLE) {
        _grantRole(ARTIST_ROLE, artist);
    }

    function revokeArtistRole(address artist) external onlyRole(ADMIN_ROLE) {
        _revokeRole(ARTIST_ROLE, artist);
    }

    function setPlatformFeeCollector(
        address _newFeeCollector
    ) external onlyRole(ADMIN_ROLE) {
        require(
            _newFeeCollector != address(0),
            "New fee collector cannot be zero address"
        );
        platformFeeCollector = _newFeeCollector;
        emit PlatformFeeCollectorChanged(_newFeeCollector);
    }

    // Artist functions
    function createEvent(
        string memory _name
    ) external onlyRole(ARTIST_ROLE) returns (uint256) {
        require(bytes(_name).length > 0, "Event name required");
        uint256 newEventId = _eventIdCounter;
        _eventIdCounter++;

        events[newEventId] = Event({
            eventId: newEventId,
            artist: msg.sender,
            name: _name,
            ticketTypeIds: new uint256[](0),
            active: true
        });

        emit EventCreated(newEventId, msg.sender, _name);
        return newEventId;
    }

    function addTicketType(
        uint256 _eventId,
        string memory _category,
        uint256 _price,
        uint256 _maxSupply,
        string memory _ipfsHash
    ) external onlyRole(ARTIST_ROLE) returns (uint256) {
        Event storage currentEvent = events[_eventId];
        require(currentEvent.artist == msg.sender, "Not event owner");
        require(currentEvent.active, "Event not active");
        require(_maxSupply > 0, "Supply must be > 0");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");

        uint256 ticketTypeId = _ticketTypeIdCounter++;

        ticketTypes[ticketTypeId] = TicketType({
            ticketTypeId: ticketTypeId,
            eventId: _eventId,
            category: _category,
            price: _price,
            maxSupply: _maxSupply,
            totalMinted: 0,
            ipfsHash: _ipfsHash
        });

        // Also store in event-specific mapping
        eventTicketTypes[_eventId][ticketTypeId] = ticketTypes[ticketTypeId];
        currentEvent.ticketTypeIds.push(ticketTypeId);

        emit TicketTypeCreated(
            ticketTypeId,
            _eventId,
            _category,
            _price,
            _maxSupply
        );
        return ticketTypeId;
    }

    function toggleEventStatus(
        uint256 _eventId
    ) external onlyRole(ARTIST_ROLE) {
        require(events[_eventId].artist == msg.sender, "Not event owner");
        require(events[_eventId].artist != address(0), "Event does not exist");
        events[_eventId].active = !events[_eventId].active;
    }

    // User functions
    function purchaseTicket(
        uint256 _eventId,
        uint256 _ticketTypeIndexInEvent, // Index in the event's ticketTypeIds array
        uint256 _quantity
    ) external payable {
        // Check if the event exists and is active
        Event storage event_ = events[_eventId];
        require(event_.artist != address(0), "Event not found");
        require(event_.active, "Event not active");

        // Check if the ticket type index is valid for the event
        require(
            _ticketTypeIndexInEvent < event_.ticketTypeIds.length,
            "Invalid ticket type index for event"
        );

        // Get the global ticketTypeId using the eventId and the index
        uint256 _ticketTypeId = event_.ticketTypeIds[_ticketTypeIndexInEvent];

        // Now check if the derived ticket type exists globally
        require(
            ticketTypes[_ticketTypeId].ticketTypeId == _ticketTypeId,
            "Ticket type not found"
        );

        // Now it's safe to access the ticket type
        TicketType storage ticketType = ticketTypes[_ticketTypeId];

        // Sanity check: ensure the ticket type actually belongs to the specified event
        require(
            ticketType.eventId == _eventId,
            "Ticket type does not belong to this event"
        );

        require(
            ticketType.totalMinted + _quantity <= ticketType.maxSupply,
            "Exceeds max supply"
        );
        require(_quantity == 1, "Can only purchase one ticket at a time");
        require(
            !hasPurchasedTicket[msg.sender][_eventId],
            "Already purchased a ticket for this event"
        );

        uint256 totalPrice = ticketType.price;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Mark as purchased for this event
        hasPurchasedTicket[msg.sender][_eventId] = true;

        // Calculate fees
        uint256 platformFee = (totalPrice * PLATFORM_FEE_BASIS_POINTS) / 10000;
        uint256 artistPayment = totalPrice - platformFee;

        // Update state before external calls
        ticketType.totalMinted += _quantity;

        // Mint the tickets
        _mint(msg.sender, _ticketTypeId, _quantity, "");

        // Handle payment transfers
        if (platformFee > 0) {
            (bool successFee, ) = platformFeeCollector.call{value: platformFee}(
                ""
            );
            require(successFee, "Platform fee transfer failed");
        }

        if (artistPayment > 0) {
            (bool successArtist, ) = event_.artist.call{value: artistPayment}(
                ""
            );
            require(successArtist, "Payment transfer to artist failed");
        }

        // Refund any excess amount to the buyer (based on total price paid vs total price of tickets)
        if (msg.value > totalPrice) {
            (bool successRefund, ) = msg.sender.call{
                value: msg.value - totalPrice
            }("");
            require(successRefund, "Refund to buyer failed");
        }

        emit TicketPurchased(_ticketTypeId, msg.sender, _quantity, totalPrice);
    }

    // View functions
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        require(events[_eventId].artist != address(0), "Event does not exist");
        return events[_eventId];
    }

    function getTicketType(
        uint256 _ticketTypeId
    ) external view returns (TicketType memory) {
        require(
            ticketTypes[_ticketTypeId].ticketTypeId == _ticketTypeId &&
                ticketTypes[_ticketTypeId].maxSupply > 0,
            "Ticket type does not exist or is not initialized"
        );
        return ticketTypes[_ticketTypeId];
    }

    function getUriForEventTicket(
        uint256 _eventId,
        uint256 _ticketTypeIndexInEvent
    ) external view returns (string memory) {
        require(events[_eventId].artist != address(0), "Event not found");
        require(
            _ticketTypeIndexInEvent < events[_eventId].ticketTypeIds.length,
            "Invalid ticket type index for event"
        );

        uint256 globalTicketTypeId = events[_eventId].ticketTypeIds[
            _ticketTypeIndexInEvent
        ];
        return uri(globalTicketTypeId);
    }

    // Override transfer functions to make tickets non-transferable (soulbound)
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        // Only allow transfers from the zero address (minting)
        require(from == address(0), "Tickets are non-transferable");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        // Only allow transfers from the zero address (minting)
        require(from == address(0), "Tickets are non-transferable");
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    // Required for AccessControl + ERC1155
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
