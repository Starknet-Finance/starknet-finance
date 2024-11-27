// Eth
const universalEthAddress =
  "0x49D36570D4E46F48E99674BD3FCC84644DDD6B96F7C741B1562B82F9E004DC7" as const;

const sepoliaAvnuAddress =
  "0x02c56e8b00dbe2a71e57472685378fc8988bba947e9a99b26a00fade2b4fe7c2" as const;

const devnetEthClassHash =
  "0x046ded64ae2dead6448e247234bab192a9c483644395b66f2155f2614e5804b0" as const;

const sepoliaMainnetEthClassHash =
  "0x07f3777c99f3700505ea966676aac4a0d692c2a9f5e667f4c606b51ca1dd3420" as const;

// Strk
const universalStrkAddress =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d" as const;

const sepoliaMainnetStrkClassHash =
  "0x04ad3c1dc8413453db314497945b6903e1c766495a1e60492d44da9c2a986e4b" as const;

const devnetStrkClassHash =
  "0x046ded64ae2dead6448e247234bab192a9c483644395b66f2155f2614e5804b0" as const;

const avnuAbi = [
  {
    name: "ExchangeLocker",
    type: "impl",
    interface_name: "avnu::interfaces::locker::ILocker",
  },
  {
    name: "avnu::interfaces::locker::ILocker",
    type: "interface",
    items: [
      {
        name: "locked",
        type: "function",
        inputs: [
          {
            name: "id",
            type: "core::integer::u32",
          },
          {
            name: "data",
            type: "core::array::Array::<core::felt252>",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<core::felt252>",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "Exchange",
    type: "impl",
    interface_name: "avnu::exchange::IExchange",
  },
  {
    name: "core::bool",
    type: "enum",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    name: "core::integer::u256",
    type: "struct",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    name: "avnu::models::Route",
    type: "struct",
    members: [
      {
        name: "token_from",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "token_to",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "exchange_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "percent",
        type: "core::integer::u128",
      },
      {
        name: "additional_swap_params",
        type: "core::array::Array::<core::felt252>",
      },
    ],
  },
  {
    name: "avnu::exchange::IExchange",
    type: "interface",
    items: [
      {
        name: "get_owner",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "transfer_ownership",
        type: "function",
        inputs: [
          {
            name: "new_owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "upgrade_class",
        type: "function",
        inputs: [
          {
            name: "new_class_hash",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "get_adapter_class_hash",
        type: "function",
        inputs: [
          {
            name: "exchange_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "set_adapter_class_hash",
        type: "function",
        inputs: [
          {
            name: "exchange_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "adapter_class_hash",
            type: "core::starknet::class_hash::ClassHash",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "get_fees_active",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "set_fees_active",
        type: "function",
        inputs: [
          {
            name: "active",
            type: "core::bool",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "get_fees_recipient",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "set_fees_recipient",
        type: "function",
        inputs: [
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "get_fees_bps_0",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u128",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "set_fees_bps_0",
        type: "function",
        inputs: [
          {
            name: "bps",
            type: "core::integer::u128",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "get_fees_bps_1",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u128",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "set_fees_bps_1",
        type: "function",
        inputs: [
          {
            name: "bps",
            type: "core::integer::u128",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "get_swap_exact_token_to_fees_bps",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u128",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "set_swap_exact_token_to_fees_bps",
        type: "function",
        inputs: [
          {
            name: "bps",
            type: "core::integer::u128",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "multi_route_swap",
        type: "function",
        inputs: [
          {
            name: "token_from_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_from_amount",
            type: "core::integer::u256",
          },
          {
            name: "token_to_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_to_amount",
            type: "core::integer::u256",
          },
          {
            name: "token_to_min_amount",
            type: "core::integer::u256",
          },
          {
            name: "beneficiary",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "integrator_fee_amount_bps",
            type: "core::integer::u128",
          },
          {
            name: "integrator_fee_recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "routes",
            type: "core::array::Array::<avnu::models::Route>",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "swap_exact_token_to",
        type: "function",
        inputs: [
          {
            name: "token_from_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_from_amount",
            type: "core::integer::u256",
          },
          {
            name: "token_from_max_amount",
            type: "core::integer::u256",
          },
          {
            name: "token_to_address",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "token_to_amount",
            type: "core::integer::u256",
          },
          {
            name: "beneficiary",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "routes",
            type: "core::array::Array::<avnu::models::Route>",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "constructor",
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "fee_recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "avnu::exchange::Exchange::Swap",
    type: "event",
    members: [
      {
        kind: "data",
        name: "taker_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "sell_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "sell_amount",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "buy_address",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "buy_amount",
        type: "core::integer::u256",
      },
      {
        kind: "data",
        name: "beneficiary",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "struct",
    name: "avnu::exchange::Exchange::OwnershipTransferred",
    type: "event",
    members: [
      {
        kind: "data",
        name: "previous_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "new_owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    kind: "enum",
    name: "avnu::exchange::Exchange::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "Swap",
        type: "avnu::exchange::Exchange::Swap",
      },
      {
        kind: "nested",
        name: "OwnershipTransferred",
        type: "avnu::exchange::Exchange::OwnershipTransferred",
      },
    ],
  },
];

const universalErc20Abi = [
  {
    type: "impl",
    name: "ERC20Impl",
    interface_name: "openzeppelin::token::erc20::interface::IERC20",
  },
  {
    name: "openzeppelin::token::erc20::interface::IERC20",
    type: "interface",
    items: [
      {
        name: "name",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "symbol",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "decimals",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u8",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "total_supply",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "balance_of",
        type: "function",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "allowance",
        type: "function",
        inputs: [
          {
            name: "owner",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "transfer",
        type: "function",
        inputs: [
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "transfer_from",
        type: "function",
        inputs: [
          {
            name: "sender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        name: "approve",
        type: "function",
        inputs: [
          {
            name: "spender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    name: "ERC20CamelOnlyImpl",
    type: "impl",
    interface_name: "openzeppelin::token::erc20::interface::IERC20CamelOnly",
  },
  {
    type: "interface",
    name: "openzeppelin::token::erc20::interface::IERC20CamelOnly",
    items: [
      {
        name: "totalSupply",
        type: "function",
        inputs: [],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "balanceOf",
        type: "function",
        inputs: [
          {
            name: "account",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::integer::u256",
          },
        ],
        state_mutability: "view",
      },
      {
        name: "transferFrom",
        type: "function",
        inputs: [
          {
            name: "sender",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "recipient",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    kind: "struct",
    name: "openzeppelin::token::erc20_v070::erc20::ERC20::Transfer",
    type: "event",
    members: [
      {
        kind: "key",
        name: "from",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "key",
        name: "to",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "value",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "struct",
    name: "openzeppelin::token::erc20_v070::erc20::ERC20::Approval",
    type: "event",
    members: [
      {
        kind: "data",
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "spender",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        kind: "data",
        name: "value",
        type: "core::integer::u256",
      },
    ],
  },
  {
    kind: "enum",
    name: "openzeppelin::token::erc20_v070::erc20::ERC20::Event",
    type: "event",
    variants: [
      {
        kind: "nested",
        name: "Transfer",
        type: "openzeppelin::token::erc20_v070::erc20::ERC20::Transfer",
      },
      {
        kind: "nested",
        name: "Approval",
        type: "openzeppelin::token::erc20_v070::erc20::ERC20::Approval",
      },
    ],
  },
] as const;

export const LAST_CONNECTED_TIME_LOCALSTORAGE_KEY = "lastConnectedTime";

export {
  devnetEthClassHash,
  devnetStrkClassHash,
  universalEthAddress,
  sepoliaMainnetEthClassHash,
  universalStrkAddress,
  sepoliaMainnetStrkClassHash,
  universalErc20Abi,
  sepoliaAvnuAddress,
  avnuAbi,
};
